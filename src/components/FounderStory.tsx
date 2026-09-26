import Image from "next/image"
import OurValues from "@/components/OurValues"

// Circular "Est. 2025" seal with text running around the edge
function EstSeal() {
  return (
    <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full bg-[#1f4a41] shadow-xl flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full animate-[spin_18s_linear_infinite]" aria-hidden>
        <defs>
          <path id="seal-circle" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
        </defs>
        <text className="fill-[#e6c88a] text-[9.5px] font-semibold uppercase" style={{ letterSpacing: "0.28em" }}>
          <textPath href="#seal-circle">Made with love · Since 2025 ·</textPath>
        </text>
      </svg>
      <div className="text-center leading-none">
        <span className="block text-[10px] uppercase tracking-[0.2em] text-white/60">Est.</span>
        <span className="block font-heading text-xl md:text-2xl font-bold text-white mt-1">2025</span>
      </div>
    </div>
  )
}

export default function FounderStory() {
  return (
    <section className="w-full py-12 md:py-16">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[5fr_7fr] gap-10 lg:gap-16 items-center">
          {/* Visual - arched frame with the mascot peeking over the ledge */}
          <div className="relative mx-auto w-full max-w-[420px]">
            <div className="relative aspect-[4/5] rounded-t-full rounded-b-3xl overflow-hidden bg-gradient-to-b from-[#fbf3e6] via-[#f3e3cc] to-[#e8d2b4] ring-1 ring-[#e6c88a]/40 shadow-[0_30px_60px_-30px_rgba(120,90,50,0.45)]">
              {/* Inner arch outline */}
              <div className="pointer-events-none absolute inset-4 rounded-t-full rounded-b-2xl border border-white/70" />

              {/* Brand name as the focal point */}
              <div className="absolute inset-x-0 top-[17%] text-center px-8">
                <p className="text-[11px] uppercase tracking-[0.3em] text-[#8a6a3b] mb-3">Named after</p>
                <p className="font-logo text-5xl md:text-6xl text-primary leading-[1.3] pb-3">Ani & Ayu</p>
                <p className="mt-3 text-sm text-ink/60">two little girls who started it all</p>
              </div>

              {/* Mascot peeking over the bottom ledge */}
              <div className="absolute inset-x-[18%] bottom-0 aspect-[683/596]">
                <Image
                  src="/assets/mascot-sketch.webp"
                  alt="Ani & Ayu mascot"
                  fill
                  loading="lazy"
                  className="object-contain object-bottom opacity-80"
                  sizes="(max-width: 1024px) 60vw, 280px"
                />
              </div>
            </div>

            {/* Seal overlapping the frame */}
            <div className="absolute -top-4 -right-2 md:-right-8">
              <EstSeal />
            </div>
          </div>

          {/* Story */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-4">Our Story</p>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-[var(--font-heading)] font-bold text-ink leading-tight mb-6">
              Crafted with Love,{" "}
              <span className="block font-light italic text-primary">Inspired by Tradition</span>
            </h2>

            {/* Pull quote */}
            <blockquote className="relative pl-6 md:pl-8 border-l-2 border-[#e6c88a] mb-6">
              <span className="absolute -top-6 -left-1 font-heading text-7xl leading-none text-[#e6c88a]/50 select-none" aria-hidden>
                &ldquo;
              </span>
              <p className="text-lg md:text-xl lg:text-2xl leading-relaxed text-ink/85 italic">
                As an aunt to two beautiful little girls, I realized how difficult it was to find
                stunning, comfortable ethnic wear for children that honored our rich cultural heritage
                while meeting the needs of today&apos;s active kids.
              </p>
            </blockquote>

            <div className="space-y-5 text-ink/75 leading-relaxed md:text-lg">
              <p>
                Founded by <strong className="text-ink font-semibold">Nalini Gautam</strong>, Ani & Ayu was born
                from love and inspiration. The brand is named after her two beautiful nieces,{" "}
                <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 font-semibold text-primary">Ani</span>{" "}
                and{" "}
                <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 font-semibold text-primary">Ayu</span>,
                whose playful spirits and need for comfortable yet traditional clothing sparked this journey.
              </p>
              <p>
                Every piece in our collection is thoughtfully designed with premium fabrics, traditional
                craftsmanship, and modern sensibilities. We believe that ethnic wear should be accessible,
                beautiful, and made for the active lives of today&apos;s children.
              </p>
            </div>

            {/* Signature */}
            <div className="mt-8 pt-6 border-t border-ink/10 flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-8">
              <div className="shrink-0">
                <p className="font-logo text-3xl text-primary leading-none">Nalini Gautam</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-ink/50">Founder, Ani & Ayu</p>
              </div>
              <p className="text-sm text-ink/60 italic sm:border-l sm:border-ink/10 sm:pl-8">
                &ldquo;Watching Ani and Ayu in their traditional outfits inspired me to create a brand where
                every child can feel as beautiful and confident as they do.&rdquo;
              </p>
            </div>
          </div>
        </div>

        <OurValues />
      </div>
    </section>
  )
}
