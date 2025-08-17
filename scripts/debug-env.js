require('dotenv').config({ path: '.env.local' });

console.log('🔍 Environment Variables Debug:');
console.log('================================');

const requiredVars = [
  'RESEND_API_KEY',
  'GMAIL_USER', 
  'GMAIL_APP_PASSWORD',
  'ADMIN_EMAIL'
];

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 10)}...`);
  } else {
    console.log(`❌ ${varName}: NOT SET`);
  }
});

console.log('\n📧 Email Service Test:');
console.log('=====================');

// Test if we can import the email service
try {
  const { EmailService } = require('../lib/email-service');
  const emailService = EmailService.getInstance();
  console.log('✅ Email service imported successfully');
  
  // Test basic functionality
  emailService.testEmailService().then(result => {
    console.log('📧 Test result:', result);
  }).catch(err => {
    console.log('❌ Test failed:', err.message);
  });
  
} catch (error) {
  console.log('❌ Failed to import email service:', error.message);
}
