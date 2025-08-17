import { supabase } from './supabase'
import { emailService } from './email-service'

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

export const checkoutClient = {
  async submitOrder(orderData: CheckoutData): Promise<{
    success: boolean
    orderId: string
    orderDbId?: number
    receiptUrl?: string
    message: string
  }> {
    try {
      console.log('📋 Submitting order to Supabase:', {
        orderId: orderData.orderId,
        customerName: orderData.customerInfo.fullName,
        total: orderData.total,
        hasReceipt: !!orderData.receiptFile
      })

      // Validate required fields
      if (!orderData.orderId || !orderData.customerInfo.fullName || !orderData.customerInfo.email) {
        throw new Error('Missing required fields')
      }

      let receiptUrl = null

      // Upload receipt to Supabase Storage if provided
      if (orderData.receiptFile && orderData.receiptFileName) {
        try {
          console.log('📤 Uploading receipt to Supabase Storage...')
          
          const fileExt = orderData.receiptFileName.split('.').pop()?.toLowerCase()
          const fileName = `${orderData.orderId}_receipt.${fileExt}`
          
          // Convert base64 to buffer
          const fileBuffer = Buffer.from(orderData.receiptFile.split(',')[1], 'base64')
          
          // Determine content type based on file extension
          let contentType = 'image/jpeg' // default
          if (fileExt === 'png') contentType = 'image/png'
          else if (fileExt === 'jpg' || fileExt === 'jpeg') contentType = 'image/jpeg'
          else if (fileExt === 'pdf') contentType = 'application/pdf'
          else if (fileExt === 'webp') contentType = 'image/webp'
          
          console.log(`📤 Uploading file: ${fileName} with content type: ${contentType}`)
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('receipts')
            .upload(fileName, fileBuffer, {
              contentType: contentType,
              cacheControl: '3600'
            })

          if (uploadError) {
            console.error('❌ Error uploading receipt:', uploadError)
          } else {
            console.log('✅ File uploaded successfully:', fileName)
            
            // Generate public URL
            const { data: urlData } = supabase.storage
              .from('receipts')
              .getPublicUrl(fileName)
            
            receiptUrl = urlData.publicUrl
            console.log('✅ Receipt URL generated:', receiptUrl)
          }
        } catch (error) {
          console.error('❌ Error processing receipt:', error)
        }
      }

      // Create order in Supabase
      console.log('📊 Creating order in Supabase database...')
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          order_id: orderData.orderId,
          customer_name: orderData.customerInfo.fullName,
          customer_email: orderData.customerInfo.email,
          customer_phone: orderData.customerInfo.phone,
          customer_city: orderData.customerInfo.city,
          customer_state: orderData.customerInfo.state,
          customer_zip_code: orderData.customerInfo.zipCode,
          customer_address: orderData.customerInfo.fullAddress,
          total_amount: orderData.total,
          payment_option: orderData.paymentOption,
          payment_status: 'pending',
          order_status: 'processing',
          receipt_url: receiptUrl,
          receipt_file_name: orderData.receiptFileName
        }])
        .select()
        .single()

      if (orderError) {
        console.error('❌ Error creating order:', orderError)
        throw new Error('Failed to create order')
      }

      console.log('✅ Order created successfully:', order.id)

      // Add order items
      console.log('📦 Adding order items...')
      const orderItems = orderData.cart.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) {
        console.error('❌ Error adding order items:', itemsError)
        throw new Error('Failed to add order items')
      }

      console.log('✅ Order items added successfully')

      // Send notification email (optional - can be handled separately)
      try {
        await this.sendNotificationEmail(orderData, order.id, receiptUrl)
        console.log('✅ Notification email sent')
      } catch (error) {
        console.error('❌ Error sending notification email:', error)
        // Don't fail the order if email fails
      }

      return {
        success: true,
        orderId: orderData.orderId,
        orderDbId: order.id,
        receiptUrl,
        message: 'Order submitted successfully to Supabase database'
      }

    } catch (error) {
      console.error('❌ Supabase checkout error:', error)
      return {
        success: false,
        orderId: orderData.orderId,
        message: error instanceof Error ? error.message : 'Internal server error'
      }
    }
  },

  // Function to send notification emails using Resend
  async sendNotificationEmail(orderData: CheckoutData, orderDbId: number, receiptUrl: string | null) {
    try {
      console.log('📧 Sending notification emails for order:', orderDbId)
      
      // Send both customer confirmation and admin notification emails
      const emailResults = await emailService.sendOrderEmails(
        {
          orderId: orderData.orderId,
          customerInfo: orderData.customerInfo,
          cart: orderData.cart,
          total: orderData.total,
          paymentOption: orderData.paymentOption,
          receiptUrl
        },
        orderDbId,
        process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@example.com' // Use public env var
      )

      // Log results
      if (emailResults.customerEmail.success) {
        console.log('✅ Customer confirmation email sent successfully')
      } else {
        console.warn('⚠️ Customer confirmation email failed:', emailResults.customerEmail.error)
      }

      if (emailResults.adminEmail.success) {
        console.log('✅ Admin notification email sent successfully')
      } else {
        console.warn('⚠️ Admin notification email failed:', emailResults.adminEmail.error)
      }

      return emailResults
    } catch (error) {
      console.error('❌ Error sending notification emails:', error)
      return {
        customerEmail: { success: false, message: 'Email service error', error: error instanceof Error ? error.message : 'Unknown error' },
        adminEmail: { success: false, message: 'Email service error', error: error instanceof Error ? error.message : 'Unknown error' }
      }
    }
  }
}
