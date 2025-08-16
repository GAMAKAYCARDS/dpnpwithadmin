# 🚀 Quick Google Drive Setup Guide

## Why Images Aren't Uploading

The checkout is currently running in **simulation mode** because Google API credentials aren't configured. Here's how to fix it:

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name it: `dopetech-checkout`
4. Click "Create"

## Step 2: Enable APIs

1. In your new project, go to "APIs & Services" → "Library"
2. Search for and enable:
   - **Google Sheets API**
   - **Google Drive API**

## Step 3: Create Service Account

1. Go to "IAM & Admin" → "Service Accounts"
2. Click "Create Service Account"
3. Name: `dopetech-checkout-bot`
4. Description: `Service account for DopeTech checkout system`
5. Click "Create and Continue"
6. Skip role assignment, click "Done"

## Step 4: Generate API Key

1. Click on your service account name
2. Go to "Keys" tab
3. Click "Add Key" → "Create new key"
4. Choose "JSON"
5. Download the JSON file

## Step 5: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create new sheet
3. Add these headers in row 1:
   ```
   A: Order ID | B: Customer Name | C: Email | D: Phone | E: Full Address | F: City | G: State | H: ZIP Code | I: Cart Items | J: Total Amount | K: Payment Option | L: Timestamp | M: Receipt File
   ```
4. Share the sheet with your service account email (from JSON file)
5. Copy the Sheet ID from URL (between /d/ and /edit)

## Step 6: Share Google Drive Folder

1. Go to your folder: [DopeTech Payment Receipts](https://drive.google.com/drive/folders/1U5wfCmULVs1US4JZ4FoAODLOk3zqzyS_?usp=sharing)
2. Click "Share"
3. Add your service account email (from JSON file)
4. Give "Editor" permissions
5. Click "Done"

## Step 7: Configure Environment Variables

Create a `.env.local` file in your project root:

```env
# Google Sheets API Configuration
GOOGLE_SHEET_ID=YOUR_SHEET_ID_HERE
GOOGLE_SERVICE_ACCOUNT_EMAIL=YOUR_SERVICE_ACCOUNT_EMAIL
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"

# Google Drive API Configuration
GOOGLE_DRIVE_FOLDER_ID=1U5wfCmULVs1US4JZ4FoAODLOk3zqzyS_
```

### How to get the values:

1. **GOOGLE_SHEET_ID**: From your Google Sheet URL
2. **GOOGLE_SERVICE_ACCOUNT_EMAIL**: From the JSON file (look for "client_email")
3. **GOOGLE_PRIVATE_KEY**: From the JSON file (look for "private_key" - copy the entire thing including BEGIN/END markers)

## Step 8: Restart Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## Step 9: Test Upload

1. Add items to cart
2. Go to checkout
3. Fill form and upload a receipt
4. Submit order
5. Check your Google Drive folder for the uploaded file

## Troubleshooting

### If uploads still don't work:

1. **Check console logs** - Look for "🚀 Using real Google APIs" message
2. **Verify permissions** - Make sure service account has Editor access to both Sheet and Drive folder
3. **Check environment variables** - Ensure all values are correct
4. **Restart server** - After changing .env.local, restart the dev server

### Common Errors:

- **"Missing required fields"**: Check your .env.local file
- **"Failed to submit to Google Sheets"**: Verify sheet sharing permissions
- **"Error uploading to Google Drive"**: Check Drive folder sharing permissions

## Success Indicators

When working correctly, you should see:
- Console: "🚀 Using real Google APIs"
- Console: "📤 Uploading receipt to Google Drive..."
- Console: "✅ File uploaded to Google Drive:"
- Files appearing in your Google Drive folder
- Order data in your Google Sheet

## Need Help?

If you're still having issues:
1. Check the browser console for error messages
2. Verify all environment variables are set correctly
3. Ensure the service account has proper permissions
4. Try the "Test Checkout API" button in the checkout form
