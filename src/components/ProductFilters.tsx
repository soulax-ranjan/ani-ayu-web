'use client'

import { Check } from 'lucide-react'
import { Filters } from '@/types/product'

export const PRICE_MAX = 10000

interface ProductFiltersProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
  /** Sizes that actually exist on the products, e.g. "2-3 Years" */
  availableSizes: string[]
  className?: string
}

const CATEGORIES = [
  { value: 'girls', label: 'Girls' },
  { value: 'boys', label: 'Boys' },
]

export const SORT_OPTIONS = [
  { value: 'popularity' as const, label: 'Popular' },
  { value: 'price-low' as const, label: 'Price: Low to High' },
  { value: 'price-high' as const, label: 'Price: High to Low' },
  { value: 'rating' as const, label: 'Top Rated' },
]

const PRICE_PRESETS: { label: string; range: [number, number] }[] = [
  { label: 'Under ₹2,500', range: [0, 2500] },
  { label: '₹2,500 – ₹3,500', range: [2500, 3500] },
  { label: '₹3,500 – ₹4,500', range: [3500, 4500] },
  { label: '₹4,500 & above', range: [4500, PRICE_MAX] },
]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="py-6 border-b border-stone-200/70 last:border-b-0">
      <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/50 mb-4">{title}</h4>
      {children}
    </section>
  )
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium ring-1 transition-colors ${
        active
          ? 'bg-primary text-white ring-primary'
          : 'bg-white text-ink/80 ring-stone-200 hover:ring-primary/60 hover:text-primary'
      }`}
    >
      {active && <Check size={14} strokeWidth={2.5} />}
      {children}
    </button>
  )
}

export default function ProductFilters({ filters, onFiltersChange, availableSizes, className = '' }: ProductFiltersProps) {
  const updateFilters = (updates: Partial<Filters>) => onFiltersChange({ ...filters, ...updates })

  const toggle = (list: string[], value: string) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value]

  const [min, max] = filters.priceRange
  const isPreset = (range: [number, number]) => range[0] === min && range[1] === max

  return (
    <div className={className}>
      {/* Sort */}
      <Section title="Sort by">
        <div className="flex flex-wrap gap-2">
          {SORT_OPTIONS.map((option) => (
            <Chip
              key={option.value}
              active={filters.sortBy === option.value}
              onClick={() => updateFilters({ sortBy: option.value })}
            >
              {option.label}
            </Chip>
          ))}
        </div>
      </Section>

      {/* Category */}
      <Section title="Shop for">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <Chip
              key={category.value}
              active={filters.category.includes(category.value)}
              onClick={() => updateFilters({ category: toggle(filters.category, category.value) })}
            >
              {category.label}
            </Chip>
          ))}
        </div>
      </Section>

      {/* Age / size */}
      {availableSizes.length > 0 && (
        <Section title="Age">
          <div className="grid grid-cols-3 gap-2">
            {availableSizes.map((size) => {
              const active = filters.sizes.includes(size)
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => updateFilters({ sizes: toggle(filters.sizes, size) })}
                  aria-pressed={active}
                  className={`rounded-xl py-2.5 text-sm font-medium ring-1 transition-colors tabular-nums ${
                    active
                      ? 'bg-primary text-white ring-primary'
                      : 'bg-white text-ink/80 ring-stone-200 hover:ring-primary/60 hover:text-primary'
                  }`}
                >
                  {size.replace(/\s*Years?/i, ' yrs')}
                </button>
              )
            })}
          </div>
        </Section>
      )}

      {/* Price */}
      <Section title="Price">
        <div className="flex flex-wrap gap-2 mb-4">
          {PRICE_PRESETS.map((preset) => (
            <Chip
              key={preset.label}
              active={isPreset(preset.range)}
              onClick={() => updateFilters({ priceRange: isPreset(preset.range) ? [0, PRICE_MAX] : preset.range })}
            >
              {preset.label}
            </Chip>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {(['Min', 'Max'] as const).map((label, i) => (
            <label key={label} className="flex-1">
              <span className="sr-only">{label} price</span>
              <div className="flex items-center rounded-xl ring-1 ring-stone-200 focus-within:ring-2 focus-within:ring-primary bg-white px-3">
                <span className="text-sm text-ink/40">₹</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  placeholder={label}
                  value={i === 0 ? (min || '') : (max < PRICE_MAX ? max : '')}
                  onChange={(e) => {
                    const value = Number(e.target.value)
                    updateFilters({
                      priceRange: i === 0 ? [value || 0, max] : [min, value || PRICE_MAX],
                    })
                  }}
                  className="w-full bg-transparent py-2.5 pl-1.5 text-sm text-ink tabular-nums outline-none placeholder:text-ink/40"
                />
              </div>
            </label>
          ))}
        </div>
      </Section>
    </div>
  )
}
