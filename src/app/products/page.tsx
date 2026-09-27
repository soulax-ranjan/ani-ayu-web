'use client'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

import { useState, useMemo, Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Grid, SlidersHorizontal, X } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import ProductFilters, { PRICE_MAX, SORT_OPTIONS } from '@/components/ProductFilters'
import { useProducts } from '@/lib/hooks'
import { Filters, Product } from '@/types/product'
import { Product as APIProduct, IS_PRODUCTION } from '@/lib/api'

// Convert API Product to Frontend Product format
function transformAPIProduct(apiProduct: APIProduct): Product {
  // Map category_id to category name/slug
  const getCategoryName = (product: APIProduct): string => {
    // Use the populated category slug or name if available
    if (product.category?.slug) return product.category.slug;
    if (product.category?.name) return product.category.name.toLowerCase();

    // Fallback to legacy UUID check
    if (product.category_id === '22222222-2222-2222-2222-222222222222') {
      return 'girls'
    }
    // All other categories are boys for now, or match existing logic
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
    category: getCategoryName(apiProduct),
    category_id: apiProduct.category_id,
    sizes: apiProduct.sizes,
    description: apiProduct.description,
    features: apiProduct.features,
    ageRange: apiProduct.age_range,
    material: apiProduct.material,
    occasion: apiProduct.occasion,
    customizable: apiProduct.customizable,
    allProduct: apiProduct.allProduct,
    section: apiProduct.section,
    status: apiProduct.status || 'active'
  }
}

function ProductsContent() {
  const searchParams = useSearchParams()
  const categoryFromUrl = searchParams?.get('category') || ''
  const sectionFromUrl = searchParams?.get('section')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const [filters, setFilters] = useState<Filters>({
    category: categoryFromUrl ? [categoryFromUrl] : [],
    priceRange: [0, PRICE_MAX],
    sizes: [],
    sortBy: 'popularity',
    section: sectionFromUrl ? parseInt(sectionFromUrl) : undefined
  })

  // Sync filters with URL changes
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      category: categoryFromUrl ? [categoryFromUrl] : [],
      section: sectionFromUrl ? parseInt(sectionFromUrl) : undefined
    }))
  }, [categoryFromUrl, sectionFromUrl])

  // Fetch ALL products from API (no filtering)
  const { data, loading, error } = useProducts({})

  const allProducts = (data?.products || []).map(transformAPIProduct)

  // Filter products on the frontend
  const filteredProducts = useMemo(() => {
    let filtered = allProducts

    // Known real categories from the API
    const knownCategories = ['boys', 'girls']

    // Check if the requested category is a real one we can filter by
    const hasKnownCategory = filters.category.length > 0 &&
      filters.category.some(cat => knownCategories.includes(cat.toLowerCase()))

    // Filter by category (only if it's a real/known category)
    if (hasKnownCategory) {
      filtered = filtered.filter(p =>
        filters.category.some(cat =>
          p.category.toLowerCase() === cat.toLowerCase() ||
          p.category_id === cat
        )
      )
    }

    // Filter by section (only if section data exists on products)
    if (filters.section) {
      const sectionProducts = filtered.filter(p => p.section === filters.section)
      // Only apply section filter if it actually returns results
      if (sectionProducts.length > 0) {
        filtered = sectionProducts
      }
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

    // Show only products marked for "all products" display when no real category/section filter is active
    if (!hasKnownCategory && !filters.section) {
      filtered = filtered.filter(p => p.allProduct === true)
    }

    // Only show active products in production; in dev show all
    if (IS_PRODUCTION) {
      filtered = filtered.filter(p => p.status === 'active')
    }

    return filtered
  }, [allProducts, filters])

  const priceActive = filters.priceRange[0] > 0 || filters.priceRange[1] < PRICE_MAX
  const activeCount = filters.category.length + filters.sizes.length + (priceActive ? 1 : 0)
  const hasActiveFilters = activeCount > 0

  // Age sizes that actually exist on products, youngest first ("2-3 Years", "3-4 Years", ...)
  const availableSizes = useMemo(() => {
    const sizes = new Set<string>()
    ;(data?.products || []).forEach((p) => p.sizes?.forEach((size) => sizes.add(size)))
    return [...sizes].sort((a, b) => (parseFloat(a) || 0) - (parseFloat(b) || 0))
  }, [data])

  const pageTitle =
    filters.category.length === 1 ? (filters.category[0] === 'girls' ? 'Girls' : filters.category[0] === 'boys' ? 'Boys' : 'Shop All') : 'Shop All'

  const resetFilters = () => {
    setFilters({
      category: [],
      priceRange: [0, PRICE_MAX],
      sizes: [],
      sortBy: filters.sortBy,
      section: undefined
    })
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream">
        <div className="max-w-[1400px] mx-auto px-4 py-6 md:py-8">
          {/* Toolbar */}
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-ink">{pageTitle}</h1>
              {!loading && (
                <p className="mt-1 text-sm text-ink/60 tabular-nums">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'style' : 'styles'}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <select
                aria-label="Sort products"
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as Filters['sortBy'] })}
                className="hidden md:block rounded-full bg-white ring-1 ring-stone-200 hover:ring-primary/60 px-4 py-2.5 text-sm font-medium text-ink outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>Sort: {option.label}</option>
                ))}
              </select>
              <button
                onClick={() => setIsFilterOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-white ring-1 ring-stone-200 hover:ring-primary/60 hover:text-primary px-4 py-2.5 text-sm font-semibold text-ink transition-colors"
              >
                <SlidersHorizontal size={16} />
                Filters
                {activeCount > 0 && (
                  <span className="grid place-items-center w-5 h-5 rounded-full bg-primary text-white text-[11px] tabular-nums">
                    {activeCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Quick category tabs + active filter chips */}
          <div className="mb-6 md:mb-8 flex items-center gap-2 overflow-x-auto -mx-4 px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {[{ value: '', label: 'All' }, { value: 'girls', label: 'Girls' }, { value: 'boys', label: 'Boys' }].map((tab) => {
              const active = tab.value ? filters.category.length === 1 && filters.category[0] === tab.value : filters.category.length === 0
              return (
                <button
                  key={tab.label}
                  onClick={() => setFilters({ ...filters, category: tab.value ? [tab.value] : [] })}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    active ? 'bg-primary text-white' : 'bg-white text-ink/70 ring-1 ring-stone-200 hover:text-primary hover:ring-primary/60'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}

            {(filters.sizes.length > 0 || priceActive) && <span className="shrink-0 w-px h-6 bg-stone-300 mx-1" />}

            {filters.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setFilters({ ...filters, sizes: filters.sizes.filter((s) => s !== size) })}
                className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-3 py-2 text-sm font-medium hover:bg-primary/15"
                aria-label={`Remove ${size}`}
              >
                {size}
                <X size={14} />
              </button>
            ))}
            {priceActive && (
              <button
                onClick={() => setFilters({ ...filters, priceRange: [0, PRICE_MAX] })}
                className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-3 py-2 text-sm font-medium hover:bg-primary/15 tabular-nums"
                aria-label="Remove price filter"
              >
                ₹{filters.priceRange[0].toLocaleString('en-IN')} – {filters.priceRange[1] >= PRICE_MAX ? 'any' : `₹${filters.priceRange[1].toLocaleString('en-IN')}`}
                <X size={14} />
              </button>
            )}
            {hasActiveFilters && (
              <button onClick={resetFilters} className="shrink-0 px-2 py-2 text-sm font-medium text-ink/60 underline underline-offset-4 hover:text-primary">
                Clear all
              </button>
            )}
          </div>

          {/* Products Grid */}
          <div>
            {loading ? (
              <div className="text-center py-12">
                <div className="relative w-20 h-20 mx-auto animate-pulse">
                  <Image
                    src="/assets/logo/small-logo.png"
                    alt="Loading..."
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                </div>
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
              <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
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

      {/* Filter drawer */}
      {isFilterOpen && (
        <>
          <div className="fixed inset-0 bg-ink/40 backdrop-blur-[2px] z-40" onClick={() => setIsFilterOpen(false)} />

          <div
            role="dialog"
            aria-modal="true"
            aria-label="Filters"
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] bg-[#fdfbf7] z-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 md:px-6 py-4 border-b border-stone-200/70 bg-white">
              <div className="flex items-baseline gap-2">
                <h2 className="font-heading text-xl font-bold text-ink">Filters</h2>
                {activeCount > 0 && <span className="text-sm text-ink/50 tabular-nums">({activeCount})</span>}
              </div>
              <div className="flex items-center gap-1">
                {hasActiveFilters && (
                  <button onClick={resetFilters} className="px-3 py-2 text-sm font-medium text-primary hover:underline underline-offset-4">
                    Clear all
                  </button>
                )}
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="p-2 rounded-full hover:bg-stone-100 transition-colors"
                  aria-label="Close filters"
                >
                  <X size={22} className="text-ink/70" />
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="flex-1 overflow-y-auto px-5 md:px-6">
              <ProductFilters filters={filters} onFiltersChange={setFilters} availableSizes={availableSizes} />
            </div>

            {/* Footer */}
            <div className="border-t border-stone-200/70 bg-white px-5 md:px-6 py-4">
              <button
                onClick={() => setIsFilterOpen(false)}
                className="w-full rounded-full bg-primary hover:bg-primary-hover text-white py-3.5 font-semibold shadow-lg shadow-primary/25 transition-colors tabular-nums"
              >
                Show {filteredProducts.length} {filteredProducts.length === 1 ? 'style' : 'styles'}
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
          <div className="relative w-20 h-20 mx-auto animate-pulse">
            <Image
              src="/assets/logo/small-logo.png"
              alt="Loading..."
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  )
}
