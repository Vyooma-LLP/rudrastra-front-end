/**
 * Ticker — Scrolling promotional banner matching Uncover's top bar.
 * Continuously scrolls left using CSS animation (no JS).
 */
export function Ticker() {
  return (
    <div className="w-full border-b border-[var(--border)] bg-[#FAFAFA] overflow-hidden py-2 flex relative before:absolute before:left-0 before:top-0 before:bottom-0 before:w-16 before:bg-gradient-to-r before:from-[#FAFAFA] before:to-transparent before:z-10 after:absolute after:right-0 after:top-0 after:bottom-0 after:w-16 after:bg-gradient-to-l after:from-[#FAFAFA] after:to-transparent after:z-10">
      <div className="flex whitespace-nowrap marquee-left shrink-0">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center shrink-0">
            <span className="font-heading font-bold text-[10px] uppercase tracking-wider mx-8 text-[var(--primary)]">
              MADE IN INDIA
            </span>
            <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full"></span>
            <span className="font-heading font-bold text-[10px] uppercase tracking-wider mx-8 text-[var(--accent)]">
              BUILT FOR ENGINEERS
            </span>
            <span className="w-1.5 h-1.5 bg-[var(--success)] rounded-full"></span>
            <span className="font-heading font-bold text-[10px] uppercase tracking-wider mx-8 text-[var(--success)]">
              INDIGENOUS COMPONENTS
            </span>
            <span className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full"></span>
            <span className="font-heading font-bold text-[10px] uppercase tracking-wider mx-8 text-[var(--primary)]">
              RUDRAASTRA
            </span>
            <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full"></span>
            <span className="font-heading font-bold text-[10px] uppercase tracking-wider mx-8 text-[var(--accent)]">
              INDIA&apos;S DRONE HARDWARE MARKETPLACE
            </span>
            <span className="w-1.5 h-1.5 bg-[var(--success)] rounded-full"></span>
            <span className="font-heading font-bold text-[10px] uppercase tracking-wider mx-8 text-[var(--success)]">
              ENGINEERING-FIRST PROCUREMENT
            </span>
            <span className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full"></span>
          </div>
        ))}
      </div>
    </div>
  );
}
