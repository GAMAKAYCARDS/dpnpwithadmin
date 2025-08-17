require('dotenv').config({ path: '.env.local' });

const { Resend } = require('resend');
const nodemailer = require('nodemailer');

console.log('🧪 Testing Email Service Configuration...\n');

// Check environment variables
console.log('📋 Environment Variables Check:');
console.log('📧 RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ Found' : '❌ Missing');
console.log('📧 GMAIL_USER:', process.env.GMAIL_USER ? '✅ Found' : '❌ Missing');
console.log('📧 GMAIL_APP_PASSWORD:', process.env.GMAIL_APP_PASSWORD ? '✅ Found' : '❌ Missing');
console.log('📧 ADMIN_EMAIL:', process.env.ADMIN_EMAIL ? '✅ Found' : '❌ Missing');
console.log('🌐 NODE_ENV:', process.env.NODE_ENV || 'Not set');
console.log('🌐 NETLIFY_ENV:', process.env.NETLIFY_ENV || 'Not set');
console.log('');

// Test Resend
async function testResend() {
  console.log('🔍 Testing Resend Service...');
  
  if (!process.env.RESEND_API_KEY) {
    console.log('❌ RESEND_API_KEY not found - skipping Resend test');
    return false;
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    // Test with a simple email
    const { data, error } = await resend.emails.send({
      from: 'DopeTech GMK <onboarding@resend.dev>',
      to: [process.env.ADMIN_EMAIL || 'dopetechnp@gmail.com'],
      subject: '🧪 Email Service Test - DopeTech GMK',
      html: `
        <h1>Email Service Test</h1>
        <p>This is a test email to verify the Resend service is working correctly.</p>
        <p><strong>Test Time:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Environment:</strong> ${process.env.NODE_ENV || 'Unknown'}</p>
        <hr>
        <p style="color: #666; font-size: 12px;">
          If you receive this email, the Resend service is working correctly!
        </p>
      `
    });

    if (error) {
      console.log('❌ Resend test failed:', error.message);
      return false;
    }

    console.log('✅ Resend test successful!');
    console.log('📧 Email ID:', data?.id);
    console.log('📧 Sent to:', process.env.ADMIN_EMAIL || 'dopetechnp@gmail.com');
    return true;
  } catch (error) {
    console.log('❌ Resend test error:', error.message);
    return false;
  }
}

// Test Gmail
async function testGmail() {
  console.log('\n🔍 Testing Gmail Service...');
  
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.log('❌ Gmail credentials not found - skipping Gmail test');
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    // Verify connection
    await transporter.verify();
    console.log('✅ Gmail connection verified');

    // Test sending email
    const mailOptions = {
      from: `"DopeTech GMK Test" <${process.env.GMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || 'dopetechnp@gmail.com',
      subject: '🧪 Gmail Service Test - DopeTech GMK',
      html: `
        <h1>Gmail Service Test</h1>
        <p>This is a test email to verify the Gmail SMTP service is working correctly.</p>
        <p><strong>Test Time:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Environment:</strong> ${process.env.NODE_ENV || 'Unknown'}</p>
        <hr>
        <p style="color: #666; font-size: 12px;">
          If you receive this email, the Gmail service is working correctly!
        </p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Gmail test successful!');
    console.log('📧 Message ID:', info.messageId);
    console.log('📧 Sent to:', process.env.ADMIN_EMAIL || 'dopetechnp@gmail.com');
    return true;
  } catch (error) {
    console.log('❌ Gmail test error:', error.message);
    return false;
  }
}

// Test order email simulation
async function testOrderEmail() {
  console.log('\n🔍 Testing Order Email Simulation...');
  
  const orderData = {
    orderId: 'TEST-' + Date.now(),
    customerInfo: {
      fullName: 'Test Customer',
      email: process.env.ADMIN_EMAIL || 'dopetechnp@gmail.com',
      phone: '+9771234567890',
      city: 'Kathmandu',
      state: 'Bagmati',
      zipCode: '44600',
      fullAddress: 'Test Address, Kathmandu, Nepal'
    },
    cart: [
      {
        id: 1,
        name: 'Test Product',
        price: 1000,
        quantity: 1,
        image_url: '/test-image.jpg'
      }
    ],
    total: 1000,
    paymentOption: 'full'
  };

  try {
    // Test Resend for admin email
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      const adminEmailHtml = `
        <h1>🚨 New Order Alert</h1>
        <p><strong>Order ID:</strong> ${orderData.orderId}</p>
        <p><strong>Customer:</strong> ${orderData.customerInfo.fullName}</p>
        <p><strong>Email:</strong> ${orderData.customerInfo.email}</p>
        <p><strong>Total:</strong> Rs ${orderData.total.toLocaleString()}</p>
        <hr>
        <p>This is a test order email simulation.</p>
      `;

      const { data, error } = await resend.emails.send({
        from: 'DopeTech GMK <onboarding@resend.dev>',
        to: [process.env.ADMIN_EMAIL || 'dopetechnp@gmail.com'],
        subject: `🚨 Test Order Alert: ${orderData.orderId} | DopeTech GMK`,
        html: adminEmailHtml
      });

      if (!error) {
        console.log('✅ Order email simulation successful!');
        console.log('📧 Admin email sent via Resend');
      }
    }

    // Test Gmail for customer email
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
             const transporter = nodemailer.createTransport({
         service: 'gmail',
         auth: {
           user: process.env.GMAIL_USER,
           pass: process.env.GMAIL_APP_PASSWORD
         }
       });

      const customerEmailHtml = `
        <h1>✅ Order Confirmation</h1>
        <p><strong>Order ID:</strong> ${orderData.orderId}</p>
        <p><strong>Total:</strong> Rs ${orderData.total.toLocaleString()}</p>
        <hr>
        <p>This is a test order confirmation email.</p>
      `;

      const info = await transporter.sendMail({
        from: `"DopeTech GMK" <${process.env.GMAIL_USER}>`,
        to: orderData.customerInfo.email,
        subject: `Order Confirmation - ${orderData.orderId} | DopeTech GMK`,
        html: customerEmailHtml
      });

      console.log('✅ Customer email sent via Gmail');
    }

    console.log('✅ Order email simulation completed!');
    return true;
  } catch (error) {
    console.log('❌ Order email simulation error:', error.message);
    return false;
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Starting Email Service Tests...\n');

  const resendResult = await testResend();
  const gmailResult = await testGmail();
  const orderResult = await testOrderEmail();

  console.log('\n📊 Test Results Summary:');
  console.log('📧 Resend Service:', resendResult ? '✅ Working' : '❌ Failed');
  console.log('📧 Gmail Service:', gmailResult ? '✅ Working' : '❌ Failed');
  console.log('📧 Order Emails:', orderResult ? '✅ Working' : '❌ Failed');

  console.log('\n💡 Recommendations:');
  
  if (!process.env.RESEND_API_KEY) {
    console.log('🔧 Add RESEND_API_KEY to your environment variables');
  }
  
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.log('🔧 Add GMAIL_USER and GMAIL_APP_PASSWORD for customer emails');
  }
  
  if (!process.env.ADMIN_EMAIL) {
    console.log('🔧 Add ADMIN_EMAIL to receive admin notifications');
  }

  console.log('\n✅ Email service test completed!');
}

// Run tests
runTests().catch(console.error);
