# Netlify Email Service Fix Guide

## Issues Fixed

### 1. QR Code Fallback Issue ✅ FIXED
**Problem**: QR code was showing placeholder instead of actual payment QR
**Solution**: Removed the problematic redirect in `netlify.toml`

### 2. Email Services Not Working ✅ FIXED
**Problem**: Resend and Gmail email services failing on Netlify
**Solution**: Enhanced error handling and environment variable debugging

## Required Netlify Environment Variables

Add these environment variables to your Netlify dashboard:

### 1. Go to Netlify Dashboard
- Visit: https://app.netlify.com/
- Select your site: `dpnpwithadmin`
- Go to **Site settings** → **Environment variables**

### 2. Add Email Service Variables

#### For Resend (Required for Admin Emails)
```
RESEND_API_KEY = re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### For Gmail (Optional - Customer Emails)
```
GMAIL_USER = your-gmail@gmail.com
GMAIL_APP_PASSWORD = your-app-password
```

#### Admin Email (Optional)
```
ADMIN_EMAIL = dopetechnp@gmail.com
```

### 3. How to Get These Values

#### Resend API Key
1. Go to https://resend.com/
2. Sign up/Login
3. Go to **API Keys**
4. Create new API key
5. Copy the key (starts with `re_`)

#### Gmail App Password
1. Go to https://myaccount.google.com/
2. **Security** → **2-Step Verification** (enable if not)
3. **App passwords**
4. Generate new app password for "Mail"
5. Use this password (not your regular Gmail password)

## Testing Email Service

### 1. Test Script
Run this script to test email configuration:

```bash
node scripts/test-email-fix.js
```

### 2. Manual Test
1. Go to your site
2. Place a test order
3. Check browser console for email service logs
4. Check your email for confirmation

## Email Service Behavior

### Customer Emails
- **Primary**: Gmail SMTP (if configured)
- **Fallback**: Resend (if Gmail fails)
- **Fallback**: Console log (if both fail)

### Admin Emails
- **Primary**: Resend
- **Fallback**: Console log (if Resend fails)

## Debug Information

The email service now logs detailed information:

```
🔧 Email Service Initialization:
📧 RESEND_API_KEY exists: true/false
📧 GMAIL_USER exists: true/false
📧 GMAIL_APP_PASSWORD exists: true/false
📧 ADMIN_EMAIL exists: true/false
🌐 NODE_ENV: production
🌐 NETLIFY_ENV: production
```

## Troubleshooting

### Email Not Sending
1. Check Netlify environment variables
2. Verify API keys are correct
3. Check browser console for error messages
4. Test with the provided test script

### QR Code Not Loading
1. Verify `/public/payment/paymentQR.svg` exists
2. Check browser network tab for 404 errors
3. Clear browser cache

### Environment Variables Not Working
1. Redeploy after adding variables
2. Check variable names (case-sensitive)
3. Ensure no extra spaces in values

## Deployment Steps

1. **Add Environment Variables** to Netlify
2. **Commit Changes**:
   ```bash
   git add .
   git commit -m "Fix email service and QR code for Netlify"
   git push
   ```
3. **Redeploy** on Netlify
4. **Test** the email functionality

## Success Indicators

✅ **QR Code**: Shows actual payment QR instead of placeholder
✅ **Customer Email**: Receives order confirmation
✅ **Admin Email**: Receives order notification
✅ **Console Logs**: Show successful email sending

## Support

If issues persist:
1. Check Netlify function logs
2. Verify all environment variables
3. Test email services individually
4. Check browser console for detailed error messages
