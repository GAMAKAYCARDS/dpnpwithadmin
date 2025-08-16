import { supabase } from './supabase'

export interface OrderItem {
  id: number
  order_id: number
  product_id: number
  quantity: number
  price: number
  created_at: string
  product_name?: string
  product_image?: string
}

export interface Order {
  id: number
  order_id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_city: string
  customer_state: string
  customer_zip_code: string
  customer_address: string
  total_amount: number
  payment_option: string
  payment_status: string
  order_status: string
  receipt_url: string | null
  receipt_file_name: string | null
  created_at: string
  updated_at: string
  order_items?: OrderItem[]
}

export async function getOrders(): Promise<Order[]> {
  try {
    console.log('🔄 Loading orders with items...')
    
    // Fetch orders
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (ordersError) {
      console.error('❌ Error fetching orders:', ordersError)
      return []
    }

    console.log(`✅ Loaded ${ordersData.length} orders`)

    // Fetch order items for each order
    const ordersWithItems = await Promise.all(
      ordersData.map(async (order) => {
        console.log(`📦 Loading items for order: ${order.order_id}`)
        
        const { data: itemsData, error: itemsError } = await supabase
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
          console.error('❌ Error fetching order items:', itemsError)
          return order
        }

        console.log(`✅ Loaded ${itemsData.length} items for order ${order.order_id}`)

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

    console.log('✅ All orders loaded successfully:', ordersWithItems.length)
    console.log('📊 Sample order with items:', ordersWithItems[0] ? {
      id: ordersWithItems[0].id,
      order_id: ordersWithItems[0].order_id,
      order_items_count: ordersWithItems[0].order_items?.length || 0
    } : 'No orders')
    
    return ordersWithItems
    
  } catch (error) {
    console.error('❌ Error loading orders:', error)
    return []
  }
}
