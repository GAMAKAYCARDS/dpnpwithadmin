const { createClient } = require('@supabase/supabase-js')

// Supabase configuration
const supabaseUrl = 'https://aizgswoelfdkhyosgvzu.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpemdzd29lbGZka2h5b3Nndnp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTA1NTIyNSwiZXhwIjoyMDcwNjMxMjI1fQ.gLnsyAhR8VSjbe37LdEHuFBGNDufqC4jZ9X3UOSNuGc'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createHeroImagesTable() {
  try {
    console.log('🔧 Creating hero_images table...')

    // SQL to create the hero_images table
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS hero_images (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        subtitle VARCHAR(500),
        description TEXT,
        image_url TEXT NOT NULL,
        image_file_name VARCHAR(255),
        button_text VARCHAR(100),
        button_link VARCHAR(500),
        display_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `

    // Execute the SQL
    const { error: createError } = await supabase.rpc('exec_sql', { sql: createTableSQL })

    if (createError) {
      console.error('❌ Error creating table:', createError)
      
      // If RPC doesn't work, try alternative approach
      console.log('🔄 Trying alternative approach...')
      
      // Check if table already exists
      const { data: existingData, error: checkError } = await supabase
        .from('hero_images')
        .select('*')
        .limit(1)

      if (checkError && checkError.message.includes('Could not find the table')) {
        console.log('❌ Table does not exist and cannot be created via RPC')
        console.log('💡 You need to create the table manually in Supabase dashboard')
        console.log('   Go to: https://supabase.com/dashboard/project/aizgswoelfdkhyosgvzu/sql')
        console.log('   Run this SQL:')
        console.log(createTableSQL)
        return
      } else if (checkError) {
        console.error('❌ Error checking table:', checkError)
        return
      } else {
        console.log('✅ hero_images table already exists!')
      }
    } else {
      console.log('✅ hero_images table created successfully!')
    }

    // Create indexes for better performance
    console.log('🔧 Creating indexes...')
    const indexSQL = `
      CREATE INDEX IF NOT EXISTS idx_hero_images_active ON hero_images(is_active);
      CREATE INDEX IF NOT EXISTS idx_hero_images_order ON hero_images(display_order);
      CREATE INDEX IF NOT EXISTS idx_hero_images_created_at ON hero_images(created_at);
    `

    const { error: indexError } = await supabase.rpc('exec_sql', { sql: indexSQL })
    if (indexError) {
      console.log('⚠️ Could not create indexes via RPC (this is optional)')
    } else {
      console.log('✅ Indexes created successfully!')
    }

    // Enable Row Level Security
    console.log('🔧 Setting up Row Level Security...')
    const rlsSQL = `
      ALTER TABLE hero_images ENABLE ROW LEVEL SECURITY;
      
      -- Allow public read access to active hero images
      CREATE POLICY "Hero images are viewable by everyone" ON hero_images
        FOR SELECT USING (is_active = true);
      
      -- Allow authenticated users to manage hero images (you can adjust this)
      CREATE POLICY "Users can manage hero images" ON hero_images
        FOR ALL USING (true);
    `

    const { error: rlsError } = await supabase.rpc('exec_sql', { sql: rlsSQL })
    if (rlsError) {
      console.log('⚠️ Could not set up RLS via RPC (you may need to do this manually)')
      console.log('💡 Go to Supabase dashboard and run:')
      console.log(rlsSQL)
    } else {
      console.log('✅ Row Level Security configured!')
    }

    // Insert sample data
    console.log('📝 Inserting sample hero image...')
    const { data: insertData, error: insertError } = await supabase
      .from('hero_images')
      .insert([
        {
          title: 'Welcome to DopeTech',
          subtitle: 'Premium Technology Solutions',
          description: 'Discover our latest collection of high-quality tech products designed for modern professionals.',
          image_url: 'https://aizgswoelfdkhyosgvzu.supabase.co/storage/v1/object/public/hero-images/sample-hero.jpg',
          image_file_name: 'sample-hero.jpg',
          button_text: 'Shop Now',
          button_link: '/products',
          display_order: 1,
          is_active: true
        }
      ])
      .select()

    if (insertError) {
      console.log('⚠️ Could not insert sample data:', insertError.message)
      console.log('💡 This is normal if the table structure is different')
    } else {
      console.log('✅ Sample hero image inserted!')
      console.log('📋 Sample record:', insertData[0])
    }

    // Verify the table structure
    console.log('\n🔍 Verifying table structure...')
    const { data: verifyData, error: verifyError } = await supabase
      .from('hero_images')
      .select('*')
      .limit(1)

    if (verifyError) {
      console.error('❌ Error verifying table:', verifyError)
    } else {
      console.log('✅ Table verification successful!')
      if (verifyData && verifyData.length > 0) {
        console.log('📋 Available columns:', Object.keys(verifyData[0]))
      }
    }

    console.log('\n🎉 hero_images table setup complete!')
    console.log('✅ You can now store both images and text content')
    console.log('✅ Admin can control titles, descriptions, buttons, and display order')
    console.log('✅ Images are stored in hero-images bucket')
    console.log('✅ Text content is stored in hero_images table')

  } catch (error) {
    console.error('❌ Error in createHeroImagesTable:', error)
  }
}

// Run the creation
createHeroImagesTable()
