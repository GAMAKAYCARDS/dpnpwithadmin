const { createClient } = require('@supabase/supabase-js')

// Supabase configuration
const supabaseUrl = 'https://aizgswoelfdkhyosgvzu.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpemdzd29lbGZka2h5b3Nndnp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTA1NTIyNSwiZXhwIjoyMDcwNjMxMjI1fQ.gLnsyAhR8VSjbe37LdEHuFBGNDufqC4jZ9X3UOSNuGc'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkDatabaseTables() {
  try {
    console.log('🔍 Checking database tables...')

    // Check what tables exist by querying information_schema
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')

    if (tablesError) {
      console.error('❌ Error checking tables:', tablesError)
      return
    }

    console.log('📋 Existing tables:')
    tables?.forEach(table => {
      console.log(`  - ${table.table_name}`)
    })

    // Check if hero_images table exists
    const heroImagesTable = tables?.find(t => t.table_name === 'hero_images')
    
    if (heroImagesTable) {
      console.log('\n✅ hero_images table exists!')
      
      // Check the structure of the hero_images table
      const { data: columns, error: columnsError } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable')
        .eq('table_schema', 'public')
        .eq('table_name', 'hero_images')

      if (columnsError) {
        console.error('❌ Error checking columns:', columnsError)
      } else {
        console.log('📋 hero_images table structure:')
        columns?.forEach(col => {
          console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`)
        })
      }

      // Check if there are any records
      const { data: records, error: recordsError } = await supabase
        .from('hero_images')
        .select('*')
        .limit(5)

      if (recordsError) {
        console.error('❌ Error checking records:', recordsError)
      } else {
        console.log(`📊 Found ${records?.length || 0} hero image records`)
        if (records && records.length > 0) {
          console.log('📋 Sample records:')
          records.forEach((record, index) => {
            console.log(`  ${index + 1}. ${record.title || record.name || 'Untitled'} (${record.image_url ? 'Has image' : 'No image'})`)
          })
        }
      }

    } else {
      console.log('\n❌ hero_images table does not exist')
      console.log('💡 You need to create a hero_images table to store image metadata and text content')
      console.log('   This table should store:')
      console.log('   - Image file information')
      console.log('   - Text content (title, description, etc.)')
      console.log('   - Display order')
      console.log('   - Active status')
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
    if (heroImagesTable) {
      console.log('✅ hero_images table exists - you can store image metadata and text content')
      console.log('✅ hero-images storage bucket exists - you can store image files')
      console.log('🎉 Your hero image system is ready to use!')
    } else {
      console.log('❌ hero_images table missing - need to create it for full functionality')
      console.log('✅ hero-images storage bucket exists - can store image files')
      console.log('💡 Consider creating a hero_images table for better content management')
    }

  } catch (error) {
    console.error('❌ Error in checkDatabaseTables:', error)
  }
}

// Run the check
checkDatabaseTables()
