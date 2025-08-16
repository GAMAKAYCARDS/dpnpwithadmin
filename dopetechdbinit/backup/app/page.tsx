"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  Headphones,
  Keyboard,
  Mouse,
  Speaker,
  Search,
  ShoppingBag,
  Camera,
  Cable,
  Plus,
  Minus,
  X,
  Grid,
  Menu,
  Instagram,
  Gamepad2,
  Laptop,
  Smartphone,
  Monitor,
} from "lucide-react"
// Removed CursorTracker (opt-in effect)
import LazyAIChat from "@/components/lazy-ai-chat"
import SEOOptimizer, { defaultStructuredData } from "@/components/seo-optimizer"
import SupabaseCheckout from "@/components/supabase-checkout"
import { getProducts, type Product } from "@/lib/products-data"
import { useCart } from "@/contexts/cart-context"


// Product type is now imported from lib/products-data



export default function DopeTechEcommerce() {
  const router = useRouter()
  const [scrollY, setScrollY] = useState(0)
  const [products, setProducts] = useState<Product[]>([])
  const { 
    cart, 
    addToCart, 
    updateQuantity, 
    removeFromCart, 
    getCartCount, 
    getCartTotal, 
    cartOpen, 
    setCartOpen,
    checkoutModalOpen,
    setCheckoutModalOpen
  } = useCart()

  // Get products from Supabase (no local storage fallback)
  const getLocalProducts = (): Product[] => {
    return products
  }
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [viewMode, setViewMode] = useState("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchDraft, setSearchDraft] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchModalReady, setSearchModalReady] = useState(false)
  const [currentProducts, setCurrentProducts] = useState<Product[]>([])
  const [showBackToCategories, setShowBackToCategories] = useState(false)
  const [isCategoryInView, setIsCategoryInView] = useState(true)
  const [categoryIconIndex, setCategoryIconIndex] = useState(0)
  const [headerOffset, setHeaderOffset] = useState<number>(72)
  const [isAdmin, setIsAdmin] = useState(false)
  const [promoOrder, setPromoOrder] = useState<number[]>([])
  const [draggedPromoIndex, setDraggedPromoIndex] = useState<number | null>(null)

  const [userBehavior, setUserBehavior] = useState({
    viewedProducts: [] as number[],
    cartItems: [] as number[],
    searchHistory: [] as string[]
  })


  const [animationKey, setAnimationKey] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [posterIndex, setPosterIndex] = useState(0)
  const searchModalRef = useRef<HTMLDivElement>(null)
  const categorySectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleScroll = () => setScrollY(window.scrollY)
      // Use passive listener for better scroll perf
      window.addEventListener("scroll", handleScroll, { passive: true } as any)
      
      return () => {
        window.removeEventListener("scroll", handleScroll as any)
      }
    }
  }, [])

  // Fetch products from Supabase with timeout
  useEffect(() => {
    let fallbackTimeout: NodeJS.Timeout | null = null

    const fetchProducts = async () => {
      try {
        console.log('🔄 Fetching products from Supabase...')
        
        // Add timeout to prevent infinite loading
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), 10000) // 10 second timeout
        })
        
        const productsPromise = getProducts()
        const supabaseProducts = await Promise.race([productsPromise, timeoutPromise]) as Product[]
        
        console.log('📦 Products fetched:', supabaseProducts.length)
        console.log('🎯 First product:', supabaseProducts[0])
        
        console.log('✅ Setting products:', supabaseProducts?.length || 0, 'products')
        setProducts(supabaseProducts || [])
        setIsLoading(false)
        
        // Clear the fallback timeout since we successfully fetched products
        if (fallbackTimeout) {
          clearTimeout(fallbackTimeout)
          fallbackTimeout = null
          console.log('✅ Cleared fallback timeout - products loaded successfully')
        }
      } catch (error) {
        console.error('❌ Error fetching products:', error)
        // Set empty products array and stop loading even if there's an error
        console.log('⚠️ Setting empty products due to error')
        setProducts([])
        setIsLoading(false)
      }
    }

    // Add a fallback timeout to ensure loading state is always cleared
    fallbackTimeout = setTimeout(() => {
      console.warn('⚠️ Fallback timeout reached - clearing loading state')
      setIsLoading(false)
      // Don't clear products if they're already loaded
      // Only clear if we're still loading and have no products
    }, 15000) // 15 second fallback

    fetchProducts()

    return () => {
      if (fallbackTimeout) {
        clearTimeout(fallbackTimeout)
      }
    }
  }, [])

  // Dynamically measure header height and apply as hero top padding to avoid clipping
  useEffect(() => {
    if (typeof window === 'undefined') return
    const header = document.querySelector('header.dopetech-nav') as HTMLElement | null

    const updateOffset = () => {
      const h = header ? header.getBoundingClientRect().height : 56
      const extra = window.innerWidth >= 1024 ? 8 : 16
      setHeaderOffset(Math.round(h + extra))
    }

    updateOffset()

    const onResize = () => updateOffset()
    window.addEventListener('resize', onResize)

    let ro: ResizeObserver | null = null
    if (typeof ResizeObserver !== 'undefined' && header) {
      ro = new ResizeObserver(updateOffset)
      ro.observe(header)
    }

    return () => {
      window.removeEventListener('resize', onResize)
      if (ro) ro.disconnect()
    }
  }, [isMobileMenuOpen, isSearchOpen])

  // Defer applying search text (debounced) to reduce re-renders while typing
  useEffect(() => {
    const t = setTimeout(() => setSearchQuery(searchDraft), 200)
    return () => clearTimeout(t)
  }, [searchDraft])

  // Update products when products state changes
  useEffect(() => {
    console.log('🔄 Products state changed:', products.length, 'products')
    setCurrentProducts(products)
  }, [products])

  // Auto-shuffle poster products
  useEffect(() => {
    if (products.length === 0) return
    
    const interval = setInterval(() => {
      const container = document.querySelector('.flex.overflow-x-auto.scrollbar-hide') as HTMLElement;
      if (container && !container.classList.contains('user-interacting')) {
        const productsToShow = products.filter((p: any) => !p.hidden_on_home).slice(0, 6);
        if (productsToShow.length === 0) return
        
        const currentIndex = posterIndex;
        const nextIndex = (currentIndex + 1) % productsToShow.length;
        
        // Scroll to the next slide
        const slideWidth = container.clientWidth;
        const newScrollLeft = nextIndex * slideWidth;
        
        container.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
        setPosterIndex(nextIndex);
      }
    }, 4000) // Change every 4 seconds

    return () => clearInterval(interval)
  }, [posterIndex, products])

  // Initialize admin mode and promo order preferences
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const flag = localStorage.getItem('adminAuthenticated') === 'true'
      setIsAdmin(!!flag)
      const stored = localStorage.getItem('promoOrderV1')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setPromoOrder(parsed.filter((id: any) => Number.isFinite(id)))
        }
      }
    } catch (e) {
      console.error('Error reading admin/promo order:', e)
    }
  }, [])

  // Listen for localStorage changes
  useEffect(() => {
    const handleGifChange = () => {
      // Force re-render to update GIF
      setAnimationKey(prev => prev + 1)
    }

    // Listen for custom events (for same-tab updates)
    window.addEventListener('gifUpdated', handleGifChange)
    
    return () => {
      window.removeEventListener('gifUpdated', handleGifChange)
    }
  }, [])

  // Handle keyboard events and click outside for search modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false)
        setSearchQuery("")
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (searchModalRef.current && !searchModalRef.current.contains(e.target as Node) && searchModalReady) {
        console.log("Click outside detected")
        setIsSearchOpen(false)
        setSearchQuery("")
      }
    }

    const handleTouchOutside = (e: TouchEvent) => {
      if (searchModalRef.current && !searchModalRef.current.contains(e.target as Node) && searchModalReady) {
        console.log("Touch outside detected")
        setIsSearchOpen(false)
        setSearchQuery("")
      }
    }

    if (isSearchOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleTouchOutside)
      // Prevent body scroll when search is open
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleTouchOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isSearchOpen, searchModalReady])

  // Set modal as ready after a short delay to prevent immediate closing
  useEffect(() => {
    if (isSearchOpen) {
      const timer = setTimeout(() => {
        setSearchModalReady(true)
      }, 100)
      return () => {
        clearTimeout(timer)
        setSearchModalReady(false)
      }
    } else {
      setSearchModalReady(false)
    }
  }, [isSearchOpen])

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }

    // Check on initial load as well
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      setIsMobileMenuOpen(false)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isMobileMenuOpen])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Force dark mode
        document.documentElement.classList.add("dark")
        localStorage.setItem("theme", "dark")
      } catch (error) {
        console.error('Error setting theme:', error)
      }
    }
  }, [])



  // DopeTech animation restart effect
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationKey(prev => prev + 1)
    }, 20000) // Restart animation every 20 seconds

    return () => clearInterval(interval)
  }, [])

  // Track category section visibility and show the button only when it's out of view
  useEffect(() => {
    const el = categorySectionRef.current
    if (!el || typeof window === 'undefined') return
    const observer = new IntersectionObserver(
      ([entry]) => setIsCategoryInView(entry.isIntersecting),
      { root: null, threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    setShowBackToCategories(!isCategoryInView)
  }, [isCategoryInView])

  // Cycle through category icons while the button is visible
  // (moved below categories state declaration to avoid TS order error)





  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId)
    // Clear search when switching categories
    setSearchQuery("")
    
    // Smooth scroll to products section with offset
    setTimeout(() => {
      const productsSection = document.querySelector('[data-products-section]')
      if (productsSection) {
        // Calculate the target scroll position with measured header height
        const header = document.querySelector('header.dopetech-nav') as HTMLElement | null
        const headerHeight = header ? header.offsetHeight + 12 : 72
        const rect = productsSection.getBoundingClientRect()
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        const targetPosition = scrollTop + rect.top - headerHeight
        
        // Smooth scroll to the calculated position
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        })
      }
    }, 60)
  }

  const scrollToCategoryFilters = () => {
    setTimeout(() => {
      const header = document.querySelector('header.dopetech-nav') as HTMLElement | null
      const headerHeight = header ? header.offsetHeight + 12 : 72
      const elem = categorySectionRef.current
      if (elem) {
        const rect = elem.getBoundingClientRect()
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        const targetPosition = scrollTop + rect.top - headerHeight
        window.scrollTo({ top: targetPosition, behavior: 'smooth' })
      }
    }, 0)
  }



  const handleAddToCartWithTracking = (product: Product) => {
    addToCart(product, 1)
    
    // Track user behavior for AI recommendations
    setUserBehavior(prev => ({
      ...prev,
      cartItems: [...prev.cartItems, product.id]
    }))
  }

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!")
      return
    }
    
    setCheckoutModalOpen(true)
  }

  const handleCartReset = () => {
    setCart([])
    setCheckoutModalOpen(false)
  }

  const filteredProducts = useMemo(() => {
    return currentProducts.filter(product => {
      // Hide products explicitly flagged to be hidden on home
      if ((product as any).hiddenOnHome) return false
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase())
      
      // If there's a search query, prioritize search results over category filtering
      if (searchQuery.trim()) {
        return matchesSearch
      }
      
      // If no search query, filter by category
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
      return matchesCategory
    })
  }, [currentProducts, searchQuery, selectedCategory])

  // Lightweight set of promo products for the top cards (hiddenOnHome excluded)
  // Always fill to a max of 6 items deterministically (no Math.random for SSR safety)
  // Apply admin-defined ordering if available
  const promoProducts = useMemo(() => {
    const PROMO_CARD_MAX = 6
    const visible = currentProducts.filter((p) => !(p as any).hiddenOnHome)
    // Reorder by admin preference
    const orderSet = new Set(promoOrder)
    const orderedByAdmin = [
      ...promoOrder
        .map((id) => visible.find((p) => p.id === id))
        .filter((p): p is Product => !!p),
      ...visible.filter((p) => !orderSet.has(p.id)),
    ]
    const base = orderedByAdmin.slice(0, PROMO_CARD_MAX)
    if (base.length === PROMO_CARD_MAX) return base
    const remaining = PROMO_CARD_MAX - base.length
    const restPool = orderedByAdmin.slice(base.length)
    const extras: Product[] = []
    // Prefer unused visible items first
    for (let i = 0; i < remaining && i < restPool.length; i++) {
      extras.push(restPool[i])
    }
    // If still short, repeat from base with a deterministic offset
    if (extras.length < remaining && base.length > 0) {
      const start = currentProducts.length % base.length
      for (let i = 0; extras.length < remaining; i++) {
        const idx = (start + i) % base.length
        extras.push(base[idx])
      }
    }
    return [...base, ...extras]
  }, [currentProducts, promoOrder])

  // Desktop-only extra promo grid (up to 6 additional squares, avoid duplicates when possible)
  const promoProductsDesktopExtra = useMemo(() => {
    const EXTRA_MAX = 6
    const visible = currentProducts.filter((p) => !(p as any).hiddenOnHome)
    const orderSet = new Set(promoOrder)
    const orderedByAdmin = [
      ...promoOrder
        .map((id) => visible.find((p) => p.id === id))
        .filter((p): p is Product => !!p),
      ...visible.filter((p) => !orderSet.has(p.id)),
    ]
    // Skip the first 6 used in the main grid
    const start = 6
    const extra = orderedByAdmin.slice(start, start + EXTRA_MAX)
    return extra
  }, [currentProducts, promoOrder])

  // Debug logging removed for performance

  // Get categories from localStorage or use defaults
  // SVG Icon Component
  const SvgIcon = ({ svgContent, className }: { svgContent: string, className?: string }) => (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: svgContent }}
      style={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'currentColor'
      }}
    />
  )

  // Type for category icons
  type CategoryIcon = React.ComponentType<{ className?: string }> | { type: 'svg', content: string }

  // Helper function to render category icons
  const renderCategoryIcon = (icon: CategoryIcon, className: string) => {
    if (typeof icon === 'object' && 'type' in icon && icon.type === 'svg') {
      return <SvgIcon svgContent={icon.content} className={className} />
    }
    const IconComp = icon as React.ComponentType<{ className?: string }>
    return <IconComp className={className} />
  }

  // Promo card shape options and deterministic picker
  // Use a consistent radius across all promo cards to avoid visual unevenness
  const promoShapeOptions = [
    "rounded-2xl",
  ] as const

  // Deterministic shape picker to avoid hydration mismatches (SSR = Client)
  // Still gives variety across items by using id + index salt.
  const getPromoShape = (id: number, index: number) => {
    const seed = Number.isFinite(id) ? id + index * 7 : index
    const idx = Math.abs(seed) % promoShapeOptions.length
    return promoShapeOptions[idx]
  }

  // Mosaic layout for exactly up to 6 items (desktop-friendly, no gaps)
  // xs: all squares; sm+: hero + vertical + horizontals arranged to fill 3 columns
  const getPromoLayout = (index: number, total: number) => {
    // Always squares on xs
    const xs = "col-span-1 row-span-1"
    if (total <= 4) {
      return { wrapper: xs, ratio: "" }
    }
    if (total === 5) {
      // Layout for 5: hero(2x2), one vertical, two squares
      const map = [
        `${xs} sm:col-span-2 sm:row-span-2`, // 0 hero
        `${xs} sm:col-span-1 sm:row-span-2`, // 1 vertical
        xs,                                   // 2 square
        xs,                                   // 3 square
        xs,                                   // 4 square
      ]
      return { wrapper: map[index % 5], ratio: "" }
    }
    // total >= 6 (we cap at 6)
    // Layout for 6: hero(2x2), vertical(1x2), horizontal(2x1), square, horizontal(2x1), square
    // This produces two fully-filled rows after the top block (no gaps)
    const map6 = [
      `${xs} sm:col-span-2 sm:row-span-2`, // 0 hero
      `${xs} sm:col-span-1 sm:row-span-2`, // 1 vertical
      `${xs} sm:col-span-2 sm:row-span-1`, // 2 horizontal
      xs,                                   // 3 square
      `${xs} sm:col-span-2 sm:row-span-1`, // 4 horizontal
      xs,                                   // 5 square
    ]
    return { wrapper: map6[index % 6], ratio: "" }
  }

  // Admin drag helpers
  const handlePromoDragStart = (index: number) => {
    if (!isAdmin) return
    setDraggedPromoIndex(index)
  }

  const handlePromoDragOver = (e: React.DragEvent) => {
    if (!isAdmin) return
    e.preventDefault()
  }

  const handlePromoDrop = (dropIndex: number) => {
    if (!isAdmin) return
    if (draggedPromoIndex === null || draggedPromoIndex === dropIndex) return
    // Combine both grids for unified ordering on desktop
    const currentIds = [...promoProducts, ...promoProductsDesktopExtra].map((p) => p.id)
    const moved = [...currentIds]
    const [m] = moved.splice(draggedPromoIndex, 1)
    if (m === undefined) return
    moved.splice(Math.min(dropIndex, moved.length), 0, m)
    // Merge moved order to the front of existing preference
    const merged = [...moved, ...promoOrder.filter((id) => !moved.includes(id))]
    setPromoOrder(merged)
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('promoOrderV1', JSON.stringify(merged))
        window.dispatchEvent(new Event('promoOrderUpdated'))
      }
    } catch {}
    setDraggedPromoIndex(null)
  }

  const getCategories = () => {
    if (typeof window !== 'undefined') {
      try {
        const adminCategories = localStorage.getItem('adminCategories')
        if (adminCategories) {
          try {
            const parsed = JSON.parse(adminCategories)
            // Add icons to categories
            const result = parsed.map((cat: any) => {
              // If category has a custom icon, use it
              if (cat.icon && cat.icon !== "Grid") {
                if (cat.icon.startsWith('<svg')) {
                  // Return SVG content as a special object that will be handled by SvgIcon
                  return {
                    ...cat,
                    icon: { type: 'svg', content: cat.icon }
                  }
                } else {
                  // Map common Lucide icon names to components
                  const iconComponent = 
                    cat.icon === "Gamepad2" ? Gamepad2 :
                    cat.icon === "Laptop" ? Laptop :
                    cat.icon === "Smartphone" ? Smartphone :
                    cat.icon === "Headphones" ? Headphones :
                    cat.icon === "Speaker" ? Speaker :
                    cat.icon === "Monitor" ? Monitor :
                    cat.icon === "Cable" ? Cable :
                    cat.icon === "Keyboard" ? Keyboard :
                    cat.icon === "Mouse" ? Mouse :
                    cat.icon === "Camera" ? Camera :
                    Grid // Default fallback
                  
                  return {
                    ...cat,
                    icon: iconComponent as React.ComponentType<{ className?: string }>
                  }
                }
              }
              
              // Use default icon mapping for existing categories
              return {
                ...cat,
                icon: (cat.id === "all" ? Grid :
                      cat.id === "keyboard" ? Keyboard :
                      cat.id === "mouse" ? Mouse :
                      cat.id === "audio" ? Headphones :
                      cat.id === "speaker" ? Speaker :
                      cat.id === "monitor" ? Camera :
                      cat.id === "accessory" ? Cable : Grid) as React.ComponentType<{ className?: string }>
              }
            })
            return result
          } catch (e) {
            console.error('Error parsing admin categories:', e)
          }
        }
      } catch (error) {
        console.error('Error accessing localStorage:', error)
      }
    }
    return [
      { id: "all", name: "All Products", icon: Grid },
      { id: "keyboard", name: "Keyboards", icon: Keyboard },
      { id: "mouse", name: "Mouse", icon: Mouse },
      { id: "audio", name: "Audio", icon: Headphones },
      { id: "speaker", name: "Speakers", icon: Speaker },
      { id: "monitor", name: "Monitors", icon: Camera },
      { id: "accessory", name: "Accessories", icon: Cable },
    ]
  }

  const [categories, setCategories] = useState<{ id: string; name: string; icon: CategoryIcon }[]>([
    { id: "all", name: "All Products", icon: Grid },
    { id: "keyboard", name: "Keyboards", icon: Keyboard },
    { id: "mouse", name: "Mouse", icon: Mouse },
    { id: "audio", name: "Audio", icon: Headphones },
    { id: "speaker", name: "Speakers", icon: Speaker },
    { id: "monitor", name: "Monitors", icon: Camera },
    { id: "accessory", name: "Accessories", icon: Cable },
  ])

  // Cycle through category icons while the button is visible
  useEffect(() => {
    if (!showBackToCategories || categories.length === 0) return
    const id = setInterval(() => {
      setCategoryIconIndex((prev) => (prev + 1) % categories.length)
    }, 900)
    return () => clearInterval(id)
  }, [showBackToCategories, categories])



  return (
    <div className="text-white min-h-screen transition-colors duration-100 tap-feedback scrollbar-hide gradient-bg">
      <SEOOptimizer structuredData={defaultStructuredData} />
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#F7DD0F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#F7DD0F] font-semibold mb-2">Loading DopeTech...</p>
            <p className="text-gray-400 text-sm mb-4">Fetching products from our database</p>
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-[#F7DD0F] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-[#F7DD0F] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-[#F7DD0F] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Mobile Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 dopetech-nav animate-fade-in-down">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3">
          <nav className="flex items-center justify-between h-auto min-h-16">
            {/* Left Side - Logo */}
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 min-w-0 flex-1 pt-1">
              <img src="/logo/dopelogo.svg" alt="DopeTech" className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 logo-adaptive flex-shrink-0 origin-left scale-[1.3]" />
              
              {/* Tagline - Mobile: Headline Only, Desktop: Both */}
              <div className="ml-2 md:ml-3">
                <p className="text-xs md:text-sm text-gray-300 font-medium leading-tight">
                  Your Setup, <span className="text-[#F7DD0F]">Perfected</span>
                </p>
                <p className="hidden md:block text-xs text-gray-400 leading-tight">
                  Premium Tech Gear from <span className="text-[#F7DD0F]">DopeTech</span> Nepal
                </p>
              </div>
              

            </div>

            {/* Right Side - Controls */}
            <div className="flex items-center justify-end space-x-2 sm:space-x-3 md:space-x-4 lg:space-x-5 flex-shrink-0 pt-1">
              {/* Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 touch-target flex items-center justify-center"
                aria-label="Search"
              >
                <Search className="w-6 h-6 sm:w-6 sm:h-6 md:w-6 md:h-6 hover:text-[#F7DD0F] transition-colors" />
              </button>

              {/* Shopping Cart with Badge */}
              <button 
                onClick={() => setCartOpen(true)}
                className="relative p-2 touch-target flex items-center justify-center" 
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-6 h-6 sm:w-6 sm:h-6 md:w-6 md:h-6 hover:text-[#F7DD0F] transition-colors" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 sm:-top-1 sm:-right-1 md:-top-2 md:-right-2 bg-[#F7DD0F] text-black text-xs rounded-full w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 flex items-center justify-center font-bold animate-bounce">
                    {getCartCount()}
                  </span>
                )}
              </button>

              {/* Instagram Button */}
              <a
                href="https://www.instagram.com/dopetech_np/?hl=ne"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 touch-target flex items-center justify-center"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6 sm:w-6 sm:h-6 md:w-6 md:h-6 hover:text-[#F7DD0F] transition-colors" />
              </a>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 touch-target flex items-center justify-center"
                aria-label="Menu"
                data-mobile-menu
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 hover:text-[#F7DD0F] transition-colors animate-scale-in" />
                ) : (
                  <Menu className="w-6 h-6 hover:text-[#F7DD0F] transition-colors" />
                )}
              </button>
            </div>
          </nav>



          {/* Desktop Search Modal */}
          {isSearchOpen && (
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in"
            >
              <div 
                ref={searchModalRef}
                className="bg-[#1a1a1a] border border-gray-700 rounded-2xl p-6 w-full max-w-2xl mx-4 animate-scale-in mt-20"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">Search Products</h3>
                  <button
                    onClick={() => {
                      setIsSearchOpen(false)
                      setSearchQuery("")
                    }}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    aria-label="Close search"
                  >
                    <X className="w-5 h-5 text-gray-400 hover:text-white" />
                  </button>
                </div>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search for keyboards, mice, headphones, speakers..."
                    value={searchDraft}
                    onChange={(e) => setSearchDraft(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 text-lg bg-white/10 backdrop-blur-sm border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F7DD0F] focus:border-transparent text-white placeholder-gray-400"
                    autoFocus
                  />
                </div>
              </div>
            </div>
          )}

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 animate-slide-in-down bg-black/95 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-gray-700 shadow-2xl md:hidden mobile-menu-enhanced z-50" data-mobile-menu>

              {/* Mobile Tagline */}
              <div className="text-center mb-4 pb-4 border-b border-gray-700">
                <p className="text-sm text-gray-300 font-medium">
                  Your Setup, <span className="text-[#F7DD0F]">Perfected</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Premium Tech Gear from <span className="text-[#F7DD0F]">DopeTech</span> Nepal
                </p>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      handleCategoryClick(category.id)
                      setIsMobileMenuOpen(false)
                    }}
                    className={`w-full flex items-center space-x-3 sm:space-x-4 px-4 sm:px-5 py-3 sm:py-4 rounded-xl transition-all duration-200 touch-target mobile-menu-item ${
                      selectedCategory === category.id
                        ? "bg-[#F7DD0F] text-black shadow-lg"
                        : "text-white bg-white/5 backdrop-blur-md border border-white/20 hover:bg-white/10 hover:border-white/30 shadow-lg"
                    }`}
                    style={{ minHeight: '56px' }}
                  >
                    {/* Category Icon */}
                    <div className={`flex-shrink-0 ${
                      selectedCategory === category.id ? "text-black" : "text-[#F7DD0F]"
                    }`}>
                      {renderCategoryIcon(category.icon, "w-5 h-5 sm:w-6 sm:h-6")}
                    </div>
                    
                    {/* Category Name */}
                    <span className="font-medium text-base sm:text-lg">{category.name}</span>
                  </button>
                ))}
                
                {/* Admin Link */}
                <button
                  onClick={() => {
                    router.push('/admin')
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full flex items-center space-x-3 sm:space-x-4 px-4 sm:px-5 py-3 sm:py-4 rounded-xl transition-all duration-200 touch-target mobile-menu-item text-white bg-red-600/20 backdrop-blur-md border border-red-500/30 hover:bg-red-600/30 hover:border-red-500/50 shadow-lg"
                  style={{ minHeight: '56px' }}
                >
                  <div className="flex-shrink-0 text-red-400">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="font-medium text-base sm:text-lg">Admin Panel</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Welcome Section - Mobile Optimized */}
      <section className="safe-top pb-4 sm:pb-8 md:pb-12 relative mobile-hero" style={{ background: 'linear-gradient(135deg, #000000 0%, #1a1a0a 50%, #000000 100%)', paddingTop: headerOffset }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-4 sm:mb-6 md:mb-8">
            {/* Hero heading removed - now in navigation */}
            {/* Tagline removed - now in navigation */}
            
            {/* Big Sliding Poster - Hero area */}
            <div className="w-full mx-auto mt-3 sm:mt-4 md:mt-6 lg:mt-8 mb-3 sm:mb-4 md:mb-6 lg:mb-6 animate-fade-in-up stagger-3">
              {/* Big Poster with Smooth Shuffling - Larger Size */}
              <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm shadow-2xl">
                <div className="relative h-72 sm:h-80 md:h-96 lg:h-[28rem] xl:h-[32rem] overflow-hidden">
                  {/* Hero Carousel Navigation Buttons - Glassy Style */}
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20">
                    <button
                      onClick={() => {
                        const container = document.querySelector('.flex.overflow-x-auto.scrollbar-hide') as HTMLElement;
                        if (container) {
                          const slideWidth = container.clientWidth;
                          const currentScroll = container.scrollLeft;
                          const newScroll = Math.max(0, currentScroll - slideWidth);
                          container.scrollTo({ left: newScroll, behavior: 'smooth' });
                          
                          // Update poster index
                          const newIndex = Math.round(newScroll / slideWidth);
                          setPosterIndex(Math.max(0, newIndex));
                        }
                      }}
                      disabled={posterIndex === 0}
                      className={`w-12 h-12 rounded-full hero-nav-button left-nav flex items-center justify-center transition-all duration-300 ${
                        posterIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:scale-110'
                      }`}
                      aria-label="Previous slide"
                    >
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  </div>

                  <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20">
                    <button
                      onClick={() => {
                        const container = document.querySelector('.flex.overflow-x-auto.scrollbar-hide') as HTMLElement;
                        if (container) {
                          const slideWidth = container.clientWidth;
                          const currentScroll = container.scrollLeft;
                          const maxScroll = container.scrollWidth - container.clientWidth;
                          const newScroll = Math.min(maxScroll, currentScroll + slideWidth);
                          container.scrollTo({ left: newScroll, behavior: 'smooth' });
                          
                          // Update poster index
                          const newIndex = Math.round(newScroll / slideWidth);
                          const maxIndex = products.filter((p: any) => !p.hiddenOnHome).slice(0, 6).length - 1;
                          setPosterIndex(Math.min(maxIndex, newIndex));
                        }
                      }}
                      disabled={posterIndex === products.filter((p: any) => !p.hiddenOnHome).slice(0, 6).length - 1}
                      className={`w-12 h-12 rounded-full hero-nav-button right-nav flex items-center justify-center transition-all duration-300 ${
                        posterIndex === products.filter((p: any) => !p.hiddenOnHome).slice(0, 6).length - 1 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:scale-110'
                      }`}
                      aria-label="Next slide"
                    >
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>


                  
                  {/* Manually Scrollable Product Images */}
                  <div 
                    className="flex overflow-x-auto scrollbar-hide h-full scroll-smooth"
                    style={{ scrollSnapType: 'x mandatory' }}
                    onScroll={(e) => {
                      const target = e.currentTarget;
                      const scrollPosition = target.scrollLeft;
                      const slideWidth = target.scrollWidth / products.filter((p: any) => !p.hiddenOnHome).slice(0, 6).length;
                      const currentIndex = Math.round(scrollPosition / slideWidth);
                      setPosterIndex(currentIndex);
                    }}
                    onTouchStart={(e) => {
                      // Pause auto-scroll on touch
                      const container = e.currentTarget as HTMLDivElement & { autoResumeTimer?: NodeJS.Timeout };
                      container.classList.add('user-interacting');
                      if (container.autoResumeTimer) {
                        clearTimeout(container.autoResumeTimer);
                      }
                    }}
                    onTouchEnd={(e) => {
                      // Resume auto-scroll after touch ends
                      const container = e.currentTarget as HTMLDivElement & { autoResumeTimer?: NodeJS.Timeout };
                      container.classList.remove('user-interacting');
                      container.autoResumeTimer = setTimeout(() => {
                        if (!container.classList.contains('user-interacting')) {
                          container.classList.remove('user-interacting');
                        }
                      }, 3000); // Resume after 3 seconds of no interaction
                    }}
                    onMouseDown={(e) => {
                      // Pause auto-scroll on mouse down
                      const container = e.currentTarget as HTMLDivElement & { autoResumeTimer?: NodeJS.Timeout };
                      container.classList.add('user-interacting');
                      if (container.autoResumeTimer) {
                        clearTimeout(container.autoResumeTimer);
                      }
                    }}
                    onMouseUp={(e) => {
                      // Resume auto-scroll after mouse up
                      const container = e.currentTarget as HTMLDivElement & { autoResumeTimer?: NodeJS.Timeout };
                      container.classList.remove('user-interacting');
                      container.autoResumeTimer = setTimeout(() => {
                        if (!container.classList.contains('user-interacting')) {
                          container.classList.remove('user-interacting');
                        }
                      }, 3000); // Resume after 3 seconds of no interaction
                    }}
                    onMouseLeave={(e) => {
                      // Resume auto-scroll when mouse leaves
                      const container = e.currentTarget as HTMLDivElement & { autoResumeTimer?: NodeJS.Timeout };
                      container.classList.remove('user-interacting');
                      container.autoResumeTimer = setTimeout(() => {
                        if (!container.classList.contains('user-interacting')) {
                          container.classList.remove('user-interacting');
                        }
                      }, 1000); // Resume faster when mouse leaves
                    }}
                    onKeyDown={(e) => {
                      const target = e.currentTarget as HTMLDivElement & { autoResumeTimer?: NodeJS.Timeout };
                      const slideWidth = target.clientWidth;
                      
                      if (e.key === 'ArrowLeft') {
                        e.preventDefault();
                        target.scrollBy({ left: -slideWidth, behavior: 'smooth' });
                        // Pause auto-scroll on keyboard interaction
                        target.classList.add('user-interacting');
                        if (target.autoResumeTimer) {
                          clearTimeout(target.autoResumeTimer);
                        }
                        target.autoResumeTimer = setTimeout(() => {
                          if (!target.classList.contains('user-interacting')) {
                            target.classList.remove('user-interacting');
                          }
                        }, 3000);
                      } else if (e.key === 'ArrowRight') {
                        e.preventDefault();
                        target.scrollBy({ left: slideWidth, behavior: 'smooth' });
                        // Pause auto-scroll on keyboard interaction
                        target.classList.add('user-interacting');
                        if (target.autoResumeTimer) {
                          clearTimeout(target.autoResumeTimer);
                        }
                        target.autoResumeTimer = setTimeout(() => {
                          if (!target.classList.contains('user-interacting')) {
                            target.classList.remove('user-interacting');
                          }
                        }, 3000);
                      }
                    }}
                    tabIndex={0}
                    role="region"
                    aria-label="Hero product carousel - use arrow keys or drag to scroll"
                  >
                    {products.filter((p: any) => !p.hiddenOnHome).slice(0, 6).map((product, index) => (
                      <div 
                        key={`poster-${product.id}`} 
                        className="relative flex-shrink-0 w-full h-full"
                        style={{ scrollSnapAlign: 'start' }}
                      >
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                        
                        {/* Product Info Overlay - Simplified */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-5 lg:p-6">
                          <div className="max-w-xs sm:max-w-sm md:max-w-xl">
                            <h3 className="text-white font-bold text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-1 sm:mb-2 md:mb-3 line-clamp-2">
                              {product.name}
                            </h3>
                            <p className="text-gray-300 text-xs sm:text-sm md:text-base lg:text-lg mb-2 sm:mb-3 md:mb-4 max-w-xs sm:max-w-sm md:max-w-md line-clamp-2">
                              Experience premium quality and cutting-edge technology
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Navigation Dots - Mobile Optimized */}
                  <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1.5 sm:space-x-2">
                    {products.filter((p: any) => !p.hidden_on_home).slice(0, 6).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          const container = document.querySelector('.flex.overflow-x-auto.scrollbar-hide') as HTMLElement;
                          if (container) {
                            const slideWidth = container.clientWidth;
                            container.scrollTo({ left: index * slideWidth, behavior: 'smooth' });
                            setPosterIndex(index);
                          }
                        }}
                        className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-200 ${
                          index === posterIndex 
                            ? 'bg-[#F7DD0F] scale-125' 
                            : 'bg-white/30 hover:bg-white/60'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                  

                </div>
              </div>
            </div>

            {/* Dope Picks Section - Now in main content area */}
            <div className="w-full mx-auto mt-6 sm:mt-8 md:mt-10 mb-6 sm:mb-8 md:mb-10 animate-fade-in-up stagger-4">
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3">
                  Dope <span className="text-[#F7DD0F]">Picks</span>
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-gray-400">
                  Latest dope drops
                </p>
              </div>
              
              {/* Marquee Layout - All Devices */}
              <div className="relative overflow-hidden cv-auto">
                
                <div 
                  className="flex space-x-4 sm:space-x-6 md:space-x-8 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 scroll-smooth"
                  onScroll={(e) => {
                    const target = e.currentTarget;
                    if (target.scrollLeft > 0) {
                      target.classList.add('user-scrolling');
                    } else {
                      target.classList.remove('user-scrolling');
                    }
                  }}
                  onTouchStart={() => {
                    const marquee = document.querySelector('.animate-marquee') as HTMLElement;
                    if (marquee) marquee.style.animationPlayState = 'paused';
                  }}
                  onTouchEnd={() => {
                    const marquee = document.querySelector('.animate-marquee') as HTMLElement;
                    if (marquee) marquee.style.animationPlayState = 'running';
                  }}
                  onMouseDown={() => {
                    const marquee = document.querySelector('.animate-marquee') as HTMLElement;
                    if (marquee) marquee.style.animationPlayState = 'paused';
                  }}
                  onMouseUp={() => {
                    const marquee = document.querySelector('.animate-marquee') as HTMLElement;
                    marquee.style.animationPlayState = 'running';
                  }}
                  onMouseLeave={() => {
                    const marquee = document.querySelector('.animate-marquee') as HTMLElement;
                    if (marquee) marquee.style.animationPlayState = 'running';
                  }}
                  onKeyDown={(e) => {
                    const target = e.currentTarget;
                    const scrollAmount = 200;
                    
                    if (e.key === 'ArrowLeft') {
                      e.preventDefault();
                      target.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
                      const marquee = document.querySelector('.animate-marquee') as HTMLElement;
                      if (marquee) marquee.style.animationPlayState = 'paused';
                      setTimeout(() => {
                        if (marquee) marquee.style.animationPlayState = 'running';
                      }, 1000);
                    } else if (e.key === 'ArrowRight') {
                      e.preventDefault();
                      target.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                      const marquee = document.querySelector('.animate-marquee') as HTMLElement;
                      if (marquee) marquee.style.animationPlayState = 'paused';
                      setTimeout(() => {
                        if (marquee) marquee.style.animationPlayState = 'running';
                      }, 1000);
                    }
                  }}
                  tabIndex={0}
                  role="region"
                  aria-label="Product carousel - use arrow keys or drag to scroll"
                >
                  {/* Continuous Marquee Row */}
                  <div className="flex animate-marquee space-x-4 sm:space-x-6 md:space-x-8 min-w-max">
                    {/* First set of products */}
                    {products.filter((p: any) => !p.hidden_on_home).map((product, index) => (
                      <div key={`marquee-first-${product.id}`} className="group relative flex-shrink-0">
                        <div className="relative overflow-hidden rounded-2xl w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 bg-gradient-to-br from-white/5 to-white/10 border border-white/10 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110 group-hover:rotate-1"
                          />
                          
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          {/* Product Info Overlay */}
                          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-5 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                            <h3 className="text-white font-bold text-sm sm:text-base md:text-lg mb-2 line-clamp-2">{product.name}</h3>
                            <p className="text-[#F7DD0F] font-bold text-sm sm:text-base md:text-lg mb-3">Rs {product.price}</p>
                            <button
                              onClick={() => handleAddToCartWithTracking(product)}
                              className="bg-[#F7DD0F] text-black px-3 py-2 sm:px-4 sm:py-2.5 rounded-full font-semibold hover:bg-[#F7DD0F]/90 transition-all duration-200 hover:scale-105 shadow-lg text-xs sm:text-sm w-full"
                            >
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Duplicate set for seamless loop */}
                    {products.filter((p: any) => !p.hidden_on_home).map((product, index) => (
                      <div key={`marquee-second-${product.id}`} className="group relative flex-shrink-0">
                        <div className="relative overflow-hidden rounded-2xl w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 bg-gradient-to-br from-white/5 to-white/10 border border-white/10 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110 group-hover:rotate-1"
                          />
                          
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          {/* Product Info Overlay */}
                          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-5 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                            <h3 className="text-white font-bold text-sm sm:text-base md:text-lg mb-2 line-clamp-2">{product.name}</h3>
                            <p className="text-[#F7DD0F] font-bold text-sm sm:text-base md:text-lg mb-3">Rs {product.price}</p>
                            <button
                              onClick={() => handleAddToCartWithTracking(product)}
                              className="bg-[#F7DD0F] text-black px-3 py-2 sm:px-4 sm:py-2.5 rounded-full font-semibold hover:bg-[#F7DD0F]/90 transition-all duration-200 hover:scale-105 shadow-lg text-xs sm:text-sm w-full"
                            >
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Scroll Hint */}
                <div className="text-center mt-2 text-xs text-gray-500 scroll-hint">
                  <span className="hidden sm:inline">← Drag to scroll • </span>
                  <span className="sm:hidden">← Swipe to scroll • </span>
                  Auto-scrolls when idle
                </div>
              </div>
            </div>

            {/* Dope Weekly Picks Section - 2x2 Grid */}
            <div className="w-full mx-auto mt-8 sm:mt-10 md:mt-12 mb-6 sm:mb-8 md:mb-10 animate-fade-in-up stagger-5">
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3">
                  Dope <span className="text-[#F7DD0F]">Weekly Picks</span>
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-gray-400">
                  This week's featured selections
                </p>
              </div>
              
              {/* 2x2 Grid Layout - 2x Bigger than Marquee */}
              <div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto">
                {products.filter((p: any) => !p.hidden_on_home).slice(0, 4).map((product, index) => (
                  <div key={`weekly-pick-${product.id}`} className="group relative animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div 
                      className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white/5 to-white/10 border-0 sm:border sm:border-white/10 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-rotate-1 cursor-pointer"
                      onClick={() => router.push(`/product/${product.id}`)}
                    >
                      {/* 2x Bigger than marquee: w-80 h-80 sm:w-96 sm:h-96 md:w-[28rem] md:h-[28rem] lg:w-[32rem] lg:h-[32rem] */}
                      <div className="w-80 h-80 sm:w-96 sm:h-96 md:w-[28rem] md:h-[28rem] lg:w-[32rem] lg:h-[32rem] mx-auto">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                        />
                      </div>
                      
                      {/* Enhanced Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                      
                      {/* Product Info Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                        <div className="space-y-3 sm:space-y-4">
                          <h3 className="text-white font-bold text-lg sm:text-xl lg:text-2xl mb-2 line-clamp-2 leading-tight">{product.name}</h3>
                          <p className="text-[#F7DD0F] font-bold text-xl sm:text-2xl lg:text-3xl mb-3">Rs {product.price}</p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleAddToCartWithTracking(product)
                            }}
                            className="bg-[#F7DD0F] text-black px-4 py-2 sm:px-5 sm:py-3 rounded-xl font-bold hover:bg-[#F7DD0F]/90 transition-all duration-300 hover:shadow-2xl w-full text-sm sm:text-base shadow-lg z-10 relative cursor-pointer"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                      

                      

                      

                      
                      {/* Floating Elements */}
                      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                        <div className="w-3 h-3 bg-[#F7DD0F] rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dope Categories Header */}
            <div className="text-center mb-4 sm:mb-6 animate-fade-in-up stagger-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3">
                Dope <span className="text-[#F7DD0F]">Categories</span>
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-400">
                Filter by your favorite tech categories
              </p>
            </div>

            {/* Category Filter - Mobile Optimized with Smaller Touch Targets */}
            <div ref={categorySectionRef} className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8 md:mb-10 px-2 animate-fade-in-up stagger-5 hero-spacing">
              {/* First row */}
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 w-full">
                {categories.slice(0, 3).map((category, index) => (
                  <div key={category.id} className="relative animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <button
                      onClick={() => handleCategoryClick(category.id)}
                      className={`flex items-center space-x-2 px-3 sm:px-4 md:px-5 py-2 sm:py-3 md:py-4 rounded-full transition-all duration-200 cursor-pointer text-xs sm:text-sm md:text-base touch-target hover-scale hover-glow min-h-[36px] ${
                        selectedCategory === category.id
                          ? "bg-[#F7DD0F] text-black shadow-lg animate-pulse font-bold"
                          : "bg-white/5 backdrop-blur-md border-0 sm:border sm:border-white/20 hover:bg-white/10 sm:hover:border-white/30 font-medium shadow-lg"
                      }`}
                      aria-label={`Filter by ${category.name}`}
                    >
                      {/* Category Icon */}
                      <div className={`flex-shrink-0 ${
                        selectedCategory === category.id ? "text-black" : "text-[#F7DD0F]"
                      }`}>
                        {renderCategoryIcon(category.icon, "w-4 h-4 sm:w-5 sm:h-5")}
                      </div>
                      
                      {/* Category Name */}
                      <span>{category.name}</span>
                    </button>
                  </div>
                ))}
              </div>
              
              {/* Divider */}
              <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent my-2 sm:my-3 opacity-50"></div>
              
              {/* Second row */}
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 w-full">
                {categories.slice(3).map((category, index) => (
                  <div key={category.id} className="relative animate-fade-in-up" style={{ animationDelay: `${(index + 3) * 0.1}s` }}>
                    <button
                      onClick={() => handleCategoryClick(category.id)}
                      className={`flex items-center space-x-2 px-3 sm:px-4 md:px-5 py-2 sm:py-3 md:py-4 rounded-full transition-all duration-200 cursor-pointer text-xs sm:text-sm md:text-base touch-target hover-scale hover-glow min-h-[36px] ${
                        selectedCategory === category.id
                          ? "bg-[#F7DD0F] text-black shadow-lg animate-pulse font-bold"
                          : "bg-white/5 backdrop-blur-md border-0 sm:border sm:border-white/20 hover:bg-white/10 sm:hover:border-white/30 font-medium shadow-lg"
                      }`}
                      aria-label={`Filter by ${category.name}`}
                    >
                      {/* Category Icon */}
                      <div className={`flex-shrink-0 ${
                        selectedCategory === category.id ? "text-black" : "text-[#F7DD0F]"
                      }`}>
                        {renderCategoryIcon(category.icon, "w-4 h-4 sm:w-5 sm:h-5")}
                      </div>
                      
                      {/* Category Name */}
                      <span>{category.name}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid - Enhanced Mobile & Desktop UX */}
          <div 
            data-products-section
            className={`grid gap-4 sm:gap-6 md:gap-8 mt-6 sm:mt-8 md:mt-10 cv-auto ${
              viewMode === "grid" 
                ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                : "grid-cols-1"
            }`}>
            {filteredProducts.map((product, index) => (
              <div key={product.id} data-product-id={product.id} className="group animate-fade-in-up mobile-product-card hover-lift" style={{ animationDelay: `${index * 0.1}s` }}>
                                <div 
                                  className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                                  onClick={() => router.push(`/product/${product.id}`)}
                                >
                  {/* Product Image with Enhanced Hover Effects */}
                  <div className="relative image-container overflow-hidden rounded-2xl aspect-square">
                      <img
                      src={product.image_url}
                      alt={product.name}
                        className="w-full h-full object-cover object-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-1"
                        loading="lazy"
                        decoding="async"
                    />
                    
                    {/* Gradient Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Mobile In-Stock badge at top-right */}
                    {product.in_stock && (
                      <div className="absolute top-2 right-2 sm:hidden px-2 py-1 rounded-full text-[10px] font-medium bg-green-500/20 backdrop-blur-md text-green-100 border border-green-500/30 shadow-lg">
                        In Stock
                      </div>
                    )}

                    {/* Product overlay content - Mobile & Desktop */}
                    <div className="absolute inset-x-0 bottom-0 p-2 sm:p-4 pointer-events-auto">
                      <h3 className="text-white font-semibold text-xs sm:text-sm line-clamp-2 mb-1 leading-snug">{product.name}</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col leading-tight">
                          <span className="text-[#F7DD0F] font-bold text-xs sm:text-sm">Rs {product.price}</span>
                          {product.original_price > product.price && (
                            <span className="text-[10px] sm:text-xs text-gray-300 line-through">Rs {product.original_price}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              addToCart(product)
                            }}
                            disabled={!product.in_stock}
                            aria-label="Add to cart"
                            className={`inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow transition-transform active:scale-95 cursor-pointer z-10 relative ${
                              product.in_stock
                                ? "bg-[#F7DD0F] text-black hover:bg-[#F7DD0F]/90"
                                : "bg-gray-500/40 text-gray-300 cursor-not-allowed"
                            }`}
                          >
                            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Stock Status Badge */}
                    {!product.in_stock && (
                      <div className="absolute top-3 right-3 bg-red-500/20 backdrop-blur-md text-red-100 border border-red-500/30 px-3 py-1.5 rounded-full text-sm font-medium shadow-lg">
                        Out of Stock
                      </div>
                    )}
                    
                    {/* Quick View Overlay */}
                    <div className="hidden sm:flex absolute inset-0 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                        Quick View
                      </div>
                    </div>
                    

                  </div>


                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GIF Section - Moved from hero area */}
      <section className="pt-8 sm:pt-12 pb-20 sm:pb-24 overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #000000 0%, #1a1a0a 50%, #000000 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-6 sm:mb-8 md:mb-10 animate-fade-in-up">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3">
              Dope <span className="text-[#F7DD0F]">Recommendations</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-400">
              Grab these and more on our Instagram
            </p>
          </div>

          {/* GIF Container */}
          <div className="w-full mx-auto animate-fade-in-up borderless-glow cv-auto rounded-2xl overflow-hidden ring-1 ring-white/10">
            <img
              src={(() => {
                if (typeof window !== 'undefined') {
                  const customGifPath = localStorage.getItem('customGifPath')
                  const customGifData = localStorage.getItem('customGifData')
                  const customGifUrl = localStorage.getItem('customGifUrl')
                  
                  if (customGifData) {
                    return customGifData
                  } else if (customGifUrl) {
                    return customGifUrl
                  } else if (customGifPath && customGifPath !== '/gif/doptechgif.gif') {
                    return customGifPath
                  }
                }
                return "/gif/doptechgif.gif"
              })()}
              alt="DopeTech Introduction"
              className="w-full h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 shadow-xl object-cover object-center"
              loading="lazy"
              decoding="async"
              key={animationKey}
            />
          </div>
        </div>
      </section>

      {/* Shopping Cart Sidebar - Mobile Optimized */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setCartOpen(false)}
          />
          
          {/* Cart Panel */}
          <div className="relative ml-auto w-full max-w-sm sm:max-w-md bg-white dark:bg-[#1a1a1a] shadow-2xl rounded-l-2xl">
            <div className="flex flex-col h-full">
              {/* Cart Header */}
              <div className="flex items-center justify-between p-3 sm:p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-base sm:text-lg md:text-xl font-semibold">Shopping Cart</h2>
                <button
                  onClick={() => setCartOpen(false)}
                  className="p-2 sm:p-3 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-full transition-colors touch-target"
                  style={{ minHeight: '44px', minWidth: '44px' }}
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 scrollbar-hide">
                {cart.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <ShoppingBag className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                    <p className="text-sm sm:text-base text-gray-400">Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 dark:bg-[#2a2a2a] rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-xs sm:text-sm line-clamp-2 leading-tight">{item.name}</h3>
                          <p className="text-[#F7DD0F] font-bold text-sm sm:text-base">Rs {item.price}</p>
                        </div>
                        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 sm:p-1.5 hover:bg-gray-200 dark:hover:bg-[#2a2a2a] rounded touch-target"
                            style={{ minHeight: '44px', minWidth: '44px' }}
                          >
                            <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                          <span className="w-6 sm:w-8 text-center font-medium text-sm sm:text-base">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 sm:p-1.5 hover:bg-gray-200 dark:hover:bg-[#2a2a2a] rounded touch-target"
                            style={{ minHeight: '44px', minWidth: '44px' }}
                          >
                            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 sm:p-1.5 hover:bg-red-100 dark:hover:bg-red-900/20 rounded text-red-500 touch-target"
                          style={{ minHeight: '44px', minWidth: '44px' }}
                        >
                          <X className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart Footer */}
              {cart.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 p-3 sm:p-4 md:p-6">
                  <div className="flex justify-between items-center mb-3 sm:mb-4">
                    <span className="text-base sm:text-lg font-semibold">Total:</span>
                    <span className="text-xl sm:text-2xl font-bold text-[#F7DD0F]">Rs {getCartTotal().toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={handleCheckout}
                    className="w-full bg-[#F7DD0F] text-black py-3 sm:py-3.5 md:py-4 px-4 rounded-xl font-medium hover:bg-[#F7DD0F]/90 transition-colors touch-target"
                    style={{ minHeight: '48px' }}
                  >
                    Checkout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer - Mobile Optimized */}
      <footer className="bg-black py-4 sm:py-6 border-t-2 border-[#F7DD0F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <img src="/logo/dopelogo.svg" alt="DopeTech" className="w-10 h-10 sm:w-12 sm:h-12 logo-adaptive" />
              <span className="text-xs sm:text-sm text-white jakarta-light">© 2025 DopeTech Nepal. All rights reserved.</span>
            </div>

            <div className="flex space-x-6 sm:space-x-8">
              <a href="#" className="text-xs sm:text-sm text-gray-400 hover:text-[#F7DD0F] transition-colors cursor-hover jakarta-light">
                Privacy Policy
              </a>
              <a href="#" className="text-xs sm:text-sm text-gray-400 hover:text-[#F7DD0F] transition-colors cursor-hover jakarta-light">
                Terms of Use
              </a>
              <a href="#" className="text-xs sm:text-sm text-gray-400 hover:text-[#F7DD0F] transition-colors cursor-hover jakarta-light">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>



      {/* Jump to Categories floating button */}
      {showBackToCategories && !cartOpen && !checkoutModalOpen && (
        <button
          onClick={scrollToCategoryFilters}
          className="fixed right-4 md:right-6 bottom-24 md:bottom-28 z-50 flex items-center gap-2 px-4 py-3 rounded-full frosted-glass-yellow frosted-glass-yellow-hover"
          aria-label="Jump to categories"
        >
          {/* Circle icon wrapper styled like the chat icon */}
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#F7DD0F] text-black shadow-lg overflow-hidden">
            {(() => {
              const item = categories[categoryIconIndex]
              if (!item) return null
              const key = `${item.id}-${categoryIconIndex}`
              const commonClasses = "w-5 h-5 animate-fade-in animate-scale-in will-change-opacity will-change-transform"
              if (typeof item.icon === 'object' && 'type' in item.icon && (item.icon as any).type === 'svg') {
                return (
                  <span key={key} className="inline-flex items-center justify-center">
                    <SvgIcon svgContent={(item.icon as { type: 'svg', content: string }).content} className={commonClasses} />
                  </span>
                )
              }
              const IconComp = item.icon as React.ComponentType<{ className?: string }>
              return (
                <span key={key} className="inline-flex items-center justify-center">
                  <IconComp className={commonClasses} />
                </span>
              )
            })()}
          </span>
          <span className="text-sm font-bold">Jump to <span className="text-[#F7DD0F]">Categories</span></span>
        </button>
      )}

      {/* AI Chat Assistant (lazy) - hidden during checkout or cart open */}
      {!checkoutModalOpen && !cartOpen && (
        <LazyAIChat products={products} onAddToCart={addToCart} />
      )}

      {/* Checkout Modal */}
      <SupabaseCheckout
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        cart={cart}
        total={getCartTotal()}
        onCartReset={handleCartReset}
      />
    </div>
  )
}
