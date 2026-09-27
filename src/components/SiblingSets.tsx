import Image from "next/image"
import Link from "next/link"
import { Plus, ArrowRight } from "lucide-react"
import type { Product } from "@/types/product"

export interface SiblingSet {
  /** The full shared tag, e.g. "Sibling Set - Pink" */
  tag: string
  products: Product[]
}

// "Sibling Set - Pink" / "SiblingSet - Pink" -> "The Pink Set"; a bare "Sibling Set" keeps its own wording
function setTitle(tag: string) {
  const name = tag.replace(/^sibling\s*set\s*[-–:]?\s*/i, "").trim()
  return name ? `The ${name} Set` : tag
}

const rupees = (n: number) => `₹${(n || 0).toLocaleString("en-IN")}`

export default function SiblingSets({ sets }: { sets: SiblingSet[] }) {
  if (sets.length === 0) return null

  return (
    <section className="w-full py-12 md:py-16">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
        <div className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-3">Sibling sets</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-[var(--font-heading)] font-bold text-ink leading-tight">
              <span className="font-light italic text-primary">Twinning,</span> made easy
            </h2>
          </div>
          <p className="text-ink/65 max-w-sm md:text-right">
            Coordinated outfits for brothers and sisters, made for family celebrations and photos together.
          </p>
        </div>

        <div className={`grid gap-6 md:gap-8 ${sets.length > 1 ? "md:grid-cols-2" : "max-w-2xl mx-auto"}`}>
          {sets.map((set) => {
            const total = set.products.reduce((sum, p) => sum + (p.price || 0), 0)
            return (
              <article
                key={set.tag}
                className="overflow-hidden rounded-3xl bg-white ring-1 ring-stone-200/70 shadow-[0_2px_12px_-4px_rgba(120,90,50,0.12)] transition-shadow duration-500 hover:shadow-[0_22px_40px_-18px_rgba(120,90,50,0.35)]"
              >
                {/* One photo area, split between the outfits */}
                <div className="relative flex aspect-[4/3] bg-gradient-to-b from-[#fdfbf7] to-[#f4ede3]">
                  {set.products.map((product, index) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      aria-label={product.name}
                      className={`relative flex-1 overflow-hidden ${index > 0 ? "border-l-2 border-white" : ""}`}
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        loading="lazy"
                        sizes="(max-width: 768px) 50vw, 340px"
                        className="object-cover object-[center_15%] brightness-[1.04] saturate-[1.08] transition-transform duration-700 ease-out hover:scale-105"
                      />
                    </Link>
                  ))}
                  {set.products.length === 2 && (
                    <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white text-[#8a6a3b] shadow-md grid place-items-center">
                      <Plus size={18} />
                    </span>
                  )}
                  <span className="pointer-events-none absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
                    Set of {set.products.length}
                  </span>
                </div>

                {/* Set details */}
                <div className="p-5 md:p-6">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-heading text-xl font-bold text-ink">{setTitle(set.tag)}</h3>
                    <p className="font-heading text-lg font-bold text-primary tabular-nums">{rupees(total)}</p>
                  </div>

                  <ul className="mt-3 divide-y divide-stone-200/70">
                    {set.products.map((product) => (
                      <li key={product.id}>
                        <Link href={`/products/${product.id}`} className="group flex items-center justify-between gap-4 py-3 text-sm">
                          <span className="min-w-0 truncate text-ink/80 group-hover:text-primary transition-colors">{product.name}</span>
                          <span className="shrink-0 flex items-center gap-2 font-semibold text-ink tabular-nums">
                            {rupees(product.price)}
                            <ArrowRight size={14} className="text-ink/30 group-hover:text-primary transition-colors" />
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-1 text-xs text-ink/50">Choose each child’s age on the outfit page.</p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
