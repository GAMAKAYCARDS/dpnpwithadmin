require('dotenv').config({ path: '.env.local' });

console.log('🧪 Testing Email Configuration Fix');
console.log('==================================');

// Check environment variables
const hasResend = !!process.env.RESEND_API_KEY;
const hasGmail = !!(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
const hasAdminEmail = !!process.env.ADMIN_EMAIL;

console.log(`✅ Resend API Key: ${hasResend ? 'SET' : 'NOT SET'}`);
console.log(`✅ Gmail User: ${process.env.GMAIL_USER ? 'SET' : 'NOT SET'}`);
console.log(`✅ Gmail App Password: ${process.env.GMAIL_APP_PASSWORD ? 'SET' : 'NOT SET'}`);
console.log(`✅ Admin Email: ${hasAdminEmail ? 'SET' : 'NOT SET'}`);

if (!hasResend && !hasGmail) {
  console.log('\n❌ No email service configured!');
  console.log('Please set up either Resend API key or Gmail credentials.');
  process.exit(1);
}

console.log('\n📧 Email services available:');
if (hasResend) console.log('- Resend (for admin notifications and customer fallback)');
if (hasGmail) console.log('- Gmail SMTP (for customer emails)');

// Test email service
async function testEmailService() {
  try {
    const { EmailService } = require('../lib/email-service');
    const emailService = EmailService.getInstance();
    
    console.log('\n🧪 Testing email service...');
    
    // Test with sample order data
    const testOrderData = {
      orderId: 'TEST-ORDER-123',
      customerInfo: {
        fullName: 'Test Customer',
        email: process.env.ADMIN_EMAIL || 'dopetechnp@gmail.com', // Use admin email for testing
        phone: '+977-1234567890',
        city: 'Kathmandu',
        state: 'Bagmati',
        zipCode: '44600',
        fullAddress: 'Test Address, Kathmandu, Nepal'
      },
      cart: [
        {
          id: 1,
          name: 'Test Product',
          price: 5000,
          quantity: 1,
          image_url: 'https://example.com/test.jpg'
        }
      ],
      total: 5000,
      paymentOption: 'full'
    };

    console.log('📧 Testing customer email...');
    const customerResult = await emailService.sendCustomerConfirmation(testOrderData, 1);
    console.log('Customer email result:', customerResult);

    console.log('📧 Testing admin email...');
    const adminResult = await emailService.sendAdminNotification(testOrderData, 1);
    console.log('Admin email result:', adminResult);

    if (customerResult.success && adminResult.success) {
      console.log('\n✅ All email tests passed!');
    } else {
      console.log('\n⚠️ Some email tests failed. Check the results above.');
    }

  } catch (error) {
    console.error('❌ Error testing email service:', error);
  }
}

testEmailService();
