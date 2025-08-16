import { NextResponse } from 'next/server'

export async function GET() {
  console.log('🔄 Test API route called')
  return NextResponse.json({
    success: true,
    message: 'Test API route is working',
    timestamp: new Date().toISOString()
  })
}
