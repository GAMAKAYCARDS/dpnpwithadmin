const { createClient } = require('@supabase/supabase-js')

// Use the same configuration as the main app
const supabaseUrl = 'https://aizgswoelfdkhyosgvzu.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpemdzd29lbGZka2h5b3Nndnp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTA1NTIyNSwiZXhwIjoyMDcwNjMxMjI1fQ.gLnsyAhR8VSjbe37LdEHuFBGNDufqC4jZ9X3UOSNuGc'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testOrderItemsDisplay() {
  console.log('🔍 Testing order items display...')
  
  try {
    // Get first order
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .limit(1)
    
    if (ordersError) {
      console.error('❌ Error fetching orders:', ordersError)
      return
    }

    if (orders.length === 0) {
      console.log('❌ No orders found')
      return
    }

    const order = orders[0]
    console.log('📋 Testing order:', order.order_id)

    // Get order items for this order
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
      console.error('❌ Error fetching items:', itemsError)
      return
    }

    console.log(`📦 Found ${items.length} items for order ${order.order_id}`)
    
    // Log each item
    items.forEach((item, index) => {
      console.log(`\n📦 Item ${index + 1}:`)
      console.log('  - ID:', item.id)
      console.log('  - Product ID:', item.product_id)
      console.log('  - Quantity:', item.quantity)
      console.log('  - Price:', item.price)
      console.log('  - Product Name:', item.products?.name || 'Unknown')
      console.log('  - Product Image:', item.products?.image_url || 'None')
    })

    // Test the mapping logic
    const mappedItems = items.map((item) => ({
      ...item,
      product_name: item.products?.name || 'Unknown Product',
      product_image: item.products?.image_url || ''
    }))

    console.log('\n🎯 Mapped items:')
    mappedItems.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.product_name} - Qty: ${item.quantity} - Price: Rs ${item.price}`)
    })

  } catch (error) {
    console.error('❌ Error testing order items:', error)
  }
}

testOrderItemsDisplay()
