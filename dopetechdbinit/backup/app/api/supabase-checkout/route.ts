import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

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

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutData = await request.json()
    
    console.log('📋 Received Supabase checkout data:', {
      orderId: body.orderId,
      customerName: body.customerInfo.fullName,
      total: body.total,
      hasReceipt: !!body.receiptFile,
      paymentOption: body.paymentOption
    })

    // Validate required fields
    if (!body.orderId || !body.customerInfo.fullName || !body.customerInfo.email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    let receiptUrl = null

    // Upload receipt to Supabase Storage if provided
    if (body.receiptFile && body.receiptFileName) {
      try {
        console.log('📤 Uploading receipt to Supabase Storage...')
        
        const fileExt = body.receiptFileName.split('.').pop()
        const fileName = `${body.orderId}_receipt.${fileExt}`
        
        // Convert base64 to buffer
        const fileBuffer = Buffer.from(body.receiptFile.split(',')[1], 'base64')
        
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
          .from('receipts')
          .upload(fileName, fileBuffer, {
            contentType: 'application/octet-stream',
            cacheControl: '3600'
          })

        if (uploadError) {
          console.error('❌ Error uploading receipt:', uploadError)
        } else {
          const { data: urlData } = supabaseAdmin.storage
            .from('receipts')
            .getPublicUrl(fileName)
          receiptUrl = urlData.publicUrl
          console.log('✅ Receipt uploaded successfully:', receiptUrl)
        }
      } catch (error) {
        console.error('❌ Error processing receipt:', error)
      }
    }

    // Create order in Supabase
    console.log('📊 Creating order in Supabase database...')
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert([{
        order_id: body.orderId,
        customer_name: body.customerInfo.fullName,
        customer_email: body.customerInfo.email,
        customer_phone: body.customerInfo.phone,
        customer_city: body.customerInfo.city,
        customer_state: body.customerInfo.state,
        customer_zip_code: body.customerInfo.zipCode,
        customer_address: body.customerInfo.fullAddress,
        total_amount: body.total,
        payment_option: body.paymentOption,
        payment_status: 'pending',
        order_status: 'processing',
        receipt_url: receiptUrl,
        receipt_file_name: body.receiptFileName
      }])
      .select()
      .single()

    if (orderError) {
      console.error('❌ Error creating order:', orderError)
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      )
    }

    console.log('✅ Order created successfully:', order.id)

    // Add order items
    console.log('📦 Adding order items...')
    const orderItems = body.cart.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price
    }))

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('❌ Error adding order items:', itemsError)
      return NextResponse.json(
        { error: 'Failed to add order items' },
        { status: 500 }
      )
    }

    console.log('✅ Order items added successfully')

    // Send notification email (you can integrate with your preferred email service)
    try {
      await sendNotificationEmail(body, order.id, receiptUrl)
      console.log('✅ Notification email sent')
    } catch (error) {
      console.error('❌ Error sending notification email:', error)
      // Don't fail the order if email fails
    }

    return NextResponse.json({
      success: true,
      orderId: body.orderId,
      orderDbId: order.id,
      receiptUrl,
      message: 'Order submitted successfully to Supabase database'
    })

  } catch (error) {
    console.error('❌ Supabase checkout API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Function to send notification email (placeholder - implement with your email service)
async function sendNotificationEmail(orderData: CheckoutData, orderDbId: number, receiptUrl: string | null) {
  // This is a placeholder. You can integrate with:
  // - Resend (recommended for Next.js)
  // - SendGrid
  // - Nodemailer
  // - Supabase Edge Functions for email
  
  console.log('📧 Sending notification email for order:', orderDbId)
  console.log('📧 Order details:', {
    orderId: orderData.orderId,
    customerName: orderData.customerInfo.fullName,
    customerEmail: orderData.customerInfo.email,
    total: orderData.total,
    paymentOption: orderData.paymentOption,
    hasReceipt: !!receiptUrl
  })
  
  // Example email content:
  const emailContent = `
    New Order Received!
    
    Order ID: ${orderData.orderId}
    Customer: ${orderData.customerInfo.fullName}
    Email: ${orderData.customerInfo.email}
    Phone: ${orderData.customerInfo.phone}
    Address: ${orderData.customerInfo.fullAddress}
    Total: Rs ${orderData.total}
    Payment Option: ${orderData.paymentOption}
    Receipt: ${receiptUrl ? 'Uploaded' : 'Not provided'}
    
    Items:
    ${orderData.cart.map(item => `- ${item.quantity}x ${item.name} (Rs ${item.price})`).join('\n')}
  `
  
  console.log('📧 Email content:', emailContent)
  
  // TODO: Implement actual email sending
  // Example with Resend:
  // await fetch('https://api.resend.com/emails', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     from: 'orders@dopetech-nepal.com',
  //     to: 'your-email@example.com',
  //     subject: `New Order: ${orderData.orderId}`,
  //     html: emailContent
  //   })
  // })
}
