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
  const maxRetries = 3
  let lastError: any = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Loading orders with items via API (attempt ${attempt}/${maxRetries})...`)
      
      // Use API route to bypass RLS policies securely
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout
      
      // Add cache: 'no-cache' to prevent caching issues
      const response = await fetch('/api/orders', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        signal: controller.signal,
        cache: 'no-cache'
      })
      
      clearTimeout(timeoutId)

      if (!response.ok) {
        console.error(`❌ Error fetching orders from API (attempt ${attempt}):`, response.status, response.statusText)
        lastError = new Error(`HTTP ${response.status}: ${response.statusText}`)
        
        if (attempt === maxRetries) {
          return []
        }
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
        continue
      }

      const result = await response.json()

      if (!result.success) {
        console.error(`❌ API returned error (attempt ${attempt}):`, result.error)
        lastError = new Error(result.error)
        
        if (attempt === maxRetries) {
          return []
        }
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
        continue
      }

      console.log(`✅ Loaded ${result.count} orders via API (attempt ${attempt})`)
      console.log('📊 Sample order with items:', result.orders[0] ? {
        id: result.orders[0].id,
        order_id: result.orders[0].order_id,
        order_items_count: result.orders[0].order_items?.length || 0
      } : 'No orders')
      
      return result.orders || []
      
    } catch (error) {
      console.error(`❌ Error loading orders (attempt ${attempt}):`, error)
      lastError = error
      
      // If it's a network error, try a different approach
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.log('🔄 Trying alternative fetch approach...')
        try {
          // Try without AbortController
          const altResponse = await fetch('/api/orders', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          })
          
          if (altResponse.ok) {
            const altResult = await altResponse.json()
            if (altResult.success) {
              console.log(`✅ Alternative approach successful: ${altResult.count} orders`)
              return altResult.orders || []
            }
          }
        } catch (altError) {
          console.error('❌ Alternative approach also failed:', altError)
        }
      }
      
      if (attempt === maxRetries) {
        console.error('❌ All retry attempts failed. Last error:', lastError)
        return []
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
    }
  }

  return []
}
