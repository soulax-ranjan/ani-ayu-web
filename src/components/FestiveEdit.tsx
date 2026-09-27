import { Sparkles } from "lucide-react"
import ProductCard from "@/components/ProductCard"
import type { Product } from "@/types/product"

export interface FestiveCollection {
  /** The full shared tag, e.g. "Festive - Diwali" */
  tag: string
  products: Product[]
}

// "Festive - Diwali" -> "Diwali"
function occasionName(tag: string) {
  return tag.replace(/^festive\s*[-–:]?\s*/i, "").trim()
}

// Soft rangoli motif: rings of petals around a centre dot
function Rangoli({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1.2">
        {Array.from({ length: 12 }).map((_, i) => (
          <ellipse key={`o${i}`} cx="100" cy="46" rx="11" ry="26" transform={`rotate(${i * 30} 100 100)`} />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <ellipse key={`i${i}`} cx="100" cy="72" rx="7" ry="14" transform={`rotate(${i * 45 + 22.5} 100 100)`} />
        ))}
        <circle cx="100" cy="100" r="16" />
        <circle cx="100" cy="100" r="90" strokeDasharray="2 6" />
      </g>
      <circle cx="100" cy="100" r="5" fill="currentColor" />
    </svg>
  )
}

// Fairy-light positions (percent of the section), with staggered twinkle
const LIGHTS = [
  { top: "14%", left: "6%", delay: "0s" }, { top: "30%", left: "92%", delay: "1.2s" },
  { top: "62%", left: "3%", delay: "0.6s" }, { top: "10%", left: "58%", delay: "1.8s" },
  { top: "82%", left: "96%", delay: "0.9s" }, { top: "22%", left: "34%", delay: "2.4s" },
]

export default function FestiveEdit({ collections }: { collections: FestiveCollection[] }) {
  if (collections.length === 0) return null

  return (
    <>
      {collections.map((collection) => {
        const occasion = occasionName(collection.tag)
        // Up to 3 pieces: intro beside the products. 4-5: intro on top, one row. 6+: intro on top, swipeable row.
        const count = collection.products.length
        const wide = count > 3
        const scrollRow = count > 5
        const desktopCols = scrollRow ? "" : count === 5 ? "lg:grid lg:grid-cols-5" : count === 4 ? "lg:grid lg:grid-cols-4" : count === 3 ? "lg:col-span-3 lg:grid lg:grid-cols-3" : "lg:col-span-3 lg:grid lg:grid-cols-2"
        return (
          <section key={collection.tag} className="relative overflow-hidden bg-gradient-to-b from-[#fffaf0] via-[#fdf3e1] to-[#fbecd3] text-ink">

            {/* Rangoli motifs and warm glows */}
            <Rangoli className="pointer-events-none absolute -top-16 -right-16 w-72 md:w-96 text-[#d9a441]/25" />
            <Rangoli className="pointer-events-none absolute -bottom-24 -left-20 w-64 md:w-80 text-[#e08a3c]/15" />
            <div className="pointer-events-none absolute top-1/3 left-1/4 w-96 h-64 rounded-full bg-[#fbd38d]/25 blur-3xl" />

            {/* Twinkling fairy lights */}
            {LIGHTS.map((light, i) => (
              <span
                key={i}
                className="pointer-events-none absolute w-1.5 h-1.5 rounded-full bg-[#f5b942] shadow-[0_0_10px_3px_rgba(245,185,66,0.55)] animate-pulse"
                style={{ top: light.top, left: light.left, animationDelay: light.delay, animationDuration: "3s" }}
                aria-hidden
              />
            ))}

            <div className={`relative mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8 py-12 md:py-16 grid gap-6 md:gap-8 ${wide ? "" : "lg:grid-cols-4 items-center"}`}>
              {/* Intro */}
              <div className={wide ? "lg:flex lg:items-end lg:justify-between lg:gap-10" : "lg:pr-4"}>
                <div>
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#b7791f]">
                  <Sparkles size={14} /> Festive edit
                </p>
                <h2 className="mt-3 text-3xl md:text-4xl lg:text-5xl font-[var(--font-heading)] font-bold leading-tight">
                  The <span className="font-light italic text-[#c2621d]">{occasion || "Festive"}</span> Edit
                </h2>
                </div>
                <div className={wide ? "lg:max-w-sm lg:text-right" : ""}>
                  <p className="mt-4 text-ink/65 leading-relaxed">
                    Our picks for {occasion || "festive"} celebrations, chosen to make your little ones shine.
                  </p>
                  <div className={`mt-5 h-px w-16 bg-[#d9a441] ${wide ? "lg:ml-auto" : ""}`} />
                </div>
              </div>

              {/* Products - swipeable on phones, grid from lg */}
              <div
                className={`${desktopCols} flex gap-3 md:gap-5 overflow-x-auto ${scrollRow ? "" : "lg:overflow-visible"} snap-x snap-mandatory scroll-px-4 lg:scroll-px-0 -mx-4 px-4 md:-mx-6 md:px-6 lg:mx-0 lg:px-0 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}
              >
                {collection.products.map((product) => (
                  <ProductCard key={product.id} product={product} className={`shrink-0 w-[46%] sm:w-[31%] snap-start ${scrollRow ? "lg:w-[23%]" : "lg:w-auto"}`} />
                ))}
              </div>
            </div>
          </section>
        )
      })}
    </>
  )
}
