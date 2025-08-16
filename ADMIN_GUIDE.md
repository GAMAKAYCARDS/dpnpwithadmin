# 🎛️ DopeTech Admin Panel Guide

## 🚀 **How to Access the Admin Panel**

1. **On Mobile**: Open the hamburger menu (☰) and click "Admin Panel"
2. **On Desktop**: The admin panel is accessible via `/admin` URL

## 📋 **What You Can Do**

### ✅ **Add New Products**
1. Click "Add Product" button
2. Fill in all the details:
   - **Product Name**: The name of your product
   - **Description**: Detailed product description
   - **Price**: Current selling price
   - **Original Price**: Original price (for discount display)
   - **Category**: Choose from keyboard, mouse, headphones, speaker, accessory, gaming
   - **Stock Quantity**: How many items you have
   - **Rating**: Product rating (1-5)
   - **Reviews**: Number of reviews
   - **Features**: Comma-separated features (e.g., "RGB Backlight, Wireless, Programmable Keys")
   - **Discount**: Discount percentage (0-100)
   - **In Stock**: Toggle if product is available
   - **Hidden on Home**: Toggle to hide from homepage

### 🖼️ **Upload Product Images**
1. Click "Upload Image" in the product form
2. Select an image file (PNG, JPG, JPEG, WebP)
3. Image will be uploaded to Supabase storage
4. Image URL will be automatically updated

### ✏️ **Edit Existing Products**
1. Click "Edit" button on any product card
2. Modify any field you want to change
3. Click "Save Changes" to update

### 🗑️ **Delete Products**
1. Click "Delete" button on any product card
2. Confirm deletion in the popup
3. Product will be permanently removed from database

## 🔧 **Features**

- **Real-time Updates**: Changes are saved directly to Supabase
- **Image Management**: Upload and manage product images
- **Bulk Operations**: View all products in a grid layout
- **Responsive Design**: Works on mobile and desktop
- **Instant Sync**: Changes appear immediately on your website

## 📱 **Mobile-Friendly**
- Touch-optimized interface
- Easy navigation
- Responsive forms
- Image upload works on mobile

## 🔒 **Security**
- All changes are saved to your Supabase database
- No local storage dependencies
- Direct database integration
- Secure image uploads

## 🎯 **Tips**
- Use high-quality images for better product presentation
- Write detailed descriptions to help customers
- Set appropriate stock quantities
- Use features to highlight key product benefits
- Keep prices updated regularly

## 🚨 **Important Notes**
- Changes are permanent and saved to Supabase
- Images are stored in Supabase storage
- All products are immediately visible on your website
- No need to restart or rebuild anything

---

**Your DopeTech admin panel is now ready! 🎉**

Access it at: `http://localhost:3000/admin` (or your domain/admin)
