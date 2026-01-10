import Link from "next/link"
import type { ReactNode } from "react"

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
  <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/80 backdrop-blur shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-6">
          {/* Left: Logo + Title */}
          <div className="flex items-center gap-2">
            <svg
              viewBox="0 0 24 24"
              width={28}
              height={28}
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              aria-hidden
              className="text-primary"
            >
              <path d="M16.88 3.549L7.12 20.451" />
            </svg>
            <Link
              href="https://github.com/chhpt/nextjs-starter"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-ink hover:text-primary transition-colors"
            >
              Next.js Starter
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://github.com/vercel/examples/tree/main"
              target="_blank"
              rel="noreferrer"
              className="rounded-md px-3.5 py-2 text-[15px] font-medium text-ink/80 hover:bg-primary/5 transition-colors"
            >
              More Examples →
            </a>
            <a
              href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fchhpt%2Fnextjs-starter&project-name=nextjs-starter&repository-name=nextjs-starter"
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-primary bg-primary px-3.5 py-2 text-[15px] font-medium text-white shadow hover:bg-primary/90 transition-colors"
            >
              Clone & Deploy
            </a>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1">{children}</main>
    </div>
  )
}
