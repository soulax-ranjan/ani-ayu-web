'use client'
import { useEffect, useState } from 'react'
import BannerProductSection from './BannerProductSection'
import { Product } from '@/types/product'
import { apiClient, Product as ApiProduct } from '@/lib/api'

// Convert API Product to local Product type
const convertApiProduct = (apiProduct: ApiProduct): Product => ({
  id: apiProduct.id,
  name: apiProduct.name,
  description: apiProduct.description,
  price: apiProduct.price,
  originalPrice: apiProduct.original_price,
  image: apiProduct.image_url,
  rating: apiProduct.rating,
  reviewCount: apiProduct.review_count,
  category: apiProduct.category_id,
  sizes: apiProduct.sizes,
  colors: apiProduct.colors,
  in_stock: apiProduct.in_stock,
  featured: apiProduct.featured,
  section: apiProduct.section,
  material: apiProduct.material || '',
  occasion: apiProduct.occasion || ''
})

// Mock product data for sections 2 and 3 - replace with real data from API
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Comfortable Cotton Set for Kids',
    description: 'Soft and comfortable cotton set perfect for daily wear',
    price: 899,
    originalPrice: 1299,
    image: '/assets/placeholders/festive-version-2.png',
    rating: 4.5,
    reviewCount: 24,
    category: 'boys',
    sizes: ['S', 'M', 'L'],
    material: 'Cotton',
    occasion: 'Daily',
    in_stock: true
  },
  {
    id: '2',
    name: 'Festival Special Traditional Outfit',
    description: 'Beautiful traditional outfit for special occasions',
    price: 1499,
    originalPrice: 1999,
    image: '/assets/placeholders/festive-version-2.png',
    rating: 4.8,
    reviewCount: 18,
    category: 'girls',
    sizes: ['S', 'M', 'L'],
    material: 'Silk',
    occasion: 'Festival',
    in_stock: true
  },
  {
    id: '3',
    name: 'Active Play Essentials Set',
    description: 'Perfect set for active play and sports activities',
    price: 699,
    originalPrice: 999,
    image: '/assets/placeholders/festive-version-2.png',
    rating: 4.3,
    reviewCount: 32,
    category: 'boys',
    sizes: ['S', 'M', 'L'],
    material: 'Cotton Blend',
    occasion: 'Casual',
    in_stock: true
  },
  {
    id: '4',
    name: 'Elegant Party Dress',
    description: 'Stylish dress perfect for parties and celebrations',
    price: 1299,
    originalPrice: 1799,
    image: '/assets/placeholders/festive-version-2.png',
    rating: 4.6,
    reviewCount: 15,
    category: 'girls',
    sizes: ['S', 'M', 'L'],
    material: 'Polyester',
    occasion: 'Party',
    in_stock: true
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
  const [section1Products, setSection1Products] = useState<Product[]>([])
  const [section2Products, setSection2Products] = useState<Product[]>([])
  const [section3Products, setSection3Products] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAllSectionProducts = async () => {
      try {
        // Fetch all products and then filter by section
        const response = await apiClient.getProducts({
          limit: 50, // Get more products to ensure we have products for each section
          featured: true
        })
        const allProducts = response.products.map(convertApiProduct)

        // Filter products by section
        const section1 = allProducts.filter(p => p.section === 1).slice(0, 4)
        const section2 = allProducts.filter(p => p.section === 2).slice(0, 4)
        const section3 = allProducts.filter(p => p.section === 3).slice(0, 4)

        console.log('API Products by section:', {
          total: allProducts.length,
          section1: section1.length,
          section2: section2.length,
          section3: section3.length,
          allSections: allProducts.map(p => ({ id: p.id, name: p.name, section: p.section, image: p.image }))
        })

        setSection1Products(section1.length > 0 ? section1 : mockProducts.slice(0, 4))
        setSection2Products(section2.length > 0 ? section2 : mockProducts.slice(0, 4))
        setSection3Products(section3.length > 0 ? section3 : mockProducts.slice(0, 4))

      } catch (error) {
        console.error('Failed to fetch section products:', error)
        // Fallback to mock data if API fails
        setSection1Products(mockProducts.slice(0, 4))
        setSection2Products(mockProducts.slice(0, 4))
        setSection3Products(mockProducts.slice(0, 4))
      } finally {
        setLoading(false)
      }
    }

    fetchAllSectionProducts()
  }, [])

  const sections = [
    {
      id: 1,
      bannerImage: '/assets/placeholders/n4-3.jpg',
      bannerAlt: 'Daily Comfort Collection',
      bannerLink: '/products?section=1',
      products: section1Products,
      sectionTitle: 'Daily Comfort'
    },
    {
      id: 2,
      bannerImage: '/assets/placeholders/n8-2.jpg',
      bannerAlt: 'Festival Collection',
      bannerLink: '/products?section=2',
      products: section2Products,
      sectionTitle: 'Festival Ready'
    },
    {
      id: 3,
      bannerImage: '/assets/placeholders/n13-1.jpg',
      bannerAlt: 'Playtime Collection',
      bannerLink: '/products?section=3',
      products: section3Products,
      sectionTitle: 'Playtime Essentials'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading sections...</p>
        </div>
      </div>
    )
  }

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