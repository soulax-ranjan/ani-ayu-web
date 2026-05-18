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
      <div className={`relative h-full bg-gradient-to-br from-white to-gray-50/50 rounded-[28px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100/50 transition-all duration-500 ${
        isOutOfStock
          ? 'opacity-80'
          : 'hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:border-primary/30 hover:-translate-y-1'
      }`}>

        {/* Image Section */}
        <div className="relative w-full aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100/30">

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
            className={`object-cover transition-all duration-700 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            } ${
              isOutOfStock ? 'grayscale-[40%]' : 'group-hover:scale-110'
            }`}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Gradient Overlay on Hover */}
          {!isOutOfStock && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          )}

          {/* Out of Stock Banner */}
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/30" />
              <div className="relative z-10 bg-white/95 text-gray-800 text-xs font-black uppercase tracking-widest px-5 py-2 rounded-full shadow-lg border border-gray-200">
                Out of Stock
              </div>
            </div>
          )}

          {/* Discount Badge */}
          {discountPercent && !isOutOfStock && (
            <div className="absolute top-3 left-3 z-10">
              <div className="bg-primary text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm flex items-center gap-1">
                <Sparkles size={12} className="fill-current" />
                <span>{discountPercent}% OFF</span>
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex flex-col p-4 space-y-3">

          {/* Title */}
          <h3 className={`font-heading text-base font-semibold leading-tight line-clamp-2 transition-colors duration-300 ${
            isOutOfStock ? 'text-gray-400' : 'text-ink group-hover:text-primary'
          }`}>
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-black tracking-tight ${
                isOutOfStock ? 'text-gray-400' : 'text-primary'
              }`}>
                ₹{product.price.toLocaleString()}
              </span>
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-[#a8a29e] line-through font-medium">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>

      </div>
    </Link>
  )
}
