const { createClient } = require('@supabase/supabase-js')

// Supabase configuration
const supabaseUrl = 'https://aizgswoelfdkhyosgvzu.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpemdzd29lbGZka2h5b3Nndnp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTA1NTIyNSwiZXhwIjoyMDcwNjMxMjI1fQ.gLnsyAhR8VSjbe37LdEHuFBGNDufqC4jZ9X3UOSNuGc'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testHeroUpload() {
  try {
    console.log('🧪 Testing Hero Image Upload System...')

    // Test 1: Check if we can connect to Supabase
    console.log('\n1️⃣ Testing Supabase connection...')
    const { data: testData, error: testError } = await supabase
      .from('hero_images')
      .select('count')
      .limit(1)
    
    if (testError) {
      console.error('❌ Database connection failed:', testError)
      return
    }
    console.log('✅ Database connection successful')

    // Test 2: Check if hero_images table exists and has data
    console.log('\n2️⃣ Checking hero_images table...')
    const { data: heroImages, error: heroError } = await supabase
      .from('hero_images')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)
    
    if (heroError) {
      console.error('❌ Error fetching hero images:', heroError)
      return
    }
    
    console.log(`✅ Found ${heroImages.length} hero images in database`)
    if (heroImages.length > 0) {
      console.log('📋 Recent images:')
      heroImages.forEach((img, index) => {
        console.log(`  ${index + 1}. ${img.title} (${img.is_active ? 'Active' : 'Inactive'})`)
      })
    }

    // Test 3: Check storage bucket access
    console.log('\n3️⃣ Testing storage bucket access...')
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets()
    
    if (bucketError) {
      console.error('❌ Error accessing storage:', bucketError)
      return
    }
    
    const heroBucket = buckets.find(b => b.name === 'hero-images')
    if (heroBucket) {
      console.log('✅ hero-images bucket accessible')
    } else {
      console.error('❌ hero-images bucket not found')
      return
    }

    // Test 4: Check if we can list files in hero-images bucket
    console.log('\n4️⃣ Testing file listing in hero-images bucket...')
    const { data: files, error: filesError } = await supabase.storage
      .from('hero-images')
      .list()
    
    if (filesError) {
      console.error('❌ Error listing files:', filesError)
      return
    }
    
    console.log(`✅ Found ${files.length} files in hero-images bucket`)
    if (files.length > 0) {
      console.log('📁 Files:')
      files.slice(0, 5).forEach((file, index) => {
        console.log(`  ${index + 1}. ${file.name} (${file.metadata?.size || 'unknown size'})`)
      })
    }

    console.log('\n🎉 All tests passed! The hero image system should be working properly.')
    console.log('\n💡 If you\'re still experiencing issues, check:')
    console.log('   - Browser console for JavaScript errors')
    console.log('   - Network tab for failed API requests')
    console.log('   - Server logs for backend errors')

  } catch (error) {
    console.error('❌ Test failed with error:', error)
  }
}

// Run the test
testHeroUpload()
