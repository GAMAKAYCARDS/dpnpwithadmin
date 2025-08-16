# 🔧 Environment Variables Setup

## Create .env.local file

Create a file named `.env.local` in your project root with the following content:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://aizgswoelfdkhyosgvzu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpemdzd29lbGZka2h5b3Nndnp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwNTUyMjUsImV4cCI6MjA3MDYzMTIyNX0.4a7Smvc_bueFLqZNvGk-AW0kD5dJusNwqaSAczJs0hU
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpemdzd29lbGZka2h5b3Nndnp1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTA1NTIyNSwiZXhwIjoyMDcwNjMxMjI1fQ.gLnsyAhR8VSjbe37LdEHuFBGNDufqC4jZ9X3UOSNuGc

# Optional: Email Service (for order notifications)
# RESEND_API_KEY=your-resend-api-key-here
```

## How to get the values:

### 1. Supabase Configuration (Already provided)
- `NEXT_PUBLIC_SUPABASE_URL`: Already set to your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Already set to your public anon key
- `SUPABASE_SERVICE_ROLE_KEY`: Already set to your service role key

### 2. Optional: Email Service
- `RESEND_API_KEY`: For sending order notification emails
- You can get this from [Resend](https://resend.com) or use any other email service

## After creating .env.local:

1. **Restart your development server**:
   ```bash
   # Stop the current server (Ctrl+C)
   npm run dev
   ```

2. **Test the setup**:
   - Go to your website
   - Add items to cart
   - Go to checkout
   - Submit an order
   - Check your Supabase database for the order

3. **Test the checkout**:
   - Fill out the checkout form
   - Upload a receipt image
   - Submit the order
   - Check your Supabase Storage for the uploaded receipt

## For Netlify Deployment:

Add these environment variables in your Netlify dashboard:
1. Go to Site Settings > Environment Variables
2. Add each variable from your `.env.local` file
3. Make sure to include the `NEXT_PUBLIC_` prefix for client-side variables

## Order Flow:

1. **Customer submits order** → Supabase checkout API
2. **Order data saved** → Supabase `orders` table
3. **Order items saved** → Supabase `order_items` table  
4. **Receipt uploaded** → Supabase Storage `receipts` bucket
5. **Notification sent** → Email service (optional)

All orders are now processed through Supabase only - no Google Sheets integration needed!
