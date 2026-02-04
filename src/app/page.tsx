import { Suspense } from 'react'
import Header from "@/components/Header"
import HeroCarousel from "@/components/HeroCarousel"
import BestDesigns from "@/components/BestDesigns"
import BannerProductSections from "@/components/BannerProductSections"
import SingleImageBanner from "@/components/SingleImageBanner"
import FounderStory from "@/components/FounderStory"
// import InstagramFeed from "@/components/InstagramFeed"
import Footer from "@/components/Footer"
import { apiClient, transformApiProduct } from "@/lib/api"

// Enable ISR (Incremental Static Regeneration) with 5 minute revalidation
export const revalidate = 300

export default async function HomePage() {
  // Parallel data fetching
  const [bannersData, bestSellersData, productsData] = await Promise.all([
    apiClient.getBanners().catch(() => ({ banners: [] })),
    apiClient.getBestSellers(6).catch(() => ({ bestSellers: [] })),
    apiClient.getProducts({ limit: 100 }).catch(() => ({ products: [], pagination: { page: 1, limit: 100, total: 0, totalPages: 0, hasNext: false, hasPrev: false }, filters: {} }))
  ])

  // Transform products for BannerProductSections
  const products = productsData.products.map(transformApiProduct)

  return (
    <>
      <Suspense fallback={<div className="h-16 md:h-20 bg-cream" />}>
        <Header />
      </Suspense>
      <main className="flex flex-col">
        {/* Hero Carousel */}
        <HeroCarousel banners={bannersData.banners} />
        <BestDesigns bestSellers={bestSellersData.bestSellers} />
        <BannerProductSections products={products} />
        <SingleImageBanner />
        <FounderStory />
        {/* <InstagramFeed /> */}
      </main>
      <Footer />
    </>
  )
}
