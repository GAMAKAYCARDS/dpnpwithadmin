# Asset Management System

## Overview

The DopeTech e-commerce platform now includes a comprehensive asset management system that allows you to store and serve logo and video assets from Supabase storage, similar to how product images are handled. This system provides:

- **Centralized Storage**: All assets stored in Supabase storage
- **Automatic Fallbacks**: Local files as backup if Supabase is unavailable
- **Admin Interface**: Easy upload and management of assets
- **Real-time Updates**: Assets update immediately across the website

## How It Works

### 1. Asset Storage Structure

Assets are stored in Supabase storage with the following structure:
```
assets/
├── logo/
│   ├── dopelogo_1234567890.svg
│   └── dopelogo_1234567891.svg
└── video/
    ├── footervid_1234567890.mp4
    └── footervid_1234567891.mp4
```

### 2. Asset Loading Logic

The system follows this priority order:
1. **Supabase Storage**: Try to load from Supabase first
2. **Local Fallback**: If Supabase fails, use local files
3. **Error Handling**: Graceful degradation with console logging

### 3. File Types Supported

- **Logo**: SVG, PNG, JPEG (recommended: SVG for logos)
- **Video**: MP4, WebM (max 10MB)
- **Images**: PNG, JPEG

## Implementation Details

### Core Functions (`lib/assets.ts`)

```typescript
// Get logo URL with fallback
export async function getLogoUrl(): Promise<string>

// Get video URL with fallback  
export async function getVideoUrl(): Promise<string>

// Upload new asset
export async function uploadAsset(file: File, name: string, type: 'logo' | 'video' | 'image')

// List all assets
export async function listAssets(): Promise<Asset[]>

// Delete asset
export async function deleteAsset(fileName: string): Promise<boolean>
```

### React Hooks (`hooks/use-assets.ts`)

```typescript
// Main assets hook
export function useAssets()

// Logo-specific hook
export function useLogoUrl()

// Video-specific hook
export function useVideoUrl()
```

### Components Using Assets

The following components automatically use Supabase assets:

- **Hero Section** (`components/hero-section.tsx`): Logo display
- **Main Page** (`app/page.tsx`): Video display
- **Checkout Modal** (`components/checkout-modal.tsx`): Logo display
- **SEO Optimizer** (`components/seo-optimizer.tsx`): Logo for meta tags

## Admin Interface

### Access Admin Panel

Visit `/admin` to access the asset management interface:
- **Password**: `dopetech2024` (you can change this in the code)

### Features

1. **Current Assets Preview**: See what's currently displayed
2. **Upload New Assets**: Replace existing assets
3. **Asset List**: View all uploaded assets
4. **Delete Assets**: Remove old assets
5. **Real-time Updates**: Changes reflect immediately

### Upload Process

1. Select asset type (logo/video/image)
2. Choose file (with size and format validation)
3. Enter asset name
4. Upload to Supabase storage
5. Asset becomes immediately available

## Testing

### Test Page

Visit `/test-assets` to test asset loading:
- Shows current logo and video sources
- Displays loading status
- Provides direct links to assets
- Shows fallback behavior

### Console Logging

The system logs important events:
- Asset loading success/failure
- Fallback usage
- Upload progress
- Error details

## Setup Instructions

### 1. Initial Setup

Run the initial asset upload script:
```bash
node scripts/upload-initial-assets.js
```

This will:
- Create the `assets` bucket in Supabase
- Upload current logo and video files
- Set up proper file structure

### 2. Environment Variables

Ensure your `.env.local` has:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Supabase Storage Setup

The system automatically creates the `assets` bucket with:
- Public access enabled
- File size limit: 10MB
- Supported MIME types configured

## Usage Examples

### In Components

```typescript
import { useLogoUrl, useVideoUrl } from "@/hooks/use-assets"

function MyComponent() {
  const { logoUrl, loading: logoLoading } = useLogoUrl()
  const { videoUrl, loading: videoLoading } = useVideoUrl()

  return (
    <div>
      <img 
        src={logoLoading ? "/logo/dopelogo.svg" : logoUrl} 
        alt="Logo" 
      />
      <video src={videoLoading ? "/video/footervid.mp4" : videoUrl} />
    </div>
  )
}
```

### Programmatic Usage

```typescript
import { getLogoUrl, uploadAsset } from "@/lib/assets"

// Get logo URL
const logoUrl = await getLogoUrl()

// Upload new asset
const result = await uploadAsset(file, "newlogo", "logo")
if (result.success) {
  console.log("Asset uploaded:", result.url)
}
```

## Benefits

### 1. Performance
- **CDN Delivery**: Supabase provides global CDN
- **Caching**: Assets cached for 1 year
- **Optimization**: Automatic format optimization

### 2. Reliability
- **Fallback System**: Local files as backup
- **Error Handling**: Graceful degradation
- **Monitoring**: Console logging for debugging

### 3. Management
- **Centralized**: All assets in one place
- **Versioning**: Multiple versions supported
- **Easy Updates**: No code changes needed

### 4. Scalability
- **Unlimited Storage**: Supabase handles scaling
- **Global Access**: CDN distribution
- **Cost Effective**: Pay only for what you use

## Troubleshooting

### Common Issues

1. **Assets not loading from Supabase**
   - Check network connectivity
   - Verify Supabase credentials
   - Check browser console for errors

2. **Upload failures**
   - Verify file size (max 10MB)
   - Check file format support
   - Ensure Supabase storage permissions

3. **Fallback not working**
   - Verify local file paths
   - Check file permissions
   - Review error handling logic

### Debug Steps

1. Visit `/test-assets` to check current status
2. Check browser console for error messages
3. Verify Supabase storage bucket exists
4. Test direct asset URLs
5. Check network tab for failed requests

## Future Enhancements

### Planned Features

1. **Image Optimization**: Automatic resizing and compression
2. **Multiple Formats**: WebP, AVIF support
3. **Asset Versioning**: Rollback to previous versions
4. **Bulk Operations**: Upload multiple files at once
5. **Usage Analytics**: Track asset performance
6. **Access Control**: Role-based asset management

### Integration Opportunities

1. **Product Images**: Extend to product image management
2. **User Avatars**: Profile picture management
3. **Content Management**: Blog post images
4. **Marketing Assets**: Banner and promotional images

## Security Considerations

1. **File Validation**: MIME type and size checks
2. **Access Control**: Admin-only upload interface
3. **Public URLs**: Assets are publicly accessible (by design)
4. **Rate Limiting**: Consider implementing upload limits
5. **Virus Scanning**: Consider adding malware detection

## Performance Optimization

1. **Lazy Loading**: Assets load only when needed
2. **Preloading**: Critical assets preloaded
3. **Caching**: Browser and CDN caching
4. **Compression**: Automatic file compression
5. **Format Selection**: Optimal format delivery

This asset management system provides a robust, scalable solution for managing logo and video assets in your DopeTech e-commerce platform, with the same reliability and performance as your product image system.
