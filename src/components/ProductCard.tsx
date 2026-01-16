"use client"
import Image from 'next/image'
import Link from 'next/link'
import { Star, ShoppingBag, Palette, Check } from 'lucide-react'
import { Product } from '@/types/product'
import { useCartStore } from '@/store/cartStore'
import { useState } from 'react'

interface ProductCardProps {
  product: Product
  className?: string
}

export default function ProductCard({ product, className = '' }: ProductCardProps) {
  const { addItem } = useCartStore()
  const [isAdding, setIsAdding] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsAdding(true)

    // Add to cart with default size (you might want to add size selection)
    const success = await addItem(product, 'M', 1)

    setIsAdding(false)

    if (success) {
      setIsSuccess(true)
      // Reset success state after delay
      setTimeout(() => {
        setIsSuccess(false)
      }, 1500)
    }
  }

  // Use placeholder if image is missing or empty
  const imageSrc = product.image && product.image.trim() !== ''
    ? product.image
    : '/assets/placeholders/festive-version-2.png'

  return (
    <div className={`group relative ${className}`}>
      {/* Main Card Container */}
      <div className="relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
        {/* Product Image Section */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            className="object-cover"
          />

          {discountPercent && (
            <div className="absolute top-2 left-2 bg-accent text-white px-2 py-1 rounded text-xs font-medium">
              -{discountPercent}%
            </div>
          )}

          {/* Preorder Tag with Add to Cart */}
          <div className="absolute bottom-2 right-2 flex flex-col gap-2">
            <div className="bg-primary text-black px-2 py-1 rounded text-xs font-semibold uppercase tracking-wide shadow-sm">
              Preorder
            </div>
            <button
              onClick={handleAddToCart}
              disabled={isAdding || isSuccess}
              className={`
                bg-white/90 backdrop-blur-sm text-ink p-2 rounded-full shadow-sm hover:bg-white transition-all duration-200 hover:scale-110 disabled:opacity-80
                ${isSuccess ? 'text-green-600 bg-green-50' : ''}
              `}
              title="Add to cart"
            >
              {isAdding ? (
                <div className="w-3.5 h-3.5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              ) : isSuccess ? (
                <Check size={14} />
              ) : (
                <ShoppingBag size={14} />
              )}
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-2">
          <Link href={`/products/${product.id}`} className="block">
            <h3 className="font-medium text-ink text-sm leading-tight mb-1 line-clamp-2 hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-1">
            <Star size={12} className="fill-primary text-primary" />
            <span className="text-xs font-medium">{product.rating}</span>
            <span className="text-xs text-muted-text">({product.reviewCount})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-1">
            <span className="font-semibold text-primary text-sm">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-muted-text line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
