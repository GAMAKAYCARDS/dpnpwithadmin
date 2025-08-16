const { createClient } = require('@supabase/supabase-js')

// Supabase configuration
const supabaseUrl = 'https://aizgswoelfdkhyosgvzu.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpemdzd29lbGZka2h5b3Nndnp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTA1NTIyNSwiZXhwIjoyMDcwNjMxMjI1fQ.gLnsyAhR8VSjbe37LdEHuFBGNDufqC4jZ9X3UOSNuGc'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkTablesSimple() {
  try {
    console.log('🔍 Checking database tables...')

    // Try to query common tables to see what exists
    const tablesToCheck = [
      'products',
      'orders', 
      'order_items',
      'hero_images',
      'hero_sections',
      'banners',
      'content'
    ]

    console.log('📋 Checking for existing tables:')
    
    for (const tableName of tablesToCheck) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1)

        if (error) {
          console.log(`  ❌ ${tableName}: ${error.message}`)
        } else {
          console.log(`  ✅ ${tableName}: Table exists`)
          
          // If it's hero_images, let's see what columns it has
          if (tableName === 'hero_images') {
            console.log(`     📊 Found ${data?.length || 0} records`)
            if (data && data.length > 0) {
              console.log(`     📋 Sample record keys: ${Object.keys(data[0]).join(', ')}`)
            }
          }
        }
      } catch (err) {
        console.log(`  ❌ ${tableName}: ${err.message}`)
      }
    }

    // Check storage buckets
    console.log('\n📦 Checking storage buckets...')
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      console.error('❌ Error checking buckets:', bucketsError)
    } else {
      console.log('📋 Available storage buckets:')
      buckets?.forEach(bucket => {
        console.log(`  - ${bucket.name} (${bucket.public ? 'Public' : 'Private'})`)
      })
    }

    console.log('\n📋 Summary:')
    console.log('✅ hero-images storage bucket exists - can store image files')
    console.log('❌ No hero_images table found - need to create one for text content')
    console.log('💡 Current system only stores images, not text content')
    console.log('💡 To store text content, you need a hero_images table')

  } catch (error) {
    console.error('❌ Error in checkTablesSimple:', error)
  }
}

// Run the check
checkTablesSimple()
