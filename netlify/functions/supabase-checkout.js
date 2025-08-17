const { createClient } = require('@supabase/supabase-js')
const { Resend } = require('resend')
const nodemailer = require('nodemailer')

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// Initialize email services
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
const gmailTransporter = (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) ? 
  nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  }) : null

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  }

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    }
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const body = JSON.parse(event.body)
    
    console.log('📋 Received Supabase checkout data:', {
      orderId: body.orderId,
      customerName: body.customerInfo.fullName,
      total: body.total,
      hasReceipt: !!body.receiptFile,
      paymentOption: body.paymentOption
    })

    // Validate required fields
    if (!body.orderId || !body.customerInfo.fullName || !body.customerInfo.email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' })
      }
    }

    let receiptUrl = null

    // Upload receipt to Supabase Storage if provided
    if (body.receiptFile && body.receiptFileName) {
      try {
        console.log('📤 Uploading receipt to Supabase Storage...')
        
        const fileExt = body.receiptFileName.split('.').pop()?.toLowerCase()
        const fileName = `${body.orderId}_receipt.${fileExt}`
        
        // Convert base64 to buffer
        const fileBuffer = Buffer.from(body.receiptFile.split(',')[1], 'base64')
        
        // Determine content type based on file extension
        let contentType = 'image/jpeg' // default
        if (fileExt === 'png') contentType = 'image/png'
        else if (fileExt === 'jpg' || fileExt === 'jpeg') contentType = 'image/jpeg'
        else if (fileExt === 'pdf') contentType = 'application/pdf'
        else if (fileExt === 'webp') contentType = 'image/webp'
        
        console.log(`📤 Uploading file: ${fileName} with content type: ${contentType}`)
        
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
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
          const { data: urlData } = supabaseAdmin.storage
            .from('receipts')
            .getPublicUrl(fileName)
          
          receiptUrl = urlData.publicUrl
          console.log('✅ Receipt URL generated:', receiptUrl)
        }
      } catch (uploadError) {
        console.error('❌ Error in receipt upload process:', uploadError)
      }
    }

    // Create order in database
    console.log('📝 Creating order in database...')
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
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
        receipt_file_name: body.receiptFileName || null
      })
      .select()
      .single()

    if (orderError) {
      console.error('❌ Error creating order:', orderError)
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to create order' })
      }
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
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to add order items' })
      }
    }

    console.log('✅ Order items added successfully')

    // Send notification emails
    try {
      console.log('📧 Sending notification emails...')
      
      // Send customer confirmation email
      if (gmailTransporter) {
        try {
          const customerEmailHtml = `
            <h2>Thank you for your order!</h2>
            <p><strong>Order ID:</strong> ${body.orderId}</p>
            <p><strong>Customer:</strong> ${body.customerInfo.fullName}</p>
            <p><strong>Total:</strong> Rs ${body.total.toLocaleString()}</p>
            <p><strong>Payment Option:</strong> ${body.paymentOption}</p>
            <p>We'll process your order and contact you soon.</p>
          `
          
          await gmailTransporter.sendMail({
            from: `"DopeTech GMK" <${process.env.GMAIL_USER}>`,
            to: body.customerInfo.email,
            subject: `Order Confirmation - ${body.orderId} | DopeTech GMK`,
            html: customerEmailHtml,
            replyTo: 'dopetechnp@gmail.com'
          })
          console.log('✅ Customer confirmation email sent successfully')
        } catch (emailError) {
          console.error('❌ Error sending customer email:', emailError)
        }
      }

      // Send admin notification email
      if (resend) {
        try {
          const adminEmailHtml = `
            <h2>New Order Received!</h2>
            <p><strong>Order ID:</strong> ${body.orderId}</p>
            <p><strong>Customer:</strong> ${body.customerInfo.fullName}</p>
            <p><strong>Email:</strong> ${body.customerInfo.email}</p>
            <p><strong>Phone:</strong> ${body.customerInfo.phone}</p>
            <p><strong>Total:</strong> Rs ${body.total.toLocaleString()}</p>
            <p><strong>Payment Option:</strong> ${body.paymentOption}</p>
            ${receiptUrl ? `<p><strong>Receipt:</strong> <a href="${receiptUrl}">View Receipt</a></p>` : ''}
          `
          
          await resend.emails.send({
            from: 'DopeTech GMK <onboarding@resend.dev>',
            to: [process.env.ADMIN_EMAIL || 'dopetechnp@gmail.com'],
            subject: `🚨 New Order Alert: ${body.orderId} | DopeTech GMK`,
            html: adminEmailHtml,
            replyTo: 'dopetechnp@gmail.com'
          })
          console.log('✅ Admin notification email sent successfully')
        } catch (emailError) {
          console.error('❌ Error sending admin email:', emailError)
        }
      }
      
      console.log('✅ Notification emails sent successfully')
    } catch (error) {
      console.error('❌ Error sending notification emails:', error)
      // Don't fail the order if email fails
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        orderId: body.orderId,
        orderDbId: order.id,
        receiptUrl,
        message: 'Order submitted successfully to Supabase database'
      })
    }

  } catch (error) {
    console.error('❌ Supabase checkout function error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    }
  }
}
