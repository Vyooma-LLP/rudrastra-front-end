import Link from "next/link";

/**
 * Footer — Uncover-style minimal footer.
 * Revised for Rudrastra B2B Engineering taxonomy.
 */
export function Footer() {
  return (
    <footer className="w-full bg-white mt-auto border-t border-[var(--border)]">
      <div className="px-6 lg:px-10 py-16 grid grid-cols-1 md:grid-cols-5 gap-12">
        {/* Brand column */}
        <div className="md:col-span-2">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <svg width="36" height="28" viewBox="0 0 36 28" fill="none" className="text-[var(--foreground)]">
              <path d="M0 0L12 14L0 28H6L18 14L6 0H0Z" fill="currentColor" />
              <path d="M14 0L26 14L14 28H20L32 14L20 0H14Z" fill="currentColor" />
            </svg>
            <span className="font-heading font-bold text-[18px] tracking-tight ml-2">RUDRASTRA</span>
          </Link>
          <p className="text-[13px] text-[var(--muted-foreground)] leading-relaxed max-w-xs">
            Technical infrastructure for drone hardware procurement.
          </p>
        </div>

        {/* Platform */}
        <div>
          <h4 className="font-sans font-semibold text-[14px] mb-5">PLATFORM</h4>
          <ul className="space-y-3 text-[13px] text-[var(--muted-foreground)]">
            <li><Link href="/categories" className="hover:text-[var(--foreground)] transition-colors duration-fast">Categories</Link></li>
            <li><Link href="/products" className="hover:text-[var(--foreground)] transition-colors duration-fast">Products</Link></li>
            <li><Link href="/compare" className="hover:text-[var(--foreground)] transition-colors duration-fast">Compare</Link></li>
            <li><Link href="/manufacturers" className="hover:text-[var(--foreground)] transition-colors duration-fast">Manufacturers</Link></li>
            <li><Link href="/sellers" className="hover:text-[var(--foreground)] transition-colors duration-fast">Sellers</Link></li>
          </ul>
        </div>

        {/* Engineering */}
        <div>
          <h4 className="font-sans font-semibold text-[14px] mb-5">ENGINEERING</h4>
          <ul className="space-y-3 text-[13px] text-[var(--muted-foreground)]">
            <li><Link href="/compatibility" className="hover:text-[var(--foreground)] transition-colors duration-fast">Compatibility</Link></li>
            <li><Link href="/bom" className="hover:text-[var(--foreground)] transition-colors duration-fast">BOM</Link></li>
            <li><Link href="/engineering/calculators" className="hover:text-[var(--foreground)] transition-colors duration-fast">Calculators</Link></li>
            <li><Link href="/engineering/guides" className="hover:text-[var(--foreground)] transition-colors duration-fast">Guides</Link></li>
            <li><Link href="/docs" className="hover:text-[var(--foreground)] transition-colors duration-fast">Documentation</Link></li>
          </ul>
        </div>

        {/* Procurement & Company */}
        <div className="flex flex-col gap-10">
          <div>
            <h4 className="font-sans font-semibold text-[14px] mb-5">PROCUREMENT</h4>
            <ul className="space-y-3 text-[13px] text-[var(--muted-foreground)]">
              <li><Link href="/rfq" className="hover:text-[var(--foreground)] transition-colors duration-fast">Request Quote</Link></li>
              <li><Link href="/suppliers" className="hover:text-[var(--foreground)] transition-colors duration-fast">Supplier Network</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-sans font-semibold text-[14px] mb-5">COMPANY</h4>
            <ul className="space-y-3 text-[13px] text-[var(--muted-foreground)]">
              <li><Link href="/about" className="hover:text-[var(--foreground)] transition-colors duration-fast">About</Link></li>
              <li><Link href="/contact" className="hover:text-[var(--foreground)] transition-colors duration-fast">Contact</Link></li>
              <li><Link href="/newsletter" className="hover:text-[var(--foreground)] transition-colors duration-fast">Newsletter</Link></li>
              <li><Link href="/privacy" className="hover:text-[var(--foreground)] transition-colors duration-fast">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-[var(--foreground)] transition-colors duration-fast">Terms</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-6 lg:px-10 py-6 border-t border-[var(--border)] flex flex-col md:flex-row items-center justify-between text-[12px] text-[var(--muted-foreground)]">
        <p>&copy; {new Date().getFullYear()} Rudrastra</p>
        <div className="flex gap-5 mt-3 md:mt-0">
          <span className="hover:text-[var(--foreground)] cursor-pointer transition-colors duration-fast">LinkedIn</span>
          <span className="hover:text-[var(--foreground)] cursor-pointer transition-colors duration-fast">GitHub</span>
          <span className="hover:text-[var(--foreground)] cursor-pointer transition-colors duration-fast">X</span>
        </div>
      </div>
    </footer>
  );
}
