import Image from 'next/image'

interface ImageBannerProps {
  imageUrl: string
  alt: string
  link?: string
}

export default function ImageBanner({ imageUrl, alt, link }: ImageBannerProps) {
  const BannerContent = () => (
    <div className="group relative">
      {/* Main Card Container - Identical to ProductCard */}
      <div className="relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
        {/* Image Section - Covers full card height */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={imageUrl}
            alt={alt}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </div>
    </div>
  )

  if (link) {
    return (
      <a href={link} className="block">
        <BannerContent />
      </a>
    )
  }

  return <BannerContent />
}