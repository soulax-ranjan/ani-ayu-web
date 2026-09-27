import Image from "next/image"
import Link from "next/link"
import { Star, Quote } from "lucide-react"
import { PARENTS_SERVED, visibleTestimonials, type Testimonial } from "@/lib/testimonials"

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={18}
          className={i <= rating ? "fill-amber-400 text-amber-400" : "fill-stone-200 text-stone-200"}
        />
      ))}
    </div>
  )
}

function Author({ t }: { t: Testimonial }) {
  return (
    <div className="pt-5 border-t border-ink/10">
      <p className="font-heading font-semibold text-ink">
        {t.name}
        {t.city && <span className="font-normal text-ink/60"> · {t.city}</span>}
      </p>
      {t.product && (
        <p className="text-sm text-ink/60 mt-1">
          Wearing{" "}
          {t.productLink ? (
            <Link href={t.productLink} className="text-primary font-medium hover:underline">
              {t.product}
            </Link>
          ) : (
            <span className="text-primary font-medium">{t.product}</span>
          )}
        </p>
      )}
    </div>
  )
}

export default function Testimonials() {
  const testimonials = visibleTestimonials()
  if (testimonials.length === 0) return null

  const isSingle = testimonials.length === 1
  const gridCols = testimonials.length === 2 ? "md:grid-cols-2 max-w-4xl mx-auto" : "md:grid-cols-2 lg:grid-cols-3"

  return (
    <section className="w-full py-12 md:py-16">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-4">
            Happy Families
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-[var(--font-heading)] font-bold text-ink leading-tight">
            <span className="font-light italic text-primary">Loved</span> by parents
          </h2>

          {/* Trust strip - customer faces + families served */}
          <div className="mt-5 inline-flex items-center gap-3 rounded-full bg-white ring-1 ring-stone-200/70 shadow-sm pl-2 pr-5 py-2">
            <div className="flex -space-x-3">
              {testimonials.slice(0, 3).map((t, index) => (
                <div key={`${t.image}-${index}`} className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-white bg-stone-100">
                  <Image src={t.image} alt="" fill sizes="36px" className="object-cover object-top" />
                </div>
              ))}
            </div>
            <p className="text-sm md:text-base text-ink/70">
              <span className="font-heading font-bold text-ink tabular-nums">{PARENTS_SERVED.toLocaleString("en-IN")}+</span>{" "}
              happy parents &amp; counting
            </p>
          </div>
        </div>

        {isSingle ? (
          // Single testimonial - large split card
          <article className="grid md:grid-cols-2 max-w-5xl mx-auto overflow-hidden rounded-3xl bg-white ring-1 ring-stone-200/70 shadow-[0_22px_50px_-24px_rgba(120,90,50,0.35)]">
            <div className="relative aspect-[4/5] md:aspect-auto md:min-h-[480px] bg-gradient-to-b from-[#fdfbf7] to-[#f4ede3]">
              <Image
                src={testimonials[0].image}
                alt={`${testimonials[0].name} with their little one`}
                fill
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 512px"
                className="object-cover object-top"
              />
            </div>

            <div className="relative flex flex-col justify-center p-7 md:p-9 lg:p-10">
              <Quote size={56} className="absolute top-6 right-6 text-primary/10 fill-primary/10" aria-hidden />
              <Stars rating={testimonials[0].rating} />
              <blockquote className="mt-4 mb-6 text-lg md:text-xl lg:text-2xl leading-relaxed text-ink/85 italic">
                &ldquo;{testimonials[0].quote}&rdquo;
              </blockquote>
              <Author t={testimonials[0]} />
            </div>
          </article>
        ) : (
          // Several testimonials - swipeable on mobile, grid on desktop
          <div className={`flex md:grid ${gridCols} gap-5 overflow-x-auto md:overflow-visible snap-x snap-mandatory scroll-px-4 md:scroll-px-0 -mx-4 px-4 md:mx-0 md:px-0 pb-2 md:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}>
            {testimonials.map((t, index) => (
              <article
                key={`${t.image}-${index}`}
                className="shrink-0 w-[85%] sm:w-[60%] md:w-auto snap-start flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200/70 shadow-[0_2px_12px_-4px_rgba(120,90,50,0.12)]"
              >
                <div className="relative aspect-[4/3] sm:aspect-square bg-gradient-to-b from-[#fdfbf7] to-[#f4ede3]">
                  <Image
                    src={t.image}
                    alt={`${t.name} with their little one`}
                    fill
                    loading="lazy"
                        sizes="(max-width: 768px) 85vw, 400px"
                    className="object-cover object-top"
                  />
                </div>
                <div className="flex flex-col flex-1 p-6">
                  <Stars rating={t.rating} />
                  <blockquote className="mt-4 mb-6 flex-1 leading-relaxed text-ink/85 italic">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <Author t={t} />
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
