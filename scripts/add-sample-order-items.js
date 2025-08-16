const { createClient } = require('@supabase/supabase-js')

// Use the same configuration as the main app
const supabaseUrl = 'https://aizgswoelfdkhyosgvzu.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpemdzd29lbGZka2h5b3Nndnp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTA1NTIyNSwiZXhwIjoyMDcwNjMxMjI1fQ.gLnsyAhR8VSjbe37LdEHuFBGNDufqC4jZ9X3UOSNuGc'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function addSampleOrderItems() {
  console.log('🔍 Adding sample order items...')
  
  try {
    // First, get existing orders
    console.log('\n📋 Getting existing orders...')
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id, order_id, total_amount')
      .limit(5)
    
    if (ordersError) {
      console.error('❌ Error getting orders:', ordersError)
      return
    }

    console.log(`✅ Found ${orders.length} orders`)

    // Get existing products
    console.log('\n🛍️ Getting existing products...')
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, price')
      .limit(5)
    
    if (productsError) {
      console.error('❌ Error getting products:', productsError)
      return
    }

    console.log(`✅ Found ${products.length} products`)

    if (orders.length === 0 || products.length === 0) {
      console.error('❌ No orders or products found. Cannot create order items.')
      return
    }

    // Create sample order items
    const sampleOrderItems = []
    
    orders.forEach((order, orderIndex) => {
      // Add 1-3 items per order
      const numItems = Math.floor(Math.random() * 3) + 1
      
      for (let i = 0; i < numItems; i++) {
        const product = products[i % products.length] // Cycle through products
        const quantity = Math.floor(Math.random() * 3) + 1
        
        sampleOrderItems.push({
          order_id: order.id,
          product_id: product.id,
          quantity: quantity,
          price: product.price,
          created_at: new Date().toISOString()
        })
      }
    })

    console.log(`📦 Creating ${sampleOrderItems.length} sample order items...`)

    // Insert the sample order items
    const { data: insertedItems, error: insertError } = await supabase
      .from('order_items')
      .insert(sampleOrderItems)
      .select()

    if (insertError) {
      console.error('❌ Error inserting order items:', insertError)
      return
    }

    console.log(`✅ Successfully created ${insertedItems.length} order items`)
    console.log('📊 Sample created items:', insertedItems.slice(0, 3))

    // Verify the items were created
    console.log('\n🔍 Verifying created items...')
    const { data: verifyItems, error: verifyError } = await supabase
      .from('order_items')
      .select('*')
      .limit(10)
    
    if (verifyError) {
      console.error('❌ Error verifying items:', verifyError)
    } else {
      console.log(`✅ Verified ${verifyItems.length} total order items in database`)
    }

  } catch (error) {
    console.error('❌ Error adding sample order items:', error)
  }
}

addSampleOrderItems()
