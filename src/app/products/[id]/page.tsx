'use client'

import React, { useState, useMemo, useEffect, useRef } from 'react'
import { notFound, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  ShoppingBag, Share2, ChevronLeft, ChevronRight, ChevronDown, X, ZoomIn, Check,
  Ruler, Scissors, RefreshCw, ShieldCheck,
} from 'lucide-react'
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

// Default measurements (inches) used when a product has no size chart of its own
const FALLBACK_SIZE_CHART = [
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
]

const TRUST_POINTS = [
  { icon: Scissors, title: 'Crafted to order', text: 'Dispatched within 7 business days' },
  { icon: RefreshCw, title: 'Size exchange', text: 'Wrong fit? We’ll swap the size' },
  { icon: ShieldCheck, title: 'Secure payments', text: 'Safe checkout via Razorpay' },
]

function Accordion({ title, defaultOpen = false, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  return (
    <details className="group border-b border-stone-200/80" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center justify-between py-4 font-heading font-semibold text-ink hover:text-primary transition-colors [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown size={18} className="text-ink/50 transition-transform duration-300 group-open:rotate-180" />
      </summary>
      <div className="pb-5 text-sm text-ink/75 leading-relaxed">{children}</div>
    </details>
  )
}

interface Props {
  params: Promise<{ id: string }>
}

export default function ProductDetailsPage({ params }: Props) {
  const resolvedParams = React.use(params)

  // ALL HOOKS MUST BE CALLED FIRST - before any conditional returns
  const router = useRouter()
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [sizeError, setSizeError] = useState(false)
  const quantity = 1
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false)
  const [previewImageIndex, setPreviewImageIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [showToast, setShowToast] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false)
  const [showStickyBar, setShowStickyBar] = useState(false)
  const [showAllDetails, setShowAllDetails] = useState(false)
  const actionsRef = useRef<HTMLDivElement>(null)
  const sizeRef = useRef<HTMLDivElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)

  // Fetch product data from API
  const { data: productData, loading: productLoading, error: productError } = useProduct(resolvedParams.id)
  const { data: relatedData } = useRelatedProducts(resolvedParams.id)

  const { addItem } = useCartStore()

  // Fetch category name
  const [categoryName, setCategoryName] = useState<string>('')

  useEffect(() => {
    if (!productData) return
    const categoryId = productData.category_id

    const fetchCategory = async () => {
      if (categoryId) {
        try {
          const category = await apiClient.getCategoryById(categoryId)
          setCategoryName(category.name)
        } catch (error) {
          console.error('Failed to fetch category:', error)
          setCategoryName('Collection')
        }
      }
    }
    fetchCategory()
  }, [productData])

  // Main image first, then the rest of the gallery without duplicates
  const productImages = useMemo(() => {
    if (!productData) return ['/assets/placeholders/ph-card-4x5.svg']

    const images: string[] = []
    if (productData.image_url) images.push(productData.image_url)
    ;(productData.images || []).forEach((img: string) => {
      if (img && !images.includes(img)) images.push(img)
    })
    return images.length > 0 ? images : ['/assets/placeholders/ph-card-4x5.svg']
  }, [productData])

  // Mobile: show a sticky "Add to bag" bar once the main buttons scroll out of view
  useEffect(() => {
    const el = actionsRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setShowStickyBar(!entry.isIntersecting && entry.boundingClientRect.top < 0))
    observer.observe(el)
    return () => observer.disconnect()
  }, [productData])

  // Handle keyboard navigation and disable body scroll for image preview
  useEffect(() => {
    if (isImagePreviewOpen) {
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
        <main className="min-h-screen bg-[#fdfbf7]">
          <div className="max-w-[1200px] mx-auto px-4 py-8 md:py-12 grid lg:grid-cols-12 gap-8 lg:gap-14">
            <div className="lg:col-span-7 aspect-[4/5] rounded-3xl bg-stone-100 animate-pulse" />
            <div className="lg:col-span-5 space-y-4">
              <div className="h-4 w-24 rounded bg-stone-100 animate-pulse" />
              <div className="h-9 w-4/5 rounded bg-stone-100 animate-pulse" />
              <div className="h-8 w-32 rounded bg-stone-100 animate-pulse" />
              <div className="h-24 rounded-2xl bg-stone-100 animate-pulse" />
              <div className="h-14 rounded-full bg-stone-100 animate-pulse" />
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

  const product = transformAPIProduct(productData)
  const relatedProducts = relatedData?.products?.map(transformAPIProduct) || []
  const isOutOfStock = product.status === 'out_of_stock' || product.in_stock === false
  const hasDiscount = (product.originalPrice ?? 0) > product.price
  const savePercent = hasDiscount ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100) : 0

  const sizeOptions = (product.size_chart && Object.keys(product.size_chart).length > 0)
    ? Object.keys(product.size_chart)
    : (product.sizes || [])

  const features = (product.features ?? []).flatMap((block) => block.split('\n')).map((line) => line.trim()).filter(Boolean)

  const sizeChartRows = (() => {
    if (product.size_chart && typeof product.size_chart === 'object' && Object.keys(product.size_chart).length > 0) {
      try {
        const rows = Object.entries(product.size_chart).map(([age, measurements]) => {
          const m = measurements as Record<string, string>
          return [age, m['Top Length'] || m['top_length'] || '-', m['Chest'] || m['chest'] || '-', m['Bottom Length'] || m['bottom_length'] || '-', m['Waist'] || m['waist'] || '-']
        })
        if (rows.length > 0) return rows
      } catch (e) {
        console.error('Failed to parse size chart', e)
      }
    }
    return FALLBACK_SIZE_CHART
  })()

  const requireSize = () => {
    if (selectedSize) return true
    setSizeError(true)
    sizeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    return false
  }

  const handleAddToCart = async () => {
    if (!requireSize()) return
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
        category: categoryName
      })
      setShowToast(true)
      setTimeout(() => setShowToast(false), 4000)
    }
  }

  const handleBuyNow = async () => {
    if (!requireSize()) return
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
  }

  const handleShare = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, url })
      } else {
        await navigator.clipboard.writeText(url)
        setLinkCopied(true)
        setTimeout(() => setLinkCopied(false), 2000)
      }
    } catch {
      // share sheet dismissed
    }
  }

  // Image preview handlers
  const openImagePreview = (index: number) => {
    setPreviewImageIndex(index)
    setIsImagePreviewOpen(true)
  }
  const nextImage = () => setPreviewImageIndex((prev) => (prev + 1) % productImages.length)
  const prevImage = () => setPreviewImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length)

  // Touch handlers for swipe navigation in the preview
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0)
    setTouchStart(e.targetTouches[0].clientX)
  }
  const handleTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX)
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    if (distance > 50 && productImages.length > 1) nextImage()
    if (distance < -50 && productImages.length > 1) prevImage()
  }

  // Mobile gallery: keep the dots in sync with the swiped image
  const handleGalleryScroll = () => {
    const el = galleryRef.current
    if (!el) return
    setSelectedImageIndex(Math.round(el.scrollLeft / el.clientWidth))
  }

  const price = `₹${(product.price || 0).toLocaleString('en-IN')}`

  return (
    <>
      <Header />

      {/* Added-to-bag toast */}
      {showToast && (
        <div className="fixed top-24 inset-x-4 sm:inset-x-auto sm:right-6 z-50 sm:w-80 rounded-2xl bg-[#1f4a41] text-white shadow-2xl p-4 flex items-center gap-3 animate-in slide-in-from-top-2 fade-in duration-300">
          <div className="relative w-12 h-14 shrink-0 rounded-lg overflow-hidden bg-white/10">
            <Image src={productImages[0]} alt="" fill sizes="48px" className="object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="flex items-center gap-1.5 text-sm font-semibold"><Check size={16} className="text-[#e6c88a]" /> Added to bag</p>
            <p className="text-xs text-white/70 truncate">{product.name} · {selectedSize}</p>
          </div>
          <Link href="/cart" className="shrink-0 rounded-full bg-white text-[#1f4a41] px-3.5 py-2 text-xs font-semibold hover:bg-[#e6c88a] transition-colors">
            View bag
          </Link>
        </div>
      )}

      <main className="min-h-screen bg-[#fdfbf7]">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 pt-4 pb-12 md:pt-6 md:pb-16">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-4 md:mb-6 flex items-center gap-1.5 text-xs md:text-sm text-ink/50 overflow-hidden">
            <Link href="/" className="hover:text-primary shrink-0">Home</Link>
            <ChevronRight size={14} className="shrink-0" />
            <Link href="/products" className="hover:text-primary shrink-0">Shop</Link>
            <ChevronRight size={14} className="shrink-0" />
            <span className="text-ink/70 truncate">{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            {/* Gallery */}
            <div className="lg:col-span-7 min-w-0">
              {/* Mobile: swipeable images with dots */}
              <div className="lg:hidden -mx-4 md:-mx-6">
                <div
                  ref={galleryRef}
                  onScroll={handleGalleryScroll}
                  className="flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                  {productImages.map((image, index) => (
                    <button
                      key={image}
                      onClick={() => openImagePreview(index)}
                      className="relative shrink-0 w-full aspect-[4/5] snap-center bg-gradient-to-b from-[#fbf6ee] to-[#f1e7da]"
                      aria-label={`View image ${index + 1} full screen`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} - image ${index + 1}`}
                        fill
                        priority={index === 0}
                        sizes="100vw"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
                {productImages.length > 1 && (
                  <div className="mt-3 flex justify-center gap-1.5">
                    {productImages.map((image, index) => (
                      <span
                        key={image}
                        className={`h-1.5 rounded-full transition-all duration-300 ${index === selectedImageIndex ? 'w-5 bg-primary' : 'w-1.5 bg-stone-300'}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Desktop: thumbnails + main image */}
              <div className="hidden lg:flex gap-4">
                {productImages.length > 1 && (
                  <div className="flex flex-col gap-3 w-20 shrink-0">
                    {productImages.map((image, index) => (
                      <button
                        key={image}
                        onClick={() => setSelectedImageIndex(index)}
                        aria-label={`Show image ${index + 1}`}
                        className={`relative aspect-[4/5] rounded-xl overflow-hidden transition-all ${
                          selectedImageIndex === index ? 'ring-2 ring-primary ring-offset-2 ring-offset-[#fdfbf7]' : 'opacity-70 hover:opacity-100'
                        }`}
                      >
                        <Image src={image} alt="" fill sizes="80px" className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                <div className="group relative flex-1 aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-b from-[#fbf6ee] to-[#f1e7da]">
                  <Image
                    src={productImages[selectedImageIndex]}
                    alt={product.name}
                    fill
                    priority
                    sizes="(max-width: 1200px) 55vw, 620px"
                    className="object-cover"
                  />
                  {hasDiscount && (
                    <span className="absolute top-4 left-4 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-primary shadow-sm tabular-nums">
                      {savePercent}% OFF
                    </span>
                  )}
                  <button
                    onClick={() => openImagePreview(selectedImageIndex)}
                    className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-white/90 hover:bg-white backdrop-blur-sm px-4 py-2 text-xs font-semibold text-ink shadow-sm transition-colors"
                  >
                    <ZoomIn size={16} /> Zoom
                  </button>
                  {productImages.length > 1 && (
                    <>
                      <button
                        onClick={() => setSelectedImageIndex((i) => (i - 1 + productImages.length) % productImages.length)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-sm grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Previous image"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={() => setSelectedImageIndex((i) => (i + 1) % productImages.length)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-sm grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Next image"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="lg:col-span-5 lg:sticky lg:top-28 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  {categoryName && (
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2">{categoryName}</p>
                  )}
                  <h1 className="font-heading text-2xl md:text-3xl font-bold text-ink leading-tight break-words">
                    {product.name}
                  </h1>
                </div>
                <button
                  onClick={handleShare}
                  className="relative shrink-0 w-10 h-10 rounded-full ring-1 ring-stone-200 bg-white grid place-items-center text-ink/60 hover:text-primary hover:ring-primary/60 transition-colors"
                  aria-label="Share this product"
                >
                  {linkCopied ? <Check size={18} className="text-primary" /> : <Share2 size={18} />}
                  {linkCopied && (
                    <span className="absolute top-full mt-2 right-0 whitespace-nowrap rounded-md bg-ink text-white text-[11px] px-2 py-1">Link copied</span>
                  )}
                </button>
              </div>

              {/* Price */}
              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="font-heading text-3xl font-bold text-primary tabular-nums">{price}</span>
                {hasDiscount && (
                  <>
                    <span className="font-heading text-lg text-ink/40 line-through tabular-nums">
                      ₹{product.originalPrice!.toLocaleString('en-IN')}
                    </span>
                    <span className="rounded-full bg-[#e6c88a]/25 px-2.5 py-1 text-xs font-semibold text-[#8a6a3b] tabular-nums">
                      Save {savePercent}%
                    </span>
                  </>
                )}
              </div>
              <p className="mt-1 text-xs text-ink/50">Inclusive of all taxes. Shipping calculated at checkout.</p>

              {/* Age selector */}
              <div ref={sizeRef} className="mt-7">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-ink">
                    Select age{selectedSize && <span className="font-normal text-ink/60">: {selectedSize}</span>}
                  </h2>
                  <button
                    onClick={() => setIsSizeChartOpen(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline underline-offset-4"
                  >
                    <Ruler size={14} /> Size guide
                  </button>
                </div>
                <div className={`grid grid-cols-3 sm:grid-cols-4 gap-2 rounded-2xl transition-shadow ${sizeError ? 'ring-2 ring-red-300 ring-offset-4 ring-offset-[#fdfbf7]' : ''}`}>
                  {sizeOptions.map((size) => {
                    const active = selectedSize === size
                    return (
                      <button
                        key={size}
                        disabled={isOutOfStock}
                        onClick={() => {
                          setSelectedSize(size)
                          setSizeError(false)
                        }}
                        aria-pressed={active}
                        className={`rounded-xl py-3 text-sm font-medium ring-1 transition-colors tabular-nums disabled:opacity-40 disabled:cursor-not-allowed ${
                          active
                            ? 'bg-primary text-white ring-primary'
                            : 'bg-white text-ink/80 ring-stone-200 hover:ring-primary/60 hover:text-primary'
                        }`}
                      >
                        {size.replace(/\s*Years?/i, ' yrs')}
                      </button>
                    )
                  })}
                </div>
                {sizeError && <p className="mt-3 text-sm text-red-600">Please select an age to continue.</p>}
              </div>

              {/* Actions */}
              <div ref={actionsRef} className="mt-6">
                {isOutOfStock ? (
                  <div className="w-full h-14 rounded-full bg-stone-100 flex items-center justify-center gap-2 text-ink/50 font-semibold select-none">
                    <span className="w-2 h-2 rounded-full bg-ink/30" />
                    Currently out of stock
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleAddToCart}
                      disabled={isAddingToCart}
                      className="h-14 rounded-full ring-1 ring-primary text-primary bg-white hover:bg-primary/5 font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
                    >
                      {isAddingToCart ? (
                        <span className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                      ) : (
                        <>
                          <ShoppingBag size={18} /> Add to bag
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleBuyNow}
                      disabled={isAddingToCart}
                      className="h-14 rounded-full bg-primary hover:bg-primary-hover text-white font-semibold shadow-lg shadow-primary/25 transition-colors disabled:opacity-60"
                    >
                      Buy now
                    </button>
                  </div>
                )}
              </div>

              {/* Trust points */}
              <div className="mt-6 grid grid-cols-3 gap-2 rounded-2xl bg-white ring-1 ring-stone-200/70 p-3">
                {TRUST_POINTS.map(({ icon: Icon, title, text }) => (
                  <div key={title} className="text-center px-1">
                    <Icon size={18} className="mx-auto text-primary" strokeWidth={1.75} />
                    <p className="mt-1.5 text-xs font-semibold text-ink">{title}</p>
                    <p className="mt-0.5 text-[11px] leading-snug text-ink/55">{text}</p>
                  </div>
                ))}
              </div>

              {/* Details accordions */}
              <div className="mt-4">
                {features.length > 0 && (
                  <Accordion title="Product details" defaultOpen>
                    <ul className="space-y-2">
                      {(showAllDetails ? features : features.slice(0, 6)).map((text, i) => (
                        <li key={i} className="flex gap-2.5">
                          <span className="mt-2 w-1 h-1 rounded-full bg-[#c9a45c] shrink-0" />
                          <span>{text}</span>
                        </li>
                      ))}
                    </ul>
                    {features.length > 6 && (
                      <button
                        onClick={() => setShowAllDetails((v) => !v)}
                        className="mt-3 text-sm font-medium text-primary hover:underline underline-offset-4"
                      >
                        {showAllDetails ? 'Show less' : `Show all ${features.length} details`}
                      </button>
                    )}
                  </Accordion>
                )}
                <Accordion title="Size & fit">
                  <p>Sizes are by age, but every child grows differently. Check your child’s measurements against the size guide before ordering.</p>
                  <button onClick={() => setIsSizeChartOpen(true)} className="mt-3 inline-flex items-center gap-1.5 font-medium text-primary hover:underline underline-offset-4">
                    <Ruler size={14} /> View size guide
                  </button>
                </Accordion>
                <Accordion title="Shipping & exchanges">
                  <p>Each piece is crafted to order and dispatched within 7 business days, then delivered in 2–8 business days depending on your city.</p>
                  <p className="mt-2">We don’t accept returns, but we’re happy to exchange for a different size.</p>
                  <div className="mt-3 flex gap-4">
                    <Link href="/help/shipping" className="font-medium text-primary hover:underline underline-offset-4">Shipping info</Link>
                    <Link href="/help/returns" className="font-medium text-primary hover:underline underline-offset-4">Exchange policy</Link>
                  </div>
                </Accordion>
              </div>
            </div>
          </div>

          {/* Related products */}
          {relatedProducts.length > 0 && (
            <section className="mt-16 md:mt-20">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-2">Complete the look</p>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-ink mb-6 md:mb-8">
                You may <span className="font-light italic text-primary">also like</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Mobile sticky buy bar */}
      {!isOutOfStock && (
        <div
          className={`lg:hidden fixed inset-x-0 bottom-0 z-40 border-t border-stone-200 bg-white/95 backdrop-blur-md px-4 py-3 flex items-center gap-3 transition-transform duration-300 ${
            showStickyBar ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <div className="min-w-0">
            <p className="font-heading text-lg font-bold text-primary leading-none tabular-nums">{price}</p>
            <p className="mt-1 text-xs text-ink/55 truncate">{selectedSize || 'Select an age'}</p>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="ml-auto h-12 px-6 rounded-full bg-primary text-white font-semibold flex items-center gap-2 disabled:opacity-60"
          >
            <ShoppingBag size={18} /> Add to bag
          </button>
        </div>
      )}

      {/* Image preview */}
      {isImagePreviewOpen && (
        <div className="fixed inset-0 z-50 bg-ink/95 flex items-center justify-center p-4">
          <button
            onClick={() => setIsImagePreviewOpen(false)}
            className="absolute top-4 right-4 z-10 p-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Close preview"
          >
            <X size={24} className="text-white" />
          </button>

          <div className="absolute top-5 left-5 z-10 text-white/70 text-sm tabular-nums">
            {previewImageIndex + 1} / {productImages.length}
          </div>

          {productImages.length > 1 && (
            <>
              <button onClick={prevImage} className="hidden sm:grid absolute left-4 z-10 w-12 h-12 place-items-center bg-white/10 hover:bg-white/20 rounded-full" aria-label="Previous image">
                <ChevronLeft size={26} className="text-white" />
              </button>
              <button onClick={nextImage} className="hidden sm:grid absolute right-4 z-10 w-12 h-12 place-items-center bg-white/10 hover:bg-white/20 rounded-full" aria-label="Next image">
                <ChevronRight size={26} className="text-white" />
              </button>
            </>
          )}

          <div
            className="relative max-w-4xl max-h-full select-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <Image
              src={productImages[previewImageIndex]}
              alt={`${product.name} - image ${previewImageIndex + 1}`}
              width={800}
              height={1000}
              sizes="(max-width: 896px) 100vw, 896px"
              className="max-w-full max-h-[85vh] w-auto object-contain pointer-events-none rounded-lg"
              draggable={false}
            />
          </div>

          {productImages.length > 1 && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex gap-2 max-w-[90vw] overflow-x-auto p-1">
              {productImages.map((image, index) => (
                <button
                  key={image}
                  onClick={() => setPreviewImageIndex(index)}
                  className={`relative shrink-0 w-12 h-14 rounded-md overflow-hidden transition-all ${
                    previewImageIndex === index ? 'ring-2 ring-white' : 'opacity-50 hover:opacity-100'
                  }`}
                  aria-label={`Show image ${index + 1}`}
                >
                  <Image src={image} alt="" fill sizes="48px" className="object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="absolute inset-0 -z-10" onClick={() => setIsImagePreviewOpen(false)} />
        </div>
      )}

      {/* Size guide */}
      {isSizeChartOpen && (
        <div className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-[2px] flex items-end sm:items-center justify-center sm:p-4" onClick={() => setIsSizeChartOpen(false)}>
          <div
            className="bg-[#fdfbf7] w-full sm:max-w-3xl max-h-[85vh] flex flex-col rounded-t-3xl sm:rounded-3xl shadow-2xl animate-in slide-in-from-bottom-4 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 md:px-7 py-4 border-b border-stone-200/70">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Size guide</p>
                <h2 className="font-heading text-lg md:text-xl font-bold text-ink">Find the right fit</h2>
              </div>
              <button onClick={() => setIsSizeChartOpen(false)} className="p-2 hover:bg-stone-100 rounded-full" aria-label="Close size guide">
                <X size={22} className="text-ink/70" />
              </button>
            </div>

            <div className="overflow-auto px-5 md:px-7 py-4">
              <table className="w-full min-w-[520px] text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-ink/50">
                    {['Age', 'Top length', 'Chest', 'Bottom length', 'Waist'].map((h) => (
                      <th key={h} className="py-3 pr-4 font-semibold first:sticky first:left-0 first:bg-[#fdfbf7]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sizeChartRows.map((row) => {
                    const highlighted = selectedSize && row[0].replace(/\s/g, '') === selectedSize.replace(/\s/g, '')
                    return (
                      <tr key={row[0]} className={`border-t border-stone-200/70 ${highlighted ? 'bg-primary/10' : ''}`}>
                        {row.map((cell, i) => (
                          <td
                            key={i}
                            className={`py-3 pr-4 tabular-nums ${i === 0 ? `sticky left-0 font-semibold text-ink ${highlighted ? 'bg-[#e3ece9]' : 'bg-[#fdfbf7]'}` : 'text-ink/70'}`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <p className="px-5 md:px-7 py-4 border-t border-stone-200/70 text-xs text-ink/60">
              All measurements are in inches. For the best fit, measure your child and compare with the chart.
            </p>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}
