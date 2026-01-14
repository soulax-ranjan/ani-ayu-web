import BannerProductSection from './BannerProductSection'
import { Product } from '@/types/product'

// Mock product data - replace with real data from API
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Comfortable Cotton Set for Kids',
    price: 899,
    originalPrice: 1299,
    image: '/assets/placeholders/1_4.webp',
    rating: 4.5,
    reviewCount: 24,
    category: 'daily-wear'
  },
  {
    id: '2', 
    name: 'Festival Special Traditional Outfit',
    price: 1499,
    originalPrice: 1999,
    image: '/assets/placeholders/1_4.webp',
    rating: 4.8,
    reviewCount: 18,
    category: 'festival'
  },
  {
    id: '3',
    name: 'Active Play Essentials Set',
    price: 699,
    originalPrice: 999,
    image: '/assets/placeholders/1_4.webp',
    rating: 4.3,
    reviewCount: 32,
    category: 'playtime'
  }
]

const sections = [
  {
    id: 1,
    bannerImage: '/assets/placeholders/n4-3.jpg',
    bannerAlt: 'Daily Comfort Collection',
    bannerLink: '/products?category=daily-comfort',
    products: mockProducts,
    sectionTitle: 'Daily Comfort'
  },
  {
    id: 2,
    bannerImage: '/assets/placeholders/n8-2.jpg', 
    bannerAlt: 'Festival Collection',
    bannerLink: '/products?category=festival',
    products: mockProducts,
    sectionTitle: 'Festival Ready'
  },
  {
    id: 3,
    bannerImage: '/assets/placeholders/n13-1.jpg',
    bannerAlt: 'Playtime Collection',
    bannerLink: '/products?category=playtime', 
    products: mockProducts,
    sectionTitle: 'Playtime Essentials'
  }
]

export default function BannerProductSections() {
  return (
    <div>
      {sections.map((section, index) => (
        <div
          key={section.id}
          className={index % 2 === 0 ? 'bg-white' : 'bg-cream/30'}
        >
          <BannerProductSection
            bannerImage={section.bannerImage}
            bannerAlt={section.bannerAlt}
            bannerLink={section.bannerLink}
            products={section.products}
            sectionTitle={section.sectionTitle}
          />
        </div>
      ))}
    </div>
  )
}