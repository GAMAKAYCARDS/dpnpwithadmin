import { NextRequest, NextResponse } from 'next/server'
import { emailService } from '@/lib/email-service'

interface OrderEmailData {
  orderId: string
  orderDbId: number
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
    image_url: string
  }>
  total: number
  paymentOption: 'full' | 'deposit'
  receiptUrl?: string | null
}

export async function POST(request: NextRequest) {
  try {
    const body: OrderEmailData = await request.json()
    
    console.log('📧 API: Sending order emails for order:', body.orderId)
    
    // Prepare email data
    const emailData = {
      orderId: body.orderId,
      customerInfo: body.customerInfo,
      cart: body.cart,
      total: body.total,
      paymentOption: body.paymentOption,
      receiptUrl: body.receiptUrl
    }
    
    // Send emails using the email service
    const emailResults = await emailService.sendOrderEmails(
      emailData,
      body.orderDbId,
      process.env.ADMIN_EMAIL || 'dopetechnp@gmail.com'
    )
    
    console.log('📧 API: Email results:', {
      customer: emailResults.customerEmail.success ? '✅ Sent' : '❌ Failed',
      admin: emailResults.adminEmail.success ? '✅ Sent' : '❌ Failed'
    })
    
    return NextResponse.json({
      success: true,
      customerEmail: emailResults.customerEmail,
      adminEmail: emailResults.adminEmail,
      message: 'Order emails processed'
    })
    
  } catch (error) {
    console.error('❌ API: Error sending order emails:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to send order emails',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
