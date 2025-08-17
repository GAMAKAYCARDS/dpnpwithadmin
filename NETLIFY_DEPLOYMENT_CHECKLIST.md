# Netlify Deployment Checklist - Enhanced Email Service

## ✅ Pre-Deployment Checklist

### 1. Environment Variables Setup
- [ ] **RESEND_API_KEY** added to Netlify
- [ ] **GMAIL_USER** added to Netlify  
- [ ] **GMAIL_APP_PASSWORD** added to Netlify
- [ ] **ADMIN_EMAIL** added to Netlify (optional)
- [ ] All variables have no extra spaces
- [ ] Variable names are case-sensitive and correct

### 2. Email Service Configuration
- [ ] Resend API key is valid and active
- [ ] Gmail app password is correctly generated
- [ ] Admin email address is valid
- [ ] Email service test script passes locally

### 3. QR Code Configuration
- [ ] `/public/payment/paymentQR.svg` exists
- [ ] QR code redirect removed from `netlify.toml`
- [ ] QR code loads properly in browser

### 4. API Routes
- [ ] `/app/api/supabase-checkout/route.ts` exists and is correct
- [ ] Email service is properly imported
- [ ] Order ID generation is working
- [ ] Customer email extraction is working

## 🚀 Deployment Steps

### Step 1: Commit and Push
```bash
git add .
git commit -m "Enhanced email service with detailed templates and Netlify compatibility"
git push origin main
```

### Step 2: Netlify Deployment
- [ ] Netlify automatically deploys from GitHub
- [ ] Check deployment logs for any errors
- [ ] Verify build completes successfully

### Step 3: Environment Variables Verification
- [ ] Go to Netlify Dashboard → Site Settings → Environment Variables
- [ ] Verify all variables are present
- [ ] Check that variables are accessible in production

## 🧪 Testing Checklist

### Local Testing
- [ ] Run `node scripts/test-email-fix.js`
- [ ] All email services working (Resend + Gmail)
- [ ] Order email simulation successful
- [ ] Order ID included in emails
- [ ] Customer email fetched correctly

### Production Testing
- [ ] Visit live site
- [ ] Place a test order
- [ ] Check browser console for email logs
- [ ] Verify customer email received
- [ ] Verify admin email received
- [ ] Check order ID in both emails
- [ ] Verify QR code displays correctly

## 📧 Email Content Verification

### Customer Email Should Include:
- [ ] Order ID in subject and content
- [ ] Customer name and email
- [ ] Complete order details
- [ ] Item quantities and prices
- [ ] Total amount
- [ ] Payment method (full/deposit)
- [ ] Deposit amount (if applicable)
- [ ] Contact information
- [ ] Next steps
- [ ] Receipt link (if uploaded)

### Admin Email Should Include:
- [ ] Order ID in subject and content
- [ ] Database ID
- [ ] Order date and time
- [ ] Quick order summary
- [ ] Complete customer information
- [ ] All order items with quantities
- [ ] Total amount and payment details
- [ ] Receipt link (if uploaded)
- [ ] Action buttons (email/call customer)
- [ ] Next steps for admin

## 🔍 Debug Information

### Console Logs to Check:
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

### Success Indicators:
- [ ] ✅ Customer confirmation email sent successfully via Gmail
- [ ] ✅ Admin notification email sent successfully
- [ ] ✅ Order created successfully in database
- [ ] ✅ QR code loaded without fallback

## 🛠️ Troubleshooting

### If Emails Not Sending:
1. Check Netlify environment variables
2. Verify API keys are correct
3. Check browser console for error messages
4. Test email services individually
5. Ensure proper email addresses

### If QR Code Not Loading:
1. Clear browser cache
2. Check network tab for 404 errors
3. Verify file exists in `/public/payment/`
4. Check `netlify.toml` redirects

### If Order ID Missing:
1. Check order generation logic
2. Verify email template includes order ID
3. Check console logs for order ID

## 📊 Performance Monitoring

### Email Delivery Metrics:
- [ ] Customer emails delivered via Gmail
- [ ] Admin emails delivered via Resend
- [ ] Order IDs included in all emails
- [ ] Customer emails fetched from order data
- [ ] No email service errors in console

### Site Performance:
- [ ] QR code loads quickly
- [ ] Order submission works smoothly
- [ ] No 404 errors for assets
- [ ] Console logs show success messages

## 🎯 Final Verification

### Complete Order Flow Test:
1. **Customer places order** → Order ID generated
2. **QR code displays** → Actual payment QR (not fallback)
3. **Customer email sent** → Via Gmail with complete details
4. **Admin email sent** → Via Resend with complete details
5. **Both emails received** → With order ID and all information
6. **Database updated** → Order stored with all details

### Email Content Quality:
- [ ] Professional design and layout
- [ ] All order information included
- [ ] Clear next steps provided
- [ ] Contact information accessible
- [ ] Mobile-responsive design

## ✅ Success Criteria

- [ ] All environment variables configured
- [ ] Both email services working
- [ ] Order ID tracking functional
- [ ] Customer email extraction working
- [ ] QR code displaying correctly
- [ ] No console errors
- [ ] All emails delivered successfully
- [ ] Complete order information in emails

## 🆘 Support

If any issues persist:
1. Check Netlify function logs
2. Verify all environment variables
3. Test email services individually
4. Check browser console for detailed error messages
5. Ensure proper API keys and credentials
6. Verify file paths and configurations
