# Complete Netlify Deployment Guide

## 🎯 Overview
This guide ensures that both email services (Resend for admin, Gmail for customers) work perfectly on Netlify with proper order ID tracking and customer email handling.

## ✅ Issues Fixed

### 1. QR Code Issue ✅ FIXED
- **Problem**: QR code showing fallback instead of actual payment QR
- **Solution**: Removed problematic redirect in `netlify.toml`

### 2. Email Service Issues ✅ FIXED
- **Problem**: Emails not sending on Netlify
- **Solution**: Enhanced debugging and proper environment variable handling

### 3. Order ID Tracking ✅ FIXED
- **Problem**: Order ID not properly included in emails
- **Solution**: Order ID now included in both email subjects and content

### 4. Customer Email Handling ✅ FIXED
- **Problem**: Customer email not properly fetched from order details
- **Solution**: Customer email is now properly extracted from `orderData.customerInfo.email`

## 🔧 Required Netlify Environment Variables

### Step 1: Access Netlify Dashboard
1. Go to https://app.netlify.com/
2. Select your site: `dpnpwithadmin`
3. Go to **Site settings** → **Environment variables**

### Step 2: Add These Environment Variables

#### **Required for Admin Emails (Resend)**
```
RESEND_API_KEY = re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### **Required for Customer Emails (Gmail)**
```
GMAIL_USER = your-gmail@gmail.com
GMAIL_APP_PASSWORD = your-app-password
```

#### **Optional Admin Email**
```
ADMIN_EMAIL = dopetechnp@gmail.com
```

## 📧 Email Service Configuration

### Email Flow
1. **Customer Email**: Sent via Gmail SMTP (primary) → Resend (fallback)
2. **Admin Email**: Sent via Resend only
3. **Order ID**: Included in both email subjects and content
4. **Customer Email**: Fetched from order details (`orderData.customerInfo.email`)

### Email Subjects
- **Customer**: `Order Confirmation - {ORDER_ID} | DopeTech GMK`
- **Admin**: `🚨 New Order Alert: {ORDER_ID} | DopeTech GMK`

## 🛠️ How to Get Environment Variables

### Resend API Key
1. Go to https://resend.com/
2. Sign up/Login
3. Go to **API Keys**
4. Create new API key
5. Copy the key (starts with `re_`)

### Gmail App Password
1. Go to https://myaccount.google.com/
2. **Security** → **2-Step Verification** (enable if not)
3. **App passwords**
4. Generate new app password for "Mail"
5. Use this password (not your regular Gmail password)

## 🧪 Testing Email Service

### Local Testing
```bash
node scripts/test-email-fix.js
```

### Production Testing
1. Go to your live site
2. Place a test order
3. Check browser console for email logs
4. Check your email for confirmation

## 📋 Email Service Debug Information

The email service now logs detailed information:

```
📧 Starting customer confirmation email...
📧 Order ID: ORDER-123456
📧 Customer Email: customer@example.com
📧 Customer Name: John Doe
📧 Order Total: 5000
📧 Payment Option: full

📧 Starting admin notification email...
📧 Order ID: ORDER-123456
📧 Database ID: 789
📧 Admin Email: admin@example.com
📧 Customer Email: customer@example.com
```

## 🚀 Deployment Steps

### 1. Add Environment Variables to Netlify
- Add all required environment variables
- Ensure no extra spaces in values
- Check variable names are case-sensitive

### 2. Commit and Push Changes
```bash
git add .
git commit -m "Complete email service fix for Netlify deployment"
git push origin main
```

### 3. Redeploy on Netlify
- Netlify will automatically redeploy
- Check deployment logs for any errors

### 4. Test the Complete Flow
1. **QR Code**: Should show actual payment QR
2. **Customer Email**: Should receive order confirmation via Gmail
3. **Admin Email**: Should receive order notification via Resend
4. **Order ID**: Should be included in both emails

## 🔍 Troubleshooting

### Email Not Sending
1. **Check Environment Variables**: Verify all variables are set in Netlify
2. **Check Console Logs**: Look for detailed email service logs
3. **Test Locally**: Run the test script to verify configuration
4. **Check API Keys**: Ensure Resend and Gmail credentials are correct

### QR Code Not Loading
1. **Clear Browser Cache**: Hard refresh the page
2. **Check Network Tab**: Look for 404 errors on QR code
3. **Verify File Exists**: Ensure `/public/payment/paymentQR.svg` exists

### Environment Variables Not Working
1. **Redeploy**: Add variables and redeploy
2. **Check Names**: Ensure exact variable names (case-sensitive)
3. **No Spaces**: Remove any extra spaces in values

## 📊 Success Indicators

### ✅ QR Code Working
- Shows actual payment QR instead of placeholder
- No 404 errors in browser network tab

### ✅ Customer Email Working
- Customer receives order confirmation email
- Email sent via Gmail SMTP (or Resend fallback)
- Order ID included in subject and content
- Customer email fetched from order details

### ✅ Admin Email Working
- Admin receives order notification email
- Email sent via Resend
- Order ID included in subject and content
- All order details included in email

### ✅ Console Logs
- Detailed email service logs in browser console
- No error messages
- Success confirmations for both emails

## 🎉 Expected Results

After proper configuration:

1. **Customer places order** → Order ID generated
2. **QR code displays** → Actual payment QR (not fallback)
3. **Customer email sent** → Via Gmail with order ID
4. **Admin email sent** → Via Resend with order ID
5. **Both emails received** → With complete order details

## 🆘 Support

If issues persist:
1. Check Netlify function logs
2. Verify all environment variables
3. Test email services individually
4. Check browser console for detailed error messages
5. Ensure proper API keys and credentials

## 📝 Notes

- **Order ID**: Automatically generated and included in all emails
- **Customer Email**: Fetched from order form data
- **Admin Email**: Uses environment variable or falls back to customer email
- **Fallback System**: Gmail → Resend for customer emails
- **Error Handling**: Comprehensive logging and fallback mechanisms
