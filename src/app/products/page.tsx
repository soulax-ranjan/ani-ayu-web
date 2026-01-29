'use client'

import { useState, useMemo, Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Grid, SlidersHorizontal, X } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import ProductFilters from '@/components/ProductFilters'
import { useProducts } from '@/lib/hooks'
import { Filters, Product } from '@/types/product'
import { Product as APIProduct } from '@/lib/api'

// Convert API Product to Frontend Product format
function transformAPIProduct(apiProduct: APIProduct): Product {
  // Map category_id to category name
  const getCategoryName = (categoryId: string): 'boys' | 'girls' => {
    // Girls category UUID
    if (categoryId === '22222222-2222-2222-2222-222222222222') {
      return 'girls'
    }
    // All other categories are boys
    return 'boys'
  }

  return {
    id: apiProduct.id,
    name: apiProduct.name,
    image: apiProduct.image_url,
    images: apiProduct.images,
    price: apiProduct.price,
    originalPrice: apiProduct.original_price,
    rating: apiProduct.rating,
    reviewCount: apiProduct.review_count,
    category: getCategoryName(apiProduct.category_id),
    sizes: apiProduct.sizes,
    description: apiProduct.description,
    features: apiProduct.features,
    ageRange: apiProduct.age_range,
    material: apiProduct.material,
    occasion: apiProduct.occasion,
    customizable: apiProduct.customizable
  }
}

function ProductsContent() {
  const searchParams = useSearchParams()
  const categoryFromUrl = searchParams?.get('category') || ''
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const [filters, setFilters] = useState<Filters>({
    category: categoryFromUrl ? [categoryFromUrl] : [],
    priceRange: [0, 10000],
    sizes: [],
    sortBy: 'popularity'
  })

  // Sync filters with URL changes
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      category: categoryFromUrl ? [categoryFromUrl] : []
    }))
  }, [categoryFromUrl])

  // Fetch ALL products from API (no filtering)
  const { data, loading, error } = useProducts({})

  const allProducts = (data?.products || []).map(transformAPIProduct)

  // Filter products on the frontend
  const filteredProducts = useMemo(() => {
    let filtered = allProducts

    // Filter by category
    if (filters.category.length > 0) {
      filtered = filtered.filter(p =>
        filters.category.includes(p.category)
      )
    }

    // Filter by price range
    filtered = filtered.filter(p =>
      p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    )

    // Filter by sizes
    if (filters.sizes.length > 0) {
      filtered = filtered.filter(p =>
        p.sizes?.some(size => filters.sizes.includes(size))
      )
    }

    // Sort products
    if (filters.sortBy === 'price-low') {
      filtered = [...filtered].sort((a, b) => a.price - b.price)
    } else if (filters.sortBy === 'price-high') {
      filtered = [...filtered].sort((a, b) => b.price - a.price)
    } else if (filters.sortBy === 'rating') {
      filtered = [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0))
    }

    // Show only customizable products when no category is selected
    if (filters.category.length === 0) {
      filtered = filtered.filter(p => p.customizable === true)
    }

    return filtered
  }, [allProducts, filters])

  const hasActiveFilters = filters.category.length > 0 || filters.sizes.length > 0 ||
    filters.priceRange[0] > 0 || filters.priceRange[1] < 10000

  const resetFilters = () => {
    setFilters({
      category: [],
      priceRange: [0, 10000],
      sizes: [],
      sortBy: 'popularity'
    })
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream">
        <div className="max-w-[1400px] mx-auto px-4 py-6 md:py-8">
          {/* Filter Button - Right Aligned */}
          <div className="mb-6 md:mb-8 flex justify-end">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-primary to-amber-400 hover:from-amber-500 hover:to-primary text-gray-900 px-4 md:px-6 py-2.5 md:py-3 rounded-full font-bold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
            >
              <SlidersHorizontal size={20} />
              <span className="hidden sm:inline">Filters</span>
              {hasActiveFilters && (
                <span className="bg-white text-primary text-xs px-2 py-0.5 rounded-full font-bold">
                  {filters.category.length + filters.sizes.length}
                </span>
              )}
            </button>
          </div>

          {/* Products Grid */}
          <div>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Loading products...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-400 mb-4">
                  <Grid size={64} className="mx-auto" />
                </div>
                <h3 className="text-xl font-[var(--font-heading)] font-semibold text-red-600 mb-2">Error loading products</h3>
                <p className="text-gray-500">{error}</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Grid size={64} className="mx-auto" />
                </div>
                <h3 className="text-xl font-[var(--font-heading)] font-semibold text-gray-600 mb-2">No products found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your filters to see more results.</p>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full font-semibold transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Filter Slider Panel */}
      {isFilterOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 z-40 transition-opacity"
            onClick={() => setIsFilterOpen(false)}
          />

          {/* Slider Panel */}
          <div className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-white z-50 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 md:p-6 z-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">Filters</h2>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close filters"
                >
                  <X size={24} className="text-gray-600" />
                </button>
              </div>

              {/* Reset Button */}
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-2.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <X size={18} />
                  Reset All Filters
                </button>
              )}
            </div>

            {/* Filters Content */}
            <div className="p-4 md:p-6">
              <ProductFilters
                filters={filters}
                onFiltersChange={setFilters}
              />
            </div>

            {/* Apply Button (Sticky Footer) */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 md:p-6">
              <button
                onClick={() => setIsFilterOpen(false)}
                className="w-full bg-gradient-to-r from-primary to-amber-400 hover:from-amber-500 hover:to-primary text-gray-900 px-6 py-3.5 rounded-full font-bold shadow-lg shadow-primary/30 transition-all duration-300 hover:shadow-xl"
              >
                Show {filteredProducts.length} Products
              </button>
            </div>
          </div>
        </>
      )}

      <Footer />
    </>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  )
}
