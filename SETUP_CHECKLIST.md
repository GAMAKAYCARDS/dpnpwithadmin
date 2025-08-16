# ✅ Google API Setup Checklist

## Phase 1: Google Cloud Console Setup
- [ ] Create Google Cloud Project named "dopetech-checkout"
- [ ] Enable Google Sheets API
- [ ] Enable Google Drive API
- [ ] Create Service Account named "dopetech-checkout-bot"
- [ ] Download JSON key file for service account

## Phase 2: Google Sheets Setup
- [ ] Create new Google Sheet
- [ ] Add headers in row 1 (Order ID, Customer Name, Email, etc.)
- [ ] Share sheet with service account email (Editor permissions)
- [ ] Copy Sheet ID from URL

## Phase 3: Google Drive Setup
- [ ] Go to [DopeTech Payment Receipts folder](https://drive.google.com/drive/folders/1U5wfCmULVs1US4JZ4FoAODLOk3zqzyS_?usp=sharing)
- [ ] Share folder with service account email (Editor permissions)

## Phase 4: Environment Configuration
- [ ] Create `.env.local` file in project root
- [ ] Add GOOGLE_SHEET_ID (from sheet URL)
- [ ] Add GOOGLE_SERVICE_ACCOUNT_EMAIL (from JSON file)
- [ ] Add GOOGLE_PRIVATE_KEY (from JSON file)
- [ ] Add GOOGLE_DRIVE_FOLDER_ID (already set to 1U5wfCmULVs1US4JZ4FoAODLOk3zqzyS_)

## Phase 5: Testing
- [ ] Restart development server
- [ ] Test API status (click "🔍 Debug API Status" in checkout)
- [ ] Test checkout with receipt upload
- [ ] Verify file appears in Google Drive folder
- [ ] Verify order data appears in Google Sheet

## Troubleshooting
- [ ] Check browser console for error messages
- [ ] Verify all environment variables are set correctly
- [ ] Ensure service account has proper permissions
- [ ] Check that APIs are enabled in Google Cloud Console

## Success Indicators
When everything is working correctly, you should see:
- ✅ "configured" status in API debug
- ✅ Files uploaded to your Google Drive folder
- ✅ Order data saved to your Google Sheet
- ✅ No error messages in browser console
