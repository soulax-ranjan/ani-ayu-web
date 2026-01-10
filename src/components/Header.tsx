'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const NAV_LINKS = [
  { href: '/products', label: 'Shop All' },
  { href: '/products?category=boys', label: 'Boys' },
  { href: '/products?category=girls', label: 'Girls' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
  <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm">
  <div className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
        {/* Mascot with Logo */}
        <div className="flex items-center shrink-0 mr-6 md:mr-8">
          <Link href="/" className="flex items-center group cursor-pointer" aria-label="Go to homepage">
            {/* Mascot before logo - welcoming first impression */}
            <div className="block mr-1">
              <Image
                src="/assets/mascot-sketch.webp"
                alt="Baby Bear Mascot"
                width={80}
                height={80}
                className="w-8 h-8 sm:w-10 sm:h-10 md:w- md:h-12 lg:w-14 lg:h-14 object-contain transition-all duration-300 group-hover:animate-pulse group-hover:scale-110 group-hover:animate-wiggle"
                style={{
                  filter: 'sepia(100%) saturate(250%) hue-rotate(-10deg) brightness(0.9) contrast(1.3)',
                  opacity: 0.95,
                  transformOrigin: 'center center'
                }}
              />
            </div>
            <Image
              src="/assets/logo/logo_ani_ayu_org_2.png"
              alt="Ani & Ayu"
              width={256}
              height={148}
              priority
              className="h-6 w-auto sm:h-8 md:h-10 lg:h-10 object-contain transition-all duration-200"
            />
          </Link>
        </div>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden md:flex items-center gap-2 font-[var(--font-heading)]">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = pathname === href || (href.includes('?') && pathname === href.split('?')[0]);
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? 'page' : undefined}
                className={`
                  group relative px-6 py-3 rounded-full transition-all duration-300 font-semibold text-sm tracking-wide
                  ${isActive 
                    ? 'bg-gradient-to-r from-[#FF725E] via-[#FF6B4A] to-[#FF8A7A] text-white shadow-lg shadow-[#FF725E]/40 transform scale-105' 
                    : 'text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-[#FF725E] hover:to-[#FF8A7A] hover:shadow-md hover:shadow-[#FF725E]/20 hover:scale-105'
                  }
                `}
              >
                <span className="relative z-10">{label}</span>
                {/* Animated underline for active state */}
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-0.5 bg-white rounded-full animate-pulse" />
                )}
                {/* Hover glow effect */}
                {!isActive && (
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FF725E] to-[#FF8A7A] opacity-0 group-hover:opacity-15 transition-all duration-300 blur-sm" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1 md:gap-2">
          <button 
            aria-label="Search" 
            className="p-3 rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <Search size={20} className="text-gray-600 hover:text-[#FF725E]" />
          </button>
          <button 
            aria-label="Account" 
            className="p-3 rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <User size={20} className="text-gray-600 hover:text-[#FF725E]" />
          </button>
          <Link 
            href="/cart" 
            aria-label="Shopping bag" 
            className="relative p-3 rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <ShoppingBag size={20} className="text-gray-600 hover:text-[#FF725E]" />
            {/* Cart badge */}
            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#FF725E] to-[#FF8A7A] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold shadow-lg">
              2
            </span>
          </Link>
          <button
            aria-label="Toggle menu"
            className="md:hidden p-3 rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-105 active:scale-95"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} className="text-gray-600" /> : <Menu size={22} className="text-gray-600" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl">
          <nav aria-label="Mobile" className="px-6 py-6 flex flex-col gap-3">
            {NAV_LINKS.map(({ href, label }) => {
              const isActive = pathname === href || (href.includes('?') && pathname === href.split('?')[0]);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`
                    group relative px-5 py-4 rounded-2xl font-semibold transition-all duration-300 text-center tracking-wide
                    ${isActive 
                      ? 'bg-gradient-to-r from-[#FF725E] via-[#FF6B4A] to-[#FF8A7A] text-white shadow-xl shadow-[#FF725E]/30 transform scale-105' 
                      : 'text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-[#FF725E] hover:to-[#FF8A7A] hover:shadow-lg hover:shadow-[#FF725E]/20 hover:scale-105 active:scale-95'
                    }
                  `}
                >
                  <span className="relative z-10">{label}</span>
                  {/* Side accent for active */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-full" />
                  )}
                  {/* Hover glow */}
                  {!isActive && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#FF725E] to-[#FF8A7A] opacity-0 group-hover:opacity-10 transition-all duration-300" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
