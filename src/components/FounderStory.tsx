import Image from "next/image"

export default function FounderStory() {
  return (
    <section className="w-full py-16 md:py-20 bg-gradient-to-br from-cream to-mint/30">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="order-2 lg:order-1">
            <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-6">
              Our Story
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-[var(--font-heading)] font-bold text-ink mb-6 leading-tight">
              Crafted with Love,
              <span className="block text-primary">Inspired by Tradition</span>
            </h2>
            
            <div className="space-y-6 text-ink/80 leading-relaxed">
              <p className="text-lg md:text-xl">
                "As an aunt to two beautiful little girls, I realized how difficult it was to find 
                stunning, comfortable ethnic wear for children that honored our rich cultural heritage 
                while meeting the needs of today's active kids."
              </p>
              
              <p className="text-base md:text-lg">
                Founded by <strong className="text-ink font-semibold">Nalini</strong>, 
                Ani & Ayu was born from love and inspiration. The brand is named after her two 
                beautiful nieces - <strong className="text-primary">Ani</strong> and <strong className="text-primary">Ayu</strong> - 
                whose playful spirits and need for comfortable yet traditional clothing sparked this journey.
              </p>
              
              <p className="text-base md:text-lg">
                Every piece in our collection is thoughtfully designed with premium fabrics, 
                traditional craftsmanship, and modern sensibilities. We believe that ethnic 
                wear should be accessible, beautiful, and made for the active lives of today's children.
              </p>
              
              <div className="pt-6 border-t border-ink/10">
                <p className="text-sm text-ink/60 italic">
                  "Watching Ani and Ayu in their traditional outfits inspired me to create a brand 
                  where every child can feel as beautiful and confident as they do."
                </p>
                <p className="text-sm font-semibold text-primary mt-2">
                  - Nalini, Founder
                </p>
              </div>
            </div>
          </div>
          
          {/* Image */}
          <div className="order-1 lg:order-2">
            <div className="relative">
              {/* Main founder image */}
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/assets/mascot-sketch.png"
                  alt="Ani & Ayu Founder - Nalini with her inspiration"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                {/* Soft overlay for better text contrast if needed */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gold/20 rounded-full blur-xl" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
              
              {/* Small accent card */}
              <div className="absolute bottom-8 left-8 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl max-w-48">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span className="text-xs font-semibold text-ink/70 uppercase tracking-wide">
                    Established 2020
                  </span>
                </div>
                <p className="text-sm text-ink font-medium">
                  Trusted by 10,000+ families across India
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Values */}
        <div className="mt-16 pt-16 border-t border-ink/10">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-[var(--font-heading)] font-bold text-ink mb-4">
              Our Values
            </h3>
            <p className="text-ink/70 max-w-2xl mx-auto">
              The principles that guide everything we create
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <span className="text-2xl">🧵</span>
              </div>
              <h4 className="text-lg font-semibold text-ink mb-2">Quality Craftsmanship</h4>
              <p className="text-ink/70 text-sm">
                Every stitch tells a story of dedication and attention to detail
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <span className="text-2xl">🌸</span>
              </div>
              <h4 className="text-lg font-semibold text-ink mb-2">Cultural Heritage</h4>
              <p className="text-ink/70 text-sm">
                Preserving traditions while embracing modern comfort and style
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <span className="text-2xl">💝</span>
              </div>
              <h4 className="text-lg font-semibold text-ink mb-2">Made with Love</h4>
              <p className="text-ink/70 text-sm">
                Every piece is created with the same care we'd want for our own children
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}