'use client'

import { Filters } from '@/types/product'

interface ProductFiltersProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
  className?: string
}

const CATEGORIES = [
  { value: 'boys', label: 'Boys' },
  { value: 'girls', label: 'Girls' }
]

const SIZES = ['XS', 'S', 'M', 'L', 'XL']

const SORT_OPTIONS = [
  { value: 'popularity' as const, label: 'Popularity' },
  { value: 'price-low' as const, label: 'Price: Low to High' },
  { value: 'price-high' as const, label: 'Price: High to Low' },
  { value: 'rating' as const, label: 'Customer Rating' }
]

export default function ProductFilters({ filters, onFiltersChange, className = '' }: ProductFiltersProps) {
  const updateFilters = (updates: Partial<Filters>) => {
    onFiltersChange({ ...filters, ...updates })
  }

  const toggleCategory = (category: string) => {
    const newCategories = filters.category.includes(category)
      ? filters.category.filter(c => c !== category)
      : [...filters.category, category]
    updateFilters({ category: newCategories })
  }

  const toggleSize = (size: string) => {
    const newSizes = filters.sizes.includes(size)
      ? filters.sizes.filter(s => s !== size)
      : [...filters.sizes, size]
    updateFilters({ sizes: newSizes })
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Sort By */}
      <div>
        <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Sort By</h4>
        <select
          value={filters.sortBy}
          onChange={(e) => updateFilters({ sortBy: e.target.value as Filters['sortBy'] })}
          className="w-full p-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all font-medium text-gray-900"
        >
          {SORT_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Categories */}
      <div>
        <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Category</h4>
        <div className="space-y-3">
          {CATEGORIES.map(category => (
            <label
              key={category.value}
              className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <div className="relative">
                <input
                  type="checkbox"
                  checked={filters.category.includes(category.value)}
                  onChange={() => toggleCategory(category.value)}
                  className="w-5 h-5 rounded-lg border-2 border-gray-300 text-primary focus:ring-primary focus:ring-2 cursor-pointer"
                />
              </div>
              <span className="font-medium text-gray-700 group-hover:text-gray-900">{category.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Price Range</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Min Price</label>
              <input
                type="number"
                placeholder="0"
                value={filters.priceRange[0] || ''}
                onChange={(e) => updateFilters({
                  priceRange: [Number(e.target.value) || 0, filters.priceRange[1]]
                })}
                className="w-full p-2.5 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 font-medium focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Max Price</label>
              <input
                type="number"
                placeholder="10000"
                value={filters.priceRange[1] || ''}
                onChange={(e) => updateFilters({
                  priceRange: [filters.priceRange[0], Number(e.target.value) || 10000]
                })}
                className="w-full p-2.5 bg-gray-50 border-2 border-gray-200 rounded-lg text-gray-900 font-medium focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm"
              />
            </div>
          </div>

          {/* Range Slider */}
          <div className="space-y-3">
            <input
              type="range"
              min="0"
              max="10000"
              step="100"
              value={filters.priceRange[1]}
              onChange={(e) => updateFilters({
                priceRange: [filters.priceRange[0], Number(e.target.value)]
              })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="bg-gradient-to-r from-primary/10 to-amber-100/50 px-4 py-2.5 rounded-xl border border-primary/20 text-center">
              <span className="text-primary font-bold text-sm">
                ₹{filters.priceRange[0].toLocaleString()} - ₹{filters.priceRange[1].toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Size</h4>
        <div className="flex flex-wrap gap-2">
          {SIZES.map(size => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={`px-4 py-2.5 rounded-xl border-2 font-bold transition-all duration-200 ${filters.sizes.includes(size)
                ? 'bg-gradient-to-r from-primary to-amber-400 text-gray-900 border-primary shadow-lg shadow-primary/30 scale-105'
                : 'bg-white text-gray-700 border-gray-200 hover:border-primary hover:bg-gray-50 hover:scale-105'
                }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
