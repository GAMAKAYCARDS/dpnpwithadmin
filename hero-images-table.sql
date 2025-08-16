-- Hero Images Table Setup for DopeTech
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/aizgswoelfdkhyosgvzu/sql

-- Create the hero_images table
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_hero_images_active ON hero_images(is_active);
CREATE INDEX IF NOT EXISTS idx_hero_images_order ON hero_images(display_order);
CREATE INDEX IF NOT EXISTS idx_hero_images_created_at ON hero_images(created_at);

-- Enable Row Level Security
ALTER TABLE hero_images ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active hero images
CREATE POLICY "Hero images are viewable by everyone" ON hero_images
  FOR SELECT USING (is_active = true);

-- Allow authenticated users to manage hero images
CREATE POLICY "Users can manage hero images" ON hero_images
  FOR ALL USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_hero_images_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_hero_images_updated_at BEFORE UPDATE ON hero_images
    FOR EACH ROW EXECUTE FUNCTION update_hero_images_updated_at();

-- Insert sample hero image data
INSERT INTO hero_images (
  title, 
  subtitle, 
  description, 
  image_url, 
  image_file_name, 
  button_text, 
  button_link, 
  display_order, 
  is_active
) VALUES (
  'Welcome to DopeTech',
  'Premium Technology Solutions',
  'Discover our latest collection of high-quality tech products designed for modern professionals.',
  'https://aizgswoelfdkhyosgvzu.supabase.co/storage/v1/object/public/hero-images/sample-hero.jpg',
  'sample-hero.jpg',
  'Shop Now',
  '/products',
  1,
  true
) ON CONFLICT DO NOTHING;

-- Verify the table was created
SELECT 'hero_images table created successfully!' as status;
