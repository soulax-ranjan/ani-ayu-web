import { Suspense } from 'react'
import Header from '@/components/Header'

// Shown instantly when someone taps a product, so the tap never feels ignored
export default function ProductLoading() {
  return (
    <>
      <Suspense fallback={<div className="h-16 md:h-20 bg-white" />}>
        <Header />
      </Suspense>
      <main className="min-h-screen bg-[#fdfbf7]" aria-busy="true" aria-label="Loading product">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6">
          <div className="h-4 w-56 rounded bg-stone-200/70 animate-pulse mb-4 md:mb-6" />
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-14">
            <div className="lg:col-span-7 -mx-4 md:mx-0 aspect-[3/4] lg:aspect-[4/5] lg:rounded-3xl bg-gradient-to-b from-[#fbf6ee] to-[#f1e7da] animate-pulse" />
            <div className="lg:col-span-5 space-y-4">
              <div className="h-3 w-20 rounded bg-stone-200/70 animate-pulse" />
              <div className="h-8 w-4/5 rounded-lg bg-stone-200/70 animate-pulse" />
              <div className="h-8 w-32 rounded-lg bg-stone-200/70 animate-pulse" />
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-4">
                {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-11 rounded-xl bg-stone-200/70 animate-pulse" />)}
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="h-14 rounded-full bg-stone-200/70 animate-pulse" />
                <div className="h-14 rounded-full bg-primary/30 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
