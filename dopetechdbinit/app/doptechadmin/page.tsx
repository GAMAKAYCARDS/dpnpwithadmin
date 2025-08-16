"use client"

import React, { useState, useEffect, useMemo } from "react"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  BarChart3, 
  TrendingUp, 
  Eye,
  Star,
  DollarSign,
  Package,
  LogOut,
  Save,
  X,
  Upload,
  Image as ImageIcon,
  CheckCircle,
  Lock,
  ArrowLeft
} from "lucide-react"
import { getProducts, type Product } from "@/lib/products-data"
import { supabase } from "@/lib/supabase"

interface AdminProduct extends Product {
  isNew?: boolean
  isEditing?: boolean
}

export default function DopeTechAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: 0,
    original_price: 0,
    description: "",
    category: "keyboard",
    image_url: "",
    rating: 0,
    reviews: 0,
    features: [""],
    in_stock: true,
    discount: 0
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  // Check for existing admin session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const isAdmin = localStorage.getItem("adminAuthenticated") === "true"
        const loginTime = localStorage.getItem("adminLoginTime")
        
        if (isAdmin && loginTime) {
          const loginDate = new Date(loginTime)
          const now = new Date()
          const hoursSinceLogin = (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60)
          
          if (hoursSinceLogin < 8) {
            setIsAuthenticated(true)
          } else {
            localStorage.removeItem("adminAuthenticated")
            localStorage.removeItem("adminLoginTime")
            setIsAuthenticated(false)
          }
        } else {
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error("Error checking admin session:", error)
        setIsAuthenticated(false)
      }
    }
  }, [])

  // Load products from Supabase
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const supabaseProducts = await getProducts()
        setProducts(supabaseProducts as AdminProduct[])
      } catch (error) {
        console.error('Error loading products:', error)
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    if (isAuthenticated) {
      loadProducts()
    }
  }, [isAuthenticated])

  const handleImageUpload = async (file: File) => {
    if (!file) return

    setIsUploadingImage(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${file.name}`
      
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file)

      if (error) {
        console.error('Error uploading image:', error)
        alert('Failed to upload image')
        return
      }

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName)

      setNewProduct(prev => ({ ...prev, image_url: publicUrl }))
      setImageFile(null)
      alert('Image uploaded successfully!')
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image')
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) {
      alert('Please fill in product name and price')
      return
    }

    try {
      // Prepare product data for Supabase (Supabase will auto-generate id)
      const { data, error } = await supabase
        .from('products')
        .insert([newProduct])
        .select()

      if (error) {
        console.error('Error adding product:', error)
        alert('Failed to add product')
        return
      }

      // Refresh products from Supabase
      const updatedProducts = await getProducts()
      setProducts(updatedProducts as AdminProduct[])

      // Reset form
      setNewProduct({
        name: "",
        price: 0,
        original_price: 0,
        description: "",
        category: "keyboard",
        image_url: "",
        rating: 0,
        reviews: 0,
        features: [""],
        in_stock: true,
        discount: 0
      })
      setIsAddingProduct(false)
      
      alert('Product added successfully!')
    } catch (error) {
      console.error('Error adding product:', error)
      alert('Failed to add product')
    }
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
  }

  const handleCancelEdit = () => {
    setEditingProduct(null)
  }

  const handleSaveProduct = async (productId: number, updatedData: Partial<Product>) => {
    try {
      const { error } = await supabase
        .from('products')
        .update(updatedData)
        .eq('id', productId)

      if (error) {
        console.error('Error updating product:', error)
        alert('Failed to update product')
        return
      }

      // Refresh products from Supabase
      const updatedProducts = await getProducts()
      setProducts(updatedProducts as AdminProduct[])

      // Close edit modal
      setEditingProduct(null)

      alert('Product updated successfully!')
    } catch (error) {
      console.error('Error updating product:', error)
      alert('Failed to update product')
    }
  }

  const handleDeleteProduct = async (productId: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', productId)

        if (error) {
          console.error('Error deleting product:', error)
          alert('Failed to delete product')
          return
        }

        // Refresh products from Supabase
        const updatedProducts = await getProducts()
        setProducts(updatedProducts as AdminProduct[])

        alert('Product deleted successfully!')
      } catch (error) {
        console.error('Error deleting product:', error)
        alert('Failed to delete product')
      }
    }
  }

  const handleLogin = () => {
    if (password === "dopetech2024") {
      setIsAuthenticated(true)
      localStorage.setItem("adminAuthenticated", "true")
      localStorage.setItem("adminLoginTime", new Date().toISOString())
    } else {
      alert("Incorrect password!")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("adminAuthenticated")
    localStorage.removeItem("adminLoginTime")
  }

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [products, searchTerm, selectedCategory])

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map(p => p.category))]
    return ["all", ...uniqueCategories]
  }, [products])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#F7DD0F] mb-2">DopeTech Admin</h1>
            <p className="text-gray-400">Enter password to access admin panel</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7DD0F] text-white"
                placeholder="Enter admin password"
              />
            </div>
            
            <button
              onClick={handleLogin}
              className="w-full px-4 py-3 bg-[#F7DD0F] text-black rounded-lg hover:bg-[#F7DD0F]/90 transition-colors font-medium"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg text-white">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-[#F7DD0F]">DopeTech Admin</h1>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Package className="w-4 h-4" />
                <span>{products.length} Products</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsAddingProduct(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-[#F7DD0F] text-black rounded-lg hover:bg-[#F7DD0F]/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7DD0F] text-white"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7DD0F] text-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Add Product Modal */}
        {isAddingProduct && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-black/80 backdrop-blur-lg rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#F7DD0F]">Add New Product</h2>
                <button
                  onClick={() => setIsAddingProduct(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Product Name</label>
                    <input
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7DD0F]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7DD0F]"
                    >
                      <option value="keyboard">Keyboard</option>
                      <option value="mouse">Mouse</option>
                      <option value="headphone">Headphone</option>
                      <option value="monitor">Monitor</option>
                      <option value="accessory">Accessory</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Price (Rs)</label>
                    <input
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7DD0F]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Original Price (Rs)</label>
                    <input
                      type="number"
                      value={newProduct.original_price}
                      onChange={(e) => setNewProduct({...newProduct, original_price: parseFloat(e.target.value)})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7DD0F]"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7DD0F]"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Product Image</label>
                    <div className="space-y-3">
                      {/* Image Upload */}
                      <div className="flex items-center space-x-3">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              setImageFile(file)
                              handleImageUpload(file)
                            }
                          }}
                          className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7DD0F] text-sm"
                        />
                        {isUploadingImage && (
                          <div className="flex items-center space-x-2 text-sm text-gray-400">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#F7DD0F]"></div>
                            <span>Uploading...</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Current Image Preview */}
                      {newProduct.image_url && (
                        <div className="flex items-center space-x-3">
                          <img 
                            src={newProduct.image_url} 
                            alt="Product preview" 
                            className="w-16 h-16 rounded object-cover border border-gray-600"
                          />
                          <div className="flex-1">
                            <p className="text-sm text-gray-400">Current image URL:</p>
                            <p className="text-xs text-gray-500 truncate">{newProduct.image_url}</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Manual URL Input */}
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-400">Or enter image URL manually:</label>
                        <input
                          type="text"
                          value={newProduct.image_url}
                          onChange={(e) => setNewProduct({...newProduct, image_url: e.target.value})}
                          placeholder="https://example.com/image.jpg"
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7DD0F] text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Rating</label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={newProduct.rating}
                      onChange={(e) => setNewProduct({...newProduct, rating: parseFloat(e.target.value)})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7DD0F]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Reviews Count</label>
                    <input
                      type="number"
                      value={newProduct.reviews}
                      onChange={(e) => setNewProduct({...newProduct, reviews: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7DD0F]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Discount (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={newProduct.discount}
                      onChange={(e) => setNewProduct({...newProduct, discount: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7DD0F]"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newProduct.in_stock}
                        onChange={(e) => setNewProduct({...newProduct, in_stock: e.target.checked})}
                        className="rounded border-gray-600 bg-gray-700 text-[#F7DD0F] focus:ring-[#F7DD0F]"
                      />
                      <span className="text-sm font-medium">In Stock</span>
                    </label>
                  </div>
                </div>
                
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={handleAddProduct}
                    className="flex-1 px-4 py-2 bg-[#F7DD0F] text-black rounded-lg hover:bg-[#F7DD0F]/90 transition-colors"
                  >
                    Add Product
                  </button>
                  <button
                    onClick={() => setIsAddingProduct(false)}
                    className="flex-1 px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Product Modal */}
        {isAddingProduct && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Add New Product</h2>
                <button
                  onClick={() => setIsAddingProduct(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Product Name</label>
                    <input
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7DD0F]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7DD0F]"
                    >
                      <option value="keyboard">Keyboard</option>
                      <option value="mouse">Mouse</option>
                      <option value="headphone">Headphone</option>
                      <option value="monitor">Monitor</option>
                      <option value="accessory">Accessory</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Price (Rs)</label>
                    <input
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7DD0F]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Original Price (Rs)</label>
                    <input
                      type="number"
                      value={newProduct.original_price}
                      onChange={(e) => setNewProduct({...newProduct, original_price: parseFloat(e.target.value)})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7DD0F]"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7DD0F]"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Product Image</label>
                    <div className="space-y-3">
                      {/* Image Upload */}
                      <div className="flex items-center space-x-3">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              setImageFile(file)
                              handleImageUpload(file)
                            }
                          }}
                          className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7DD0F] text-sm"
                        />
                        {isUploadingImage && (
                          <div className="flex items-center space-x-2 text-sm text-gray-400">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#F7DD0F]"></div>
                            <span>Uploading...</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Current Image Preview */}
                      {newProduct.image_url && (
                        <div className="flex items-center space-x-3">
                          <img 
                            src={newProduct.image_url} 
                            alt="Product preview" 
                            className="w-16 h-16 rounded object-cover border border-gray-600"
                          />
                          <div className="flex-1">
                            <p className="text-sm text-gray-400">Current image URL:</p>
                            <p className="text-xs text-gray-500 truncate">{newProduct.image_url}</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Manual URL Input */}
                      <div>
                        <label className="block text-xs font-medium mb-1 text-gray-400">Or enter image URL manually:</label>
                        <input
                          type="text"
                          value={newProduct.image_url}
                          onChange={(e) => setNewProduct({...newProduct, image_url: e.target.value})}
                          placeholder="https://example.com/image.jpg"
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7DD0F] text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Rating</label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={newProduct.rating}
                      onChange={(e) => setNewProduct({...newProduct, rating: parseFloat(e.target.value)})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7DD0F]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Reviews Count</label>
                    <input
                      type="number"
                      value={newProduct.reviews}
                      onChange={(e) => setNewProduct({...newProduct, reviews: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7DD0F]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Discount (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={newProduct.discount}
                      onChange={(e) => setNewProduct({...newProduct, discount: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7DD0F]"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newProduct.in_stock}
                        onChange={(e) => setNewProduct({...newProduct, in_stock: e.target.checked})}
                        className="rounded border-gray-600 bg-gray-700 text-[#F7DD0F] focus:ring-[#F7DD0F]"
                      />
                      <span className="text-sm font-medium">In Stock</span>
                    </label>
                  </div>
                </div>
                
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={handleAddProduct}
                    className="flex-1 px-4 py-2 bg-[#F7DD0F] text-black rounded-lg hover:bg-[#F7DD0F]/90 transition-colors"
                  >
                    Add Product
                  </button>
                  <button
                    onClick={() => setIsAddingProduct(false)}
                    className="flex-1 px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Product Modal */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-black/80 backdrop-blur-lg rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#F7DD0F]">Edit Product</h2>
                <button
                  onClick={handleCancelEdit}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Product Name</label>
                    <input
                      type="text"
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7DD0F] text-white placeholder-gray-400"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      value={editingProduct.category}
                      onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7DD0F] text-white"
                    >
                      <option value="keyboard">Keyboard</option>
                      <option value="mouse">Mouse</option>
                      <option value="headphone">Headphone</option>
                      <option value="monitor">Monitor</option>
                      <option value="accessory">Accessory</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Price (Rs)</label>
                    <input
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value) || 0})}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7DD0F] text-white placeholder-gray-400"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Original Price (Rs)</label>
                    <input
                      type="number"
                      value={editingProduct.original_price}
                      onChange={(e) => setEditingProduct({...editingProduct, original_price: parseFloat(e.target.value) || 0})}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7DD0F] text-white placeholder-gray-400"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={editingProduct.description}
                      onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7DD0F] text-white placeholder-gray-400 resize-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Rating</label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={editingProduct.rating}
                      onChange={(e) => setEditingProduct({...editingProduct, rating: parseFloat(e.target.value) || 0})}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7DD0F] text-white placeholder-gray-400"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Reviews</label>
                    <input
                      type="number"
                      value={editingProduct.reviews}
                      onChange={(e) => setEditingProduct({...editingProduct, reviews: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7DD0F] text-white placeholder-gray-400"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Product Image URL</label>
                    <input
                      type="text"
                      value={editingProduct.image_url}
                      onChange={(e) => setEditingProduct({...editingProduct, image_url: e.target.value})}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F7DD0F] text-white placeholder-gray-400"
                      placeholder="Enter image URL"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editingProduct.in_stock}
                        onChange={(e) => setEditingProduct({...editingProduct, in_stock: e.target.checked})}
                        className="rounded border-white/20 bg-white/5 text-[#F7DD0F] focus:ring-[#F7DD0F] focus:ring-2"
                      />
                      <span className="text-sm font-medium">In Stock</span>
                    </label>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 pt-4 border-t border-white/10">
                  <button
                    onClick={() => handleSaveProduct(editingProduct.id, editingProduct)}
                    className="flex-1 px-4 py-2 bg-[#F7DD0F] text-black rounded-lg hover:bg-[#F7DD0F]/90 transition-colors font-medium"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex-1 px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Display */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F7DD0F]"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or category filters</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="rounded-lg p-4 border border-white/10 bg-white/5">
                  <div className="flex items-start space-x-3 mb-3">
                    <img src={product.image_url} alt={product.name} className="w-16 h-16 rounded object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm mb-1 truncate text-white">{product.name}</h3>
                      <p className="text-gray-400 text-xs mb-2 line-clamp-2">{product.description}</p>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="px-2 py-1 bg-[#F7DD0F]/20 text-[#F7DD0F] rounded-full text-xs font-medium border border-[#F7DD0F]/30">{product.category}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                          product.in_stock 
                            ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                            : 'bg-red-500/20 text-red-400 border-red-500/30'
                        }`}>
                          {product.in_stock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-[#F7DD0F] fill-current" />
                            <span className="text-xs">{product.rating}</span>
                            <span className="text-gray-400 text-xs">({product.reviews})</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm text-[#F7DD0F]">Rs {product.price}</p>
                          {product.original_price > product.price && (
                            <p className="text-gray-400 text-xs line-through">Rs {product.original_price}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Mobile Actions */}
                  <div className="flex items-center justify-end space-x-2 pt-3 border-t border-white/10">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-all duration-200 text-blue-400 text-sm flex items-center space-x-1"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-all duration-200 text-red-400 text-sm flex items-center space-x-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Desktop Table */}
            <div className="hidden lg:block">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4">Product</th>
                      <th className="text-left py-3 px-4">Category</th>
                      <th className="text-left py-3 px-4">Price</th>
                      <th className="text-left py-3 px-4">Rating</th>
                      <th className="text-left py-3 px-4">Stock</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="border-b border-gray-800 hover:bg-white/5">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <img src={product.image_url} alt={product.name} className="w-10 h-10 rounded object-cover" />
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-gray-400 text-sm truncate max-w-xs">{product.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-[#F7DD0F]/20 text-[#F7DD0F] rounded-full text-xs font-medium border border-[#F7DD0F]/30">
                            {product.category}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">Rs {product.price}</p>
                            {product.original_price > product.price && (
                              <p className="text-gray-400 text-sm line-through">Rs {product.original_price}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-[#F7DD0F] fill-current" />
                            <span>{product.rating}</span>
                            <span className="text-gray-400 text-sm">({product.reviews})</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.in_stock ? 'bg-green-600' : 'bg-red-600'
                          }`}>
                            {product.in_stock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="p-2 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors text-blue-400"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
