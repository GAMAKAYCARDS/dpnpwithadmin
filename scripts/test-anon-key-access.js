const { createClient } = require('@supabase/supabase-js')

// Use the anon key (same as frontend)
const supabaseUrl = 'https://aizgswoelfdkhyosgvzu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpemdzd29lbGZka2h5b3Nndnp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwNTUyMjUsImV4cCI6MjA3MDYzMTIyNX0.4a7Smvc_bueFLqZNvGk-AW0kD5dJusNwqaSAczJs0hU'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testAnonKeyAccess() {
  console.log('🔍 Testing anon key access (frontend simulation)...')
  
  try {
    // Test 1: Get orders
    console.log('\n📋 Test 1: Getting orders...')
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .limit(1)
    
    if (ordersError) {
      console.error('❌ Error fetching orders with anon key:', ordersError)
      return
    }

    console.log(`✅ Found ${orders.length} orders with anon key`)

    if (orders.length === 0) {
      console.log('❌ No orders found with anon key')
      return
    }

    const order = orders[0]
    console.log('📋 Testing order:', order.order_id)

    // Test 2: Get order items
    console.log('\n📦 Test 2: Getting order items...')
    const { data: items, error: itemsError } = await supabase
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
      console.error('❌ Error fetching items with anon key:', itemsError)
      console.log('🔍 This might be an RLS policy issue')
      return
    }

    console.log(`✅ Found ${items.length} items with anon key`)
    
    // Log each item
    items.forEach((item, index) => {
      console.log(`\n📦 Item ${index + 1}:`)
      console.log('  - ID:', item.id)
      console.log('  - Product ID:', item.product_id)
      console.log('  - Quantity:', item.quantity)
      console.log('  - Price:', item.price)
      console.log('  - Product Name:', item.products?.name || 'Unknown')
    })

  } catch (error) {
    console.error('❌ Error testing anon key access:', error)
  }
}

testAnonKeyAccess()
