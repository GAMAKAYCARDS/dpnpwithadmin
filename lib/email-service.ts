import { Resend } from 'resend'
import { renderToString } from 'react-dom/server'
import { CustomerOrderConfirmation } from '@/components/email-templates/customer-order-confirmation'
import { AdminOrderNotification } from '@/components/email-templates/admin-order-notification'

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY)

interface OrderData {
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
  receiptUrl?: string | null
}

interface EmailResult {
  success: boolean
  message: string
  error?: string
}

export class EmailService {
  private static instance: EmailService
  private resend: Resend

  private constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY)
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService()
    }
    return EmailService.instance
  }

  /**
   * Send order confirmation email to customer
   */
  async sendCustomerConfirmation(
    orderData: OrderData,
    orderDbId: number
  ): Promise<EmailResult> {
    try {
      if (!process.env.RESEND_API_KEY) {
        console.warn('⚠️ RESEND_API_KEY not configured - skipping customer email')
        return {
          success: false,
          message: 'Email service not configured',
          error: 'RESEND_API_KEY not found'
        }
      }

      // Render the email template to HTML
      const emailHtml = renderToString(
        CustomerOrderConfirmation({
          orderId: orderData.orderId,
          customerName: orderData.customerInfo.fullName,
          customerEmail: orderData.customerInfo.email,
          customerPhone: orderData.customerInfo.phone,
          customerAddress: orderData.customerInfo.fullAddress,
          items: orderData.cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
          })),
          total: orderData.total,
          paymentOption: orderData.paymentOption,
          receiptUrl: orderData.receiptUrl
        })
      )

      // Send email using Resend
      const { data, error } = await this.resend.emails.send({
        from: 'DopeTech GMK <orders@dopetech-nepal.com>',
        to: [orderData.customerInfo.email],
        subject: `Order Confirmation - ${orderData.orderId} | DopeTech GMK`,
        html: emailHtml,
        replyTo: 'support@dopetech-nepal.com'
      })

      if (error) {
        console.error('❌ Error sending customer confirmation email:', error)
        return {
          success: false,
          message: 'Failed to send customer confirmation email',
          error: error.message
        }
      }

      console.log('✅ Customer confirmation email sent successfully:', data?.id)
      return {
        success: true,
        message: 'Customer confirmation email sent successfully'
      }
    } catch (error) {
      console.error('❌ Exception sending customer confirmation email:', error)
      return {
        success: false,
        message: 'Exception occurred while sending customer confirmation email',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Send admin notification email
   */
  async sendAdminNotification(
    orderData: OrderData,
    orderDbId: number,
    adminEmail?: string
  ): Promise<EmailResult> {
    try {
      if (!process.env.RESEND_API_KEY) {
        console.warn('⚠️ RESEND_API_KEY not configured - skipping admin email')
        return {
          success: false,
          message: 'Email service not configured',
          error: 'RESEND_API_KEY not found'
        }
      }

      // Use admin email from env or fallback to customer email for testing
      const recipientEmail = adminEmail || process.env.ADMIN_EMAIL || orderData.customerInfo.email

      // Render the email template to HTML
      const emailHtml = renderToString(
        AdminOrderNotification({
          orderId: orderData.orderId,
          customerName: orderData.customerInfo.fullName,
          customerEmail: orderData.customerInfo.email,
          customerPhone: orderData.customerInfo.phone,
          customerAddress: orderData.customerInfo.fullAddress,
          customerCity: orderData.customerInfo.city,
          customerState: orderData.customerInfo.state,
          customerZipCode: orderData.customerInfo.zipCode,
          items: orderData.cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
          })),
          total: orderData.total,
          paymentOption: orderData.paymentOption,
          receiptUrl: orderData.receiptUrl,
          orderDbId
        })
      )

      // Send email using Resend
      const { data, error } = await this.resend.emails.send({
        from: 'DopeTech GMK <orders@dopetech-nepal.com>',
        to: [recipientEmail],
        subject: `🚨 New Order Alert: ${orderData.orderId} | DopeTech GMK`,
        html: emailHtml,
        replyTo: 'support@dopetech-nepal.com'
      })

      if (error) {
        console.error('❌ Error sending admin notification email:', error)
        return {
          success: false,
          message: 'Failed to send admin notification email',
          error: error.message
        }
      }

      console.log('✅ Admin notification email sent successfully:', data?.id)
      return {
        success: true,
        message: 'Admin notification email sent successfully'
      }
    } catch (error) {
      console.error('❌ Exception sending admin notification email:', error)
      return {
        success: false,
        message: 'Exception occurred while sending admin notification email',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Send both customer confirmation and admin notification emails
   */
  async sendOrderEmails(
    orderData: OrderData,
    orderDbId: number,
    adminEmail?: string
  ): Promise<{
    customerEmail: EmailResult
    adminEmail: EmailResult
  }> {
    console.log('📧 Sending order emails...')

    // Send emails in parallel
    const [customerResult, adminResult] = await Promise.allSettled([
      this.sendCustomerConfirmation(orderData, orderDbId),
      this.sendAdminNotification(orderData, orderDbId, adminEmail)
    ])

    const customerEmail = customerResult.status === 'fulfilled' 
      ? customerResult.value 
      : {
          success: false,
          message: 'Customer email failed',
          error: customerResult.reason?.message || 'Unknown error'
        }

    const adminEmailResult = adminResult.status === 'fulfilled' 
      ? adminResult.value 
      : {
          success: false,
          message: 'Admin email failed',
          error: adminResult.reason?.message || 'Unknown error'
        }

    console.log('📧 Email results:', {
      customer: customerEmail.success ? '✅ Sent' : '❌ Failed',
      admin: adminEmailResult.success ? '✅ Sent' : '❌ Failed'
    })

    return {
      customerEmail,
      adminEmail: adminEmailResult
    }
  }

  /**
   * Test email service configuration
   */
  async testEmailService(): Promise<EmailResult> {
    try {
      if (!process.env.RESEND_API_KEY) {
        return {
          success: false,
          message: 'Email service not configured',
          error: 'RESEND_API_KEY not found'
        }
      }

      const { data, error } = await this.resend.emails.send({
        from: 'DopeTech GMK <orders@dopetech-nepal.com>',
        to: ['test@example.com'],
        subject: 'Test Email - DopeTech GMK Email Service',
        html: '<h1>Test Email</h1><p>This is a test email to verify the email service is working correctly.</p>'
      })

      if (error) {
        return {
          success: false,
          message: 'Email service test failed',
          error: error.message
        }
      }

      return {
        success: true,
        message: 'Email service test successful'
      }
    } catch (error) {
      return {
        success: false,
        message: 'Email service test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}

// Export singleton instance
export const emailService = EmailService.getInstance()
