const { EmailService } = require('../lib/email-service');

async function testEmailSetup() {
  console.log('🧪 Testing Email Setup...\n');

  const emailService = EmailService.getInstance();

  // Test email service configuration
  console.log('1. Testing email service configuration...');
  const testResult = await emailService.testEmailService();
  
  if (testResult.success) {
    console.log('✅ Email service is configured correctly');
    console.log('📧 Test email sent successfully');
  } else {
    console.log('❌ Email service configuration failed');
    console.log('Error:', testResult.error);
    console.log('\nPlease check your environment variables:');
    console.log('- RESEND_API_KEY');
    console.log('- GMAIL_USER');
    console.log('- GMAIL_APP_PASSWORD');
    console.log('- ADMIN_EMAIL');
  }

  console.log('\n2. Testing with sample order data...');
  
  const sampleOrderData = {
    orderId: 'TEST-123456789',
    customerInfo: {
      fullName: 'Test Customer',
      email: 'test@example.com',
      phone: '+9779812345678',
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
        image_url: 'https://example.com/test.jpg'
      }
    ],
    total: 1000,
    paymentOption: 'full',
    receiptUrl: null
  };

  try {
    const emailResults = await emailService.sendOrderEmails(sampleOrderData, 1);
    
    console.log('\n📧 Email Results:');
    console.log('Customer Email:', emailResults.customerEmail.success ? '✅ Sent' : '❌ Failed');
    if (!emailResults.customerEmail.success) {
      console.log('   Error:', emailResults.customerEmail.error);
    }
    
    console.log('Admin Email:', emailResults.adminEmail.success ? '✅ Sent' : '❌ Failed');
    if (!emailResults.adminEmail.success) {
      console.log('   Error:', emailResults.adminEmail.error);
    }
    
  } catch (error) {
    console.log('❌ Error testing email sending:', error.message);
  }

  console.log('\n📋 Summary:');
  console.log('If you see any ❌ errors above, please:');
  console.log('1. Check your .env.local file has all required variables');
  console.log('2. Verify your Resend API key is valid');
  console.log('3. Ensure Gmail app password is correct');
  console.log('4. Check that ADMIN_EMAIL is set correctly');
  console.log('\nFor detailed setup instructions, see EMAIL_SETUP.md');
}

// Run the test
testEmailSetup().catch(console.error);
