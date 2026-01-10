'use client'

import { useState, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Grid } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import ProductFilters from '@/components/ProductFilters'
import { useProducts } from '@/lib/hooks'
import { Filters, Product } from '@/types/product'
import { Product as APIProduct } from '@/lib/api'

// Convert API Product to Frontend Product format
function transformAPIProduct(apiProduct: APIProduct): Product {
  return {
    id: apiProduct.id,
    name: apiProduct.name,
    image: apiProduct.image_url,
    images: apiProduct.images,
    price: apiProduct.price,
    originalPrice: apiProduct.original_price,
    rating: apiProduct.rating,
    reviewCount: apiProduct.review_count,
    category: apiProduct.category_id as 'boys' | 'girls',
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
  
  const [filters, setFilters] = useState<Filters>({
    category: categoryFromUrl ? [categoryFromUrl] : [],
    priceRange: [0, 5000],
    sizes: [],
    sortBy: 'popularity'
  })

  // Build API parameters from filters
  const apiParams = useMemo(() => ({
    category: filters.category.length > 0 ? filters.category[0] : undefined,
    minPrice: filters.priceRange[0],
    maxPrice: filters.priceRange[1],
    sizes: filters.sizes.length > 0 ? filters.sizes : undefined,
    sort: filters.sortBy === 'price-low' ? 'price-asc' : 
          filters.sortBy === 'price-high' ? 'price-desc' : 
          filters.sortBy === 'rating' ? 'rating' : undefined, // 'popularity' maps to default sorting
    // Remove limit to fetch all products
  }), [filters])

  // Fetch products from API
  const { data, loading, error } = useProducts(apiParams)
  
  const products = data?.products || []
  const filteredProducts = products.map(transformAPIProduct)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream">
        <div className="max-w-[1400px] mx-auto px-4 py-8">
          {/* Page Header (category info only) */}
          {categoryFromUrl && (
            <div className="mb-8">
              <h2 className="text-xl md:text-2xl font-[var(--font-heading)] font-semibold text-ink mb-2">
                {`${categoryFromUrl.charAt(0).toUpperCase() + categoryFromUrl.slice(1)} Collection`}
              </h2>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:w-80 flex-shrink-0">
              <ProductFilters
                filters={filters}
                onFiltersChange={setFilters}
              />
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Products */}
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
                  <p className="text-gray-500">Try adjusting your filters to see more results.</p>
                </div>
              ) : (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
        </div>
      </main>
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
