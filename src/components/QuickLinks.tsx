import Image from "next/image"
import Link from "next/link"
import { Sparkles, ArrowUpRight } from "lucide-react"

export interface QuickLink {
  label: string
  href: string
  /** One image, or two for a split tile (e.g. a sibling set) */
  images: string[]
  /** Short line under the label */
  caption?: string
  highlight?: boolean
}

// "Shop by collection" - bento grid: the first link is a large feature tile, the rest fill a 2x2 grid beside it
export default function QuickLinks({ links }: { links: QuickLink[] }) {
  if (links.length === 0) return null
  const [feature, ...rest] = links

  return (
    <section aria-labelledby="shop-by-collection" className="w-full bg-white">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8 pt-6 pb-10 md:pt-10 md:pb-14">
        <div className="mb-5 md:mb-7">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-2">Shop by collection</p>
          <h2 id="shop-by-collection" className="text-2xl md:text-4xl font-[var(--font-heading)] font-bold text-ink leading-tight">
            Dressed for every <span className="font-light italic text-primary">occasion</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-[260px] sm:grid-rows-[300px] md:grid-rows-none auto-rows-[168px] sm:auto-rows-[200px] md:auto-rows-[210px] lg:auto-rows-[230px] gap-3 md:gap-4">
          <Tile link={feature} className="col-span-2 md:row-span-2" feature />
          {rest.map((link, i) => (
            <Tile
              key={link.href}
              link={link}
              // an odd last tile spans the full row so the grid never leaves a gap
              className={rest.length % 2 === 1 && i === rest.length - 1 ? "col-span-2" : ""}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function Tile({ link, className = "", feature = false }: { link: QuickLink; className?: string; feature?: boolean }) {
  const images = link.images.slice(0, 2)
  return (
    <Link
      href={link.href}
      className={`group relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-b from-[#fdfbf7] to-[#f1e7da] ring-1 ring-black/5 active:scale-[0.98] transition-transform ${className}`}
    >
      {/* Photo(s) */}
      {images.map((src, i) => (
        <div
          key={src}
          className={`absolute inset-y-0 ${images.length === 2 ? (i === 0 ? "left-0 w-1/2" : "right-0 w-1/2 border-l-2 border-white/80") : "inset-x-0"}`}
        >
          <Image
            src={src}
            alt=""
            fill
            loading="lazy"
            sizes={feature ? "(max-width: 768px) 100vw, 600px" : "(max-width: 768px) 50vw, 300px"}
            className={`object-cover ${feature ? "object-[center_12%]" : "object-[center_18%]"} brightness-[1.04] saturate-[1.08] transition-transform duration-700 ease-out group-hover:scale-[1.06]`}
          />
        </div>
      ))}

      {/* Soft shade along the bottom so the label reads on any photo */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[rgba(35,22,10,0.72)] via-[rgba(35,22,10,0.22)] to-transparent" />

      {/* Label - kept at the bottom, clear of faces */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-3.5 md:p-5">
        <div className="min-w-0 text-white">
          {link.highlight && (
            <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-[#c2621d] px-2.5 py-1 text-[10px] md:text-[11px] font-bold uppercase tracking-wider shadow">
              <Sparkles size={11} /> Festive edit
            </span>
          )}
          <p className={`font-heading font-bold leading-tight [text-shadow:0_1px_8px_rgba(0,0,0,0.25)] ${feature ? "text-2xl md:text-4xl" : "text-base md:text-xl"}`}>
            {link.label}
          </p>
          {link.caption && (
            <p className={`mt-0.5 text-white/85 truncate ${feature ? "text-sm md:text-base" : "text-[11px] md:text-sm"}`}>{link.caption}</p>
          )}
        </div>
        <span
          className={`shrink-0 grid place-items-center rounded-full bg-white text-ink shadow-md transition-all duration-300 group-hover:bg-[#e6c88a] group-hover:rotate-45 ${feature ? "w-11 h-11 md:w-12 md:h-12" : "w-8 h-8 md:w-10 md:h-10"}`}
          aria-hidden
        >
          <ArrowUpRight size={feature ? 20 : 16} />
        </span>
      </div>
    </Link>
  )
}
