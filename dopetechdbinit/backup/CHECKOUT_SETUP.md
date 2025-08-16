# Checkout Setup Guide

This guide will help you set up the checkout functionality to submit form details to Google Sheets and upload payment receipts to Google Drive.

## Prerequisites

1. Google Cloud Project with APIs enabled
2. Google Sheets API enabled
3. Google Drive API enabled
4. Service account with proper permissions

## Step 1: Set up Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Google Sheets API
   - Google Drive API

## Step 2: Create a Service Account

1. In Google Cloud Console, go to "IAM & Admin" > "Service Accounts"
2. Click "Create Service Account"
3. Give it a name like "dopetech-checkout"
4. Grant the following roles:
   - Google Sheets API > Editor
   - Google Drive API > Editor
5. Create and download the JSON key file

## Step 3: Set up Google Sheets

1. Create a new Google Sheet
2. Add the following columns in the first row:
   - A: Order ID
   - B: Customer Name
   - C: Email
   - D: Phone
   - E: Full Address
   - F: City
   - G: State
   - H: ZIP Code
   - I: Cart Items
   - J: Total Amount
   - K: Payment Option
   - L: Timestamp
   - M: Receipt File
3. Share the sheet with your service account email (with Editor permissions)
4. Copy the Sheet ID from the URL (the long string between /d/ and /edit)

## Step 4: Set up Google Drive Folder

1. **Use the provided folder**: [DopeTech Payment Receipts](https://drive.google.com/drive/folders/1U5wfCmULVs1US4JZ4FoAODLOk3zqzyS_?usp=sharing)
2. Share this folder with your service account email (with Editor permissions)
3. The Folder ID is: `1U5wfCmULVs1US4JZ4FoAODLOk3zqzyS_`

## Step 5: Configure Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Google Sheets API Configuration
GOOGLE_SHEET_ID=your-google-sheet-id-here
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"

# Google Drive API Configuration
GOOGLE_DRIVE_FOLDER_ID=1U5wfCmULVs1US4JZ4FoAODLOk3zqzyS_
```

### How to get these values:

1. **GOOGLE_SHEET_ID**: From your Google Sheet URL
2. **GOOGLE_SERVICE_ACCOUNT_EMAIL**: From your service account JSON file
3. **GOOGLE_PRIVATE_KEY**: From your service account JSON file (copy the entire private key including the BEGIN and END markers)
4. **GOOGLE_DRIVE_FOLDER_ID**: `1U5wfCmULVs1US4JZ4FoAODLOk3zqzyS_` (already configured)

## Step 6: Install Dependencies

Run the following command to install the Google APIs package:

```bash
npm install googleapis
```

## Step 7: Test the Setup

1. Start your development server: `npm run dev`
2. Add items to cart and proceed to checkout
3. Fill in the form and upload a receipt
4. Click "Submit Order"
5. Check your Google Sheet and Google Drive folder for the submitted data

## Troubleshooting

### Common Issues:

1. **"Missing required fields" error**: Make sure all environment variables are set correctly
2. **"Failed to submit to Google Sheets" error**: Check that your service account has proper permissions
3. **File upload fails**: Ensure the Google Drive folder is shared with the service account

### Debug Steps:

1. Check the browser console for detailed error messages
2. Use the "Test Checkout API" button to test the connection
3. Use the "Debug Checkout Data" button to see what data is being sent

## Security Notes

- Never commit your `.env.local` file to version control
- Keep your service account credentials secure
- Consider using environment-specific service accounts for production

## API Endpoints

The checkout system uses the following API endpoint:

- `POST /api/checkout` - Submits order data to Google Sheets and uploads receipts to Google Drive

The API expects the following data structure:

```typescript
{
  orderId: string
  customerInfo: {
    fullName: string
    email: string
    phone: string
    city: string
    state: string
    zipCode: string
    fullAddress: string
  }
  cart: Array<{
    id: number
    name: string
    price: number
    quantity: number
    image: string
  }>
  total: number
  paymentOption: 'full' | 'deposit'
  receiptFile?: string // base64 encoded file
  receiptFileName?: string
}
```
