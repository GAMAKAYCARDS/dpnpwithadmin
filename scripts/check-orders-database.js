const { createClient } = require('@supabase/supabase-js')

// Use the same configuration as the main app
const supabaseUrl = 'https://aizgswoelfdkhyosgvzu.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpemdzd29lbGZka2h5b3Nndnp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTA1NTIyNSwiZXhwIjoyMDcwNjMxMjI1fQ.gLnsyAhR8VSjbe37LdEHuFBGNDufqC4jZ9X3UOSNuGc'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkDatabase() {
  console.log('🔍 Checking database structure...')
  
  try {
    // Check if orders table exists and has data
    console.log('\n📋 Checking orders table...')
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .limit(5)
    
    if (ordersError) {
      console.error('❌ Error accessing orders table:', ordersError)
    } else {
      console.log(`✅ Orders table accessible. Found ${orders.length} orders`)
      if (orders.length > 0) {
        console.log('📊 Sample order:', {
          id: orders[0].id,
          order_id: orders[0].order_id,
          customer_name: orders[0].customer_name
        })
      }
    }

    // Check if order_items table exists and has data
    console.log('\n📦 Checking order_items table...')
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .limit(5)
    
    if (itemsError) {
      console.error('❌ Error accessing order_items table:', itemsError)
    } else {
      console.log(`✅ Order items table accessible. Found ${orderItems.length} items`)
      if (orderItems.length > 0) {
        console.log('📊 Sample order item:', {
          id: orderItems[0].id,
          order_id: orderItems[0].order_id,
          product_id: orderItems[0].product_id,
          quantity: orderItems[0].quantity
        })
      }
    }

    // Check if products table exists
    console.log('\n🛍️ Checking products table...')
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(5)
    
    if (productsError) {
      console.error('❌ Error accessing products table:', productsError)
    } else {
      console.log(`✅ Products table accessible. Found ${products.length} products`)
    }

    // Check relationships
    if (orders && orders.length > 0 && orderItems && orderItems.length > 0) {
      console.log('\n🔗 Checking relationships...')
      const sampleOrderId = orders[0].id
      const { data: relatedItems, error: relError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', sampleOrderId)
      
      if (relError) {
        console.error('❌ Error checking relationships:', relError)
      } else {
        console.log(`✅ Found ${relatedItems.length} items for order ${sampleOrderId}`)
      }
    }

  } catch (error) {
    console.error('❌ Database check failed:', error)
  }
}

checkDatabase()
