import CardBanner from './CardBanner'

const promoBanners = [
  {
    id: 1,
    title: "Daily Comfort",
    subtitle: "Soft cotton sets for everyday fun",
    ctaText: "Shop Now",
    ctaLink: "/products?category=daily-comfort",
    backgroundImage: "/assets/placeholders/ph-hero-1.png",
    imageAlt: "Kids in comfortable daily wear"
  },
  {
    id: 2,
    title: "Festival Ready",
    subtitle: "Traditional designs for special occasions",
    ctaText: "Explore Collection",
    ctaLink: "/products?category=festival",
    backgroundImage: "/assets/placeholders/festive-version-2.png",
    imageAlt: "Children in festival wear"
  },
  {
    id: 3,
    title: "Playtime Essentials",
    subtitle: "Durable and fun clothing for active kids",
    ctaText: "Shop Collection",
    ctaLink: "/products?category=playtime",
    backgroundImage: "/assets/placeholders/ph-hero-2.jpg",
    imageAlt: "Kids playing in comfortable clothes"
  }
]

export default function PromoBanners() {
  return (
    <section className="py-8 md:py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {promoBanners.map((banner) => (
            <CardBanner
              key={banner.id}
              title={banner.title}
              subtitle={banner.subtitle}
              ctaText={banner.ctaText}
              ctaLink={banner.ctaLink}
              backgroundImage={banner.backgroundImage}
              imageAlt={banner.imageAlt}
            />
          ))}
        </div>
      </div>
    </section>
  )
}