'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Star, ShoppingBag, Share2, ChevronLeft, Minus, Plus, X, ZoomIn } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { useProduct, useRelatedProducts } from '@/lib/hooks'
import { useCartStore } from '@/store/cartStore'
import { Product as APIProduct } from '@/lib/api'
import { Product } from '@/types/product'

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
    category: apiProduct.category_id as 'boys' | 'girls',
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
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false)
  const [previewImageIndex, setPreviewImageIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  
  // Fetch product data from API
  const { data: productData, loading: productLoading, error: productError } = useProduct(resolvedParams.id)
  const { data: relatedData, loading: relatedLoading } = useRelatedProducts(resolvedParams.id)
  
  const { addItem, getItemQuantity } = useCartStore()
  
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

  const currentQuantityInCart = selectedSize ? getItemQuantity(product.id, selectedSize) : 0

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert('Please select a size')
      return
    }

    setIsAddingToCart(true)
    
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 500))
    
    addItem(product, selectedSize, quantity)
    setIsAddingToCart(false)
    
    // Reset form
    setQuantity(1)
    setSelectedSize('')
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
      
      <main className="min-h-screen bg-cream">
        <div className="max-w-[1400px] mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-white group cursor-pointer">
                <Image
                  src={productImages[selectedImageIndex]}
                  alt={product.name}
                  width={600}
                  height={750}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onClick={() => openImagePreview(selectedImageIndex)}
                />
                {/* Zoom overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 p-2 rounded-full">
                    <ZoomIn size={24} className="text-gray-700" />
                  </div>
                </div>
              </div>

              {/* Thumbnail Images */}
              {productImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {productImages.map((image: string, index: number) => (
                    <div key={index} className="flex-shrink-0">
                      <button
                        onClick={() => setSelectedImageIndex(index)}
                        onDoubleClick={() => openImagePreview(index)}
                        className={`relative aspect-[4/5] w-20 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                          selectedImageIndex === index 
                            ? 'border-primary shadow-lg' 
                            : 'border-gray-200 hover:border-primary/50'
                        }`}
                        title={`View image ${index + 1} (double-click to preview)`}
                      >
                        <Image
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          width={80}
                          height={100}
                          className="w-full h-full object-cover"
                        />
                        {/* Small zoom icon on hover */}
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
                          <ZoomIn size={14} className="text-white" />
                        </div>
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
            <div className="space-y-6">
              {/* Category Badge */}
              <div className="inline-block bg-mint px-3 py-1 rounded-full text-primary text-sm font-medium capitalize">
                {product.category}
              </div>

              <div>
                <h1 className="text-2xl lg:text-3xl font-[var(--font-heading)] font-bold text-ink mb-4">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={18} 
                          className={i < Math.floor(product.rating) ? 'fill-accent text-accent' : 'text-gray-300'} 
                        />
                      ))}
                    </div>
                    <span className="font-semibold ml-1">{product.rating}</span>
                  </div>
                  <span className="text-gray-500">({product.reviewCount} reviews)</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold text-ink">
                      ₹{(product.price || 0).toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <>
                        <span className="text-xl text-gray-500 line-through">
                          ₹{(product.originalPrice || 0).toLocaleString()}
                        </span>
                        {discountPercent && (
                          <span className="bg-accent text-white px-2 py-1 rounded text-sm font-semibold">
                            {discountPercent}% OFF
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Product Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-t border-b border-gray-200">
                {product.brand && (
                  <div>
                    <span className="text-sm text-gray-600">Brand:</span>
                    <p className="font-medium">{product.brand}</p>
                  </div>
                )}
                {product.sku && (
                  <div>
                    <span className="text-sm text-gray-600">SKU:</span>
                    <p className="font-medium font-mono text-xs">{product.sku}</p>
                  </div>
                )}
                <div>
                  <span className="text-sm text-gray-600">Age Range:</span>
                  <p className="font-medium">{product.ageRange}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Material:</span>
                  <p className="font-medium">{product.material}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Occasion:</span>
                  <p className="font-medium">{product.occasion}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Available Sizes:</span>
                  <p className="font-medium">{(product.sizes || []).join(', ')}</p>
                </div>
                {product.stock_quantity !== undefined && (
                  <div>
                    <span className="text-sm text-gray-600">Stock:</span>
                    <p className={`font-medium ${
                      product.stock_quantity === 0 
                        ? 'text-red-600' 
                        : product.stock_quantity <= 5
                        ? 'text-orange-600'
                        : 'text-green-600'
                    }`}>
                      {product.stock_quantity === 0 
                        ? 'Out of Stock' 
                        : `${product.stock_quantity} available`
                      }
                    </p>
                  </div>
                )}
                {product.customizable && (
                  <div>
                    <span className="text-sm text-gray-600">Customization:</span>
                    <p className="font-medium text-primary">Available</p>
                  </div>
                )}
              </div>

              {/* Features */}
              {product.features && (
                <div>
                  <h3 className="font-semibold text-ink mb-2">Features:</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {product.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Specifications */}
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div>
                  <h3 className="font-semibold text-ink mb-3">Specifications:</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-gray-600 capitalize">{key.replace(/_/g, ' ')}:</span>
                        <span className="text-ink font-medium">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Warranty and Return Policy */}
              {(product.warranty || product.return_policy) && (
                <div className="space-y-4">
                  {product.warranty && (
                    <div>
                      <h3 className="font-semibold text-ink mb-2">Warranty:</h3>
                      <p className="text-gray-700 text-sm">{product.warranty}</p>
                    </div>
                  )}
                  {product.return_policy && (
                    <div>
                      <h3 className="font-semibold text-ink mb-2">Return Policy:</h3>
                      <p className="text-gray-700 text-sm">{product.return_policy}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Size Selection */}
              <div>
                <h3 className="font-[var(--font-heading)] font-semibold text-ink mb-3">Select Size:</h3>
                <div className="flex flex-wrap gap-3">
                  {(product.sizes || []).map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border-2 font-medium transition-colors ${
                        selectedSize === size
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-200 bg-white text-ink hover:border-primary'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selection */}
              <div>
                <h3 className="font-[var(--font-heading)] font-semibold text-ink mb-3">Quantity:</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-gray-50 transition-colors"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 hover:bg-gray-50 transition-colors"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  {currentQuantityInCart > 0 && (
                    <span className="text-sm text-gray-600">
                      {currentQuantityInCart} in cart
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className="flex-1 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  {isAddingToCart ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={20} />
                      Add to Cart
                    </>
                  )}
                </button>

                <div className="flex gap-2">
                  <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Share2 size={20} />
                  </button>
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
                    className={`flex-shrink-0 w-12 h-12 rounded border-2 overflow-hidden transition-all ${
                      previewImageIndex === index
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

      <Footer />
    </>
  )
}
