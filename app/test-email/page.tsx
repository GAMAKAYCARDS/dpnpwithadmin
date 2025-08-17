'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Mail, CheckCircle, XCircle } from 'lucide-react'

export default function TestEmailPage() {
  const [adminEmail, setAdminEmail] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const testEmailService = async () => {
    setIsLoading(true)
    setError(null)
    setResults(null)

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testType: 'service'
        })
      })

      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError('Failed to test email service')
      console.error('Test error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const testOrderEmails = async () => {
    if (!adminEmail) {
      setError('Please enter an admin email address')
      return
    }

    setIsLoading(true)
    setError(null)
    setResults(null)

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testType: 'order',
          adminEmail,
          customerEmail: customerEmail || adminEmail // Use customer email if provided, otherwise use admin email
        })
      })

      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError('Failed to test order emails')
      console.error('Test error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">🧪 Email Service Test</h1>
          <p className="text-gray-600">
            Test the email functionality for DopeTech GMK orders
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Configuration Test
            </CardTitle>
            <CardDescription>
              Test if the email service is properly configured
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={testEmailService} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : (
                'Test Email Service'
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Order Email Test
            </CardTitle>
            <CardDescription>
              Test customer confirmation and admin notification emails
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="adminEmail" className="block text-sm font-medium mb-2">
                Admin Email Address
              </label>
              <Input
                id="adminEmail"
                type="email"
                placeholder="admin@example.com"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="customerEmail" className="block text-sm font-medium mb-2">
                Customer Email Address (Optional - will use admin email if not provided)
              </label>
              <Input
                id="customerEmail"
                type="email"
                placeholder="customer@example.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
              />
            </div>
            <Button 
              onClick={testOrderEmails} 
              disabled={isLoading || !adminEmail}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Test Emails...
                </>
              ) : (
                'Send Test Order Emails'
              )}
            </Button>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {results && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Test Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
                {JSON.stringify(results, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>📋 Setup Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">1. Get Resend API Key</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                <li>Sign up at <a href="https://resend.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">resend.com</a></li>
                <li>Create a new API key</li>
                <li>Add your domain (e.g., dopetech-nepal.com)</li>
              </ol>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">2. Configure Environment Variables</h4>
              <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                RESEND_API_KEY=your_resend_api_key_here<br/>
                ADMIN_EMAIL=your_admin_email@example.com
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">3. Test the Service</h4>
              <p className="text-sm text-gray-600">
                Use the buttons above to test the email functionality. 
                Make sure to add a valid admin email address for testing order emails.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
