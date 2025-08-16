const { createClient } = require('@supabase/supabase-js')

// Supabase configuration
const supabaseUrl = 'https://aizgswoelfdkhyosgvzu.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpemdzd29lbGZka2h5b3Nndnp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTA1NTIyNSwiZXhwIjoyMDcwNjMxMjI1fQ.gLnsyAhR8VSjbe37LdEHuFBGNDufqC4jZ9X3UOSNuGc'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixStorageRLS() {
  try {
    console.log('🔧 Fixing storage RLS policies...')

    // First, let's check what buckets exist
    const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('❌ Error listing buckets:', listError)
      return
    }

    console.log('📋 Existing buckets:', existingBuckets?.map(b => b.name) || [])

    // Check if hero-images bucket exists
    const heroImagesBucket = existingBuckets?.find(bucket => bucket.name === 'hero-images')
    
    if (!heroImagesBucket) {
      console.log('📦 Creating hero-images bucket...')
      
      // Try to create the bucket with minimal configuration
      const { error: createError } = await supabase.storage.createBucket('hero-images', {
        public: true
      })
      
      if (createError) {
        console.error('❌ Error creating hero-images bucket:', createError)
        
        // If bucket creation fails, we'll try a different approach
        console.log('🔄 Trying alternative approach...')
        
        // Let's check if we can at least list the bucket (it might exist but not be accessible)
        const { data: testList, error: testError } = await supabase.storage
          .from('hero-images')
          .list('', { limit: 1 })
        
        if (testError) {
          console.error('❌ Cannot access hero-images bucket:', testError)
          console.log('💡 You may need to create the bucket manually in Supabase dashboard')
          console.log('   Go to: https://supabase.com/dashboard/project/aizgswoelfdkhyosgvzu/storage')
          console.log('   Create a bucket named "hero-images" with public access')
        } else {
          console.log('✅ hero-images bucket exists and is accessible')
        }
      } else {
        console.log('✅ hero-images bucket created successfully')
      }
    } else {
      console.log('✅ hero-images bucket already exists')
    }

    // Test if we can upload to the bucket
    console.log('🧪 Testing bucket access...')
    
    // Create a simple test file
    const testContent = 'test'
    const testFileName = `test-${Date.now()}.txt`
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('hero-images')
      .upload(testFileName, testContent, {
        contentType: 'text/plain'
      })

    if (uploadError) {
      console.error('❌ Error uploading test file:', uploadError)
      console.log('🔧 This indicates RLS policy issues')
      
      // Try to get more information about the error
      if (uploadError.message.includes('row-level security')) {
        console.log('💡 RLS Policy Issue Detected')
        console.log('   This means the bucket exists but has restrictive policies')
        console.log('   You need to update the RLS policies in Supabase dashboard')
        console.log('   Go to: https://supabase.com/dashboard/project/aizgswoelfdkhyosgvzu/storage/policies')
      }
    } else {
      console.log('✅ Test upload successful!')
      
      // Clean up test file
      const { error: deleteError } = await supabase.storage
        .from('hero-images')
        .remove([testFileName])
      
      if (deleteError) {
        console.error('⚠️ Error deleting test file:', deleteError)
      } else {
        console.log('🧹 Test file cleaned up')
      }
    }

    console.log('\n📋 Summary:')
    console.log('1. Check if hero-images bucket exists in Supabase dashboard')
    console.log('2. If it exists, check RLS policies')
    console.log('3. If it doesn\'t exist, create it manually')
    console.log('4. Ensure the bucket has public access')

  } catch (error) {
    console.error('❌ Error in fixStorageRLS:', error)
  }
}

// Run the fix
fixStorageRLS()
