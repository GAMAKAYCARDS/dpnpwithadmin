import React from 'react'

interface CustomerOrderConfirmationProps {
  orderId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  total: number
  paymentOption: string
  receiptUrl?: string | null
}

export function CustomerOrderConfirmation({
  orderId,
  customerName,
  customerEmail,
  customerPhone,
  customerAddress,
  items,
  total,
  paymentOption,
  receiptUrl
}: CustomerOrderConfirmationProps) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Order Confirmation - DopeTech GMK</title>
        <style>
          {`
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f8f9fa;
            }
            .container {
              background-color: white;
              border-radius: 12px;
              padding: 40px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
              border-bottom: 2px solid #f0f0f0;
              padding-bottom: 20px;
            }
            .logo {
              font-size: 28px;
              font-weight: bold;
              color: #2563eb;
              margin-bottom: 10px;
            }
            .order-id {
              background-color: #f0f9ff;
              border: 1px solid #0ea5e9;
              border-radius: 8px;
              padding: 15px;
              margin: 20px 0;
              text-align: center;
            }
            .order-id h2 {
              margin: 0;
              color: #0c4a6e;
              font-size: 18px;
            }
            .section {
              margin: 25px 0;
            }
            .section h3 {
              color: #1f2937;
              border-bottom: 2px solid #e5e7eb;
              padding-bottom: 8px;
              margin-bottom: 15px;
            }
            .item {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 12px 0;
              border-bottom: 1px solid #f3f4f6;
            }
            .item:last-child {
              border-bottom: none;
            }
            .item-name {
              font-weight: 500;
            }
            .item-details {
              color: #6b7280;
              font-size: 14px;
            }
            .total {
              background-color: #fef3c7;
              border: 1px solid #f59e0b;
              border-radius: 8px;
              padding: 20px;
              margin: 25px 0;
              text-align: center;
            }
            .total h3 {
              margin: 0 0 10px 0;
              color: #92400e;
            }
            .total-amount {
              font-size: 24px;
              font-weight: bold;
              color: #d97706;
            }
            .payment-info {
              background-color: #f0fdf4;
              border: 1px solid #22c55e;
              border-radius: 8px;
              padding: 15px;
              margin: 20px 0;
            }
            .receipt-section {
              background-color: #fef2f2;
              border: 1px solid #ef4444;
              border-radius: 8px;
              padding: 15px;
              margin: 20px 0;
              text-align: center;
            }
            .receipt-button {
              display: inline-block;
              background-color: #dc2626;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 500;
              margin-top: 10px;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid #f0f0f0;
              color: #6b7280;
              font-size: 14px;
            }
            .contact-info {
              background-color: #f8fafc;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
            }
            .contact-info h4 {
              margin: 0 0 15px 0;
              color: #374151;
            }
            .contact-item {
              margin: 8px 0;
              color: #6b7280;
            }
          `}
        </style>
      </head>
      <body>
        <div className="container">
          <div className="header">
            <div className="logo">🎮 DopeTech GMK</div>
            <p style={{ margin: 0, color: '#6b7280' }}>Your Gaming Gear Destination</p>
          </div>

          <div className="order-id">
            <h2>✅ Order Confirmed!</h2>
            <p style={{ margin: '10px 0 0 0', fontSize: '16px', color: '#0c4a6e' }}>
              Order ID: <strong>{orderId}</strong>
            </p>
          </div>

          <div className="section">
            <h3>👋 Hello {customerName}!</h3>
            <p>Thank you for your order! We've received your purchase and are processing it now. Here are your order details:</p>
          </div>

          <div className="section">
            <h3>📦 Order Items</h3>
            {items.map((item, index) => (
              <div key={index} className="item">
                <div>
                  <div className="item-name">{item.name}</div>
                  <div className="item-details">Quantity: {item.quantity}</div>
                </div>
                <div style={{ fontWeight: 'bold', color: '#059669' }}>
                  Rs {item.price.toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div className="total">
            <h3>💰 Total Amount</h3>
            <div className="total-amount">Rs {total.toLocaleString()}</div>
          </div>

          <div className="payment-info">
            <h4 style={{ margin: '0 0 10px 0', color: '#166534' }}>💳 Payment Information</h4>
            <p style={{ margin: 0, color: '#166534' }}>
              <strong>Payment Option:</strong> {paymentOption === 'full' ? 'Full Payment' : '10% Deposit'}
            </p>
            {paymentOption === 'deposit' && (
              <p style={{ margin: '10px 0 0 0', color: '#166534' }}>
                <strong>Deposit Amount:</strong> Rs {Math.max(1, Math.round(total * 0.10)).toLocaleString()}
              </p>
            )}
          </div>

          {receiptUrl && (
            <div className="receipt-section">
              <h4 style={{ margin: '0 0 10px 0', color: '#991b1b' }}>📄 Payment Receipt</h4>
              <p style={{ margin: '0 0 15px 0', color: '#991b1b' }}>
                Your payment receipt has been uploaded successfully.
              </p>
              <a href={receiptUrl} className="receipt-button" target="_blank" rel="noopener noreferrer">
                View Receipt
              </a>
            </div>
          )}

          <div className="contact-info">
            <h4>📞 Contact Information</h4>
            <div className="contact-item">
              <strong>Name:</strong> {customerName}
            </div>
            <div className="contact-item">
              <strong>Email:</strong> {customerEmail}
            </div>
            <div className="contact-item">
              <strong>Phone:</strong> {customerPhone}
            </div>
            <div className="contact-item">
              <strong>Address:</strong> {customerAddress}
            </div>
          </div>

          <div className="section">
            <h3>🚚 What's Next?</h3>
            <ul style={{ paddingLeft: '20px', color: '#374151' }}>
              <li>We'll review your order and payment</li>
              <li>You'll receive updates on your order status</li>
              <li>We'll contact you to arrange delivery or pickup</li>
              <li>Your gaming gear will be ready soon!</li>
            </ul>
          </div>

          <div className="footer">
            <p>Thank you for choosing DopeTech GMK!</p>
            <p>For any questions, please contact us at support@dopetech-nepal.com</p>
            <p style={{ marginTop: '20px', fontSize: '12px' }}>
              © 2024 DopeTech GMK. All rights reserved.
            </p>
          </div>
        </div>
      </body>
    </html>
  )
}
