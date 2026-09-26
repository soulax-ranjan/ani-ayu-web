'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Search, PackageSearch, ShoppingBag, Menu, X } from 'lucide-react';
import { usePathname, useSearchParams } from 'next/navigation';
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
  const searchParams = useSearchParams();
  const { totalItems } = useCartStore();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-stone-200/70 shadow-[0_1px_12px_-6px_rgba(120,90,50,0.15)]">
      {/* Promo Strip */}
      <div className="bg-[#1f4a41] text-white/90 py-3 md:py-3.5 px-4 text-center text-xs md:text-sm font-medium tracking-wider">
        Use code <strong className="font-bold text-[#e6c88a] bg-white/10 ring-1 ring-[#e6c88a]/40 px-2.5 py-1 rounded-md mx-1.5 tracking-widest">FIRSTBUY10</strong> for a 10% discount on your first buy!
      </div>
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center shrink-0 mr-6 md:mr-8">
          <Link href="/" className="flex items-center group cursor-pointer" aria-label="Go to homepage">
            <Image
              src="/assets/logo/main-logo.webp"
              alt="Ani & Ayu Logo"
              width={556}
              height={148}
              priority
              className="h-24 w-auto sm:h-28 md:h-32 lg:h-36 object-contain transition-all duration-200"
            />
          </Link>
        </div>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden md:flex items-center gap-4 font-[var(--font-heading)]">
          {NAV_LINKS.map(({ href, label }) => {
            // Check if link is active by comparing both path and query params
            let isActive = false;
            if (href.includes('?')) {
              const [linkPath, linkQuery] = href.split('?');
              const category = searchParams?.get('category');
              const expectedCategory = new URLSearchParams(linkQuery).get('category');
              isActive = pathname === linkPath && category === expectedCategory;
            } else {
              // For /products without query, only active if no category param
              isActive = pathname === href && !searchParams?.get('category');
            }
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? 'page' : undefined}
                className={`group relative px-4 py-2 text-sm font-semibold tracking-wide transition-colors duration-300 ${
                  isActive ? 'text-primary' : 'text-gray-700 hover:text-primary'
                }`}
              >
                {label}
                {/* Underline - grows on hover, stays for the active page */}
                <span
                  className={`absolute left-4 right-4 -bottom-0.5 h-0.5 rounded-full bg-[#c9a45c] origin-left transition-transform duration-300 ${
                    isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1 md:gap-2">
          {/* Search button - hidden for now
          <button
            aria-label="Search"
            className="p-3 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <Search size={20} className="text-gray-600 hover:text-primary" />
          </button>
          */}

          <Link
            href="/orders"
            aria-label="Track Order"
            className="flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-gray-100 transition-colors duration-200 text-gray-600 hover:text-primary"
          >
            <PackageSearch size={20} />
            <span className="hidden sm:inline text-sm font-semibold">Track Order</span>
          </Link>
          <Link
            href="/cart"
            aria-label="Shopping bag"
            className="relative p-3 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <ShoppingBag size={20} className="text-gray-600 hover:text-primary" />
            {/* Cart badge */}
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white ring-2 ring-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold shadow-lg">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Link>
          <button
            aria-label="Toggle menu"
            className="md:hidden p-3 rounded-full hover:bg-gray-100 transition-colors duration-200"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} className="text-gray-600" /> : <Menu size={22} className="text-gray-600" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-stone-200/70 bg-white/95 backdrop-blur-xl">
          <nav aria-label="Mobile" className="px-6 py-5 flex flex-col gap-2">
            {NAV_LINKS.map(({ href, label }) => {
              // Check if link is active by comparing both path and query params
              let isActive = false;
              if (href.includes('?')) {
                const [linkPath, linkQuery] = href.split('?');
                const category = searchParams?.get('category');
                const expectedCategory = new URLSearchParams(linkQuery).get('category');
                isActive = pathname === linkPath && category === expectedCategory;
              } else {
                // For /products without query, only active if no category param
                isActive = pathname === href && !searchParams?.get('category');
              }
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`px-5 py-3.5 rounded-2xl font-semibold text-center tracking-wide transition-colors duration-300 ${
                    isActive ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-primary/5 hover:text-primary'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
