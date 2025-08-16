const { createClient } = require('@supabase/supabase-js')

// Supabase configuration
const supabaseUrl = 'https://aizgswoelfdkhyosgvzu.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpemdzd29lbGZka2h5b3Nndnp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTA1NTIyNSwiZXhwIjoyMDcwNjMxMjI1fQ.gLnsyAhR8VSjbe37LdEHuFBGNDufqC4jZ9X3UOSNuGc'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupStorageBuckets() {
  try {
    console.log('🚀 Setting up storage buckets for DopeTech...')

    // Get existing buckets
    const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('❌ Error listing buckets:', listError)
      return
    }

    console.log('📋 Existing buckets:', existingBuckets?.map(b => b.name) || [])

    // Define required buckets
    const requiredBuckets = [
      {
        name: 'assets',
        public: true,
        allowedMimeTypes: ['image/svg+xml', 'image/png', 'image/jpeg', 'video/mp4', 'video/webm'],
        fileSizeLimit: 10485760 // 10MB
      },
      {
        name: 'hero-images',
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
        fileSizeLimit: 10485760 // 10MB
      },
      {
        name: 'product-images',
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
        fileSizeLimit: 10485760 // 10MB
      },
      {
        name: 'receipts',
        public: false,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'],
        fileSizeLimit: 10485760 // 10MB
      },
      {
        name: 'avatars',
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
        fileSizeLimit: 5242880 // 5MB
      }
    ]

    // Create missing buckets
    for (const bucketConfig of requiredBuckets) {
      const existingBucket = existingBuckets?.find(b => b.name === bucketConfig.name)
      
      if (!existingBucket) {
        console.log(`📦 Creating ${bucketConfig.name} bucket...`)
        
        const { error: createError } = await supabase.storage.createBucket(bucketConfig.name, {
          public: bucketConfig.public,
          allowedMimeTypes: bucketConfig.allowedMimeTypes,
          fileSizeLimit: bucketConfig.fileSizeLimit
        })
        
        if (createError) {
          console.error(`❌ Error creating ${bucketConfig.name} bucket:`, createError)
        } else {
          console.log(`✅ ${bucketConfig.name} bucket created successfully`)
        }
      } else {
        console.log(`✅ ${bucketConfig.name} bucket already exists`)
      }
    }

    // Verify all buckets exist
    const { data: finalBuckets, error: finalListError } = await supabase.storage.listBuckets()
    
    if (finalListError) {
      console.error('❌ Error listing final buckets:', finalListError)
      return
    }

    console.log('\n🎉 Storage setup complete!')
    console.log('📋 Available buckets:')
    finalBuckets?.forEach(bucket => {
      console.log(`  - ${bucket.name} (${bucket.public ? 'Public' : 'Private'})`)
    })

  } catch (error) {
    console.error('❌ Error in setupStorageBuckets:', error)
  }
}

// Run the setup
setupStorageBuckets()
