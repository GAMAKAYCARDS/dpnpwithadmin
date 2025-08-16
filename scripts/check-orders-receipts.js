const { createClient } = require('@supabase/supabase-js')

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://aizgswoelfdkhyosgvzu.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpemdzd29lbGZka2h5b3Nndnp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTA1NTIyNSwiZXhwIjoyMDcwNjMxMjI1fQ.gLnsyAhR8VSjbe37LdEHuFBGNDufqC4jZ9X3UOSNuGc'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkOrdersReceipts() {
  console.log('🔍 Checking orders and receipts...')

  try {
    // Get all orders
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (ordersError) {
      console.error('❌ Error fetching orders:', ordersError)
      return
    }

    console.log(`📋 Found ${orders.length} orders`)

    if (orders.length === 0) {
      console.log('⚠️ No orders found in database')
      return
    }

    // Check each order for receipt information
    orders.forEach((order, index) => {
      console.log(`\n📦 Order ${index + 1}:`)
      console.log(`   Order ID: ${order.order_id}`)
      console.log(`   Customer: ${order.customer_name}`)
      console.log(`   Date: ${new Date(order.created_at).toLocaleString()}`)
      console.log(`   Receipt URL: ${order.receipt_url || 'None'}`)
      console.log(`   Receipt File Name: ${order.receipt_file_name || 'None'}`)
      console.log(`   Payment Option: ${order.payment_option}`)
      console.log(`   Payment Status: ${order.payment_status}`)
      console.log(`   Order Status: ${order.order_status}`)
      
      if (order.receipt_url) {
        console.log(`   ✅ Has receipt URL`)
      } else {
        console.log(`   ❌ No receipt URL`)
      }
    })

    // Count orders with receipts
    const ordersWithReceipts = orders.filter(order => order.receipt_url)
    console.log(`\n📊 Summary:`)
    console.log(`   Total Orders: ${orders.length}`)
    console.log(`   Orders with Receipts: ${ordersWithReceipts.length}`)
    console.log(`   Orders without Receipts: ${orders.length - ordersWithReceipts.length}`)

  } catch (error) {
    console.error('❌ Error checking orders:', error)
  }
}

// Run the check
checkOrdersReceipts()
