// Note: This API route won't work with static export
// For Netlify deployment, we need to use Netlify Functions instead
// This file is kept for development purposes only

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Required for static export compatibility
export const dynamic = 'force-static'
export const revalidate = 0

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'API route not available in static export' })
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ message: 'API route not available in static export' })
}

export async function PATCH(request: NextRequest) {
  try {
    console.log('🔄 API: Updating order status...')
    
    // Add CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
    
    const body = await request.json()
    const { orderId, order_status } = body
    
    if (!orderId || !order_status) {
      return NextResponse.json(
        { error: 'Missing required fields: orderId and order_status' },
        { status: 400, headers }
      )
    }
    
    console.log(`📝 API: Updating order ${orderId} status to: ${order_status}`)
    
    // Update the order status in the database
    const { data, error } = await supabaseAdmin
      .from('orders')
      .update({ 
        order_status,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
    
    if (error) {
      console.error('❌ API: Error updating order status:', error)
      return NextResponse.json(
        { error: `Failed to update order status: ${error.message}` },
        { status: 500, headers }
      )
    }
    
    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404, headers }
      )
    }
    
    console.log('✅ API: Order status updated successfully')
    
    return NextResponse.json({
      success: true,
      message: 'Order status updated successfully',
      order: data[0]
    }, { headers })
    
  } catch (error) {
    console.error('❌ API: Error updating order status:', error)
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500, headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }}
    )
  }
}
