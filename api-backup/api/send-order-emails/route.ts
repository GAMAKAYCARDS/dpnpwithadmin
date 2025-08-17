// Note: This API route won't work with static export
// For Netlify deployment, we need to use Netlify Functions instead
// This file is kept for development purposes only

import { NextRequest, NextResponse } from 'next/server'
import { emailService } from '@/lib/email-service'

interface OrderEmailData {
  orderId: string
  orderDbId: number
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
    image_url: string
  }>
  total: number
  paymentOption: 'full' | 'deposit'
  receiptUrl?: string | null
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ message: 'API route not available in static export' })
}
