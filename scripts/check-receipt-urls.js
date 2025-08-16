const { createClient } = require('@supabase/supabase-js')

// Use the service key to check all data
const supabaseUrl = 'https://aizgswoelfdkhyosgvzu.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpemdzd29lbGZka2h5b3Nndnp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTA1NTIyNSwiZXhwIjoyMDcwNjMxMjI1fQ.gLnsyAhR8VSjbe37LdEHuFBGNDufqC4jZ9X3UOSNuGc'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkReceiptUrls() {
  console.log('🔍 Checking receipt URLs in database...')
  
  try {
    // Get all orders with receipt information
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id, order_id, receipt_url, receipt_file_name')
    
    if (ordersError) {
      console.error('❌ Error fetching orders:', ordersError)
      return
    }

    console.log(`📋 Found ${orders.length} orders`)
    
    // Check each order for receipt info
    orders.forEach((order, index) => {
      console.log(`\n📋 Order ${index + 1}: ${order.order_id}`)
      console.log('  - Receipt URL:', order.receipt_url || 'NULL')
      console.log('  - Receipt File Name:', order.receipt_file_name || 'NULL')
      
      if (order.receipt_url) {
        console.log('  - ✅ Has receipt URL')
      } else if (order.receipt_file_name) {
        console.log('  - ⚠️ Has file name but no URL')
      } else {
        console.log('  - ❌ No receipt information')
      }
    })

    // Check storage bucket for receipt files
    console.log('\n📦 Checking storage bucket for receipt files...')
    const { data: files, error: filesError } = await supabase.storage
      .from('receipts')
      .list()

    if (filesError) {
      console.error('❌ Error listing receipt files:', filesError)
    } else {
      console.log(`📄 Found ${files.length} files in receipts bucket:`)
      files.forEach((file, index) => {
        console.log(`  ${index + 1}. ${file.name}`)
      })
    }

  } catch (error) {
    console.error('❌ Error checking receipt URLs:', error)
  }
}

checkReceiptUrls()
