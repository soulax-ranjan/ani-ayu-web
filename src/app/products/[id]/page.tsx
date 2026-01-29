'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { notFound, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Star, ShoppingBag, Share2, ChevronLeft, X, ZoomIn, CheckCircle } from 'lucide-react'
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
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading product...</p>
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

      <main className="min-h-screen bg-cream">
        <div className="max-w-[1400px] mx-auto px-4 py-6 md:py-12 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 w-full">
            {/* Product Images */}
            <div className="space-y-4 min-w-0">
              {/* Main Image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100">
                <Image
                  src={productImages[selectedImageIndex]}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
                {/* Zoom button - bottom right corner */}
                <button
                  onClick={() => openImagePreview(selectedImageIndex)}
                  className="absolute bottom-4 right-4 bg-white/90 hover:bg-white p-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
                  title="View full size"
                >
                  <ZoomIn size={20} className="text-gray-700" />
                </button>
              </div>

              {/* Thumbnail Images */}
              {productImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {productImages.map((image: string, index: number) => (
                    <div key={index} className="flex-shrink-0">
                      <button
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative aspect-square w-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${selectedImageIndex === index
                          ? 'border-primary shadow-md scale-105'
                          : 'border-gray-200 hover:border-gray-300'
                          }`}
                        title={`View image ${index + 1}`}
                      >
                        <Image
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Image Count Indicator */}
              {productImages.length > 1 && (
                <p className="text-sm text-gray-500 text-center">
                  {selectedImageIndex + 1} of {productImages.length} images
                </p>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col h-full bg-white p-4 sm:p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 min-w-0">
              {/* Header Section */}
              <div className="mb-4 md:mb-6 border-b border-gray-100 pb-4 md:pb-6">
                <div className="flex items-start justify-between gap-4 mb-2">
                  {categoryName && (
                    <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {categoryName}
                    </span>
                  )}
                  {/* Share Button (moved up) */}
                  <button className="text-gray-400 hover:text-primary transition-colors p-1" title="Share">
                    <Share2 size={20} />
                  </button>
                </div>

                <h1 className="text-2xl md:text-3xl lg:text-4xl font-[var(--font-heading)] font-bold text-gray-900 mb-2 md:mb-3 leading-tight">
                  {product.name}
                </h1>
              </div>

              {/* Price Block */}
              <div className="mb-6 md:mb-8">
                <div className="flex items-end gap-3 mb-2">
                  <span className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                    ₹{(product.price || 0).toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg md:text-xl text-gray-400 line-through mb-1.5">
                      ₹{(product.originalPrice || 0).toLocaleString()}
                    </span>
                  )}
                  {discountPercent && (
                    <span className="mb-2 bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide">
                      {discountPercent}% OFF
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">Includes all taxes</p>
              </div>

              {/* Description (Condensed) */}
              <p className="text-gray-600 leading-relaxed mb-8 text-sm sm:text-base">
                {product.description}
              </p>

              {/* Selectors (Size & Quantity) */}
              <div className="space-y-6 mb-8 bg-gray-50 p-6 rounded-2xl border border-gray-100/50">
                {/* Size */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Select Size</h3>
                    {product.sizes && <button onClick={() => setIsSizeChartOpen(true)} className="text-xs text-primary font-medium hover:underline">Size Chart</button>}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(product.sizes || []).map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[3rem] h-10 flex items-center justify-center px-4 rounded-xl text-sm font-bold transition-all duration-200 border
                          ${selectedSize === size
                            ? 'bg-gray-900 text-white border-gray-900 shadow-md transform scale-105'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>


              </div>

              {/* Action Buttons (Right Aligned per request) */}
              <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col gap-3 sm:flex-row sm:gap-4 justify-end">
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className="w-full sm:w-auto sm:flex-1 md:flex-none border-2 border-primary text-primary hover:bg-primary/5 font-bold py-3 px-6 rounded-full flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {isAddingToCart ? (
                    <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  ) : (
                    <>
                      <ShoppingBag size={18} />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                <button
                  onClick={async () => {
                    // Reuse cart adding logic but redirect afterwards
                    if (!selectedSize) {
                      alert('Please select a size')
                      return
                    }
                    setIsAddingToCart(true)
                    const success = await addItem(product, selectedSize, quantity)
                    setIsAddingToCart(false)

                    if (success) {
                      trackEvent('Buy Now Clicked', {
                        product_id: product.id,
                        product_name: product.name,
                        price: product.price,
                        size: selectedSize,
                        quantity: quantity,
                        category: categoryName
                      })
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
                  className="w-full sm:w-auto sm:flex-1 md:flex-none bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 active:scale-95 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <span>Buy Now</span>
                </button>
              </div>

              {/* Quick Details (Compact) */}
              <div className="mt-8 grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-gray-500">
                <div className="flex gap-2">
                  <span className="font-semibold text-gray-900">Brand:</span>
                  <span>{product.brand || 'Ani & Ayu'}</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-semibold text-gray-900">Material:</span>
                  <span>{product.material || 'Cotton'}</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-semibold text-gray-900">SKU:</span>
                  <span className="font-mono">{product.sku || 'N/A'}</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-semibold text-gray-900">Ships in:</span>
                  <span>2-3 Days</span>
                </div>
              </div>

            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-20">
              <h2 className="text-2xl font-[var(--font-heading)] font-bold text-ink mb-8">You May Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <div className="flex items-center gap-3">
                {/* Unit Toggle */}
                <div className="flex items-center bg-gray-100 rounded-full p-1">
                  <button
                    onClick={() => setSizeUnit('inches')}
                    className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all ${sizeUnit === 'inches'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    Inches
                  </button>
                  <button
                    onClick={() => setSizeUnit('cm')}
                    className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all ${sizeUnit === 'cm'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    CM
                  </button>
                </div>
                <button
                  onClick={() => setIsSizeChartOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close size chart"
                >
                  <X size={24} className="text-gray-600" />
                </button>
              </div>
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
                  {[
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
                  ].map((row, index) => {
                    const convertToUnit = (inches: string) => {
                      if (sizeUnit === 'cm') {
                        return (parseFloat(inches) * 2.54).toFixed(1);
                      }
                      return inches;
                    };

                    return (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                        <td className="border border-gray-200 px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-900 font-medium">{row[0]}</td>
                        <td className="border border-gray-200 px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-700">{convertToUnit(row[1])}</td>
                        <td className="border border-gray-200 px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-700">{convertToUnit(row[2])}</td>
                        <td className="border border-gray-200 px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-700">{convertToUnit(row[3])}</td>
                        <td className="border border-gray-200 px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-700">{convertToUnit(row[4])}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="p-4 md:p-6 border-t border-gray-200 bg-gray-50">
              <p className="text-xs md:text-sm text-gray-600">
                <strong>Note:</strong> All measurements are in {sizeUnit === 'inches' ? 'inches' : 'centimeters'}. For the best fit, please measure your child and compare with the chart above.
              </p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}
