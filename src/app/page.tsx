import Header from "@/components/Header"
import HeroCarousel from "@/components/HeroCarousel"
import BestDesigns from "@/components/BestDesigns"
import SingleImageBanner from "@/components/SingleImageBanner"
import ShopByGender from "@/components/ShopByGender"
import FounderStory from "@/components/FounderStory"
import InstagramFeed from "@/components/InstagramFeed"
import Footer from "@/components/Footer"
import MascotCorner from "@/components/MascotCorner"

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex flex-col">
        {/* Hero Carousel */}
        <HeroCarousel />
        <BestDesigns />
        <SingleImageBanner />
        <ShopByGender />
        <FounderStory />
        <InstagramFeed />
      </main>
      <Footer />
    </>
  )
}
