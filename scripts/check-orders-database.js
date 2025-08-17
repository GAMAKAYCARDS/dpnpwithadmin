const { createClient } = require('@supabase/supabase-js')

// Use the same configuration as the main app
const supabaseUrl = 'https://aizgswoelfdkhyosgvzu.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpemdzd29lbGZka2h5b3Nndnp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTA1NTIyNSwiZXhwIjoyMDcwNjMxMjI1fQ.gLnsyAhR8VSjbe37LdEHuFBGNDufqC4jZ9X3UOSNuGc'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkDatabase() {
  console.log('🔍 Checking database tables and policies...')
  
  try {
    // Check if orders table exists
    console.log('\n📋 Checking orders table...')
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .limit(1)
    
    if (ordersError) {
      console.error('❌ Orders table error:', ordersError)
    } else {
      console.log('✅ Orders table accessible')
      console.log(`📊 Orders count: ${ordersData?.length || 0}`)
    }
    
    // Check if order_items table exists
    console.log('\n📦 Checking order_items table...')
    const { data: itemsData, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .limit(1)
    
    if (itemsError) {
      console.error('❌ Order items table error:', itemsError)
    } else {
      console.log('✅ Order items table accessible')
      console.log(`📊 Order items count: ${itemsData?.length || 0}`)
    }
    
    // Check if products table exists
    console.log('\n🛍️ Checking products table...')
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(1)
    
    if (productsError) {
      console.error('❌ Products table error:', productsError)
    } else {
      console.log('✅ Products table accessible')
      console.log(`📊 Products count: ${productsData?.length || 0}`)
    }
    
    // Test a full query with joins
    console.log('\n🔗 Testing full query with joins...')
    const { data: fullQueryData, error: fullQueryError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (
            name,
            image_url
          )
        )
      `)
      .limit(1)
    
    if (fullQueryError) {
      console.error('❌ Full query error:', fullQueryError)
    } else {
      console.log('✅ Full query successful')
      console.log('📊 Sample order with items:', fullQueryData?.[0] ? {
        id: fullQueryData[0].id,
        order_id: fullQueryData[0].order_id,
        items_count: fullQueryData[0].order_items?.length || 0
      } : 'No orders found')
    }
    
  } catch (error) {
    console.error('❌ Database check failed:', error)
  }
}

checkDatabase()
