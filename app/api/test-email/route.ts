import { NextRequest, NextResponse } from 'next/server'
import { emailService } from '@/lib/email-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { testType, adminEmail } = body

    console.log('🧪 Testing email service...')

    if (testType === 'service') {
      // Test basic email service configuration
      const result = await emailService.testEmailService()
      
      return NextResponse.json({
        success: result.success,
        message: result.message,
        error: result.error
      })
    }

    if (testType === 'order') {
      // Test with sample order data
      const sampleOrderData = {
        orderId: 'TEST-123456',
        customerInfo: {
          fullName: 'Test Customer',
          email: adminEmail || 'test@example.com',
          phone: '+9771234567890',
          city: 'Kathmandu',
          state: 'Bagmati',
          zipCode: '44600',
          fullAddress: '123 Test Street, Kathmandu, Nepal'
        },
        cart: [
          {
            id: 1,
            name: 'Test Gaming Keyboard',
            price: 5000,
            quantity: 1,
            image: '/test-keyboard.jpg'
          },
          {
            id: 2,
            name: 'Test Gaming Mouse',
            price: 3000,
            quantity: 2,
            image: '/test-mouse.jpg'
          }
        ],
        total: 11000,
        paymentOption: 'full' as const,
        receiptUrl: null
      }

      const emailResults = await emailService.sendOrderEmails(
        sampleOrderData,
        999, // Test order DB ID
        adminEmail
      )

      return NextResponse.json({
        success: true,
        message: 'Test order emails sent',
        results: emailResults
      })
    }

    return NextResponse.json(
      { error: 'Invalid test type. Use "service" or "order"' },
      { status: 400 }
    )

  } catch (error) {
    console.error('❌ Email test error:', error)
    return NextResponse.json(
      { error: 'Email test failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Email test endpoint',
    usage: {
      POST: {
        service: 'Test email service configuration',
        order: 'Test order confirmation emails (requires adminEmail in body)'
      }
    }
  })
}
