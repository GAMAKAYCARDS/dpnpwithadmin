# Hero Images System Setup Guide

## 🎯 Overview

This guide will help you set up a complete hero images system for your DopeTech website that allows admin control over both images and text content.

## 📋 What You'll Get

✅ **Full Admin Control**: Upload, edit, and manage hero images  
✅ **Text Content Management**: Titles, subtitles, descriptions, buttons  
✅ **Display Control**: Order, active/inactive status  
✅ **Professional Carousel**: Auto-play, navigation, responsive design  
✅ **Database Storage**: Persistent data with proper structure  

## 🗄️ Database Setup

### Step 1: Create the hero_images Table

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/aizgswoelfdkhyosgvzu/sql
2. Copy and paste the SQL from `hero-images-table.sql` file
3. Click "Run" to execute the SQL

This will create:
- `hero_images` table with all necessary columns
- Indexes for performance
- Row Level Security policies
- Sample data

### Step 2: Verify the Setup

Run this command to check if everything is working:

```bash
node scripts/check-tables-simple.js
```

You should see:
- ✅ `hero_images: Table exists`
- ✅ `hero-images` storage bucket exists

## 🎨 Features

### Admin Panel Features
- **Upload Images**: Drag & drop or click to upload
- **Edit Content**: Click "Edit" to modify text content
- **Toggle Active**: Switch to show/hide images
- **Set Order**: Control display sequence
- **Delete Images**: Remove unwanted images

### Frontend Features
- **Auto-play Carousel**: Images change every 5 seconds
- **Manual Navigation**: Arrow buttons and dot indicators
- **Responsive Design**: Works on all devices
- **Text Overlay**: Displays title, subtitle, description, and button
- **Hover Pause**: Auto-play pauses when hovering

## 📊 Database Schema

The `hero_images` table includes:

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL | Primary key |
| `title` | VARCHAR(255) | Main heading |
| `subtitle` | VARCHAR(500) | Secondary heading |
| `description` | TEXT | Detailed description |
| `image_url` | TEXT | Image file URL |
| `image_file_name` | VARCHAR(255) | Original filename |
| `button_text` | VARCHAR(100) | Call-to-action text |
| `button_link` | VARCHAR(500) | Button destination URL |
| `display_order` | INTEGER | Sort order (0 = first) |
| `is_active` | BOOLEAN | Show/hide image |
| `created_at` | TIMESTAMP | Creation date |
| `updated_at` | TIMESTAMP | Last update date |

## 🔧 Usage

### For Admins

1. **Access Admin Panel**: Go to `/admin`
2. **Upload Images**: Use the upload section
3. **Edit Content**: Click "Edit" on any image
4. **Manage Display**: Toggle active status and set order
5. **Preview**: Visit the main page to see changes

### For Developers

The system includes:

- **Hook**: `useHeroImages()` - Manages all hero image operations
- **Components**: 
  - `HeroImageCarousel` - Displays images on frontend
  - `HeroImageManager` - Admin interface
- **Fallback**: Works with or without database table

## 🚀 Quick Start

1. **Run the SQL**: Execute `hero-images-table.sql` in Supabase
2. **Upload Images**: Go to `/admin` and upload some images
3. **Add Content**: Edit titles, descriptions, and buttons
4. **View Results**: Check your main page at `/`

## 🔄 Migration from Storage-Only

If you were using the old storage-only system:

1. Your existing images will still work
2. The system will automatically fall back to storage-only mode
3. New uploads will use the database table
4. You can gradually migrate existing images

## 🛠️ Troubleshooting

### Common Issues

**"Table not found" error:**
- Run the SQL script in Supabase dashboard
- Check that the table was created successfully

**"Upload failed" error:**
- Check that `hero-images` bucket exists
- Verify RLS policies are set correctly

**"Images not showing":**
- Check that images are marked as `is_active = true`
- Verify `display_order` is set correctly

### Debug Commands

```bash
# Check database tables
node scripts/check-tables-simple.js

# Test hero image upload
node scripts/test-hero-access.js

# Check storage buckets
node scripts/setup-storage-buckets.js
```

## 📱 Responsive Design

The carousel is fully responsive:
- **Desktop**: Full-size images with large text
- **Tablet**: Medium-size with adjusted text
- **Mobile**: Compact layout with readable text

## 🎨 Customization

### Styling
- Edit `components/hero-image-carousel.tsx` for visual changes
- Modify `components/hero-image-manager.tsx` for admin interface

### Behavior
- Change auto-play timing in the carousel component
- Adjust image limits in the hook
- Modify upload restrictions in the manager

## 🔒 Security

- **Row Level Security**: Enabled on hero_images table
- **Public Read**: Anyone can view active images
- **Admin Write**: Only authenticated users can manage
- **File Validation**: Images only, size limits enforced

## 📈 Performance

- **Lazy Loading**: Images load as needed
- **Optimized Queries**: Indexed database columns
- **Caching**: Supabase handles caching automatically
- **CDN**: Images served via Supabase CDN

## 🎉 Success!

Once set up, you'll have:
- ✅ Professional hero image carousel
- ✅ Full admin control over content
- ✅ Responsive design
- ✅ Database-backed persistence
- ✅ Easy content management

Your DopeTech website will now have a powerful, professional hero section that you can control completely from the admin panel!
