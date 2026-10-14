import { Suspense } from 'react'
import Header from '@/components/Header'

// Shown instantly when someone taps through to the shop, so the tap never feels ignored
export default function ProductsLoading() {
  return (
    <>
      <Suspense fallback={<div className="h-16 md:h-20 bg-white" />}>
        <Header />
      </Suspense>
      <main className="min-h-screen bg-cream" aria-busy="true" aria-label="Loading products">
        <div className="max-w-[1400px] mx-auto px-4 py-6 md:py-8">
          <div className="h-8 w-48 rounded-lg bg-stone-200/70 animate-pulse" />
          <div className="mt-2 h-4 w-20 rounded bg-stone-200/70 animate-pulse" />
          <div className="mt-5 mb-6 flex gap-2">
            {[1, 2, 3].map((i) => <div key={i} className="h-9 w-16 rounded-full bg-stone-200/70 animate-pulse" />)}
          </div>
          <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl md:rounded-[28px] overflow-hidden bg-white ring-1 ring-stone-200/70">
                <div className="aspect-[3/4] bg-gradient-to-b from-[#fdfbf7] to-[#f1e7da] animate-pulse" />
                <div className="p-3 md:p-4 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-stone-200/70 animate-pulse" />
                  <div className="h-5 w-1/3 rounded bg-stone-200/70 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
