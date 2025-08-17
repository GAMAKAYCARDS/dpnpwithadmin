import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

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

export async function GET() {
  try {
    console.log('🔄 API: Loading orders with items...')
    console.log('🔧 API: Checking supabaseAdmin configuration...')
    
    // Add CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
    
    // Test the connection first
    const { data: testData, error: testError } = await supabaseAdmin
      .from('orders')
      .select('count')
      .limit(1)
    
    if (testError) {
      console.error('❌ API: Connection test failed:', testError)
      return NextResponse.json(
        { error: `Database connection failed: ${testError.message}` },
        { status: 500, headers }
      )
    }
    
    console.log('✅ API: Database connection successful')
    
    // Fetch orders using admin client
    const { data: ordersData, error: ordersError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (ordersError) {
      console.error('❌ API: Error fetching orders:', ordersError)
      return NextResponse.json(
        { error: `Failed to fetch orders: ${ordersError.message}` },
        { status: 500 }
      )
    }

    console.log(`✅ API: Loaded ${ordersData?.length || 0} orders`)

    // If no orders, return empty array
    if (!ordersData || ordersData.length === 0) {
      console.log('ℹ️ API: No orders found in database')
      return NextResponse.json({
        success: true,
        orders: [],
        count: 0
      }, { headers })
    }

    // Fetch order items for each order using admin client
    const ordersWithItems = await Promise.all(
      ordersData.map(async (order) => {
        console.log(`📦 API: Loading items for order: ${order.order_id}`)
        
        const { data: itemsData, error: itemsError } = await supabaseAdmin
          .from('order_items')
          .select(`
            *,
            products (
              name,
              image_url
            )
          `)
          .eq('order_id', order.id)

        if (itemsError) {
          console.error('❌ API: Error fetching order items:', itemsError)
          return {
            ...order,
            order_items: []
          }
        }

        console.log(`✅ API: Loaded ${itemsData?.length || 0} items for order ${order.order_id}`)

        // Map product data to order items
        const orderItems = (itemsData || []).map((item: any) => ({
          ...item,
          product_name: item.products?.name || 'Unknown Product',
          product_image: item.products?.image_url || ''
        }))

        return {
          ...order,
          order_items: orderItems
        }
      })
    )

    console.log('✅ API: All orders loaded successfully:', ordersWithItems.length)
    
    return NextResponse.json({
      success: true,
      orders: ordersWithItems,
      count: ordersWithItems.length
    }, { headers })

  } catch (error) {
    console.error('❌ API: Error loading orders:', error)
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500, headers }
    )
  }
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
