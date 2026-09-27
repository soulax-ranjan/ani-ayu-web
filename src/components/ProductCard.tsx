"use client"
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { Product } from '@/types/product'

interface ProductCardProps {
  product: Product
  className?: string
}

export default function ProductCard({ product, className = '' }: ProductCardProps) {
  const isOutOfStock = product.status === 'out_of_stock' || product.in_stock === false
  const [isLoaded, setIsLoaded] = useState(false)

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  const imageSrc = product.image && product.image.trim() !== ''
    ? product.image
    : '/assets/placeholders/festive-version-2.png'

  return (
    <Link href={`/products/${product.id}`} className={`group relative block ${className}`}>
      <div className={`relative h-full bg-white rounded-2xl md:rounded-[28px] overflow-hidden ring-1 ring-stone-200/70 shadow-[0_2px_12px_-4px_rgba(120,90,50,0.14)] transition-all duration-500 ease-out ${
        isOutOfStock
          ? 'opacity-80'
          : 'hover:-translate-y-1 hover:ring-[#e6c88a] hover:shadow-[0_22px_40px_-18px_rgba(120,90,50,0.38)]'
      }`}>

        {/* Image Section */}
        <div className="relative w-full aspect-[3/4] overflow-hidden bg-gradient-to-b from-[#fdfbf7] to-[#f1e7da]">

          {/* Shimmer skeleton — visible until image loads */}
          {!isLoaded && (
            <div className="absolute inset-0 z-10 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            </div>
          )}

          <Image
            src={imageSrc}
            alt={product.name}
            fill
            onLoad={() => setIsLoaded(true)}
            className={`object-cover object-[center_15%] transition-all duration-700 ease-out ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            } ${
              isOutOfStock ? 'grayscale-[40%]' : 'brightness-[1.05] contrast-[1.04] saturate-[1.1] group-hover:scale-105 group-hover:brightness-[1.09]'
            }`}
            sizes="(max-width: 1024px) 50vw, 33vw"
          />

          {/* Studio lighting: soft key light from above, gentle vignette, grounding shadow at the base */}
          {!isOutOfStock && (
            <>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,transparent_55%,rgba(60,40,20,0.12)_100%)]" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/5 bg-gradient-to-t from-[rgba(60,40,20,0.10)] to-transparent" />
              <div className="pointer-events-none absolute inset-0 rounded-t-[inherit] ring-1 ring-inset ring-white/40" />
              {/* Light sheen that sweeps across on hover */}
              <div className="pointer-events-none absolute inset-y-0 left-0 w-1/2 -translate-x-[150%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-[250%]" />
            </>
          )}

          {/* Out of Stock Banner */}
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/30" />
              <div className="relative z-10 bg-white/95 text-gray-800 text-[10px] md:text-xs font-bold uppercase tracking-widest px-3 md:px-5 py-1.5 md:py-2 rounded-full shadow-lg border border-gray-200">
                Out of Stock
              </div>
            </div>
          )}

          {/* Discount Badge */}
          {discountPercent && !isOutOfStock && (
            <div className="absolute top-2 left-2 md:top-3 md:left-3 z-10">
              <div className="bg-primary text-white text-[10px] md:text-xs font-bold px-2 md:px-3 py-1 md:py-1.5 rounded-full shadow-lg backdrop-blur-sm flex items-center gap-1">
                <Sparkles size={12} className="fill-current" />
                <span>{discountPercent}% OFF</span>
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex flex-col p-3 md:p-4 space-y-1.5 md:space-y-3">

          {/* Title */}
          <h3 className={`font-heading text-sm md:text-base font-semibold leading-tight line-clamp-2 transition-colors duration-300 ${
            isOutOfStock ? 'text-gray-400' : 'text-ink group-hover:text-primary'
          }`}>
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className={`font-heading text-lg md:text-2xl font-bold tabular-nums ${
                isOutOfStock ? 'text-gray-400' : 'text-primary'
              }`}>
                ₹{product.price.toLocaleString()}
              </span>
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="font-heading text-xs text-[#a8a29e] line-through font-medium tabular-nums">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>

      </div>
    </Link>
  )
}
