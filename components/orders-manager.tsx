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
  X,
  CreditCard,
  Truck,
  CheckCircle2
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"

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

  // Stats calculation
  const stats = {
    total: orders.length,
    processing: orders.filter(o => o.order_status === 'processing').length,
    completed: orders.filter(o => o.order_status === 'completed').length,
    pending: orders.filter(o => o.order_status === 'pending').length,
    cancelled: orders.filter(o => o.order_status === 'cancelled').length,
    paid: orders.filter(o => o.payment_status === 'paid').length
  }

  console.log('🔄 OrdersManager render - loading:', loading, 'orders count:', orders.length)
  
  if (loading) {
    return (
      <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl mx-auto">
        <Card className="bg-white/5 backdrop-blur-xl border border-white/20 shadow-xl">
          <CardHeader className="pb-4 sm:pb-6 border-b border-white/10 p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg sm:rounded-xl flex-shrink-0">
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-blue-400" />
              </div>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-white leading-tight">
                  Orders Management
                </CardTitle>
                <p className="text-xs sm:text-sm lg:text-base text-gray-300 mt-1 leading-relaxed">
                  View and manage all customer orders
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-3">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                <span className="text-gray-400 text-sm sm:text-base">Loading orders...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl mx-auto space-y-4 sm:space-y-6">
      {/* Header Card */}
      <Card className="bg-white/5 backdrop-blur-xl border border-white/20 shadow-xl">
        <CardHeader className="pb-4 sm:pb-6 border-b border-white/10 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg sm:rounded-xl flex-shrink-0">
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-blue-400" />
              </div>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-white leading-tight">
                  Orders Management
                </CardTitle>
                <p className="text-xs sm:text-sm lg:text-base text-gray-300 mt-1 leading-relaxed">
                  View and manage all customer orders
                </p>
              </div>
            </div>
            <Button
              onClick={loadOrders}
              disabled={loading}
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10 h-10 px-3 sm:px-4"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline ml-2">Refresh</span>
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <Card className="bg-white/5 backdrop-blur-xl border border-white/20 shadow-xl">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-400">Total</p>
                <p className="text-lg sm:text-xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500/20 rounded-lg sm:rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-xl border border-white/20 shadow-xl">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-400">Processing</p>
                <p className="text-lg sm:text-xl font-bold text-blue-400">{stats.processing}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500/20 rounded-lg sm:rounded-xl flex items-center justify-center">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-xl border border-white/20 shadow-xl">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-400">Completed</p>
                <p className="text-lg sm:text-xl font-bold text-green-400">{stats.completed}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500/20 rounded-lg sm:rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-xl border border-white/20 shadow-xl">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-400">Pending</p>
                <p className="text-lg sm:text-xl font-bold text-yellow-400">{stats.pending}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-500/20 rounded-lg sm:rounded-xl flex items-center justify-center">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-xl border border-white/20 shadow-xl">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-400">Cancelled</p>
                <p className="text-lg sm:text-xl font-bold text-red-400">{stats.cancelled}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-500/20 rounded-lg sm:rounded-xl flex items-center justify-center">
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-xl border border-white/20 shadow-xl">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-400">Paid</p>
                <p className="text-lg sm:text-xl font-bold text-green-400">{stats.paid}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500/20 rounded-lg sm:rounded-xl flex items-center justify-center">
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Controls */}
      <Card className="bg-white/5 backdrop-blur-xl border border-white/20 shadow-xl">
        <CardHeader className="pb-4 sm:pb-6 border-b border-white/10 p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-lg sm:rounded-xl flex-shrink-0">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
            </div>
            <div>
              <CardTitle className="text-base sm:text-lg lg:text-xl font-bold text-white">
                Search & Filter
              </CardTitle>
              <p className="text-xs sm:text-sm text-gray-300 mt-1">
                Find orders by ID, customer name, email, or phone
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4 lg:gap-6">
            <div className="space-y-2 sm:space-y-3">
              <label className="text-sm sm:text-base font-semibold text-white">Search Orders</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search by ID, name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 h-12 sm:h-14 text-sm sm:text-base"
                />
              </div>
            </div>
            
            <div className="space-y-2 sm:space-y-3">
              <label className="text-sm sm:text-base font-semibold text-white">Filter by Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base h-12 sm:h-14"
              >
                <option value="all" className="bg-slate-800">All Status</option>
                <option value="processing" className="bg-slate-800">Processing</option>
                <option value="completed" className="bg-slate-800">Completed</option>
                <option value="pending" className="bg-slate-800">Pending</option>
                <option value="cancelled" className="bg-slate-800">Cancelled</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center justify-center p-3 sm:p-4 bg-white/5 rounded-lg sm:rounded-xl border border-white/20">
            <Package className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 mr-2 sm:mr-3" />
            <span className="text-sm sm:text-base text-gray-300 font-semibold">
              {filteredOrders.length} Orders Found
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <Card className="bg-white/5 backdrop-blur-xl border border-white/20 shadow-xl">
        <CardHeader className="pb-4 sm:pb-6 border-b border-white/10 p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg sm:rounded-xl flex-shrink-0">
              <Package className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-base sm:text-lg lg:text-xl font-bold text-white">
                Orders List
              </CardTitle>
              <p className="text-xs sm:text-sm text-gray-300 mt-1">
                Click on any order to view details
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-8 sm:py-12 text-gray-400">
              <ShoppingCart className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 opacity-50" />
              <p className="text-sm sm:text-base">No orders found</p>
              <p className="text-xs sm:text-sm mt-1">Try adjusting your search or status filters</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {filteredOrders.map((order) => (
                <Card
                  key={order.id}
                  className="bg-white/5 border border-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer"
                  onClick={() => handleViewOrder(order)}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/20 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                          <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-semibold text-white truncate">{order.order_id}</h3>
                          <p className="text-sm text-gray-400 truncate">{order.customer_name}</p>
                          <div className="flex items-center gap-2 sm:gap-4 mt-1">
                            <div className="flex items-center gap-1">
                              <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                              <span className="text-xs sm:text-sm text-gray-300 truncate">{order.customer_email}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                              <span className="text-xs sm:text-sm text-gray-300">{order.customer_phone}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                        <div className="flex flex-col items-end gap-2">
                          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.order_status)}`}>
                            {order.order_status}
                          </span>
                          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColor(order.payment_status)}`}>
                            {order.payment_status}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="text-right">
                            <p className="text-xs sm:text-sm text-gray-400">{formatDate(order.created_at)}</p>
                            <p className="text-xs text-gray-500">{order.order_items?.length || 0} items</p>
                            <p className="text-sm sm:text-base text-blue-400 font-semibold">Rs {order.total_amount}</p>
                          </div>
                          
                          <Button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleViewOrder(order)
                            }}
                            variant="outline"
                            size="sm"
                            className="border-white/20 text-white hover:bg-white/10 h-10 px-3 sm:px-4"
                          >
                            <Eye className="w-4 h-4" />
                            <span className="hidden sm:inline ml-2">View</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      {orderDetailsOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-lg sm:rounded-xl p-4 sm:p-6 max-w-2xl sm:max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg sm:rounded-xl flex-shrink-0">
                  <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Order Details</h2>
                  <p className="text-xs sm:text-sm text-gray-300 mt-1">Order ID: {selectedOrder.order_id}</p>
                </div>
              </div>
              <Button
                onClick={() => setOrderDetailsOpen(false)}
                variant="outline"
                size="sm"
                className="border-white/20 text-white hover:bg-white/10 h-10 px-3 sm:px-4"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {/* Order Header */}
              <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4 lg:gap-6">
                <Card className="bg-white/5 border border-white/20">
                  <CardHeader className="pb-3 sm:pb-4 p-3 sm:p-4">
                    <CardTitle className="text-sm sm:text-base font-semibold text-white">Order Information</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-gray-400">Order ID:</span>
                      <span className="text-xs sm:text-sm text-white font-mono">{selectedOrder.order_id}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-gray-400">Date:</span>
                      <span className="text-xs sm:text-sm text-white">{formatDate(selectedOrder.created_at)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-gray-400">Total Amount:</span>
                      <span className="text-sm sm:text-base text-blue-400 font-bold">Rs {selectedOrder.total_amount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-gray-400">Payment Option:</span>
                      <span className="text-xs sm:text-sm text-white capitalize">{selectedOrder.payment_option}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border border-white/20">
                  <CardHeader className="pb-3 sm:pb-4 p-3 sm:p-4">
                    <CardTitle className="text-sm sm:text-base font-semibold text-white">Status</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-gray-400">Order Status:</span>
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedOrder.order_status)}`}>
                        {selectedOrder.order_status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-gray-400">Payment Status:</span>
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColor(selectedOrder.payment_status)}`}>
                        {selectedOrder.payment_status}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Customer Information */}
              <Card className="bg-white/5 border border-white/20">
                <CardHeader className="pb-3 sm:pb-4 p-3 sm:p-4">
                  <CardTitle className="text-sm sm:text-base font-semibold text-white">Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-white">{selectedOrder.customer_name}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-white">{selectedOrder.customer_email}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-white">{selectedOrder.customer_phone}</span>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                    <div className="text-sm sm:text-base text-white">
                      <p>{selectedOrder.customer_address}</p>
                      <p className="text-xs sm:text-sm text-gray-400 mt-1">
                        {selectedOrder.customer_city}, {selectedOrder.customer_state} {selectedOrder.customer_zip_code}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card className="bg-white/5 border border-white/20">
                <CardHeader className="pb-3 sm:pb-4 p-3 sm:p-4">
                  <CardTitle className="text-sm sm:text-base font-semibold text-white">Order Items</CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-4">
                  <div className="space-y-3">
                    {selectedOrder.order_items && selectedOrder.order_items.length > 0 ? (
                      selectedOrder.order_items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10"
                        >
                          <img
                            src={item.product_image || '/placeholder-product.svg'}
                            alt={item.product_name}
                            className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover flex-shrink-0"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = '/placeholder-product.svg'
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm sm:text-base text-white font-medium truncate">{item.product_name}</h4>
                            <p className="text-xs sm:text-sm text-gray-400">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm sm:text-base text-blue-400 font-semibold">Rs {item.price}</p>
                            <p className="text-xs sm:text-sm text-gray-400">Total: Rs {item.price * item.quantity}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 sm:py-8">
                        <Package className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2 sm:mb-3" />
                        <p className="text-sm sm:text-base text-gray-400">No order items found</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Receipt Section */}
              {(selectedOrder.receipt_url || selectedOrder.receipt_file_name) && (
                <Card className="bg-white/5 border border-white/20">
                  <CardHeader className="pb-3 sm:pb-4 p-3 sm:p-4">
                    <CardTitle className="text-sm sm:text-base font-semibold text-white">Payment Receipt</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                    <div className="bg-white/5 rounded-lg border border-white/10 p-3 sm:p-4">
                      <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm sm:text-base text-white font-medium truncate">
                            {selectedOrder.receipt_file_name || 'Receipt'}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-400">Payment proof uploaded by customer</p>
                          {selectedOrder.receipt_url && (
                            <p className="text-xs text-gray-500 mt-1 truncate">URL: {selectedOrder.receipt_url}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {selectedOrder.receipt_url ? (
                            <>
                              <Button
                                onClick={() => window.open(selectedOrder.receipt_url!, '_blank')}
                                variant="outline"
                                size="sm"
                                className="border-blue-500/30 text-blue-400 hover:bg-blue-500/20 h-8 sm:h-10 px-2 sm:px-3"
                              >
                                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                              <Button
                                onClick={() => handleDownloadReceipt(selectedOrder.receipt_url!, selectedOrder.receipt_file_name || 'receipt')}
                                variant="outline"
                                size="sm"
                                className="border-blue-500/30 text-blue-400 hover:bg-blue-500/20 h-8 sm:h-10 px-2 sm:px-3"
                              >
                                <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
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
                            className="max-w-full max-h-64 sm:max-h-96 rounded-lg border border-white/20"
                            onLoad={() => console.log('✅ Receipt image loaded successfully:', selectedOrder.receipt_url)}
                            onError={(e) => {
                              console.error('❌ Receipt image failed to load:', selectedOrder.receipt_url)
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                              // Show fallback message
                              const parent = target.parentElement
                              if (parent) {
                                parent.innerHTML = `
                                  <div class="text-center py-6 sm:py-8">
                                    <FileText class="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2 sm:mb-3" />
                                    <p class="text-sm sm:text-base text-gray-400">Receipt image not available</p>
                                    <p class="text-xs sm:text-sm text-gray-500 mt-2">File: ${selectedOrder.receipt_file_name}</p>
                                    <p class="text-xs sm:text-sm text-gray-500 mt-2">The receipt was uploaded but the image is not accessible</p>
                                  </div>
                                `
                              }
                            }}
                          />
                        ) : (
                          <div className="text-center py-6 sm:py-8">
                            <FileText className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2 sm:mb-3" />
                            <p className="text-sm sm:text-base text-gray-400">Receipt uploaded but not accessible</p>
                            <p className="text-xs sm:text-sm text-gray-500 mt-2">File: {selectedOrder.receipt_file_name}</p>
                            <p className="text-xs sm:text-sm text-gray-500 mt-2">The receipt file was uploaded but the URL is not available</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end pt-4 sm:pt-6 border-t border-white/10">
                <Button
                  onClick={() => setOrderDetailsOpen(false)}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
