# Email Setup Guide for DopeTech GMK

This guide will help you set up email notifications for order confirmations and admin alerts.

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Resend API Key (for admin notifications)
RESEND_API_KEY=your_resend_api_key_here

# Gmail Configuration (for customer emails)
GMAIL_USER=your_gmail_address@gmail.com
GMAIL_APP_PASSWORD=your_gmail_app_password

# Admin Email (where admin notifications will be sent)
ADMIN_EMAIL=dopetechnp@gmail.com
```

## Setup Instructions

### 1. Resend Setup (for Admin Notifications)

1. Go to [resend.com](https://resend.com) and create an account
2. Verify your domain or use the default `onboarding@resend.dev`
3. Get your API key from the dashboard
4. Add it to your `.env.local` file as `RESEND_API_KEY`

### 2. Gmail Setup (for Customer Emails)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
3. Use your Gmail address and the generated app password in `.env.local`

### 3. Admin Email Configuration

Set `ADMIN_EMAIL` to the email address where you want to receive order notifications.

## Testing Email Configuration

You can test your email setup by:

1. Making a test order through the checkout
2. Checking the browser console for email sending logs
3. Verifying emails are received by both customer and admin

## Troubleshooting

### Emails Not Sending

1. **Check Environment Variables**: Ensure all required variables are set
2. **Verify API Keys**: Make sure your Resend API key is valid
3. **Gmail App Password**: Ensure you're using an app password, not your regular password
4. **Check Console Logs**: Look for email-related error messages in the browser console

### Common Issues

- **"Email service not configured"**: Missing environment variables
- **"Failed to send customer confirmation email"**: Gmail configuration issue
- **"Failed to send admin notification email"**: Resend API key issue

## Email Templates

The system uses two email templates:

1. **Customer Confirmation**: Sent to customers with order details
2. **Admin Notification**: Sent to admin with order alert and customer details

Both templates include:
- Order ID and details
- Customer information
- Payment details
- Receipt link (if uploaded)
- Contact information

## Security Notes

- Never commit `.env.local` to version control
- Use app passwords for Gmail, not regular passwords
- Keep API keys secure and rotate them regularly
- The system uses secure SMTP connections for email delivery

## Production Deployment

For production deployment:

1. Set environment variables in your hosting platform (Netlify, Vercel, etc.)
2. Ensure your domain is verified with Resend
3. Test email delivery in production environment
4. Monitor email delivery rates and bounce rates

## Support

If you encounter issues:

1. Check the browser console for detailed error messages
2. Verify all environment variables are correctly set
3. Test with a simple order to isolate the issue
4. Contact support with specific error messages and logs
