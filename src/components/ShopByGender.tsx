import Image from "next/image"
import Link from "next/link"

export default function ShopByGender() {
  return (
    <>
  <section className="w-full py-6 my-2 md:my-4">
        <div className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-[var(--font-heading)] font-bold mb-3 text-ink">
              Shop by Category
            </h2>
            <p className="text-ink/70">Find the perfect ethnic wear for your little ones</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            {/* Shop for Boys */}
            <Link href="/products?category=boys" className="group rounded-lg">
              <div className="relative h-[380px] md:h-[420px] rounded-2xl overflow-hidden shadow-card group-hover:shadow-lg transition-shadow">
                <Image
                  src="/assets/designs/design-1.jpg"
                  alt="Boys Collection"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end">
                  <div className="p-6 md:p-7 text-white">
                    <h3 className="text-xl md:text-2xl font-[var(--font-heading)] font-bold mb-2">
                      Shop for Boys
                    </h3>
                    <p className="text-sm md:text-base mb-4">Traditional kurtas, sherwanis & more</p>
                    <span className="inline-block bg-gold text-ink px-4 py-2 rounded-full font-semibold group-hover:brightness-105 transition text-sm">
                      Explore →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
            {/* Shop for Girls */}
            <Link href="/products?category=girls" className="group rounded-lg">
              <div className="relative h-[380px] md:h-[420px] rounded-2xl overflow-hidden shadow-card group-hover:shadow-lg transition-shadow">
                <Image
                  src="/assets/designs/design-2.jpg"
                  alt="Girls Collection"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end">
                  <div className="p-6 md:p-7 text-white">
                    <h3 className="text-xl md:text-2xl font-[var(--font-heading)] font-bold mb-2">
                      Shop for Girls
                    </h3>
                    <p className="text-sm md:text-base mb-4">Beautiful lehengas, suits & dresses</p>
                    <span className="inline-block bg-gold text-ink px-4 py-2 rounded-full font-semibold group-hover:brightness-105 transition text-sm">
                      Explore →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
