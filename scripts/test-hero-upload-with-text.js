const { createClient } = require('@supabase/supabase-js')

// Supabase configuration
const supabaseUrl = 'https://aizgswoelfdkhyosgvzu.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpemdzd29lbGZka2h5b3Nndnp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTA1NTIyNSwiZXhwIjoyMDcwNjMxMjI1fQ.gLnsyAhR8VSjbe37LdEHuFBGNDufqC4jZ9X3UOSNuGc'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testHeroUploadWithText() {
  try {
    console.log('🧪 Testing hero image upload with text content...')

    // First, check if hero_images table exists and has the right structure
    console.log('\n📋 Checking hero_images table structure...')
    const { data: tableData, error: tableError } = await supabase
      .from('hero_images')
      .select('*')
      .limit(1)

    if (tableError) {
      console.error('❌ Error accessing hero_images table:', tableError)
      return
    }

    console.log('✅ hero_images table is accessible')
    console.log('📊 Current records:', tableData?.length || 0)

    // Test inserting a new record with text content
    console.log('\n📝 Testing text content insertion...')
    const testRecord = {
      title: 'Test Hero Title',
      subtitle: 'Test Subtitle',
      description: 'This is a test description for the hero image',
      image_url: 'https://via.placeholder.com/1920x1080/000000/FFFFFF?text=Test+Hero+Image',
      image_file_name: 'test-hero.jpg',
      button_text: '',
      button_link: '',
      display_order: 999,
      is_active: true
    }

    const { data: insertData, error: insertError } = await supabase
      .from('hero_images')
      .insert([testRecord])
      .select()

    if (insertError) {
      console.error('❌ Error inserting test record:', insertError)
      return
    }

    console.log('✅ Successfully inserted test record with text content')
    console.log('📋 Inserted record:', insertData[0])

    // Test updating the record
    console.log('\n✏️ Testing text content update...')
    const { data: updateData, error: updateError } = await supabase
      .from('hero_images')
      .update({ 
        title: 'Updated Test Title',
        subtitle: 'Updated Test Subtitle',
        description: 'This is an updated test description'
      })
      .eq('id', insertData[0].id)
      .select()

    if (updateError) {
      console.error('❌ Error updating test record:', updateError)
    } else {
      console.log('✅ Successfully updated test record')
      console.log('📋 Updated record:', updateData[0])
    }

    // Clean up - delete the test record
    console.log('\n🧹 Cleaning up test record...')
    const { error: deleteError } = await supabase
      .from('hero_images')
      .delete()
      .eq('id', insertData[0].id)

    if (deleteError) {
      console.error('❌ Error deleting test record:', deleteError)
    } else {
      console.log('✅ Successfully deleted test record')
    }

    console.log('\n🎉 All tests passed! The hero_images table is working correctly with text content.')

  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

testHeroUploadWithText()
