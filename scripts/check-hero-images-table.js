const { createClient } = require('@supabase/supabase-js')

// Supabase configuration
const supabaseUrl = 'https://aizgswoelfdkhyosgvzu.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpemdzd29lbGZka2h5b3Nndnp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTA1NTIyNSwiZXhwIjoyMDcwNjMxMjI1fQ.gLnsyAhR8VSjbe37LdEHuFBGNDufqC4jZ9X3UOSNuGc'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkHeroImagesTable() {
  try {
    console.log('🔍 Checking hero_images table structure...')

    // Check if table exists
    const { data: tableData, error: tableError } = await supabase
      .from('hero_images')
      .select('*')
      .limit(1)

    if (tableError) {
      console.error('❌ Error accessing hero_images table:', tableError)
      return
    }

    console.log('✅ hero_images table exists and is accessible')
    console.log('📊 Current records:', tableData?.length || 0)

    if (tableData && tableData.length > 0) {
      console.log('\n📋 Table structure (from sample record):')
      const sampleRecord = tableData[0]
      Object.keys(sampleRecord).forEach(key => {
        console.log(`  - ${key}: ${typeof sampleRecord[key]} (${sampleRecord[key]})`)
      })
    }

    // Check specific text fields
    console.log('\n📝 Checking text content fields:')
    const textFields = ['title', 'subtitle', 'description', 'button_text', 'button_link']
    
    for (const field of textFields) {
      const { data: fieldData, error: fieldError } = await supabase
        .from('hero_images')
        .select(field)
        .limit(1)
      
      if (fieldError) {
        console.log(`  ❌ ${field}: Error - ${fieldError.message}`)
      } else {
        console.log(`  ✅ ${field}: Available`)
      }
    }

  } catch (error) {
    console.error('❌ Check failed:', error)
  }
}

checkHeroImagesTable()
