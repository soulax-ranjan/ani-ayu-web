
import Image from "next/image"
import Link from "next/link"
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 text-white">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6 lg:px-8">

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 py-12 md:py-16">

          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block">
              <Image
                src="/assets/logo/main-logo.webp"
                alt="Ani & Ayu"
                width={556}
                height={148}
                className="h-20 w-auto sm:h-20 md:h-24 lg:h-28 object-contain"
              />
            </Link>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed text-sm md:text-base">
              Beautiful traditional clothing for children, crafted with love and inspired by heritage.
              Making every occasion special for kids aged 2-13.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Mail size={16} className="text-primary" />
                </div>
                <a href="mailto:hello@aniayu.com" className="hover:text-primary transition-colors">
                  hello@aniayu.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Phone size={16} className="text-primary" />
                </div>
                <a href="tel:+911234567890" className="hover:text-primary transition-colors">
                  +91 123 456 7890
                </a>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="font-[var(--font-heading)] font-bold mb-4 text-white text-sm uppercase tracking-wider">
                Follow Us
              </h4>
              <div className="flex gap-3">
                <a
                  href="https://instagram.com/aniayu"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="bg-gradient-to-br from-pink-500 to-purple-600 p-3 rounded-xl hover:shadow-lg hover:shadow-pink-500/30 transition-all hover:scale-110 transform duration-200 group"
                >
                  <Instagram size={20} className="text-white" />
                </a>
                <a
                  href="https://facebook.com/aniayu"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="bg-gradient-to-br from-blue-500 to-blue-700 p-3 rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all hover:scale-110 transform duration-200 group"
                >
                  <Facebook size={20} className="text-white" />
                </a>
                <a
                  href="https://youtube.com/aniayu"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="bg-gradient-to-br from-red-500 to-red-700 p-3 rounded-xl hover:shadow-lg hover:shadow-red-500/30 transition-all hover:scale-110 transform duration-200 group"
                >
                  <Youtube size={20} className="text-white" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-[var(--font-heading)] font-bold mb-6 text-white text-sm uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/products"
                  className="text-gray-300 hover:text-primary transition-colors flex items-center gap-2 group text-sm md:text-base"
                >
                  <span className="w-1.5 h-1.5 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=girls"
                  className="text-gray-300 hover:text-primary transition-colors flex items-center gap-2 group text-sm md:text-base"
                >
                  <span className="w-1.5 h-1.5 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Girls Collection
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=boys"
                  className="text-gray-300 hover:text-primary transition-colors flex items-center gap-2 group text-sm md:text-base"
                >
                  <span className="w-1.5 h-1.5 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Boys Collection
                </Link>
              </li>
              <li>
                <Link
                  href="/orders"
                  className="text-gray-300 hover:text-primary transition-colors flex items-center gap-2 group text-sm md:text-base"
                >
                  <span className="w-1.5 h-1.5 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care Section */}
          <div>
            <h4 className="font-[var(--font-heading)] font-bold mb-6 text-white text-sm uppercase tracking-wider">
              Customer Care
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/help/contact"
                  className="text-gray-300 hover:text-primary transition-colors flex items-center gap-2 group text-sm md:text-base"
                >
                  <span className="w-1.5 h-1.5 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/help/shipping"
                  className="text-gray-300 hover:text-primary transition-colors flex items-center gap-2 group text-sm md:text-base"
                >
                  <span className="w-1.5 h-1.5 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  href="/help/returns"
                  className="text-gray-300 hover:text-primary transition-colors flex items-center gap-2 group text-sm md:text-base"
                >
                  <span className="w-1.5 h-1.5 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link
                  href="/help/size-guide"
                  className="text-gray-300 hover:text-primary transition-colors flex items-center gap-2 group text-sm md:text-base"
                >
                  <span className="w-1.5 h-1.5 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Size Guide
                </Link>
              </li>
              <li>
                <Link
                  href="/help/faq"
                  className="text-gray-300 hover:text-primary transition-colors flex items-center gap-2 group text-sm md:text-base"
                >
                  <span className="w-1.5 h-1.5 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 py-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div className="text-sm text-gray-300 text-center md:text-left">
              © {new Date().getFullYear()} Ani & Ayu. All rights reserved. Made with ❤️ for little ones.
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-6 text-sm">
              <Link
                href="/legal/privacy"
                className="text-gray-300 hover:text-primary transition-colors font-medium"
              >
                Privacy Policy
              </Link>
              <Link
                href="/legal/terms"
                className="text-gray-300 hover:text-primary transition-colors font-medium"
              >
                Terms of Service
              </Link>
              <Link
                href="/legal/refund"
                className="text-gray-300 hover:text-primary transition-colors font-medium"
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
