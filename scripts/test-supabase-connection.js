const { createClient } = require('@supabase/supabase-js')

// Use the same configuration as the main app
const supabaseUrl = 'https://aizgswoelfdkhyosgvzu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpemdzd29lbGZka2h5b3Nndnp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwNTUyMjUsImV4cCI6MjA3MDYzMTIyNX0.4a7Smvc_bueFLqZNvGk-AW0kD5dJusNwqaSAczJs0hU'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  console.log('🔍 Testing Supabase connection...')
  console.log('URL:', supabaseUrl)
  console.log('Key set:', !!supabaseAnonKey)
  
  try {
    // Test 1: Simple connection test
    console.log('\n📡 Test 1: Basic connection...')
    const { data, error } = await supabase
      .from('products')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ Connection failed:', error)
      return
    }
    
    console.log('✅ Basic connection successful')
    
    // Test 2: Get products count
    console.log('\n📦 Test 2: Getting products count...')
    const { count, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
    
    if (countError) {
      console.error('❌ Products count failed:', countError)
    } else {
      console.log(`✅ Products count: ${count}`)
    }
    
    // Test 3: Get orders count
    console.log('\n📋 Test 3: Getting orders count...')
    const { count: ordersCount, error: ordersError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
    
    if (ordersError) {
      console.error('❌ Orders count failed:', ordersError)
    } else {
      console.log(`✅ Orders count: ${ordersCount}`)
    }
    
    // Test 4: Get order_items count
    console.log('\n🛍️ Test 4: Getting order_items count...')
    const { count: itemsCount, error: itemsError } = await supabase
      .from('order_items')
      .select('*', { count: 'exact', head: true })
    
    if (itemsError) {
      console.error('❌ Order items count failed:', itemsError)
    } else {
      console.log(`✅ Order items count: ${itemsCount}`)
    }
    
    console.log('\n🎉 All connection tests completed!')
    
  } catch (error) {
    console.error('❌ Connection test failed:', error)
  }
}

testConnection()
