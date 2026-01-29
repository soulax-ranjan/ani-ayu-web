"use client"
import Image from 'next/image'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { Product } from '@/types/product'

interface ProductCardProps {
  product: Product
  className?: string
}

export default function ProductCard({ product, className = '' }: ProductCardProps) {
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  const imageSrc = product.image && product.image.trim() !== ''
    ? product.image
    : '/assets/placeholders/festive-version-2.png'

  return (
    <Link href={`/products/${product.id}`} className={`group relative block ${className}`}>
      <div className="relative h-full bg-gradient-to-br from-white to-gray-50/50 rounded-[28px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-500 border border-gray-100/50 hover:border-amber-200/60 hover:-translate-y-1">

        {/* Image Section */}
        <div className="relative w-full aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100/30">
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Badges */}
          <div className="absolute top-3 inset-x-3 flex justify-between items-start z-10">
            {discountPercent ? (
              <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm flex items-center gap-1">
                <Sparkles size={12} className="fill-current" />
                <span>{discountPercent}% OFF</span>
              </div>
            ) : <div />}

            <span className="bg-white/95 backdrop-blur-md text-gray-800 text-[10px] font-extrabold px-3 py-1.5 rounded-full shadow-lg border border-white/40 uppercase tracking-[0.1em]">
              Preorder
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col p-3 space-y-2">

          {/* Title */}
          <h3 className="font-heading text-base font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-300 min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                ₹{product.price.toLocaleString()}
              </span>
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-gray-400 line-through font-medium">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* View Details Hint */}
          <div className="hidden md:block pt-1 text-xs md:text-sm text-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            View Details →
          </div>

        </div>

      </div>
    </Link>
  )
}
