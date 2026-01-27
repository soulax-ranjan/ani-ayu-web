import Image from 'next/image'
import Link from 'next/link'

interface ImageBannerProps {
  imageUrl: string
  alt: string
  link?: string
}

export default function ImageBanner({ imageUrl, alt, link }: ImageBannerProps) {
  const Content = () => (
    <div className="relative w-full aspect-[3/4] md:aspect-[4/5] lg:h-full bg-gray-50 rounded-3xl overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-300 border border-transparent group-hover:border-amber-100">
      <Image
        src={imageUrl}
        alt={alt}
        fill
        className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 33vw"
      />
    </div>
  )

  if (link) {
    return (
      <Link href={link} className="group block h-full">
        <Content />
      </Link>
    )
  }

  return (
    <div className="group h-full">
      <Content />
    </div>
  )
}