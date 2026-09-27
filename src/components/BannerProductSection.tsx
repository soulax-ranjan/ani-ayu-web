import ImageBanner from './ImageBanner'
import ProductCard from './ProductCard'
import { Product } from '@/types/product'

interface BannerProductSectionProps {
  bannerImage: string
  bannerAlt: string
  bannerLink?: string
  products: Product[]
  sectionTitle?: string
}

export default function BannerProductSection({
  bannerImage,
  bannerAlt,
  bannerLink,
  products,
  sectionTitle
}: BannerProductSectionProps) {
  return (
    <section className="py-6 md:py-8">
      <div className="container mx-auto px-4">
        {/* Banner and Products in Single Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          {/* Banner Card - Takes 3 columns */}
          <div className="lg:col-span-3">
            <ImageBanner
              imageUrl={bannerImage}
              alt={bannerAlt}
              link={bannerLink}
            />
          </div>

          {/* Product Cards - Take 9 columns, display 3 cards */}
          <div className="lg:col-span-9 flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 overflow-x-auto sm:overflow-visible snap-x snap-mandatory scroll-px-4 sm:scroll-px-0 -mx-4 px-4 sm:mx-0 sm:px-0 pb-1 sm:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {products.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} className="shrink-0 w-[46%] sm:w-auto snap-start" />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}