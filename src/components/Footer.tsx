
import Image from "next/image"
import Link from "next/link"
import { Instagram, Facebook, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#FFF7F3] text-[#FF725E] pt-16 pb-8">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <Image 
                src="/assets/logo/logo_ani_ayu_org_2.png" 
                alt="Ani & Ayu" 
                width={200} 
                height={70} 
                className="h-14 w-auto object-contain" 
              />
            </Link>
            <p className="text-[#FF725E]/90 mb-6 max-w-md leading-relaxed">
              Beautiful traditional clothing for children, crafted with love and inspired by heritage. 
              Making every occasion special for kids aged 2-13.
            </p>
            
            {/* Social Media */}
            <div>
              <h4 className="font-[var(--font-heading)] font-semibold mb-4 text-[#FF725E]">
                Follow Us
              </h4>
              <div className="flex gap-4">
                <a 
                  href="https://instagram.com/aniayu" 
                  target="_blank" 
                  rel="noopener" 
                  aria-label="Instagram"
                  className="bg-white/50 p-3 rounded-full hover:bg-white/80 transition-colors hover:scale-110 transform duration-200"
                >
                  <Instagram size={20} color="#FF725E" />
                </a>
                <a 
                  href="https://facebook.com/aniayu" 
                  target="_blank" 
                  rel="noopener" 
                  aria-label="Facebook"
                  className="bg-white/50 p-3 rounded-full hover:bg-white/80 transition-colors hover:scale-110 transform duration-200"
                >
                  <Facebook size={20} color="#FF725E" />
                </a>
                <a 
                  href="https://youtube.com/aniayu" 
                  target="_blank" 
                  rel="noopener" 
                  aria-label="YouTube"
                  className="bg-white/50 p-3 rounded-full hover:bg-white/80 transition-colors hover:scale-110 transform duration-200"
                >
                  <Youtube size={20} color="#FF725E" />
                </a>
              </div>
            </div>
          </div>

          {/* Shop Section */}
          <div>
            <h4 className="font-[var(--font-heading)] font-semibold mb-6 text-[#FF725E]">
              Shop
            </h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/products?category=girls" 
                  className="text-[#FF725E]/80 hover:text-[#FF725E] hover:underline transition-colors"
                >
                  Girls Collection
                </Link>
              </li>
              <li>
                <Link 
                  href="/products?category=boys" 
                  className="text-[#FF725E]/80 hover:text-[#FF725E] hover:underline transition-colors"
                >
                  Boys Collection
                </Link>
              </li>

              <li>
                <Link 
                  href="/products" 
                  className="text-[#FF725E]/80 hover:text-[#FF725E] hover:underline transition-colors"
                >
                  All Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care Section */}
          <div>
            <h4 className="font-[var(--font-heading)] font-semibold mb-6 text-[#FF725E]">
              Customer Care
            </h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/help/contact" 
                  className="text-[#FF725E]/80 hover:text-[#FF725E] hover:underline transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/help/shipping" 
                  className="text-[#FF725E]/80 hover:text-[#FF725E] hover:underline transition-colors"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link 
                  href="/help/returns" 
                  className="text-[#FF725E]/80 hover:text-[#FF725E] hover:underline transition-colors"
                >
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link 
                  href="/help/size-guide" 
                  className="text-[#FF725E]/80 hover:text-[#FF725E] hover:underline transition-colors"
                >
                  Size Guide
                </Link>
              </li>
              <li>
                <Link 
                  href="/help/faq" 
                  className="text-[#FF725E]/80 hover:text-[#FF725E] hover:underline transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-[#FF725E]/20">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div className="text-sm text-[#FF725E]/70">
              © {new Date().getFullYear()} Ani & Ayu. All rights reserved.
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <Link 
                href="/legal/privacy" 
                className="text-[#FF725E]/70 hover:text-[#FF725E] hover:underline transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/legal/terms" 
                className="text-[#FF725E]/70 hover:text-[#FF725E] hover:underline transition-colors"
              >
                Terms of Service
              </Link>
              <Link 
                href="/legal/refund" 
                className="text-[#FF725E]/70 hover:text-[#FF725E] hover:underline transition-colors"
              >
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
