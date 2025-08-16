const { createClient } = require('@supabase/supabase-js')

// Use the service key to update data
const supabaseUrl = 'https://aizgswoelfdkhyosgvzu.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpemdzd29lbGZka2h5b3Nndnp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTA1NTIyNSwiZXhwIjoyMDcwNjMxMjI1fQ.gLnsyAhR8VSjbe37LdEHuFBGNDufqC4jZ9X3UOSNuGc'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixReceiptUrls() {
  console.log('🔧 Fixing receipt URLs for existing orders...')
  
  try {
    // Get orders that have file names but no URLs
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id, order_id, receipt_url, receipt_file_name')
      .is('receipt_url', null)
      .not('receipt_file_name', 'is', null)
    
    if (ordersError) {
      console.error('❌ Error fetching orders:', ordersError)
      return
    }

    console.log(`📋 Found ${orders.length} orders with file names but no URLs`)
    
    if (orders.length === 0) {
      console.log('✅ No orders need fixing')
      return
    }

    // Fix each order
    for (const order of orders) {
      console.log(`\n🔧 Fixing order: ${order.order_id}`)
      console.log('  - File name:', order.receipt_file_name)
      
      // Generate the expected file name in storage
      const fileExt = order.receipt_file_name.split('.').pop()
      const expectedFileName = `${order.order_id}_receipt.${fileExt}`
      
      console.log('  - Expected file name:', expectedFileName)
      
      // Check if file exists in storage
      const { data: files, error: filesError } = await supabase.storage
        .from('receipts')
        .list('', {
          search: expectedFileName
        })
      
      if (filesError) {
        console.error('  ❌ Error checking storage:', filesError)
        continue
      }
      
      if (files.length === 0) {
        console.log('  ⚠️ File not found in storage, skipping...')
        continue
      }
      
      // Generate public URL
      const { data: urlData } = supabase.storage
        .from('receipts')
        .getPublicUrl(expectedFileName)
      
      const receiptUrl = urlData.publicUrl
      console.log('  - Generated URL:', receiptUrl)
      
      // Update the order with the URL
      const { error: updateError } = await supabase
        .from('orders')
        .update({ receipt_url: receiptUrl })
        .eq('id', order.id)
      
      if (updateError) {
        console.error('  ❌ Error updating order:', updateError)
      } else {
        console.log('  ✅ Order updated successfully')
      }
    }

    console.log('\n🎉 Receipt URL fixing completed!')

  } catch (error) {
    console.error('❌ Error fixing receipt URLs:', error)
  }
}

fixReceiptUrls()
