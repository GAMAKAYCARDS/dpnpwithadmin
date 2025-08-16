# 🎠 Hero Carousel Admin Guide

## Overview
The Hero Carousel is now fully integrated with your admin panel! You can manage all hero images directly from the admin interface.

## Accessing the Admin Panel

1. **Navigate to Admin Panel**: Go to `/admin` on your website
2. **Login**: Use password `dopetech2024`
3. **Find Hero Images Tab**: Click on the "Hero Images" tab in the admin interface

## Features Available

### 📊 **Status Overview**
- **Connection Status**: Real-time indicator showing if the system is connected to Supabase
- **Image Count**: Shows how many images are currently loaded
- **Active Images**: Displays count of active images that will appear on the homepage

### 👀 **Preview Mode**
- **Toggle Preview**: Click "Show Preview" to see how your carousel will look
- **Visual Grid**: Shows all active images in a grid layout
- **Order Display**: Numbers show the display order of each image
- **Hover Effects**: Hover over images to see title and subtitle

### 📤 **Upload New Images**

1. **Fill in Details**:
   - **Title** (Required): Main heading for the slide
   - **Subtitle** (Optional): Secondary text
   - **Description** (Optional): Longer description text

2. **Upload Image**:
   - Click "Choose File" and select an image
   - Recommended size: 1920x1080px
   - Supported formats: JPG, PNG, WebP

3. **Auto-Activation**: New images are automatically set to active

### ✏️ **Edit Existing Images**

1. **Click Edit**: Use the "Edit" button on any image card
2. **Modify Fields**:
   - Title, Subtitle, Description
   - Button Text and Link (if applicable)
   - Display Order (controls the sequence)
3. **Save Changes**: Click "Save" to update

### 🎛️ **Manage Image Status**

- **Active Toggle**: Use the switch on each image to activate/deactivate
- **Display Order**: Control the sequence of images in the carousel
- **Quick Actions**: Edit or delete images directly from the list

### 🗑️ **Delete Images**

- Click the "Delete" button on any image
- Confirm the deletion when prompted
- Images are permanently removed from the database

## Best Practices

### 🖼️ **Image Guidelines**
- **Resolution**: 1920x1080px or higher
- **Format**: JPG or PNG for best compatibility
- **File Size**: Keep under 2MB for fast loading
- **Content**: Use high-quality, relevant product images

### 📝 **Content Guidelines**
- **Title**: Keep under 50 characters for best display
- **Subtitle**: Use for additional context or calls-to-action
- **Description**: Provide detailed information about the product/offer

### 🎯 **Display Order**
- **Priority**: Most important images first (order 1, 2, 3...)
- **Flow**: Create a logical sequence that tells a story
- **Testing**: Use preview mode to check the flow

## Troubleshooting

### 🔄 **Refresh Issues**
- Click the "Refresh" button to reload images
- Check the connection status indicator
- Ensure your internet connection is stable

### 📸 **Upload Problems**
- Verify image format (JPG, PNG, WebP)
- Check file size (should be under 2MB)
- Ensure all required fields are filled

### 🎨 **Display Issues**
- Use the preview mode to check how images will look
- Verify that images are set to "Active"
- Check the display order for proper sequencing

## Integration with Homepage

The hero carousel automatically:
- ✅ Loads active images from the database
- ✅ Displays them in the correct order
- ✅ Shows smooth sliding animations
- ✅ Includes auto-play functionality
- ✅ Supports manual navigation

## API Endpoints

The system uses these API routes:
- `POST /api/hero-images/upload` - Upload new images
- `PUT /api/hero-images/update` - Update existing images
- `DELETE /api/hero-images/delete` - Delete images

All endpoints are automatically handled by the admin interface.

## Support

If you encounter any issues:
1. Check the connection status indicator
2. Try refreshing the page
3. Verify your admin session is still active
4. Contact support if problems persist

---

**Happy managing your hero carousel! 🚀**
