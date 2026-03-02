import { Suspense } from 'react'
import Header from "@/components/Header"
import HeroCarousel from "@/components/HeroCarousel"
import BestDesigns from "@/components/BestDesigns"
import BannerProductSections from "@/components/BannerProductSections"
import SingleImageBanner from "@/components/SingleImageBanner"
import FounderStory from "@/components/FounderStory"
import InstagramFeed from "@/components/InstagramFeed"
import Footer from "@/components/Footer"
import { apiClient, transformApiProduct } from "@/lib/api"

export const revalidate = 300

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

  const products = productsData.products.map(transformApiProduct)

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

        {/* ── 4. Single Image Banner ── light stone wrapper */}
        <div style={{ background: '#f0ece6', padding: '3rem 0' }}>
          <SingleImageBanner />
        </div>

        {/* ── 5. Founder Story ── soft ivory stone */}
        <div style={{ background: '#f7f4f0' }}>
          <FounderStory />
        </div>

        {/* ── 6. Instagram CTA ── warm stone */}
        <div style={{ background: '#f0ece6' }}>
          <InstagramFeed />
        </div>

      </main>

      <Footer />
    </>
  )
}
