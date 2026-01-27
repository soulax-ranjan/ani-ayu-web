"use client"
import Image from 'next/image'
import Link from 'next/link'
import { Star, ShoppingCart, Check, Sparkles } from 'lucide-react'
import { Product } from '@/types/product'
import { useCartStore } from '@/store/cartStore'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface ProductCardProps {
  product: Product
  className?: string
}

export default function ProductCard({ product, className = '' }: ProductCardProps) {
  const { addItem } = useCartStore()
  const router = useRouter()
  const [isAdding, setIsAdding] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsAdding(true)
    const success = await addItem(product, 'M', 1)
    setIsAdding(false)

    if (success) {
      setIsSuccess(true)
      setTimeout(() => setIsSuccess(false), 1500)
    }
  }

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsAdding(true)
    await addItem(product, 'M', 1)
    setIsAdding(false)
    router.push('/checkout')
  }

  const imageSrc = product.image && product.image.trim() !== ''
    ? product.image
    : '/assets/placeholders/festive-version-2.png'

  return (
    <div className={`group relative ${className}`}>
      <div className="relative h-full bg-gradient-to-br from-white to-gray-50/50 rounded-[28px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-500 border border-gray-100/50 hover:border-amber-200/60 hover:-translate-y-1">

        {/* Image Section */}
        <Link href={`/products/${product.id}`} className="relative block w-full aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100/30">
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
        </Link>

        {/* Content Section */}
        <div className="flex flex-col p-4 space-y-3">

          {/* Title */}
          <Link href={`/products/${product.id}`} className="block">
            <h3 className="font-heading text-base font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-300 min-h-[2.5rem]">
              {product.name}
            </h3>
          </Link>


          {/* Price & Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 pt-2">

            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-gray-900 tracking-tight">
                  ₹{product.price.toLocaleString()}
                </span>
              </div>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-gray-400 line-through font-medium">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleAddToCart}
                disabled={isAdding || isSuccess}
                className={`
                  w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-2xl transition-all duration-300 transform
                  ${isSuccess
                    ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-lg shadow-green-500/30 scale-110'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-primary hover:text-primary hover:shadow-lg hover:scale-105 active:scale-95'
                  }
                `}
                title="Add to cart"
              >
                {isAdding ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : isSuccess ? (
                  <Check size={18} className="stroke-[3]" />
                ) : (
                  <ShoppingCart size={18} className="stroke-[2.5]" />
                )}
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 sm:flex-initial bg-gradient-to-r from-primary via-amber-400 to-primary hover:from-amber-500 hover:to-amber-400 text-gray-900 rounded-2xl px-5 py-2.5 text-sm font-black shadow-lg shadow-primary/40 hover:shadow-xl hover:shadow-primary/50 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-1.5 whitespace-nowrap"
                title="Buy Now"
              >
                <Sparkles size={15} className="fill-current" />
                <span>Buy Now</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
