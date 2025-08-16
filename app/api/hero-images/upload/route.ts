import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const subtitle = formData.get('subtitle') as string
    const description = formData.get('description') as string
    const displayOrder = parseInt(formData.get('display_order') as string) || 0
    const showContent = formData.get('show_content') === 'true'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const fileName = `${Date.now()}-${file.name}`

    // Upload file to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('hero-images')
      .upload(fileName, file)

    if (uploadError) {
      console.error('Error uploading file:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      )
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('hero-images')
      .getPublicUrl(fileName)

    // Insert record into hero_images table
    const { data: insertData, error: insertError } = await supabase
      .from('hero_images')
      .insert([
        {
          title: title || '',
          subtitle: subtitle || '',
          description: description || '',
          image_url: urlData.publicUrl,
          image_file_name: fileName,
          button_text: '',
          button_link: '',
          display_order: displayOrder,
          is_active: true,
          show_content: showContent
        }
      ])
      .select()

    if (insertError) {
      console.error('Error inserting into database:', insertError)
      return NextResponse.json(
        { error: 'Failed to save image data' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: insertData[0]
    })

  } catch (error) {
    console.error('Error in hero image upload:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
