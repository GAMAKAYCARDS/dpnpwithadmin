"use client"

import { useState, useRef, useEffect } from "react"
import { X, Truck, Lock, CheckCircle, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  cart: CartItem[]
  total: number
  onCartReset: () => void
}

export default function GoogleFormsCheckout({ isOpen, onClose, cart, total, onCartReset }: CheckoutModalProps) {
  const [shouldRender, setShouldRender] = useState(isOpen)
  const [isClosing, setIsClosing] = useState(false)
  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    zipCode: '',
    fullAddress: '',
  })
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [orderConfirmed, setOrderConfirmed] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [currentStep, setCurrentStep] = useState<'customer-info' | 'payment' | 'confirmation'>('customer-info')
  const [paymentOption, setPaymentOption] = useState<'full' | 'deposit'>('full')
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [receiptFileName, setReceiptFileName] = useState('')
  const [isUploadingReceipt, setIsUploadingReceipt] = useState(false)
  const [isCartCollapsed, setIsCartCollapsed] = useState(false)
  
  // Auto-collapse cart on mobile for better UX
  useEffect(() => {
    const isMobile = window.innerWidth < 1024 // lg breakpoint
    if (isMobile) {
      setIsCartCollapsed(true)
    }
  }, [])

  // API endpoint for checkout
  const CHECKOUT_API_URL = '/api/checkout'

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
      setIsClosing(false)
      return
    }
    setIsClosing(true)
    const timeout = setTimeout(() => {
      setShouldRender(false)
      setIsClosing(false)
    }, 220)
    return () => clearTimeout(timeout)
  }, [isOpen])

  const NEPAL_PHONE_REGEX = /^\+977\d{8,10}$/

  const handleCustomerInfoChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePhoneChange = (rawValue: string) => {
    const digitsOnly = rawValue.replace(/\D/g, '')
    let localPart = digitsOnly
    if (localPart.startsWith('977')) {
      localPart = localPart.slice(3)
    }
    localPart = localPart.slice(0, 10)
    const fullNumber = `+977${localPart}`
    handleCustomerInfoChange('phone', fullNumber)
  }

  const isCustomerInfoValid = () => {
    return (
      customerInfo.fullName.trim().length > 0 &&
      customerInfo.email.trim().length > 0 &&
      NEPAL_PHONE_REGEX.test(customerInfo.phone) &&
      customerInfo.fullAddress.trim().length > 0 &&
      termsAccepted
    )
  }

  const isPaymentValid = () => {
    // Make receipt upload optional - user can submit without it
    return true
  }

  const shippingCost = 5 // Fixed delivery cost
  const finalTotal = total + shippingCost
  const depositAmount = Math.round(finalTotal * 0.1) // 10% deposit
  const paymentAmount = paymentOption === 'full' ? finalTotal : depositAmount

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setReceiptFile(file)
      setReceiptFileName(file.name)
    }
  }

  const handleNextStep = () => {
    if (currentStep === 'customer-info' && isCustomerInfoValid()) {
      setCurrentStep('payment')
    }
  }

  const handleBackStep = () => {
    if (currentStep === 'payment') {
      setCurrentStep('customer-info')
    }
  }

  const uploadReceiptToDrive = async (file: File): Promise<string | null> => {
    try {
      setIsUploadingReceipt(true)
      
      console.log('Processing receipt file:', file.name)
      
      // Convert file to base64 for API submission
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => {
          const dataUrl = reader.result as string
          console.log('Receipt processed, base64 data created')
          resolve(dataUrl)
        }
        reader.readAsDataURL(file)
      })
    } catch (error) {
      console.error('Error processing receipt:', error)
      return null
    } finally {
      setIsUploadingReceipt(false)
    }
  }

  const submitToCheckoutAPI = async () => {
    try {
      // Generate order ID
      const generatedOrderId = `DTP-${Math.floor(100000 + Math.random()*900000)}`
      setOrderId(generatedOrderId)
      
      // Process receipt file if provided
      let receiptFileData = null
      if (receiptFile) {
        receiptFileData = await uploadReceiptToDrive(receiptFile)
      }
      
      // Prepare checkout data
      const checkoutData = {
        orderId: generatedOrderId,
        customerInfo,
        cart,
        total: finalTotal,
        paymentOption,
        receiptFile: receiptFileData,
        receiptFileName: receiptFileName
      }

      console.log('📤 Submitting to checkout API:', {
        orderId: generatedOrderId,
        customerName: customerInfo.fullName,
        total: finalTotal,
        hasReceipt: !!receiptFileData
      })

      // Submit to API
      const response = await fetch(CHECKOUT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutData)
      })

      const result = await response.json()

      if (response.ok) {
        console.log('✅ Order submitted successfully!')
        console.log('📋 API Response:', result)
        return true
      } else {
        console.error('❌ Order submission failed:', result)
        return false
      }
    } catch (error) {
      console.error('Error submitting to checkout API:', error)
      return false
    }
  }

  const handleSubmitOrder = async () => {
    console.log('Current step:', currentStep)
    
    if (currentStep === 'customer-info') {
      if (!isCustomerInfoValid()) {
        console.log('Customer info not valid')
        return
      }
      console.log('Advancing to payment step')
      setCurrentStep('payment')
      return
    }
    
         if (currentStep === 'payment') {
       // Receipt upload is now optional
       console.log('Proceeding with order submission...')

      try {
        console.log('Starting checkout API submission...')
        const success = await submitToCheckoutAPI()
        
                 if (success) {
           console.log('Checkout API submission successful!')
           setCurrentStep('confirmation')
           setOrderConfirmed(true)
           
           // Show success message
           console.log('✅ Order submitted successfully!')
           console.log('📋 Check your Google Sheets and Google Drive for the order details')
           
           // Show success alert
           alert('✅ Order submitted successfully! Check your Google Sheets and Google Drive for the order details.')
         } else {
           console.error('Checkout API submission failed')
           alert('❌ Order submission failed! Check browser console for details and try again.')
         }
             } catch (error) {
         console.error('Error submitting order:', error)
         alert('❌ Error submitting order! Check browser console for details and try again.')
       }
    }
  }

  const handleContinueShopping = () => {
    // Reset all checkout states
    setOrderConfirmed(false)
    setOrderId('')
    setCurrentStep('customer-info')
    setPaymentOption('full')
    setReceiptFile(null)
    setReceiptFileName('')
    setIsUploadingReceipt(false)
    setCustomerInfo({
      fullName: '',
      email: '',
      phone: '',
      city: '',
      state: '',
      zipCode: '',
      fullAddress: '',
    })
    setTermsAccepted(false)
    
    // Reset cart and close modal
    onCartReset()
    onClose()
  }

  if (!shouldRender) return null

  // Order Confirmation Screen
  if (orderConfirmed) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-white/20 gradient-bg">
          <div className="p-6 text-center">
            {/* Animated Checkmark */}
            <div className="mb-4 flex justify-center">
              <div className="relative">
                <div className="w-16 h-16 bg-[#F7DD0F] rounded-full flex items-center justify-center animate-pulse">
                  <CheckCircle className="w-10 h-10 text-black animate-bounce" />
                </div>
                <div className="absolute inset-0 w-16 h-16 bg-[#F7DD0F] rounded-full animate-ping opacity-20"></div>
              </div>
            </div>

            {/* Success Message */}
            <h2 className="text-xl font-bold text-white mb-3">Order Confirmed!</h2>
            <p className="text-gray-300 mb-4 text-sm">
              Thank you for your order. We've received your request and will process it shortly.
            </p>

            {/* Order Details */}
            <div className="bg-white/5 rounded-lg p-3 mb-4 border border-white/10">
              <div className="text-xs text-gray-300 mb-1">Order ID</div>
              <div className="text-base font-semibold text-[#F7DD0F]">{orderId}</div>
            </div>

            {/* Order Summary */}
            <div className="bg-white/5 rounded-lg p-3 mb-4 border border-white/10 text-left">
              <h3 className="text-white font-semibold mb-2 text-sm">Order Summary</h3>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-300">Items:</span>
                  <span className="text-white">{cart.length} products</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Total:</span>
                  <span className="text-[#F7DD0F] font-semibold">Rs {finalTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Delivery to:</span>
                  <span className="text-white text-right">{customerInfo.fullName}</span>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-[#F7DD0F]/10 rounded-lg p-3 mb-4 border border-[#F7DD0F]/20">
              <h4 className="text-[#F7DD0F] font-semibold mb-2 text-sm">What's Next?</h4>
              <ul className="text-xs text-gray-300 space-y-1 text-left">
                <li>• We'll contact you within 24 hours</li>
                <li>• Delivery in 2-3 business days</li>
                <li>• Updates via email and phone</li>
              </ul>
            </div>

            {/* Close Button */}
            <Button 
              onClick={handleContinueShopping}
              className="w-full bg-[#F7DD0F] hover:bg-[#F7DD0F]/90 text-black py-2 rounded-lg font-semibold text-base animate-scale-in premium-transition active:scale-95"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Main Modal Container
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden border border-white/20 gradient-bg">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/20 bg-white/10 backdrop-blur-sm">
          <div className="flex items-center space-x-3 md:space-x-4">
            <img src="/logo/dopelogo.svg" alt="DopeTech" className="h-6 md:h-8 w-auto" />
            <span className="text-base md:text-lg font-semibold text-[#F7DD0F]">
              {currentStep === 'customer-info' ? 'Checkout' : 'Payment'}
            </span>
            <span className="text-sm text-gray-400">
              Step {currentStep === 'customer-info' ? '1' : '2'} of 2
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white active:scale-95"
          >
            <X className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row h-[calc(95vh-80px)]">
          {/* Left Column */}
          <div className="flex-1 p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-white/20 overflow-y-auto">
            {currentStep === 'customer-info' ? (
              // Customer Information Form
              <div className="space-y-6 md:space-y-8">
                <div>
                  <h2 className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6">Shipping Information</h2>
                  
                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="md:col-span-2">
                      <label htmlFor="fullName" className="block text-base font-medium text-gray-300 mb-2">
                        Full name *
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        value={customerInfo.fullName}
                        onChange={(e) => handleCustomerInfoChange('fullName', e.target.value)}
                        className="w-full px-4 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-[#F7DD0F] focus:border-transparent bg-white/5 text-white placeholder-gray-400 backdrop-blur-sm text-base md:text-lg"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="email" className="block text-base font-medium text-gray-300 mb-2">
                        Email address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={customerInfo.email}
                        onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                        className="w-full px-4 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-[#F7DD0F] focus:border-transparent bg-white/5 text-white placeholder-gray-400 backdrop-blur-sm text-base md:text-lg"
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="phone" className="block text-base font-medium text-gray-300 mb-2">
                        Phone number (Nepal only) *
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                          <span className="text-base">🇳🇵</span>
                          <span className="text-gray-400">+977</span>
                        </div>
                        <input
                          type="tel"
                          id="phone"
                          value={customerInfo.phone.replace(/^\+977/, '')}
                          onChange={(e) => handlePhoneChange(e.target.value)}
                          className="w-full pl-32 pr-4 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-[#F7DD0F] focus:border-transparent bg-white/5 text-white placeholder-gray-400 backdrop-blur-sm text-base md:text-lg"
                          placeholder="98XXXXXXXX"
                          required
                        />
                        {!NEPAL_PHONE_REGEX.test(customerInfo.phone) && customerInfo.phone.length > 0 && (
                          <p className="mt-2 text-sm text-red-400">Enter a valid Nepal number starting with +977.</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="city" className="block text-base font-medium text-gray-300 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        value={customerInfo.city}
                        onChange={(e) => handleCustomerInfoChange('city', e.target.value)}
                        className="w-full px-4 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-[#F7DD0F] focus:border-transparent bg-white/5 text-white placeholder-gray-400 backdrop-blur-sm text-base md:text-lg"
                        placeholder="Enter city"
                      />
                    </div>

                    <div>
                      <label htmlFor="state" className="block text-base font-medium text-gray-300 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        id="state"
                        value={customerInfo.state}
                        onChange={(e) => handleCustomerInfoChange('state', e.target.value)}
                        className="w-full px-4 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-[#F7DD0F] focus:border-transparent bg-white/5 text-white placeholder-gray-400 backdrop-blur-sm text-base md:text-lg"
                        placeholder="Enter state"
                      />
                    </div>

                    <div>
                      <label htmlFor="zipCode" className="block text-base font-medium text-gray-300 mb-2">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        value={customerInfo.zipCode}
                        onChange={(e) => handleCustomerInfoChange('zipCode', e.target.value)}
                        className="w-full px-4 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-[#F7DD0F] focus:border-transparent bg-white/5 text-white placeholder-gray-400 backdrop-blur-sm text-base md:text-lg"
                        placeholder="Enter ZIP code"
                      />
                    </div>
                  </div>

                  {/* Full Address */}
                  <div className="mt-6 md:mt-8">
                    <label htmlFor="fullAddress" className="block text-base font-medium text-gray-300 mb-2">
                      Full Address *
                    </label>
                    <textarea
                      id="fullAddress"
                      value={customerInfo.fullAddress}
                      onChange={(e) => handleCustomerInfoChange('fullAddress', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-white/20 rounded-lg focus:ring-2 focus:ring-[#F7DD0F] focus:border-transparent bg-white/5 text-white placeholder-gray-400 resize-none backdrop-blur-sm text-base md:text-lg"
                      placeholder="Enter your complete address"
                      required
                    />
                  </div>

                  {/* Terms and Conditions */}
                  <div className="mt-6 md:mt-8">
                    <label className="flex items-start space-x-4">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="mt-1 w-5 h-5 text-[#F7DD0F] border-white/30 rounded focus:ring-[#F7DD0F] bg-white/5"
                      />
                      <span className="text-base text-gray-300">
                        I have read and agree to the Terms and Conditions.
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            ) : (
              // Payment Screen
              <div className="space-y-6 md:space-y-8">
                {/* Payment Options */}
                <div>
                  <h2 className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6">Payment Options</h2>
                  
                  <div className="space-y-4">
                    <label className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                      <input
                        type="radio"
                        name="paymentOption"
                        value="full"
                        checked={paymentOption === 'full'}
                        onChange={(e) => setPaymentOption(e.target.value as 'full' | 'deposit')}
                        className="w-5 h-5 text-[#F7DD0F] border-white/30 rounded focus:ring-[#F7DD0F] bg-white/5"
                      />
                      <div className="flex-1">
                        <div className="text-white font-semibold">Pay in Full</div>
                        <div className="text-gray-300 text-sm">Pay the complete amount now</div>
                        <div className="text-[#F7DD0F] font-bold text-lg">Rs {finalTotal.toLocaleString()}</div>
                      </div>
                    </label>

                    <label className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                      <input
                        type="radio"
                        name="paymentOption"
                        value="deposit"
                        checked={paymentOption === 'deposit'}
                        onChange={(e) => setPaymentOption(e.target.value as 'full' | 'deposit')}
                        className="w-5 h-5 text-[#F7DD0F] border-white/30 rounded focus:ring-[#F7DD0F] bg-white/5"
                      />
                      <div className="flex-1">
                        <div className="text-white font-semibold">Pay 10% Deposit</div>
                        <div className="text-gray-300 text-sm">Pay 10% now, rest on delivery</div>
                        <div className="text-[#F7DD0F] font-bold text-lg">Rs {depositAmount.toLocaleString()}</div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* QR Code Section */}
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-white mb-4">Scan QR Code to Pay</h3>
                  <div className="bg-white/5 rounded-lg p-6 border border-white/10 text-center">
                    <div className="w-48 h-48 mx-auto bg-white rounded-lg p-4 mb-4">
                      {/* Placeholder QR Code - Replace with actual QR code */}
                      <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-500 text-sm">QR Code Here</span>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">Scan this QR code with your payment app</p>
                    <p className="text-[#F7DD0F] font-semibold">Amount: Rs {paymentAmount.toLocaleString()}</p>
                  </div>
                </div>

                                 {/* Receipt Upload */}
                 <div>
                   <h3 className="text-base md:text-lg font-semibold text-white mb-4">Upload Payment Receipt (Optional)</h3>
                   <div className="space-y-4">
                     <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-[#F7DD0F] transition-colors">
                       <input
                         type="file"
                         accept="image/*,.pdf"
                         onChange={handleFileChange}
                         className="hidden"
                         id="receipt-upload"
                       />
                       <label htmlFor="receipt-upload" className="cursor-pointer">
                         <div className="text-[#F7DD0F] mb-2">
                           <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                           </svg>
                         </div>
                         <p className="text-white font-medium">Click to upload receipt (optional)</p>
                         <p className="text-gray-400 text-sm">PNG, JPG, PDF up to 5MB</p>
                       </label>
                     </div>
                     
                     {receiptFileName && (
                       <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3">
                         <p className="text-green-300 text-sm">✓ {receiptFileName}</p>
                         {isUploadingReceipt && (
                           <div className="mt-2 flex items-center space-x-2">
                             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-300"></div>
                             <span className="text-green-300 text-xs">Processing receipt...</span>
                           </div>
                         )}
                       </div>
                     )}
                   </div>
                 </div>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="w-full lg:w-96 p-4 md:p-6 bg-white/5 backdrop-blur-sm border-t lg:border-t-0 lg:border-l border-white/20 overflow-y-auto">
            <div className="mb-4 md:mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-base md:text-lg font-semibold text-white">
                  {currentStep === 'customer-info' ? 'Review your cart' : 'Order Summary'}
                </h2>
                {currentStep === 'customer-info' && (
                  <button
                    onClick={() => setIsCartCollapsed(!isCartCollapsed)}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                  >
                    <ChevronDown 
                      className={`w-5 h-5 text-white transition-transform duration-200 ${
                        isCartCollapsed ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                )}
              </div>
            </div>

            {/* Products - Collapsible */}
            {!isCartCollapsed && (
              <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10 backdrop-blur-sm">
                    <img src={item.image} alt={item.name} className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-lg" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white text-sm md:text-base truncate">{item.name}</h3>
                      <p className="text-sm text-gray-300">{item.quantity}x</p>
                    </div>
                    <span className="font-semibold text-[#F7DD0F] text-sm md:text-base">Rs {item.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Price Summary */}
            <div className="space-y-3 mb-4 md:mb-6 p-3 md:p-4 bg-white/5 rounded-lg border border-white/10 backdrop-blur-sm">
              <div className="flex justify-between">
                <span className="text-gray-300 text-sm md:text-base">Subtotal</span>
                <span className="font-medium text-white text-sm md:text-base">Rs {total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300 text-sm md:text-base">Shipping</span>
                <span className="font-medium text-white text-sm md:text-base">Rs {shippingCost.toLocaleString()}</span>
              </div>
              <div className="border-t border-white/20 pt-3">
                <div className="flex justify-between">
                  <span className="text-base md:text-lg font-semibold text-white">Total</span>
                  <span className="text-base md:text-lg font-bold text-[#F7DD0F]">Rs {finalTotal.toLocaleString()}</span>
                </div>
                {currentStep === 'payment' && paymentOption === 'deposit' && (
                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-gray-300">Deposit (10%)</span>
                    <span className="text-sm font-semibold text-[#F7DD0F]">Rs {depositAmount.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {currentStep === 'payment' && (
                <Button 
                  onClick={handleBackStep}
                  className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg font-semibold text-base md:text-lg border border-white/20"
                >
                  Back to Details
                </Button>
              )}
              
                             <Button 
                 className="w-full bg-[#F7DD0F] hover:bg-[#F7DD0F]/90 text-black py-3 rounded-lg font-semibold text-base md:text-lg disabled:opacity-50 disabled:cursor-not-allowed animate-scale-in premium-transition active:scale-95"
                 disabled={currentStep === 'customer-info' ? !isCustomerInfoValid() : false}
                 onClick={handleSubmitOrder}
               >
                 {currentStep === 'customer-info' ? 'Continue to Payment' : 'Submit Order'}
               </Button>
            </div>

                                       {/* Security Message */}
              <div className="mt-4 text-center p-3 bg-white/5 rounded-lg border border-white/10 backdrop-blur-sm">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Lock className="w-4 h-4 text-[#F7DD0F]" />
                  <span className="text-sm font-medium text-white">
                    {currentStep === 'customer-info' ? 'Secure Checkout - SSL Encrypted' : 'Secure Payment - SSL Encrypted'}
                  </span>
                </div>
                <p className="text-xs text-gray-300">
                  {currentStep === 'customer-info' 
                    ? 'Your order data will be securely processed and confirmed.'
                    : 'Your payment and order data will be securely processed.'
                  }
                </p>
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}
