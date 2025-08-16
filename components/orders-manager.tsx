"use client"

import React, { useState, useEffect } from "react"
import { 
  ShoppingCart, 
  Eye, 
  Download, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Package,
  Search,
  Filter,
  RefreshCw,
  Loader2,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  ExternalLink,
  X
} from "lucide-react"
import { supabase } from "@/lib/supabase"

interface OrderItem {
  id: number
  order_id: number
  product_id: number
  quantity: number
  price: number
  created_at: string
  product_name?: string
  product_image?: string
}

interface Order {
  id: number
  order_id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_city: string
  customer_state: string
  customer_zip_code: string
  customer_address: string
  total_amount: number
  payment_option: string
  payment_status: string
  order_status: string
  receipt_url: string | null
  receipt_file_name: string | null
  created_at: string
  updated_at: string
  order_items?: OrderItem[]
}

export function OrdersManager() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false)

  // Load orders from API route
  const loadOrders = async () => {
    try {
      setLoading(true)
      console.log('🔄 Loading orders via API...')
      
      // Fetch orders with order items from API route
      const response = await fetch('/api/orders')
      
      if (!response.ok) {
        console.error('❌ Error fetching orders:', response.statusText)
        return
      }

      const responseData = await response.json()
      console.log('📊 Raw API response:', responseData)
      
      const { orders: ordersWithItems } = responseData

      console.log('✅ All orders loaded successfully:', ordersWithItems.length)
      console.log('📊 Sample order data:', ordersWithItems[0])
      console.log('📦 Sample order items:', ordersWithItems[0]?.order_items)
      setOrders(ordersWithItems)
    } catch (error) {
      console.error('❌ Error loading orders:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log('🚀 OrdersManager component mounted, loading orders...')
    loadOrders()
  }, [])

  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_phone.includes(searchTerm)
    
    const matchesStatus = statusFilter === "all" || order.order_status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleViewOrder = (order: Order) => {
    console.log('👁️ Viewing order:', order)
    console.log('📦 Order items:', order.order_items)
    setSelectedOrder(order)
    setOrderDetailsOpen(true)
  }

  const handleDownloadReceipt = (receiptUrl: string, fileName: string) => {
    const link = document.createElement('a')
    link.href = receiptUrl
    link.download = fileName || 'receipt'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  console.log('🔄 OrdersManager render - loading:', loading, 'orders count:', orders.length)
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#F7DD0F] mx-auto mb-4" />
          <p className="text-gray-400">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#F7DD0F]/20 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-[#F7DD0F]" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gradient">Orders Management</h2>
              <p className="text-gray-400">View and manage all customer orders</p>
            </div>
          </div>
          <button
            onClick={loadOrders}
            disabled={loading}
            className="flex items-center space-x-3 px-6 py-3 glass hover:bg-white/15 hover:scale-105 transition-all duration-300 text-white focus-ring disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 text-[#F7DD0F] ${loading ? 'animate-spin' : ''}`} />
            <span className="font-semibold">Refresh</span>
          </button>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search orders by ID, customer name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-glass pl-12 pr-4 w-full"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-glass px-4 py-3"
          >
            <option value="all">All Status</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <div className="flex items-center space-x-3 px-4 py-2 glass rounded-xl">
            <Package className="w-5 h-5 text-[#F7DD0F]" />
            <span className="text-gray-200 font-semibold">{filteredOrders.length} Orders</span>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No orders found</h3>
            <p className="text-gray-500">Try adjusting your search or status filters</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="card-elevated p-6 hover:bg-white/5 transition-all duration-300 cursor-pointer"
              onClick={() => handleViewOrder(order)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-[#F7DD0F]/20 rounded-xl flex items-center justify-center">
                      <ShoppingCart className="w-6 h-6 text-[#F7DD0F]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{order.order_id}</h3>
                      <p className="text-sm text-gray-400">{order.customer_name}</p>
                    </div>
                  </div>
                  
                  <div className="hidden md:flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">{order.customer_email}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">{order.customer_phone}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-[#F7DD0F] font-semibold">Rs {order.total_amount}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.order_status)}`}>
                      {order.order_status}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColor(order.payment_status)}`}>
                      {order.payment_status}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <p className="text-sm text-gray-400">{formatDate(order.created_at)}</p>
                      <p className="text-xs text-gray-500">{order.order_items?.length || 0} items</p>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleViewOrder(order)
                      }}
                      className="p-2 bg-[#F7DD0F]/20 hover:bg-[#F7DD0F]/30 rounded-lg transition-all duration-300 text-[#F7DD0F] hover:scale-110 focus-ring"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Order Details Modal */}
      {orderDetailsOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="card-elevated p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#F7DD0F]/20 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-[#F7DD0F]" />
                </div>
                <h2 className="text-3xl font-bold text-gradient">Order Details</h2>
              </div>
              <button
                onClick={() => setOrderDetailsOpen(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 focus-ring"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-8">
              {/* Order Header */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Order Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Order ID:</span>
                        <span className="text-white font-mono">{selectedOrder.order_id}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Date:</span>
                        <span className="text-white">{formatDate(selectedOrder.created_at)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Total Amount:</span>
                        <span className="text-[#F7DD0F] font-bold text-lg">Rs {selectedOrder.total_amount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Payment Option:</span>
                        <span className="text-white capitalize">{selectedOrder.payment_option}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Status</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Order Status:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedOrder.order_status)}`}>
                          {selectedOrder.order_status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Payment Status:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPaymentStatusColor(selectedOrder.payment_status)}`}>
                          {selectedOrder.payment_status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Customer Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-white">{selectedOrder.customer_name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-white">{selectedOrder.customer_email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-white">{selectedOrder.customer_phone}</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                      <div className="text-white">
                        <p>{selectedOrder.customer_address}</p>
                        <p className="text-sm text-gray-400">
                          {selectedOrder.customer_city}, {selectedOrder.customer_state} {selectedOrder.customer_zip_code}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.order_items && selectedOrder.order_items.length > 0 ? (
                    selectedOrder.order_items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg border border-white/10"
                      >
                        <img
                          src={item.product_image || '/placeholder-product.svg'}
                          alt={item.product_name}
                          className="w-16 h-16 rounded-lg object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = '/placeholder-product.svg'
                          }}
                        />
                        <div className="flex-1">
                          <h4 className="text-white font-medium">{item.product_name}</h4>
                          <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[#F7DD0F] font-semibold">Rs {item.price}</p>
                          <p className="text-sm text-gray-400">Total: Rs {item.price * item.quantity}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">No order items found</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Receipt Section */}
              {(selectedOrder.receipt_url || selectedOrder.receipt_file_name) && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Payment Receipt</h3>
                  <div className="space-y-4">
                    {/* Receipt Image Preview */}
                    <div className="bg-white/5 rounded-lg border border-white/10 p-4">
                      <div className="flex items-center space-x-4 mb-4">
                        <FileText className="w-8 h-8 text-[#F7DD0F]" />
                        <div className="flex-1">
                          <p className="text-white font-medium">
                            {selectedOrder.receipt_file_name || 'Receipt'}
                          </p>
                          <p className="text-sm text-gray-400">Payment proof uploaded by customer</p>
                          {selectedOrder.receipt_url && (
                            <p className="text-xs text-gray-500 mt-1">URL: {selectedOrder.receipt_url}</p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          {selectedOrder.receipt_url ? (
                            <>
                              <button
                                onClick={() => window.open(selectedOrder.receipt_url!, '_blank')}
                                className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-all duration-300 text-blue-400 hover:scale-110 focus-ring"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDownloadReceipt(selectedOrder.receipt_url!, selectedOrder.receipt_file_name || 'receipt')}
                                className="p-2 bg-[#F7DD0F]/20 hover:bg-[#F7DD0F]/30 rounded-lg transition-all duration-300 text-[#F7DD0F] hover:scale-110 focus-ring"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <div className="text-xs text-gray-400 px-2 py-1 bg-gray-700/50 rounded">
                              File uploaded but URL not available
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Receipt Image Display */}
                      <div className="flex justify-center">
                        {selectedOrder.receipt_url ? (
                          <img
                            src={selectedOrder.receipt_url}
                            alt="Payment Receipt"
                            className="max-w-full max-h-96 rounded-lg border border-white/20"
                            onLoad={() => console.log('✅ Receipt image loaded successfully:', selectedOrder.receipt_url)}
                            onError={(e) => {
                              console.error('❌ Receipt image failed to load:', selectedOrder.receipt_url)
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                              // Show fallback message
                              const parent = target.parentElement
                              if (parent) {
                                parent.innerHTML = `
                                  <div class="text-center py-8">
                                    <FileText class="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p class="text-gray-400">Receipt image not available</p>
                                    <p class="text-sm text-gray-500 mt-2">File: ${selectedOrder.receipt_file_name}</p>
                                    <p class="text-sm text-gray-500 mt-2">The receipt was uploaded but the image is not accessible</p>
                                  </div>
                                `
                              }
                            }}
                          />
                        ) : (
                          <div className="text-center py-8">
                            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-400">Receipt uploaded but not accessible</p>
                            <p className="text-sm text-gray-500 mt-2">File: {selectedOrder.receipt_file_name}</p>
                            <p className="text-sm text-gray-500 mt-2">The receipt file was uploaded but the URL is not available</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-white/10">
                <button
                  onClick={() => setOrderDetailsOpen(false)}
                  className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
