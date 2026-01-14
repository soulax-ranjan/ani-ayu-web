import Image from 'next/image'
import Link from 'next/link'
import { Star, ShoppingBag, Palette } from 'lucide-react'
import { Product } from '@/types/product'

interface ProductCardProps {
  product: Product
  className?: string
}

export default function ProductCard({ product, className = '' }: ProductCardProps) {
  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  return (
    <div className={`group relative ${className}`}>
      {/* Main Card Container */}
      <div className="relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
        {/* Product Image Section */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />
          
          {discountPercent && (
            <div className="absolute top-2 left-2 bg-accent text-white px-2 py-1 rounded text-xs font-medium">
              -{discountPercent}%
            </div>
          )}
          
          {/* Preorder Tag */}
          <div className="absolute bottom-2 right-2 bg-primary text-white px-2 py-1 rounded text-xs font-semibold uppercase tracking-wide shadow-sm">
            Preorder
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
