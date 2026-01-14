import Image from 'next/image'
import Link from 'next/link'

interface CardBannerProps {
  title: string
  subtitle: string
  ctaText: string
  ctaLink: string
  backgroundImage: string
  imageAlt?: string
}

export default function CardBanner({
  title,
  subtitle,
  ctaText,
  ctaLink,
  backgroundImage,
  imageAlt = "Promo banner"
}: CardBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl shadow-lg h-48 md:h-64 lg:h-72">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-center p-6 md:p-8 lg:p-10">
        <div className="max-w-md">
          <h3 className="text-white text-xl md:text-2xl lg:text-3xl font-bold mb-2 md:mb-3">
            {title}
          </h3>
          <p className="text-white/90 text-sm md:text-base mb-4 md:mb-6 leading-relaxed">
            {subtitle}
          </p>
          <Link
            href={ctaLink}
            className="inline-flex items-center px-4 py-2 md:px-6 md:py-3 bg-primary text-black font-semibold rounded-lg hover:bg-primary/90 transition-colors duration-200 text-sm md:text-base"
          >
            {ctaText}
          </Link>
        </div>
      </div>
    </div>
  )
}