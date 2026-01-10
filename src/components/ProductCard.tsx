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
      <div className="relative bg-gradient-to-br from-white via-cream/30 to-mint/20 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-mint/30">
        {/* Product Image Section */}
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Top Badges Row */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
            {/* Discount Badge */}
            {discountPercent && (
              <div className="bg-gradient-to-r from-accent to-accent/80 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                -{discountPercent}%
              </div>
            )}
          </div>



          {/* Action Buttons - Appear on Hover */}
          <div className="absolute bottom-4 right-4 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <div className="flex flex-col gap-2">
              {/* Quick Add Button */}
              <button 
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                className="bg-primary text-white p-2.5 rounded-full shadow-lg hover:bg-primary/90 hover:scale-110 transition-all duration-200"
                title="Quick add to cart"
              >
                <ShoppingBag size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Product Info Section */}
        <div className="p-5">
          {/* Product Name */}
          <Link href={`/products/${product.id}`} className="block">
            <h3 className="font-[var(--font-heading)] font-bold text-ink text-base leading-tight mb-3 group-hover:text-primary transition-colors duration-200 line-clamp-2">
              {product.name}
            </h3>
          </Link>

          {/* Rating & Reviews */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1 bg-accent/10 px-2 py-1 rounded-full">
              <Star size={12} className="fill-accent text-accent" />
              <span className="text-xs font-semibold text-accent">{product.rating}</span>
            </div>
            <span className="text-xs text-ink/60">({product.reviewCount} reviews)</span>
          </div>

          {/* Preorder Tag */}
          <div className="mb-3">
            <span className="inline-block bg-accent text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm">
              Preorder
            </span>
          </div>

          {/* Product Description */}
          <div className="mb-3">
            <p className="text-sm text-ink/80 leading-relaxed line-clamp-2" style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical' as any,
              overflow: 'hidden'
            }}>
              {product.short_description || product.description}
            </p>
          </div>

          {/* Brand and Stock Info */}
          {(product.brand || (product.stock_quantity !== undefined && product.stock_quantity !== null)) && (
            <div className="mb-3 flex items-center justify-between">
              {product.brand && (
                <span className="text-xs text-ink/60 font-medium">
                  by {product.brand}
                </span>
              )}
              {(product.stock_quantity !== undefined && product.stock_quantity !== null) && (
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  product.stock_quantity === 0 
                    ? 'bg-red-100 text-red-700' 
                    : product.stock_quantity <= (product.low_stock_threshold || 5)
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-green-100 text-green-700'
                }`}>
                  {product.stock_quantity === 0 
                    ? 'Out of Stock' 
                    : product.stock_quantity <= (product.low_stock_threshold || 5)
                    ? `Only ${product.stock_quantity} left`
                    : `${product.stock_quantity} in stock`
                  }
                </span>
              )}
            </div>
          )}

          {/* Age Range & Available Sizes */}
          <div className="mb-3 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-ink/70 bg-mint/30 px-2 py-1 rounded-full font-medium">
                Age: {product.ageRange}
              </span>
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              <span className="text-xs text-ink/60 font-medium">Sizes:</span>
              {(product.sizes || []).slice(0, 4).map((size, index) => (
                <span key={size} className="text-xs bg-white border border-mint px-2 py-0.5 rounded font-medium text-ink">
                  {size}
                </span>
              ))}
              {(product.sizes || []).length > 4 && (
                <span className="text-xs text-ink/60">+{(product.sizes || []).length - 4}</span>
              )}
            </div>
          </div>

          {/* Price Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-[var(--font-heading)] font-bold text-lg text-primary">
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-ink/50 line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            
            {/* Small action indicator */}
            <div className="w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>

        {/* Hover Effect Border */}
        <div className="absolute inset-0 rounded-3xl border-2 border-primary/0 group-hover:border-primary/20 transition-all duration-300 pointer-events-none" />
      </div>
    </div>
  )
}
