import Image from "next/image"
import Link from "next/link"
import { Instagram, Mail, Heart, ArrowUpRight } from "lucide-react"

const LINK_GROUPS = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/products" },
      { label: "Girls Collection", href: "/products?category=girls" },
      { label: "Boys Collection", href: "/products?category=boys" },
      { label: "Track Order", href: "/orders" },
    ],
  },
  {
    title: "Customer Care",
    links: [
      { label: "Shipping Info", href: "/help/shipping" },
      { label: "Returns & Exchanges", href: "/help/returns" },
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Terms of Service", href: "/legal/terms" },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#1f4a41] text-white border-t-2 border-[#e6c88a]/60">
      {/* Soft decorative glows, matching the values band */}
      <div className="pointer-events-none absolute -top-32 -left-24 w-96 h-96 rounded-full bg-primary/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 w-96 h-96 rounded-full bg-[#d9b36c]/10 blur-3xl" />

      <div className="relative mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-x-6 gap-y-10 pt-12 md:pt-14 pb-10">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-5">
            <Link href="/" className="inline-block" aria-label="Ani & Ayu home">
              <Image
                src="/assets/logo/main-logo.webp"
                alt="Ani & Ayu"
                width={556}
                height={148}
                className="h-28 md:h-32 w-auto object-contain -ml-3 -my-7"
              />
            </Link>
            <p className="mt-5 max-w-sm text-sm md:text-base text-white/70 leading-relaxed">
              Beautiful traditional clothing for children, crafted with love and inspired by heritage.
              Making every occasion special for kids aged 2-13.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="mailto:support@aniayu.com"
                className="inline-flex items-center gap-2 rounded-full ring-1 ring-white/15 px-4 py-2 text-sm text-white/80 hover:ring-[#e6c88a] hover:text-[#e6c88a] transition-colors"
              >
                <Mail size={16} />
                support@aniayu.com
              </a>
              <a
                href="https://www.instagram.com/aniayukids/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full ring-1 ring-white/15 px-4 py-2 text-sm text-white/80 hover:ring-[#e6c88a] hover:text-[#e6c88a] transition-colors"
              >
                <Instagram size={16} />
                @aniayukids
              </a>
            </div>
          </div>

          {/* Link groups */}
          {LINK_GROUPS.map((group) => (
            <nav key={group.title} className="lg:col-span-3" aria-label={group.title}>
              <h4 className="text-xs font-semibold uppercase tracking-[0.25em] text-[#e6c88a] mb-5">
                {group.title}
              </h4>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1 text-sm md:text-[15px] text-white/75 hover:text-white transition-colors"
                    >
                      {link.label}
                      <ArrowUpRight
                        size={14}
                        className="text-[#e6c88a] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Oversized brand wordmark, clipped so it sits on the divider */}
        <div className="overflow-hidden -mt-4 lg:-mt-10" aria-hidden>
          <p className="pointer-events-none select-none font-logo text-center leading-[1.1] text-white/[0.05] text-[18vw] lg:text-[200px] translate-y-[12%]">
            Ani & Ayu
          </p>
        </div>

        {/* Bottom bar */}
        <div className="relative border-t border-white/10 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs md:text-sm text-white/60">
          <p>© {new Date().getFullYear()} Ani & Ayu. All rights reserved.</p>
          <p className="inline-flex items-center gap-1.5">
            Made with <Heart size={14} className="fill-[#e6c88a] text-[#e6c88a]" /> for little ones
          </p>
        </div>
      </div>
    </footer>
  )
}
