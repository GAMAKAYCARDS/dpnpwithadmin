import { NextRequest, NextResponse } from 'next/server'

// Google Sheets API configuration
const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID || 'your-sheet-id-here'
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')

// Google Drive API configuration
const GOOGLE_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || '1U5wfCmULVs1US4JZ4FoAODLOk3zqzyS_'

// Check if Google APIs are properly configured
const isGoogleAPIConfigured = GOOGLE_SERVICE_ACCOUNT_EMAIL && GOOGLE_PRIVATE_KEY && GOOGLE_SHEET_ID !== 'your-sheet-id-here'

export async function GET(request: NextRequest) {
  try {
    const status = {
      status: isGoogleAPIConfigured ? 'configured' : 'not_configured',
      mode: isGoogleAPIConfigured ? 'production' : 'simulation',
      googleAPIConfigured: isGoogleAPIConfigured,
      configuration: {
        hasServiceAccountEmail: !!GOOGLE_SERVICE_ACCOUNT_EMAIL,
        hasPrivateKey: !!GOOGLE_PRIVATE_KEY,
        hasSheetId: GOOGLE_SHEET_ID !== 'your-sheet-id-here',
        driveFolderId: GOOGLE_DRIVE_FOLDER_ID,
        sheetId: GOOGLE_SHEET_ID === 'your-sheet-id-here' ? 'not_set' : GOOGLE_SHEET_ID
      },
      message: isGoogleAPIConfigured 
        ? 'Google APIs are properly configured. Receipts will be uploaded to Google Drive and order data will be saved to Google Sheets.'
        : 'Google APIs are not configured. Running in simulation mode. Receipts and order data will only be logged to console.',
      nextSteps: isGoogleAPIConfigured 
        ? 'You can now test the checkout with real Google Drive uploads.'
        : 'Follow the setup guide in GOOGLE_SETUP_QUICK.md to configure Google APIs.'
    }

    return NextResponse.json(status)
  } catch (error) {
    console.error('❌ Status API error:', error)
    return NextResponse.json(
      { 
        status: 'error',
        mode: 'unknown',
        error: 'Internal server error',
        message: 'Error checking API configuration status.'
      },
      { status: 500 }
    )
  }
}
