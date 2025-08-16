import { NextRequest, NextResponse } from 'next/server'

// Google Sheets API configuration
const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID || 'your-sheet-id-here'
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')

// Google Drive API configuration
const GOOGLE_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || '1U5wfCmULVs1US4JZ4FoAODLOk3zqzyS_'

// Check if Google APIs are properly configured
const isGoogleAPIConfigured = GOOGLE_SERVICE_ACCOUNT_EMAIL && GOOGLE_PRIVATE_KEY && GOOGLE_SHEET_ID !== 'your-sheet-id-here'

interface CheckoutData {
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

// Function to get Google Sheets API client
async function getGoogleSheetsClient() {
  const { google } = require('googleapis')
  
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: GOOGLE_PRIVATE_KEY,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  return google.sheets({ version: 'v4', auth })
}

// Function to get Google Drive API client
async function getGoogleDriveClient() {
  const { google } = require('googleapis')
  
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: GOOGLE_PRIVATE_KEY,
    },
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  })

  return google.drive({ version: 'v3', auth })
}

// Function to submit data to Google Sheets
async function submitToGoogleSheets(data: CheckoutData) {
  try {
    const sheets = await getGoogleSheetsClient()
    
    const cartSummary = data.cart.map(item => 
      `${item.quantity}x ${item.name} (Rs ${item.price.toLocaleString()})`
    ).join(', ')

    const rowData = [
      data.orderId,
      data.customerInfo.fullName,
      data.customerInfo.email,
      data.customerInfo.phone,
      data.customerInfo.fullAddress,
      data.customerInfo.city,
      data.customerInfo.state,
      data.customerInfo.zipCode,
      cartSummary,
      data.total.toString(),
      data.paymentOption,
      new Date().toISOString(),
      data.receiptFileName || 'No receipt uploaded'
    ]

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: GOOGLE_SHEET_ID,
      range: 'Sheet1!A:M', // Adjust range based on your sheet columns
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [rowData]
      }
    })

    console.log('✅ Data submitted to Google Sheets:', response.data)
    return true
  } catch (error) {
    console.error('❌ Error submitting to Google Sheets:', error)
    return false
  }
}

// Function to upload file to Google Drive
async function uploadToGoogleDrive(fileData: string, fileName: string, orderId: string): Promise<string | null> {
  try {
    const drive = await getGoogleDriveClient()
    
    // Convert base64 to buffer
    const fileBuffer = Buffer.from(fileData.split(',')[1], 'base64')
    
    // Create file metadata
    const fileMetadata = {
      name: `${orderId}_${fileName}`,
      parents: [GOOGLE_DRIVE_FOLDER_ID]
    }

    // Create media
    const media = {
      mimeType: 'application/octet-stream',
      body: fileBuffer
    }

    // Upload file
    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id,webViewLink'
    })

    console.log('✅ File uploaded to Google Drive:', response.data)
    return response.data.webViewLink || null
  } catch (error) {
    console.error('❌ Error uploading to Google Drive:', error)
    return null
  }
}

// Fallback function for testing when Google APIs are not configured
function simulateGoogleAPISubmission(data: CheckoutData) {
  console.log('🧪 SIMULATION MODE - Google APIs not configured')
  console.log('📋 Order Data:', {
    orderId: data.orderId,
    customerName: data.customerInfo.fullName,
    email: data.customerInfo.email,
    phone: data.customerInfo.phone,
    address: data.customerInfo.fullAddress,
    cartItems: data.cart.length,
    total: data.total,
    paymentOption: data.paymentOption,
    hasReceipt: !!data.receiptFile
  })
  
  // Simulate processing delay
  return new Promise(resolve => setTimeout(() => resolve(true), 1000))
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutData = await request.json()
    
    console.log('📋 Received checkout data:', {
      orderId: body.orderId,
      customerName: body.customerInfo.fullName,
      total: body.total,
      hasReceipt: !!body.receiptFile,
      googleAPIConfigured: isGoogleAPIConfigured
    })

    // Validate required fields
    if (!body.orderId || !body.customerInfo.fullName || !body.customerInfo.email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    let receiptLink = null
    let submissionSuccess = false

    if (isGoogleAPIConfigured) {
      // Use real Google APIs
      console.log('🚀 Using real Google APIs')
      
      // Upload receipt to Google Drive if provided
      if (body.receiptFile && body.receiptFileName) {
        console.log('📤 Uploading receipt to Google Drive...')
        receiptLink = await uploadToGoogleDrive(body.receiptFile, body.receiptFileName, body.orderId)
      }

      // Submit data to Google Sheets
      console.log('📊 Submitting data to Google Sheets...')
      submissionSuccess = await submitToGoogleSheets(body)
    } else {
      // Use simulation mode
      console.log('🧪 Using simulation mode - Google APIs not configured')
      submissionSuccess = await simulateGoogleAPISubmission(body)
    }

    if (!submissionSuccess) {
      return NextResponse.json(
        { error: 'Failed to submit order data' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      orderId: body.orderId,
      receiptLink,
      message: isGoogleAPIConfigured 
        ? 'Order submitted successfully to Google Sheets and Google Drive' 
        : 'Order submitted successfully (simulation mode - Google APIs not configured)',
      mode: isGoogleAPIConfigured ? 'production' : 'simulation'
    })

  } catch (error) {
    console.error('❌ Checkout API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
