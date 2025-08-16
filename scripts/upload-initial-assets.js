const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

// Supabase configuration
const supabaseUrl = 'https://aizgswoelfdkhyosgvzu.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpemdzd29lbGZka2h5b3Nndnp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTA1NTIyNSwiZXhwIjoyMDcwNjMxMjI1fQ.gLnsyAhR8VSjbe37LdEHuFBGNDufqC4jZ9X3UOSNuGc'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function uploadInitialAssets() {
  try {
    console.log('🚀 Starting initial asset upload to Supabase...')

    // Initialize assets bucket
    const { data: buckets } = await supabase.storage.listBuckets()
    const assetsBucket = buckets?.find(bucket => bucket.name === 'assets')
    
    if (!assetsBucket) {
      console.log('📦 Creating assets bucket...')
      const { error: bucketError } = await supabase.storage.createBucket('assets', {
        public: true,
        allowedMimeTypes: ['image/svg+xml', 'image/png', 'image/jpeg', 'video/mp4', 'video/webm'],
        fileSizeLimit: 10485760 // 10MB
      })
      
      if (bucketError) {
        console.error('❌ Error creating assets bucket:', bucketError)
        return
      }
      console.log('✅ Assets bucket created successfully')
    } else {
      console.log('✅ Assets bucket already exists')
    }

    // Upload logo
    const logoPath = path.join(__dirname, '..', 'public', 'logo', 'dopelogo.svg')
    if (fs.existsSync(logoPath)) {
      console.log('📤 Uploading logo...')
      const logoBuffer = fs.readFileSync(logoPath)
      const timestamp = Date.now()
      const logoFileName = `logo/dopelogo_${timestamp}.svg`
      
      const { data: logoData, error: logoError } = await supabase.storage
        .from('assets')
        .upload(logoFileName, logoBuffer, {
          contentType: 'image/svg+xml',
          cacheControl: '31536000', // 1 year cache
          upsert: false
        })

      if (logoError) {
        console.error('❌ Error uploading logo:', logoError)
      } else {
        const { data: logoUrlData } = supabase.storage
          .from('assets')
          .getPublicUrl(logoFileName)
        console.log('✅ Logo uploaded successfully')
        console.log('🔗 Logo URL:', logoUrlData.publicUrl)
      }
    } else {
      console.log('⚠️ Logo file not found at:', logoPath)
    }

    // Upload video
    const videoPath = path.join(__dirname, '..', 'public', 'video', 'footervid.mp4')
    if (fs.existsSync(videoPath)) {
      console.log('📤 Uploading video...')
      const videoBuffer = fs.readFileSync(videoPath)
      const timestamp = Date.now()
      const videoFileName = `video/footervid_${timestamp}.mp4`
      
      const { data: videoData, error: videoError } = await supabase.storage
        .from('assets')
        .upload(videoFileName, videoBuffer, {
          contentType: 'video/mp4',
          cacheControl: '31536000', // 1 year cache
          upsert: false
        })

      if (videoError) {
        console.error('❌ Error uploading video:', videoError)
      } else {
        const { data: videoUrlData } = supabase.storage
          .from('assets')
          .getPublicUrl(videoFileName)
        console.log('✅ Video uploaded successfully')
        console.log('🔗 Video URL:', videoUrlData.publicUrl)
      }
    } else {
      console.log('⚠️ Video file not found at:', videoPath)
    }

    // List all assets
    console.log('\n📋 Listing all assets...')
    const { data: files, error: listError } = await supabase.storage
      .from('assets')
      .list('', { limit: 100 })

    if (listError) {
      console.error('❌ Error listing assets:', listError)
    } else {
      console.log('✅ Assets in storage:')
      files?.forEach(file => {
        const { data: urlData } = supabase.storage
          .from('assets')
          .getPublicUrl(file.name)
        console.log(`  - ${file.name}: ${urlData.publicUrl}`)
      })
    }

    console.log('\n🎉 Initial asset upload completed!')
    console.log('💡 You can now access the admin panel at /admin to manage assets')

  } catch (error) {
    console.error('❌ Error in uploadInitialAssets:', error)
  }
}

// Run the upload
uploadInitialAssets()
