import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Image ID is required' },
        { status: 400 }
      )
    }

    // First, get the image record to get the filename
    const { data: imageData, error: fetchError } = await supabase
      .from('hero_images')
      .select('image_file_name')
      .eq('id', id)
      .single()

    if (fetchError) {
      console.error('Error fetching image data:', fetchError)
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      )
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from('hero_images')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Error deleting from database:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete image from database' },
        { status: 500 }
      )
    }

    // Delete file from storage if filename exists
    if (imageData.image_file_name && typeof imageData.image_file_name === 'string') {
      const { error: storageError } = await supabase.storage
        .from('hero-images')
        .remove([imageData.image_file_name])

      if (storageError) {
        console.error('Error deleting from storage:', storageError)
        // Don't return error here as the database record is already deleted
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully'
    })

  } catch (error) {
    console.error('Error in hero image deletion:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
