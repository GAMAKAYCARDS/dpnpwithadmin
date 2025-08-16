const { createClient } = require('@supabase/supabase-js')

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://aizgswoelfdkhyosgvzu.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpemdzd29lbGZka2h5b3Nndnp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTA1NTIyNSwiZXhwIjoyMDcwNjMxMjI1fQ.gLnsyAhR8VSjbe37LdEHuFBGNDufqC4jZ9X3UOSNuGc'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testOrdersLoading() {
  console.log('🧪 Testing orders loading...')

  try {
    // Test 1: Load orders
    console.log('\n📋 Test 1: Loading orders...')
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (ordersError) {
      console.error('❌ Error loading orders:', ordersError)
      return
    }

    console.log(`✅ Successfully loaded ${ordersData.length} orders`)

    if (ordersData.length === 0) {
      console.log('⚠️ No orders found in database')
      return
    }

    // Test 2: Load order items for first order
    console.log('\n📦 Test 2: Loading order items...')
    const firstOrder = ordersData[0]
    console.log(`Testing with order: ${firstOrder.order_id}`)

    const { data: itemsData, error: itemsError } = await supabase
      .from('order_items')
      .select(`
        *,
        products (
          name,
          image_url
        )
      `)
      .eq('order_id', firstOrder.id)

    if (itemsError) {
      console.error('❌ Error loading order items:', itemsError)
      return
    }

    console.log(`✅ Successfully loaded ${itemsData.length} order items`)

    // Test 3: Check products table
    console.log('\n🛍️ Test 3: Checking products table...')
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('id, name, image_url')
      .limit(5)

    if (productsError) {
      console.error('❌ Error loading products:', productsError)
      return
    }

    console.log(`✅ Successfully loaded ${productsData.length} products`)

    // Test 4: Test the complete join query
    console.log('\n🔗 Test 4: Testing complete join query...')
    const { data: completeData, error: completeError } = await supabase
      .from('order_items')
      .select(`
        *,
        products (
          name,
          image_url
        )
      `)
      .eq('order_id', firstOrder.id)

    if (completeError) {
      console.error('❌ Error with complete query:', completeError)
      return
    }

    console.log('✅ Complete query successful')
    console.log('Sample order item with product data:')
    if (completeData.length > 0) {
      const sampleItem = completeData[0]
      console.log(`  - Order Item ID: ${sampleItem.id}`)
      console.log(`  - Product Name: ${sampleItem.products?.name || 'Unknown'}`)
      console.log(`  - Product Image: ${sampleItem.products?.image_url || 'None'}`)
      console.log(`  - Quantity: ${sampleItem.quantity}`)
      console.log(`  - Price: ${sampleItem.price}`)
    }

    console.log('\n✅ All tests passed! Orders and order items can be loaded successfully.')

  } catch (error) {
    console.error('❌ Error during testing:', error)
  }
}

// Run the test
testOrdersLoading()
