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
    console.log('🔄 Loading orders with items via API...')
    
    // Use API route to bypass RLS policies securely
    const response = await fetch('/api/orders', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      console.error('❌ Error fetching orders from API:', response.status, response.statusText)
      return []
    }

    const result = await response.json()

    if (!result.success) {
      console.error('❌ API returned error:', result.error)
      return []
    }

    console.log(`✅ Loaded ${result.count} orders via API`)
    console.log('📊 Sample order with items:', result.orders[0] ? {
      id: result.orders[0].id,
      order_id: result.orders[0].order_id,
      order_items_count: result.orders[0].order_items?.length || 0
    } : 'No orders')
    
    return result.orders || []
    
  } catch (error) {
    console.error('❌ Error loading orders:', error)
    return []
  }
}
