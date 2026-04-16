'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { notFound, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Star, ShoppingBag, Share2, ChevronLeft, X, ZoomIn, CheckCircle, ChevronDown } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { useProduct, useRelatedProducts } from '@/lib/hooks'
import { useCartStore } from '@/store/cartStore'
import { Product as APIProduct } from '@/lib/api'
import { Product } from '@/types/product'
import { apiClient } from '@/lib/api'
import { trackEvent } from '@/lib/mixpanel'

export const runtime = 'edge'

// Convert API Product to Frontend Product format
function transformAPIProduct(apiProduct: APIProduct): Product {
  return {
    id: apiProduct.id,
    name: apiProduct.name,
    slug: apiProduct.slug,
    image: apiProduct.image_url,
    image_url: apiProduct.image_url,
    images: apiProduct.images,
    price: apiProduct.price,
    original_price: apiProduct.original_price,
    originalPrice: apiProduct.original_price,
    discount_percent: apiProduct.discount_percent,
    short_description: apiProduct.short_description,
    rating: apiProduct.rating,
    review_count: apiProduct.review_count,
    reviewCount: apiProduct.review_count,
    category: apiProduct.category_id,
    category_id: apiProduct.category_id,
    sizes: apiProduct.sizes,
    colors: apiProduct.colors,
    description: apiProduct.description,
    features: apiProduct.features,
    age_range: apiProduct.age_range,
    ageRange: apiProduct.age_range,
    material: apiProduct.material,
    occasion: apiProduct.occasion,
    customizable: apiProduct.customizable,
    brand: apiProduct.brand,
    sku: apiProduct.sku,
    specifications: apiProduct.specifications,
    size_chart: apiProduct.size_chart,
    stock_quantity: apiProduct.stock_quantity,
    warranty: apiProduct.warranty,
    return_policy: apiProduct.return_policy,
    in_stock: apiProduct.in_stock,
    status: apiProduct.status,
    created_at: apiProduct.created_at,
    updated_at: apiProduct.updated_at
  }
}

interface Props {
  params: Promise<{ id: string }>
}

export default function ProductDetailsPage({ params }: Props) {
  const resolvedParams = React.use(params)

  // ALL HOOKS MUST BE CALLED FIRST - before any conditional returns
  const router = useRouter()
  const [selectedSize, setSelectedSize] = useState<string>('')
  const quantity = 1
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false)
  const [previewImageIndex, setPreviewImageIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [showToast, setShowToast] = useState(false)
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false)
  const [sizeUnit, setSizeUnit] = useState<'inches' | 'cm'>('inches')

  // Fetch product data from API
  const { data: productData, loading: productLoading, error: productError } = useProduct(resolvedParams.id)
  const { data: relatedData, loading: relatedLoading } = useRelatedProducts(resolvedParams.id)

  const { addItem } = useCartStore()

  // Fetch category name
  const [categoryName, setCategoryName] = useState<string>('')

  useEffect(() => {
    // Only fetch if we have a product and category_id
    if (!productData) return;

    // Check if category_id exists (it's in the API response)
    const categoryId = productData.category_id;

    const fetchCategory = async () => {
      if (categoryId) {
        try {
          const category = await apiClient.getCategoryById(categoryId)
          setCategoryName(category.name)
        } catch (error) {
          console.error('Failed to fetch category:', error)
          // Fallback to category ID if name fetch fails, or static default if needed
          setCategoryName('Collection')
        }
      }
    }
    fetchCategory()
  }, [productData]) // Depend on productData being loaded

  // Process product images - MUST be called before conditional returns
  const productImages = useMemo(() => {
    // Default fallback for loading/error states
    if (!productData) {
      return ['/assets/placeholders/ph-card-4x5.svg']
    }

    const product = transformAPIProduct(productData)
    const images: string[] = []

    // Add main image first if it exists
    if (product.image) {
      images.push(product.image)
    }

    // Add additional images from the images array, avoiding duplicates
    if (product.images && Array.isArray(product.images)) {
      product.images.forEach((img: string) => {
        if (img && img !== product.image && !images.includes(img)) {
          images.push(img)
        }
      })
    }

    // FOR TESTING: Add some sample images if we don't have enough
    if (images.length < 3) {
      const sampleImages = [
        '/assets/designs/design-1.jpg',
        '/assets/designs/design-2.jpg',
        '/assets/designs/design-4.webp',
        '/assets/designs/design-5.webp'
      ]

      sampleImages.forEach((img: string) => {
        if (!images.includes(img) && images.length < 5) {
          images.push(img)
        }
      })
    }

    // Fallback to main image if no images found
    return images.length > 0 ? images : [product.image || '/assets/placeholders/ph-card-4x5.svg']
  }, [productData])

  // Handle keyboard navigation and disable body scroll for image preview
  useEffect(() => {
    if (isImagePreviewOpen) {
      // Disable body scroll when modal is open
      document.body.style.overflow = 'hidden'

      const handleKeydown = (e: KeyboardEvent) => {
        switch (e.key) {
          case 'Escape':
            setIsImagePreviewOpen(false)
            break
          case 'ArrowLeft':
            e.preventDefault()
            setPreviewImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length)
            break
          case 'ArrowRight':
            e.preventDefault()
            setPreviewImageIndex((prev) => (prev + 1) % productImages.length)
            break
        }
      }

      document.addEventListener('keydown', handleKeydown)

      return () => {
        document.removeEventListener('keydown', handleKeydown)
        document.body.style.overflow = 'unset'
      }
    }
  }, [isImagePreviewOpen, productImages.length])

  // Show loading or error states AFTER all hooks are called
  if (productLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-cream">
          <div className="max-w-[1400px] mx-auto px-4 py-16">
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-4 animate-pulse">
                <Image
                  src="/assets/logo/small-logo.png"
                  alt="Loading..."
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (productError || !productData) {
    notFound()
  }

  // Transform product data (now safe since we've checked for null)
  const product = transformAPIProduct(productData)
  const relatedProducts = relatedData?.products?.map(transformAPIProduct) || []

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert('Please select a size')
      return
    }

    setIsAddingToCart(true)

    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 500))

    const success = await addItem(product, selectedSize, quantity)
    setIsAddingToCart(false)

    if (success) {
      trackEvent('Add to Cart', {
        product_id: product.id,
        product_name: product.name,
        price: product.price,
        size: selectedSize,
        quantity: quantity,
        category: categoryName
      })

      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)

      // Reset form
      setSelectedSize('')
    }
  }

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  // Image preview handlers
  const openImagePreview = (index: number) => {
    setPreviewImageIndex(index)
    setIsImagePreviewOpen(true)
  }

  const closeImagePreview = () => {
    setIsImagePreviewOpen(false)
  }

  const nextImage = () => {
    setPreviewImageIndex((prev) => (prev + 1) % productImages.length)
  }

  const prevImage = () => {
    setPreviewImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length)
  }

  // Touch handlers for swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0) // Reset touch end
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe && productImages.length > 1) {
      nextImage()
    }
    if (isRightSwipe && productImages.length > 1) {
      prevImage()
    }
  }

  return (
    <>
      <Header />

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-24 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-in slide-in-from-right fade-in duration-300">
          <div className="bg-white/20 p-1 rounded-full">
            <CheckCircle size={18} className="text-white" />
          </div>
          <div>
            <p className="font-medium">Added to Cart!</p>
            <p className="text-xs text-green-100">Item added successfully</p>
          </div>
        </div>
      )}

      <main className="min-h-screen bg-white">
        <div className="max-w-[1200px] mx-auto px-4 py-8 md:py-12">

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Left Column: Images */}
            <div className="flex flex-col gap-4 w-full min-w-0">
              {/* Main Image */}
              <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                <Image
                  src={productImages[selectedImageIndex]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />

                {/* Image Actions */}
                <button
                  onClick={() => openImagePreview(selectedImageIndex)}
                  className="absolute bottom-4 right-4 bg-white/90 hover:bg-white p-2.5 rounded-full shadow-sm backdrop-blur-sm transition-all hover:scale-105"
                  title="Zoom"
                >
                  <ZoomIn size={18} className="text-gray-700" />
                </button>
                {product.discount_percent ? (
                  <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                    -{product.discount_percent}%
                  </div>
                ) : null}
              </div>

              {/* Thumbnails - Clean Row */}
              {productImages.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
                  {productImages.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative w-20 aspect-[3/4] flex-shrink-0 rounded-lg overflow-hidden transition-all ${selectedImageIndex === index
                        ? 'shadow-lg scale-105'
                        : 'bg-gray-100 hover:shadow-sm hover:scale-102'
                        }`}
                    >
                      <Image
                        src={image}
                        alt={`View ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Product Details - Sticky */}
            <div className="flex flex-col lg:sticky lg:top-24 h-fit min-w-0">
              <div className="mb-6">
                <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 mb-2 md:mb-4 leading-tight tracking-tight break-words">
                  {product.name}
                </h1>

                <div className="flex flex-wrap items-center justify-between mt-4 gap-y-3">
                  <div className="flex flex-wrap items-baseline gap-3">
                    <span className="text-3xl font-bold text-primary">
                      ₹{(product.price || 0).toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="text-lg text-gray-400 line-through">
                        ₹{(product.originalPrice || 0).toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Share */}
                  <button className="text-gray-400 hover:text-gray-900 p-2 rounded-full hover:bg-gray-50 transition-colors">
                    <Share2 size={20} />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Tax included. Shipping calculated at checkout.</p>
              </div>

              {/* Description - commented out */}
              {/* <div className="mb-10 min-w-0">
                <p className="text-gray-800 text-base leading-relaxed break-words whitespace-pre-wrap">
                  {product.description}
                </p>
              </div> */}

              {/* Product Features - Expandable (Moved) */}
              {false && product.features && (
                <div className="hidden">
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between py-4 font-medium text-gray-900 transition-colors hover:text-primary">
                      <span>Product Features</span>
                      <span className="transition-transform group-open:rotate-180">
                        <ChevronDown size={18} />
                      </span>
                    </summary>
                    <div className="pb-4 text-sm text-gray-600 animate-in slide-in-from-top-1 duration-200">
                      <ul className="space-y-1 mt-2">
                        {(product.features ?? []).flatMap(block => block.split('\n')).map((line, i) => {
                          // Clean up line
                          const text = line.trim();
                          if (!text) return null;

                          const parts = text.split(':');
                          // Check if it looks like a Key: Value pair
                          if (parts.length > 1 && parts[0].trim().length < 40) {
                            const label = parts[0].trim();
                            const value = parts.slice(1).join(':').trim();
                            return (
                              <li key={i} className="flex flex-col sm:grid sm:grid-cols-[140px_1fr] gap-1 sm:gap-2 py-2 sm:py-1 border-b border-gray-50 last:border-0 break-words">
                                <span className="font-semibold text-gray-900">{label}</span>
                                <span className="text-gray-700 min-w-0 break-words">{value}</span>
                              </li>
                            );
                          }

                          // Standard feature item
                          return (
                            <li key={i} className="flex gap-2 py-1 pl-1">
                              <span className="text-primary mt-1.5 text-[8px]">●</span>
                              <span>{text}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </details>
                </div>
              )}

              {/* Selectors */}
              <div className="mb-10">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">Select Size</h3>
                    {product.sizes && (
                      <button
                        onClick={() => setIsSizeChartOpen(true)}
                        className="text-xs text-gray-600 hover:text-primary underline underline-offset-2 transition-colors"
                      >
                        Size Guide
                      </button>
                    )}
                  </div>

                  {/* Size Dropdown */}
                  <div className="relative">
                    <select
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="w-full h-12 pl-4 pr-10 rounded-xl border-2 border-gray-200 bg-white text-sm font-medium text-gray-800 appearance-none cursor-pointer focus:outline-none focus:border-gray-900 transition-colors hover:border-gray-400"
                    >
                      <option value="" disabled>Choose a size…</option>
                      {(() => {
                        const availableSizes = (product.size_chart && Object.keys(product.size_chart).length > 0)
                          ? Object.keys(product.size_chart)
                          : (product.sizes || []);
                        return availableSizes.map(size => (
                          <option key={size} value={size}>{size}</option>
                        ));
                      })()}
                    </select>
                    <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-10">
                <button
                  onClick={async () => {
                    if (!selectedSize) {
                      alert('Please select a size')
                      return
                    }
                    setIsAddingToCart(true)
                    const success = await addItem(product, selectedSize, quantity)
                    setIsAddingToCart(false)

                    if (success) {
                      trackEvent('Add to Cart', {
                        product_id: product.id,
                        product_name: product.name,
                        price: product.price,
                        size: selectedSize,
                        quantity: quantity,
                        category: categoryName,
                        source: 'Buy Now'
                      })
                      router.push('/checkout')
                    }
                  }}
                  className="w-full bg-primary hover:bg-primary-hover text-white font-semibold h-14 rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center text-base tracking-wide"
                >
                  Buy Now
                </button>

                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className="w-full bg-white border-2 border-gray-900 hover:bg-gray-900 text-gray-900 hover:text-white font-semibold h-14 rounded-xl transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-2 text-base"
                >
                  {isAddingToCart ? (
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-900 rounded-full animate-spin" />
                  ) : (
                    <>
                      <ShoppingBag size={20} />
                      <span>Add to Bag</span>
                    </>
                  )}
                </button>
              </div>

              {/* Product Details - Modern Always-Visible Card */}
              {product.features && product.features.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Product Details</h3>
                  <div className="rounded-2xl border border-gray-100 bg-gray-50/60 divide-y divide-gray-100 overflow-hidden">
                    {product.features.flatMap(block => block.split('\n')).map((line, i) => {
                      const text = line.trim();
                      if (!text) return null;

                      return (
                        <div key={i} className="flex items-start gap-3 px-4 py-3">
                          <span className="text-primary mt-2 text-[7px] flex-shrink-0">●</span>
                          <span className="text-sm text-gray-800 leading-relaxed">{text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Related Products - Clean Section */}
          {relatedProducts.length > 0 && (
            <div className="mt-24 border-t border-gray-100 pt-16">
              <h2 className="font-[family-name:var(--font-heading)] text-2xl font-medium text-gray-900 mb-8 text-center">
                You May Also Like
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 lg:gap-8">
                {relatedProducts.map(relatedProduct => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Image Preview Modal */}
      {isImagePreviewOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          {/* Close button */}
          <button
            onClick={closeImagePreview}
            className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            title="Close preview (Esc)"
          >
            <X size={24} className="text-white" />
          </button>

          {/* Image counter */}
          <div className="absolute top-4 left-4 z-10 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {previewImageIndex + 1} / {productImages.length}
          </div>

          {/* Navigation arrows */}
          {productImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                title="Previous image (←)"
              >
                <ChevronLeft size={28} className="text-white" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                title="Next image (→)"
              >
                <ChevronLeft size={28} className="text-white rotate-180" />
              </button>
            </>
          )}

          {/* Main preview image */}
          <div
            className="relative max-w-4xl max-h-full select-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <Image
              src={productImages[previewImageIndex]}
              alt={`${product.name} - Image ${previewImageIndex + 1}`}
              width={800}
              height={1000}
              className="max-w-full max-h-[90vh] object-contain pointer-events-none"
              priority
              draggable={false}
            />

            {/* Swipe instruction for mobile */}
            {productImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded text-sm sm:hidden">
                Swipe to navigate
              </div>
            )}
          </div>

          {/* Thumbnail strip at bottom */}
          {productImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
              <div className="flex gap-2 bg-black/50 p-2 rounded-lg max-w-xs overflow-x-auto">
                {productImages.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setPreviewImageIndex(index)}
                    className={`flex-shrink-0 w-12 h-12 rounded border-2 overflow-hidden transition-all ${previewImageIndex === index
                      ? 'border-white scale-110'
                      : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                  >
                    <Image
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Click outside to close */}
          <div
            className="absolute inset-0 -z-10"
            onClick={closeImagePreview}
          />
        </div>
      )}

      {/* Size Chart Modal */}
      {isSizeChartOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full my-8 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl z-10">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">Size Chart</h2>
              <button
                onClick={() => setIsSizeChartOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close size chart"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto p-4 md:p-6">
              <table className="w-full border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-3 md:px-4 py-3 text-left text-xs md:text-sm font-bold text-gray-900">Age</th>
                    <th className="border border-gray-200 px-3 md:px-4 py-3 text-left text-xs md:text-sm font-bold text-gray-900">Top Length</th>
                    <th className="border border-gray-200 px-3 md:px-4 py-3 text-left text-xs md:text-sm font-bold text-gray-900">Chest</th>
                    <th className="border border-gray-200 px-3 md:px-4 py-3 text-left text-xs md:text-sm font-bold text-gray-900">Bottom Length</th>
                    <th className="border border-gray-200 px-3 md:px-4 py-3 text-left text-xs md:text-sm font-bold text-gray-900">Waist</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const fallbackData = [
                      ['6 - 12 Months', '6.00', '20.00', '15.00', '18.00'],
                      ['1 - 2 Years', '6.00', '22.00', '17.00', '19.00'],
                      ['2 - 3 Years', '7.00', '23.00', '21.00', '20.00'],
                      ['3 - 4 Years', '7.00', '23.50', '23.00', '21.00'],
                      ['4 - 5 Years', '8.00', '24.00', '25.00', '22.00'],
                      ['5 - 6 Years', '9.00', '25.00', '26.00', '23.00'],
                      ['6 - 7 Years', '9.00', '26.00', '28.00', '24.00'],
                      ['7 - 8 Years', '10.00', '27.00', '30.00', '25.00'],
                      ['8 - 9 Years', '10.00', '28.50', '32.00', '26.00'],
                      ['9 - 10 Years', '11.00', '30.00', '34.00', '28.00'],
                      ['10 - 11 Years', '12.00', '31.00', '35.00', '29.00'],
                      ['11 - 12 Years', '13.00', '31.00', '35.00', '30.00'],
                    ];

                    let rows = fallbackData;

                    // Try to use API size chart if available
                    if (product.size_chart && typeof product.size_chart === 'object' && Object.keys(product.size_chart).length > 0) {
                      try {
                        // Assuming format: { "6-12 Months": { "Top Length": "6", "Chest": "20", ... } }
                        const apiRows = Object.entries(product.size_chart).map(([age, measurements]) => {
                          const m = measurements as Record<string, any>;
                          return [
                            age,
                            m['Top Length'] || m['top_length'] || '-',
                            m['Chest'] || m['chest'] || '-',
                            m['Bottom Length'] || m['bottom_length'] || '-',
                            m['Waist'] || m['waist'] || '-'
                          ];
                        });

                        // Sort by age simply or leave as is (keys order)
                        if (apiRows.length > 0) {
                          rows = apiRows;
                        }
                      } catch (e) {
                        console.error('Failed to parse size chart', e);
                      }
                    }

                    return rows.map((row, index) => {
                      return (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                          <td className="border border-gray-200 px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-900 font-medium">{row[0]}</td>
                          <td className="border border-gray-200 px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-700">{row[1]}</td>
                          <td className="border border-gray-200 px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-700">{row[2]}</td>
                          <td className="border border-gray-200 px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-700">{row[3]}</td>
                          <td className="border border-gray-200 px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-700">{row[4]}</td>
                        </tr>
                      );
                    })
                  })()}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="p-4 md:p-6 border-t border-gray-200 bg-gray-50">
              <p className="text-xs md:text-sm text-gray-600">
                <strong>Note:</strong> All measurements are in inches. For the best fit, please measure your child and compare with the chart above.
              </p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}
