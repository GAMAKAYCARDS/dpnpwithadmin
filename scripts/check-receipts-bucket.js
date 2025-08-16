const { createClient } = require('@supabase/supabase-js')

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://aizgswoelfdkhyosgvzu.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpemdzd29lbGZka2h5b3Nndnp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTA1NTIyNSwiZXhwIjoyMDcwNjMxMjI1fQ.gLnsyAhR8VSjbe37LdEHuFBGNDufqC4jZ9X3UOSNuGc'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkReceiptsBucket() {
  console.log('🔍 Checking receipts bucket setup...')

  try {
    // List all buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      console.error('❌ Error listing buckets:', bucketsError)
      return
    }

    console.log('📦 Available buckets:', buckets.map(b => b.name))

    // Check if receipts bucket exists
    const receiptsBucket = buckets.find(b => b.name === 'receipts')
    
    if (!receiptsBucket) {
      console.log('⚠️ Receipts bucket not found. Creating...')
      
      const { data: newBucket, error: createError } = await supabase.storage.createBucket('receipts', {
        public: true,
        allowedMimeTypes: ['image/*', 'application/pdf', 'application/octet-stream'],
        fileSizeLimit: 52428800 // 50MB
      })

      if (createError) {
        console.error('❌ Error creating receipts bucket:', createError)
        return
      }

      console.log('✅ Receipts bucket created successfully')
    } else {
      console.log('✅ Receipts bucket exists')
    }

    // List files in receipts bucket
    const { data: files, error: filesError } = await supabase.storage
      .from('receipts')
      .list()

    if (filesError) {
      console.error('❌ Error listing files:', filesError)
      return
    }

    console.log('📄 Files in receipts bucket:', files.map(f => f.name))

    // Test public URL generation
    if (files.length > 0) {
      const testFile = files[0]
      const { data: urlData } = supabase.storage
        .from('receipts')
        .getPublicUrl(testFile.name)
      
      console.log('🔗 Test public URL:', urlData.publicUrl)
    }

  } catch (error) {
    console.error('❌ Error checking receipts bucket:', error)
  }
}

// Run the check
checkReceiptsBucket()
