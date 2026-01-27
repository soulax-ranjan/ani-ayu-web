'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';

const NAV_LINKS = [
  { href: '/products', label: 'Shop All' },
  { href: '/products?category=boys', label: 'Boys' },
  { href: '/products?category=girls', label: 'Girls' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { totalItems } = useCartStore();

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center shrink-0 mr-6 md:mr-8">
          <Link href="/" className="flex items-center group cursor-pointer" aria-label="Go to homepage">
            <Image
              src="/assets/logo/ani_ayu_logo.png"
              alt="Ani & Ayu Logo"
              width={556}
              height={148}
              priority
              className="h-20 w-auto sm:h-20 md:h-24 lg:h-28 object-contain transition-all duration-200"
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
                    ? 'bg-primary text-white shadow-lg shadow-primary/40 transform scale-105'
                    : 'text-gray-700 hover:text-white hover:bg-primary hover:shadow-md hover:shadow-primary/20 hover:scale-105'
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
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-primary opacity-0 group-hover:opacity-15 transition-all duration-300 blur-sm" />
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
            <Search size={20} className="text-gray-600 hover:text-primary" />
          </button>

          <div className="relative group">
            <button
              aria-label="Account"
              className="p-3 rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-105 active:scale-95 group-hover:bg-gray-100"
            >
              <User size={20} className="text-gray-600 hover:text-primary" />
            </button>

            {/* Profile Dropdown */}
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <Link
                href="/orders"
                className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors font-medium border-l-2 border-transparent hover:border-primary"
              >
                Track Order
              </Link>
              {/* Future items like My Profile, Logout can go here */}
            </div>
          </div>
          <Link
            href="/cart"
            aria-label="Shopping bag"
            className="relative p-3 rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <ShoppingBag size={20} className="text-gray-600 hover:text-primary" />
            {/* Cart badge */}
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold shadow-lg">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
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
        <div className="md:hidden border-t border-gray-100 bg-cream/95 backdrop-blur-xl">
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
