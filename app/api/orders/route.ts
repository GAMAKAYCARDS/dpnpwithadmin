import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 API: Loading orders with items...')
    
    // Fetch orders
    const { data: ordersData, error: ordersError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (ordersError) {
      console.error('❌ API: Error fetching orders:', ordersError)
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
    }

    console.log(`✅ API: Loaded ${ordersData.length} orders`)

    // Fetch order items for each order
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
          return order
        }

        console.log(`✅ API: Loaded ${itemsData.length} items for order ${order.order_id}`)

        // Map product data to order items
        const orderItems = itemsData.map((item: any) => ({
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
    console.log('📊 Sample order with items:', ordersWithItems[0] ? {
      id: ordersWithItems[0].id,
      order_id: ordersWithItems[0].order_id,
      order_items_count: ordersWithItems[0].order_items?.length || 0
    } : 'No orders')
    
    return NextResponse.json({ orders: ordersWithItems })
    
  } catch (error) {
    console.error('❌ API: Error loading orders:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
