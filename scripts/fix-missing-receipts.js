const { createClient } = require('@supabase/supabase-js')

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://aizgswoelfdkhyosgvzu.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpemdzd29lbGZka2h5b3Nndnp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTA1NTIyNSwiZXhwIjoyMDcwNjMxMjI1fQ.gLnsyAhR8VSjbe37LdEHuFBGNDufqC4jZ9X3UOSNuGc'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixMissingReceipts() {
  console.log('🔧 Fixing missing receipt URLs...')

  try {
    // Get orders with receipt file names but no URLs
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .not('receipt_file_name', 'is', null)
      .is('receipt_url', null)

    if (ordersError) {
      console.error('❌ Error fetching orders:', ordersError)
      return
    }

    console.log(`📋 Found ${orders.length} orders with missing receipt URLs`)

    if (orders.length === 0) {
      console.log('✅ No orders need fixing')
      return
    }

    // Process each order
    for (const order of orders) {
      console.log(`\n🔧 Processing order: ${order.order_id}`)
      console.log(`   File name: ${order.receipt_file_name}`)
      
      try {
        // Generate the expected file name
        const fileExt = order.receipt_file_name.split('.').pop()
        const fileName = `${order.order_id}_receipt.${fileExt}`
        
        console.log(`   Expected file name: ${fileName}`)
        
        // Check if file exists in storage
        const { data: files, error: listError } = await supabase.storage
          .from('receipts')
          .list('', {
            search: fileName
          })

        if (listError) {
          console.error(`   ❌ Error listing files:`, listError)
          continue
        }

        if (files.length === 0) {
          console.log(`   ⚠️ File not found in storage: ${fileName}`)
          continue
        }

        // Generate public URL
        const { data: urlData } = supabase.storage
          .from('receipts')
          .getPublicUrl(fileName)

        const receiptUrl = urlData.publicUrl
        console.log(`   ✅ Generated URL: ${receiptUrl}`)

        // Update the order with the receipt URL
        const { error: updateError } = await supabase
          .from('orders')
          .update({ receipt_url: receiptUrl })
          .eq('id', order.id)

        if (updateError) {
          console.error(`   ❌ Error updating order:`, updateError)
        } else {
          console.log(`   ✅ Order updated successfully`)
        }

      } catch (error) {
        console.error(`   ❌ Error processing order ${order.order_id}:`, error)
      }
    }

    console.log('\n✅ Finished processing orders')

  } catch (error) {
    console.error('❌ Error fixing missing receipts:', error)
  }
}

// Run the fix
fixMissingReceipts()
