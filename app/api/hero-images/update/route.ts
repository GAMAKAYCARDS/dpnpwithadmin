import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, title, subtitle, description, button_text, button_link, display_order, is_active, show_content } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Image ID is required' },
        { status: 400 }
      )
    }

    // Update record in hero_images table
    const { data: updateData, error: updateError } = await supabase
      .from('hero_images')
      .update({
        title: title || '',
        subtitle: subtitle || '',
        description: description || '',
        button_text: button_text || '',
        button_link: button_link || '',
        display_order: display_order || 0,
        is_active: is_active !== undefined ? is_active : true,
        show_content: show_content !== undefined ? show_content : true
      })
      .eq('id', id)
      .select()

    if (updateError) {
      console.error('Error updating hero image:', updateError)
      return NextResponse.json(
        { error: 'Failed to update image' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updateData[0]
    })

  } catch (error) {
    console.error('Error in hero image update:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
