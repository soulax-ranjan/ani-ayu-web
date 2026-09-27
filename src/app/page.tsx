import { Suspense } from 'react'
import Header from "@/components/Header"
import HeroCarousel from "@/components/HeroCarousel"
import BestDesigns from "@/components/BestDesigns"
import BannerProductSections from "@/components/BannerProductSections"
import FounderStory from "@/components/FounderStory"
import InstagramGallery from "@/components/InstagramGallery"
import Testimonials from "@/components/Testimonials"
import InstagramFeed from "@/components/InstagramFeed"
import Footer from "@/components/Footer"
import { apiClient, transformApiProduct } from "@/lib/api"
import type { Product } from "@/types/product"

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

export default async function HomePage() {
  const [bannersData, bestSellersData, productsData] = await Promise.all([
    apiClient.getBanners().catch(() => ({ banners: [] })),
    apiClient.getBestSellers(8).catch(() => ({ bestSellers: [] })),
    apiClient.getProducts({ limit: 100 }).catch(() => ({
      products: [],
      pagination: { page: 1, limit: 100, total: 0, totalPages: 0, hasNext: false, hasPrev: false },
      filters: {}
    }))
  ])

  // Only send the products the home banner rows actually show (first 4 per section) - keeps the page payload small
  const perSection = new Map<number, number>()
  const products = productsData.products.map(transformApiProduct).filter((p) => {
    if (!p.section) return false
    const shown = perSection.get(p.section) ?? 0
    perSection.set(p.section, shown + 1)
    return shown < 4
  }).map(toCardProduct)

  return (
    <>
      <Suspense fallback={<div className="h-16 md:h-20 bg-cream" />}>
        <Header />
      </Suspense>

      <main className="flex flex-col">

        {/* ── 1. Hero Carousel ── full bleed, no bg */}
        <HeroCarousel banners={bannersData.banners} />

        {/* ── 2. Best Designs ── crisp white */}
        <div style={{ background: '#ffffff' }}>
          <BestDesigns bestSellers={bestSellersData.bestSellers} />
        </div>

        {/* ── 3. Banner + Product Sections ── warm stone greige */}
        <div style={{ background: '#f0ece6' }}>
          <BannerProductSections products={products} />
        </div>

        {/* ── 4. Instagram Gallery ── crisp white */}
        <div style={{ background: '#ffffff' }}>
          <InstagramGallery />
        </div>

        {/* ── 5. Founder Story ── soft ivory stone */}
        <div style={{ background: '#f7f4f0' }}>
          <FounderStory />
        </div>

        {/* ── 6. Testimonials ── crisp white */}
        <div style={{ background: '#ffffff' }}>
          <Testimonials />
        </div>

        {/* ── 7. Instagram CTA ── warm stone */}
        <div style={{ background: '#f0ece6' }}>
          <InstagramFeed />
        </div>

      </main>

      <Footer />
    </>
  )
}

// Just the fields a ProductCard renders - descriptions, specs, sizes etc. stay out of the page payload
function toCardProduct(p: Product): Product {
  return {
    id: p.id,
    name: p.name,
    price: p.price,
    originalPrice: p.originalPrice,
    image: p.image,
    in_stock: p.in_stock,
    status: p.status,
    section: p.section,
    rating: p.rating,
    category: p.category,
    description: '',
    sizes: [],
    material: '',
    occasion: '',
  }
}
