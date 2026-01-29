import Header from "@/components/Header"
import HeroCarousel from "@/components/HeroCarousel"
import BestDesigns from "@/components/BestDesigns"
import BannerProductSections from "@/components/BannerProductSections"
import SingleImageBanner from "@/components/SingleImageBanner"
import FounderStory from "@/components/FounderStory"
// import InstagramFeed from "@/components/InstagramFeed"
import Footer from "@/components/Footer"
import MascotCorner from "@/components/MascotCorner"

// Disable static generation (components fetch dynamic data)
export const dynamic = 'force-dynamic'
export const runtime = 'edge'

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex flex-col">
        {/* Hero Carousel */}
        <HeroCarousel />
        <BestDesigns />
        <BannerProductSections />
        <SingleImageBanner />
        <FounderStory />
        {/* <InstagramFeed /> */}
      </main>
      <Footer />
    </>
  )
}
