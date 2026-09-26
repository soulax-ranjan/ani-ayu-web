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
        loading="lazy"
        placeholder="blur"
        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjZjBlY2U2Ii8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjZTBkNWNhIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI1MDAiIGZpbGw9InVybCgjZykiLz48L3N2Zz4="
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