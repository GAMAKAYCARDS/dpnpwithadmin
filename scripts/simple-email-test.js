require('dotenv').config({ path: '.env.local' });

console.log('🧪 Simple Email Test');
console.log('===================');

// Check environment variables
const hasResend = !!process.env.RESEND_API_KEY;
const hasGmail = !!(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
const hasAdminEmail = !!process.env.ADMIN_EMAIL;

console.log(`✅ Resend API Key: ${hasResend ? 'SET' : 'NOT SET'}`);
console.log(`✅ Gmail Credentials: ${hasGmail ? 'SET' : 'NOT SET'}`);
console.log(`✅ Admin Email: ${hasAdminEmail ? 'SET' : 'NOT SET'}`);

if (!hasResend && !hasGmail) {
  console.log('\n❌ No email service configured!');
  console.log('Please set up either Resend API key or Gmail credentials.');
  process.exit(1);
}

console.log('\n📧 Email services available:');
if (hasResend) console.log('- Resend (for admin notifications)');
if (hasGmail) console.log('- Gmail SMTP (for customer emails)');

console.log('\n🎯 Next Steps:');
console.log('1. Start your development server: npm run dev');
console.log('2. Make a test order through the checkout');
console.log('3. Check browser console for email logs');
console.log('4. Check your email inboxes for confirmation emails');

console.log('\n📋 Expected Console Logs:');
console.log('- "📧 Sending order emails..."');
console.log('- "✅ Order emails sent successfully:"');
console.log('- Or error messages if something fails');
