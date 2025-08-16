const { createClient } = require('@supabase/supabase-js')

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://aizgswoelfdkhyosgvzu.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpemdzd29lbGZka2h5b3Nndnp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTA1NTIyNSwiZXhwIjoyMDcwNjMxMjI1fQ.gLnsyAhR8VSjbe37LdEHuFBGNDufqC4jZ9X3UOSNuGc'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupDatabase() {
  console.log('🚀 Setting up DopeTech Admin Database...')

  try {
    // 1. Create hero_images table
    console.log('📋 Creating hero_images table...')
    const { error: heroTableError } = await supabase.rpc('exec_sql', {
      sql: `
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
    })

    if (heroTableError) {
      console.log('⚠️ Hero images table might already exist or there was an error:', heroTableError.message)
    } else {
      console.log('✅ Hero images table created successfully')
    }

    // 2. Create storage buckets
    console.log('🪣 Creating storage buckets...')
    
    // Assets bucket
    const { data: assetsBucket, error: assetsError } = await supabase.storage.createBucket('assets', {
      public: true,
      allowedMimeTypes: ['image/svg+xml', 'image/png', 'image/jpeg', 'image/jpg', 'video/mp4', 'video/webm'],
      fileSizeLimit: 10485760 // 10MB
    })

    if (assetsError && !assetsError.message.includes('already exists')) {
      console.error('❌ Error creating assets bucket:', assetsError)
    } else {
      console.log('✅ Assets bucket ready')
    }

    // Hero images bucket
    const { data: heroBucket, error: heroError } = await supabase.storage.createBucket('hero-images', {
      public: true,
      allowedMimeTypes: ['image/svg+xml', 'image/png', 'image/jpeg', 'image/jpg'],
      fileSizeLimit: 5242880 // 5MB
    })

    if (heroError && !heroError.message.includes('already exists')) {
      console.error('❌ Error creating hero-images bucket:', heroError)
    } else {
      console.log('✅ Hero images bucket ready')
    }

    // 3. Insert sample hero image if none exist
    console.log('🖼️ Checking for sample hero images...')
    const { data: existingHeroImages, error: checkError } = await supabase
      .from('hero_images')
      .select('id')
      .limit(1)

    if (checkError) {
      console.error('❌ Error checking hero images:', checkError)
    } else if (!existingHeroImages || existingHeroImages.length === 0) {
      console.log('📸 Inserting sample hero image...')
      const { error: insertError } = await supabase
        .from('hero_images')
        .insert([
          {
            title: 'Welcome to DopeTech',
            subtitle: 'Premium Technology Solutions',
            description: 'Discover our latest collection of high-quality tech products designed for modern professionals.',
            image_url: '/products/keyboard.png',
            image_file_name: 'sample-hero.jpg',
            button_text: 'Shop Now',
            button_link: '/products',
            display_order: 1,
            is_active: true
          }
        ])

      if (insertError) {
        console.error('❌ Error inserting sample hero image:', insertError)
      } else {
        console.log('✅ Sample hero image inserted')
      }
    } else {
      console.log('✅ Hero images already exist')
    }

    // 4. Check products table
    console.log('📦 Checking products table...')
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id')
      .limit(1)

    if (productsError) {
      console.error('❌ Products table error:', productsError)
      console.log('💡 You may need to run the main schema setup first')
    } else {
      console.log(`✅ Products table ready (${products?.length || 0} products found)`)
    }

    // 5. Set up RLS policies
    console.log('🔒 Setting up Row Level Security policies...')
    
    // Hero images policies
    const { error: heroPolicyError } = await supabase.rpc('exec_sql', {
      sql: `
        -- Drop existing policies if they exist
        DROP POLICY IF EXISTS "Hero images are viewable by everyone" ON hero_images;
        DROP POLICY IF EXISTS "Users can manage hero images" ON hero_images;
        
        -- Create new policies
        CREATE POLICY "Hero images are viewable by everyone" ON hero_images
          FOR SELECT USING (is_active = true);
        
        CREATE POLICY "Users can manage hero images" ON hero_images
          FOR ALL USING (true);
      `
    })

    if (heroPolicyError) {
      console.log('⚠️ RLS policies might already exist or there was an error:', heroPolicyError.message)
    } else {
      console.log('✅ RLS policies set up')
    }

    console.log('🎉 Database setup completed successfully!')
    console.log('')
    console.log('📋 Next steps:')
    console.log('1. Visit http://localhost:3000/admin')
    console.log('2. Login with password: admin123')
    console.log('3. Test the admin panel functionality')
    console.log('4. Upload hero images and manage products')

  } catch (error) {
    console.error('❌ Setup failed:', error)
    process.exit(1)
  }
}

// Run the setup
setupDatabase()
