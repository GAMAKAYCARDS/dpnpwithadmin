import React from 'react'

interface AdminOrderNotificationProps {
  orderId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  customerCity: string
  customerState: string
  customerZipCode: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  total: number
  paymentOption: string
  receiptUrl?: string | null
  orderDbId: number
}

export function AdminOrderNotification({
  orderId,
  customerName,
  customerEmail,
  customerPhone,
  customerAddress,
  customerCity,
  customerState,
  customerZipCode,
  items,
  total,
  paymentOption,
  receiptUrl,
  orderDbId
}: AdminOrderNotificationProps) {
  const depositAmount = paymentOption === 'deposit' ? Math.max(1, Math.round(total * 0.10)) : 0

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>New Order Alert - DopeTech GMK</title>
        <style>
          {`
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 700px;
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
              border-bottom: 3px solid #dc2626;
              padding-bottom: 20px;
            }
            .logo {
              font-size: 32px;
              font-weight: bold;
              color: #dc2626;
              margin-bottom: 10px;
            }
            .alert-badge {
              background-color: #dc2626;
              color: white;
              padding: 8px 16px;
              border-radius: 20px;
              font-size: 14px;
              font-weight: bold;
              display: inline-block;
              margin-bottom: 15px;
            }
            .order-id {
              background-color: #fef2f2;
              border: 2px solid #dc2626;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
              text-align: center;
            }
            .order-id h2 {
              margin: 0;
              color: #991b1b;
              font-size: 20px;
            }
            .section {
              margin: 25px 0;
            }
            .section h3 {
              color: #1f2937;
              border-bottom: 2px solid #e5e7eb;
              padding-bottom: 8px;
              margin-bottom: 15px;
              font-size: 18px;
            }
            .customer-info {
              background-color: #f0f9ff;
              border: 1px solid #0ea5e9;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
            }
            .customer-info h4 {
              margin: 0 0 15px 0;
              color: #0c4a6e;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
            }
            .info-item {
              margin: 8px 0;
            }
            .info-label {
              font-weight: 600;
              color: #374151;
            }
            .info-value {
              color: #6b7280;
            }
            .item {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 15px;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              margin: 10px 0;
              background-color: #f9fafb;
            }
            .item-name {
              font-weight: 600;
              color: #1f2937;
            }
            .item-details {
              color: #6b7280;
              font-size: 14px;
              margin-top: 5px;
            }
            .item-price {
              font-weight: bold;
              color: #059669;
              font-size: 16px;
            }
            .total-section {
              background-color: #fef3c7;
              border: 2px solid #f59e0b;
              border-radius: 8px;
              padding: 25px;
              margin: 25px 0;
              text-align: center;
            }
            .total-amount {
              font-size: 28px;
              font-weight: bold;
              color: #d97706;
              margin: 10px 0;
            }
            .payment-details {
              background-color: #f0fdf4;
              border: 1px solid #22c55e;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
            }
            .payment-details h4 {
              margin: 0 0 15px 0;
              color: #166534;
            }
            .receipt-section {
              background-color: #fef2f2;
              border: 1px solid #ef4444;
              border-radius: 8px;
              padding: 20px;
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
            .action-buttons {
              text-align: center;
              margin: 30px 0;
            }
            .action-button {
              display: inline-block;
              padding: 12px 24px;
              margin: 0 10px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 500;
              font-size: 14px;
            }
            .primary-button {
              background-color: #2563eb;
              color: white;
            }
            .secondary-button {
              background-color: #6b7280;
              color: white;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid #f0f0f0;
              color: #6b7280;
              font-size: 14px;
            }
            .urgent-note {
              background-color: #fef2f2;
              border: 2px solid #ef4444;
              border-radius: 8px;
              padding: 15px;
              margin: 20px 0;
              text-align: center;
            }
            .urgent-note h4 {
              margin: 0 0 10px 0;
              color: #991b1b;
            }
          `}
        </style>
      </head>
      <body>
        <div className="container">
          <div className="header">
            <div className="logo">🎮 DopeTech GMK</div>
            <div className="alert-badge">🚨 NEW ORDER ALERT</div>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '16px' }}>Admin Notification</p>
          </div>

          <div className="order-id">
            <h2>🆕 New Order Received!</h2>
            <p style={{ margin: '10px 0 0 0', fontSize: '18px', color: '#991b1b' }}>
              Order ID: <strong>{orderId}</strong>
            </p>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#6b7280' }}>
              Database ID: {orderDbId}
            </p>
          </div>

          <div className="urgent-note">
            <h4>⚠️ Action Required</h4>
            <p style={{ margin: 0, color: '#991b1b' }}>
              A new order has been placed. Please review the details and take appropriate action.
            </p>
          </div>

          <div className="section">
            <h3>👤 Customer Information</h3>
            <div className="customer-info">
              <h4>Contact Details</h4>
              <div className="info-grid">
                <div className="info-item">
                  <div className="info-label">Name:</div>
                  <div className="info-value">{customerName}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Email:</div>
                  <div className="info-value">{customerEmail}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Phone:</div>
                  <div className="info-value">{customerPhone}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">City:</div>
                  <div className="info-value">{customerCity}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">State:</div>
                  <div className="info-value">{customerState}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">ZIP Code:</div>
                  <div className="info-value">{customerZipCode}</div>
                </div>
              </div>
              <div style={{ marginTop: '15px' }}>
                <div className="info-label">Full Address:</div>
                <div className="info-value">{customerAddress}</div>
              </div>
            </div>
          </div>

          <div className="section">
            <h3>📦 Order Items</h3>
            {items.map((item, index) => (
              <div key={index} className="item">
                <div>
                  <div className="item-name">{item.name}</div>
                  <div className="item-details">Quantity: {item.quantity}</div>
                </div>
                <div className="item-price">
                  Rs {item.price.toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div className="total-section">
            <h3 style={{ margin: '0 0 15px 0', color: '#92400e' }}>💰 Order Summary</h3>
            <div className="total-amount">Rs {total.toLocaleString()}</div>
            <p style={{ margin: '10px 0 0 0', color: '#92400e' }}>
              Total Order Value
            </p>
          </div>

          <div className="payment-details">
            <h4>💳 Payment Information</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <div className="info-label">Payment Option:</div>
                <div className="info-value">
                  {paymentOption === 'full' ? 'Full Payment' : '10% Deposit'}
                </div>
              </div>
              {paymentOption === 'deposit' && (
                <div>
                  <div className="info-label">Deposit Amount:</div>
                  <div className="info-value" style={{ color: '#059669', fontWeight: 'bold' }}>
                    Rs {depositAmount.toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          </div>

          {receiptUrl && (
            <div className="receipt-section">
              <h4 style={{ margin: '0 0 10px 0', color: '#991b1b' }}>📄 Payment Receipt</h4>
              <p style={{ margin: '0 0 15px 0', color: '#991b1b' }}>
                Customer has uploaded a payment receipt.
              </p>
              <a href={receiptUrl} className="receipt-button" target="_blank" rel="noopener noreferrer">
                View Receipt
              </a>
            </div>
          )}

          <div className="action-buttons">
            <a href={`mailto:${customerEmail}?subject=Order ${orderId} - DopeTech GMK`} className="action-button primary-button">
              📧 Email Customer
            </a>
            <a href={`tel:${customerPhone}`} className="action-button secondary-button">
              📞 Call Customer
            </a>
          </div>

          <div className="section">
            <h3>📋 Next Steps</h3>
            <ul style={{ paddingLeft: '20px', color: '#374151' }}>
              <li>Review the order details and payment</li>
              <li>Contact customer to confirm order</li>
              <li>Arrange delivery or pickup</li>
              <li>Update order status in admin panel</li>
              <li>Process payment verification</li>
            </ul>
          </div>

          <div className="footer">
            <p>This is an automated notification from DopeTech GMK</p>
            <p>Order received at: {new Date().toLocaleString()}</p>
            <p style={{ marginTop: '20px', fontSize: '12px' }}>
              © 2024 DopeTech GMK. All rights reserved.
            </p>
          </div>
        </div>
      </body>
    </html>
  )
}
