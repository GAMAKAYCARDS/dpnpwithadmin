"use client"

import { useState, useMemo } from 'react'
import { Headphones, Keyboard, Mouse, Speaker, Search, Filter } from 'lucide-react'
import OptimizedProductCard from './optimized-product-card'

interface Product {
  id: number
  name: string
  price: number
  original_price: number
  image_url: string
  category: string
  rating: number
  reviews: number
  description: string
  features: string[]
  in_stock: boolean
  discount: number
}

interface ProductsSectionProps {
  products: Product[]
  onAddToCart: (product: Product) => void
}

const categories = [
  { id: 'all', name: 'All', icon: null },
  { id: 'keyboard', name: 'Keyboards', icon: Keyboard },
  { id: 'mouse', name: 'Mice', icon: Mouse },
  { id: 'audio', name: 'Audio', icon: Headphones },
  { id: 'speaker', name: 'Speakers', icon: Speaker },
]

export default function ProductsSection({ products, onAddToCart }: ProductsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [products, selectedCategory, searchTerm])

  return (
    <section className="py-8 md:py-20 bg-gray-50 dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4 jakarta-light">
            Featured Products
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 jakarta-light">
            Discover our premium collection of tech gear
          </p>
        </div>

        {/* Mobile Search Bar */}
        <div className="mb-6 md:hidden animate-fade-in-up stagger-1">
          <div className={`relative transition-all duration-300 ${isSearchFocused ? 'scale-105' : ''}`}>
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="w-full px-12 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#F7DD0F] focus:ring-4 focus:ring-[#F7DD0F]/20 touch-manipulation premium-transition text-base"
              style={{ minHeight: '56px' }}
            />
          </div>
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden md:block mb-8 animate-fade-in-up stagger-1">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-12 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#F7DD0F] focus:ring-4 focus:ring-[#F7DD0F]/20 touch-manipulation premium-transition"
                style={{ minHeight: '48px' }}
              />
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-8 md:mb-10 animate-fade-in-up stagger-2">
          {/* Mobile Category Scroll */}
          <div className="md:hidden">
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
              {categories.map((category, index) => {
                const Icon = category.icon
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 px-6 py-4 rounded-2xl whitespace-nowrap transition-all touch-manipulation premium-transition flex-shrink-0 ${
                      selectedCategory === category.id
                        ? 'bg-[#F7DD0F] text-black shadow-lg shadow-[#F7DD0F]/30'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
                    }`}
                    style={{ 
                      minHeight: '56px',
                      animationDelay: `${(index + 1) * 0.1}s`
                    }}
                  >
                    {Icon && <Icon className="w-5 h-5" />}
                    <span className="text-base font-medium">{category.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Desktop Category Grid */}
          <div className="hidden md:grid md:grid-cols-5 gap-4">
            {categories.map((category, index) => {
              const Icon = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center justify-center gap-3 px-6 py-4 rounded-xl transition-all touch-manipulation premium-transition hover-scale ${
                    selectedCategory === category.id
                      ? 'bg-[#F7DD0F] text-black shadow-lg'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
                  }`}
                  style={{ 
                    minHeight: '64px',
                    animationDelay: `${(index + 1) * 0.1}s`
                  }}
                >
                  {Icon && <Icon className="w-5 h-5" />}
                  <span className="text-base font-medium">{category.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product, index) => (
            <div 
              key={product.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <OptimizedProductCard
                product={product}
                onAddToCart={onAddToCart}
              />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16 animate-fade-in-up">
            <div className="max-w-md mx-auto">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No products found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                }}
                className="bg-[#F7DD0F] text-black px-6 py-3 rounded-xl font-medium hover:bg-[#F7DD0F]/90 transition-colors touch-manipulation"
                style={{ minHeight: '48px' }}
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
} 