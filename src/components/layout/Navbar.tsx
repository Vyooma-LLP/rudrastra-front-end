import Link from "next/link";

/**
 * Navbar — Pixel-accurate reproduction of the Uncover template navigation.
 * Revised for Rudrastra B2B Engineering taxonomy.
 */
export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-[var(--border)]">
      <nav className="w-full px-6 lg:px-10 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0"
        >
          {/* Uncover-style double chevron mark */}
          <svg width="36" height="28" viewBox="0 0 36 28" fill="none" className="text-[var(--foreground)]">
            <path d="M0 0L12 14L0 28H6L18 14L6 0H0Z" fill="currentColor" />
            <path d="M14 0L26 14L14 28H20L32 14L20 0H14Z" fill="currentColor" />
          </svg>
          <span className="font-heading font-bold text-[16px] tracking-tight ml-2">RUDRASTRA</span>
        </Link>

        {/* Center Navigation */}
        <div className="hidden md:flex items-center gap-1 font-sans text-[14px] font-medium">
          {[
            { name: "Categories", path: "/categories" },
            { name: "Products", path: "/products" },
            { name: "Engineering", path: "/engineering" },
            { name: "Manufacturers", path: "/manufacturers" },
          ].map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className="group flex items-center gap-1 px-4 py-2 border border-transparent hover:border-[#111111] transition-colors duration-fast"
            >
              {link.name}
              <svg className="w-3.5 h-3.5 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all duration-fast" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="square" strokeLinejoin="miter" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          ))}
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-4">
          <Link
            href="/rfq"
            className="hidden md:inline-flex px-5 py-2.5 border border-[var(--foreground)] text-[13px] font-sans font-semibold hover:bg-[var(--foreground)] hover:text-white transition-colors duration-fast"
          >
            Request Quote
          </Link>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2"
            aria-label="Open menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
}
