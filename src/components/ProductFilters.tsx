'use client'

import { useState } from 'react'
import { ChevronDown, Filter, X } from 'lucide-react'
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
  const [isOpen, setIsOpen] = useState(false)

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

  const clearFilters = () => {
    onFiltersChange({
      category: [],
      priceRange: [0, 5000],
      sizes: [],
      sortBy: 'popularity'
    })
  }

  const hasActiveFilters = filters.category.length > 0 || filters.sizes.length > 0 || 
    filters.priceRange[0] > 0 || filters.priceRange[1] < 5000

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 px-5 py-3 bg-cream border-2 border-mint rounded-xl w-full justify-between hover:bg-mint transition-colors duration-200 shadow-sm"
        >
          <span className="flex items-center gap-3">
            <Filter size={20} className="text-primary" />
            <span className="font-medium text-ink">Filters</span>
            {hasActiveFilters && (
              <span className="bg-accent text-white text-xs px-2.5 py-1 rounded-full font-semibold">
                Active
              </span>
            )}
          </span>
          <ChevronDown size={20} className={`transition-transform duration-200 text-primary ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Filters Panel */}
      <div className={`${className} ${isOpen ? 'block' : 'hidden'} lg:block bg-cream border-2 border-mint rounded-2xl p-6 shadow-card w-full max-w-sm lg:max-w-none`}>
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-[var(--font-heading)] font-bold text-ink text-xl">Filters</h3>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-accent hover:text-accent/80 text-sm font-semibold flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-accent/20 hover:bg-accent/5 transition-colors"
            >
              <X size={16} />
              Clear All
            </button>
          )}
        </div>

        {/* Sort By */}
        <div className="mb-8">
          <h4 className="font-[var(--font-heading)] font-semibold text-ink mb-4 text-lg">Sort By</h4>
          <select
            value={filters.sortBy}
            onChange={(e) => updateFilters({ sortBy: e.target.value as Filters['sortBy'] })}
            className="w-full p-3 bg-white border-2 border-mint rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors font-medium text-ink"
          >
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h4 className="font-[var(--font-heading)] font-semibold text-ink mb-4 text-lg">Category</h4>
          <div className="space-y-3">
            {CATEGORIES.map(category => (
              <label key={category.value} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-mint/30 transition-colors">
                <input
                  type="checkbox"
                  checked={filters.category.includes(category.value)}
                  onChange={() => toggleCategory(category.value)}
                  className="w-5 h-5 rounded border-2 border-primary text-primary focus:ring-primary focus:ring-2"
                />
                <span className="font-medium text-ink">{category.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-8">
          <h4 className="font-[var(--font-heading)] font-semibold text-ink mb-4 text-lg">Price Range</h4>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-ink/70 mb-1">Min</label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.priceRange[0] || ''}
                  onChange={(e) => updateFilters({ 
                    priceRange: [Number(e.target.value) || 0, filters.priceRange[1]] 
                  })}
                  className="w-full p-2 bg-white border-2 border-mint rounded-lg text-ink font-medium focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-ink/70 mb-1">Max</label>
                <input
                  type="number"
                  placeholder="5000"
                  value={filters.priceRange[1] || ''}
                  onChange={(e) => updateFilters({ 
                    priceRange: [filters.priceRange[0], Number(e.target.value) || 5000] 
                  })}
                  className="w-full p-2 bg-white border-2 border-mint rounded-lg text-ink font-medium focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm"
                />
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="5000"
              step="100"
              value={filters.priceRange[1]}
              onChange={(e) => updateFilters({ 
                priceRange: [filters.priceRange[0], Number(e.target.value)] 
              })}
              className="w-full h-2 bg-mint rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="bg-white px-3 py-1.5 rounded-lg border border-mint/50 text-center">
              <span className="text-primary font-semibold text-sm">
                ₹{filters.priceRange[0].toLocaleString()} - ₹{filters.priceRange[1].toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Sizes */}
        <div className="mb-6">
          <h4 className="font-[var(--font-heading)] font-semibold text-ink mb-4 text-lg">Size</h4>
          <div className="flex flex-wrap gap-3">
            {SIZES.map(size => (
              <button
                key={size}
                onClick={() => toggleSize(size)}
                className={`px-4 py-2.5 rounded-lg border-2 font-semibold transition-all duration-200 ${
                  filters.sizes.includes(size)
                    ? 'bg-primary text-white border-primary shadow-md transform scale-105'
                    : 'bg-white text-ink border-mint hover:border-primary hover:bg-mint/20 hover:scale-105'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
