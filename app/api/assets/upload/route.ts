import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string
    const name = formData.get('name') as string

    if (!file || !type || !name) {
      return NextResponse.json(
        { error: 'Missing required fields: file, type, name' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['logo', 'video', 'image']
    if (!allowedTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type. Must be logo, video, or image' },
        { status: 400 }
      )
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB' },
        { status: 400 }
      )
    }

    // Initialize assets bucket
    const { data: buckets } = await supabase.storage.listBuckets()
    const assetsBucket = buckets?.find(bucket => bucket.name === 'assets')
    
    if (!assetsBucket) {
      const { error: bucketError } = await supabase.storage.createBucket('assets', {
        public: true,
        allowedMimeTypes: ['image/svg+xml', 'image/png', 'image/jpeg', 'video/mp4', 'video/webm'],
        fileSizeLimit: maxSize
      })
      
      if (bucketError) {
        console.error('Error creating assets bucket:', bucketError)
        return NextResponse.json(
          { error: 'Failed to initialize storage' },
          { status: 500 }
        )
      }
    }

    // Create unique filename
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop()
    const fileName = `${type}/${name}_${timestamp}.${fileExtension}`

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from('assets')
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: '31536000', // 1 year cache
        upsert: false
      })

    if (error) {
      console.error('Error uploading asset:', error)
      return NextResponse.json(
        { error: 'Failed to upload asset' },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('assets')
      .getPublicUrl(fileName)

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      fileName: fileName
    })

  } catch (error) {
    console.error('Error in asset upload:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    let query = supabase.storage.from('assets').list('', { limit: 100 })
    
    if (type) {
      query = supabase.storage.from('assets').list(type, { limit: 100 })
    }

    const { data: files, error } = await query

    if (error) {
      console.error('Error listing assets:', error)
      return NextResponse.json(
        { error: 'Failed to list assets' },
        { status: 500 }
      )
    }

    const assets = files?.map(file => ({
      id: file.id,
      name: file.name,
      url: supabase.storage.from('assets').getPublicUrl(file.name).data.publicUrl,
      type: file.name.startsWith('logo/') ? 'logo' : 
            file.name.startsWith('video/') ? 'video' : 'image',
      created_at: file.created_at
    })) || []

    return NextResponse.json({ assets })

  } catch (error) {
    console.error('Error listing assets:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
