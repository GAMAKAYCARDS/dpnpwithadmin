const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Supabase configuration
const supabaseUrl = 'https://aizgswoelfdkhyosgvzu.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpemdzd29lbGZka2h5b3Nndnp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTA1NTIyNSwiZXhwIjoyMDcwNjMxMjI1fQ.gLnsyAhR8VSjbe37LdEHuFBGNDufqC4jZ9X3UOSNuGc'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testHeroAccess() {
  try {
    console.log('🧪 Testing hero-images bucket access...')

    // Check if hero-images bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('❌ Error listing buckets:', listError)
      return
    }

    const heroImagesBucket = buckets?.find(bucket => bucket.name === 'hero-images')
    
    if (!heroImagesBucket) {
      console.error('❌ hero-images bucket not found!')
      return
    }

    console.log('✅ hero-images bucket found')
    console.log('📋 Bucket details:', {
      name: heroImagesBucket.name,
      public: heroImagesBucket.public,
      fileSizeLimit: heroImagesBucket.fileSizeLimit,
      allowedMimeTypes: heroImagesBucket.allowedMimeTypes
    })

    // Test uploading a sample image
    const sampleImagePath = path.join(__dirname, '..', 'products', 'keyboard.png')
    
    if (fs.existsSync(sampleImagePath)) {
      console.log('📤 Testing upload with sample image...')
      
      const fileBuffer = fs.readFileSync(sampleImagePath)
      const fileName = `test-${Date.now()}-keyboard.png`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('hero-images')
        .upload(fileName, fileBuffer, {
          contentType: 'image/png'
        })

      if (uploadError) {
        console.error('❌ Error uploading test image:', uploadError)
        
        if (uploadError.message.includes('row-level security')) {
          console.log('🔧 RLS Policy Issue Detected')
          console.log('   The bucket exists but has restrictive policies')
          console.log('   You need to update the RLS policies in Supabase dashboard')
          console.log('   Go to: https://supabase.com/dashboard/project/aizgswoelfdkhyosgvzu/storage/policies')
          console.log('   For the hero-images bucket, you need policies that allow:')
          console.log('   - SELECT (for reading images)')
          console.log('   - INSERT (for uploading images)')
          console.log('   - DELETE (for deleting images)')
        }
      } else {
        console.log('✅ Test image uploaded successfully!')
        console.log('📁 Uploaded file:', uploadData.path)

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('hero-images')
          .getPublicUrl(fileName)

        console.log('🔗 Public URL:', urlData.publicUrl)

        // Test listing files
        const { data: listData, error: listFilesError } = await supabase.storage
          .from('hero-images')
          .list('', { limit: 10 })

        if (listFilesError) {
          console.error('❌ Error listing files:', listFilesError)
        } else {
          console.log('📋 Files in bucket:', listData?.map(f => f.name) || [])
        }

        // Clean up test image
        const { error: deleteError } = await supabase.storage
          .from('hero-images')
          .remove([fileName])

        if (deleteError) {
          console.error('⚠️ Error deleting test image:', deleteError)
        } else {
          console.log('🧹 Test image cleaned up')
        }

        console.log('\n🎉 Hero images bucket is working correctly!')
        console.log('✅ The admin panel should now work for uploading hero images')
      }

    } else {
      console.log('⚠️ No sample image found for testing')
      console.log('💡 You can test manually by uploading an image through the admin panel')
    }

  } catch (error) {
    console.error('❌ Error in testHeroAccess:', error)
  }
}

// Run the test
testHeroAccess()
