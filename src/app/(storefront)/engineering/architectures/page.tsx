import Link from "next/link";
import Image from "next/image";

const architectures = [
  {
    slug: "heavy-lift-hexacopter",
    title: "Heavy Lift Hexacopter",
    payload: "15kg",
    flightTime: "45m",
    motors: 6,
    config: "X6",
    useCase: "Agricultural, industrial inspection, cargo delivery",
    img: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "mapping-vtol",
    title: "Mapping VTOL Fixed-Wing",
    payload: "2kg",
    flightTime: "120m",
    motors: 5,
    config: "Tilt-Rotor VTOL",
    useCase: "Terrain mapping, survey, long-range reconnaissance",
    img: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "tactical-quadcopter",
    title: "Tactical Quadcopter",
    payload: "1.5kg",
    flightTime: "55m",
    motors: 4,
    config: "H4",
    useCase: "Defense ISR, border patrol, urban surveillance",
    img: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function ArchitectureListPage() {
  return (
    
      <div className="w-full flex flex-col min-h-screen bg-[#F5F5F5]">
        {/* HERO */}
        <section className="w-full bg-white border-b border-[var(--border)] px-6 lg:px-10 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 text-[12px] text-[var(--muted-foreground)] mb-4">
              <Link href="/" className="hover:text-[var(--foreground)] transition-colors">Home</Link>
              <span>/</span>
              <Link href="/engineering" className="hover:text-[var(--foreground)] transition-colors">Engineering</Link>
              <span>/</span>
              <span className="text-[var(--foreground)] font-semibold">Reference Architectures</span>
            </div>
            <h1 className="font-heading font-extrabold text-[40px] md:text-[56px] leading-[1.05] tracking-tight max-w-3xl mb-4">
              Reference <span className="text-[var(--primary)]">Architectures</span>
            </h1>
            <p className="font-sans text-[16px] text-[var(--muted-foreground)] max-w-2xl">
              Explore verified UAV system architectures. Each architecture includes a complete component stack optimised for its use case. Click any architecture to see its BOM and procurement plan.
            </p>
          </div>
        </section>

        {/* GRID */}
        <section className="w-full px-6 lg:px-10 py-16 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {architectures.map((arch) => (
              <Link
                key={arch.slug}
                href={`/engineering/architectures/${arch.slug}`}
                className="bg-white border border-[var(--border)] hover:border-[var(--foreground)] transition-all duration-fast group flex flex-col"
              >
                <div className="aspect-video overflow-hidden relative bg-[#111111]">
                  <Image
                    src={arch.img}
                    alt={arch.title}
                    fill
                    className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-slow"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 font-mono text-[10px] text-white/40 uppercase tracking-widest">
                    {arch.config}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h2 className="font-heading font-bold text-[22px] text-[var(--foreground)] mb-2 group-hover:text-[var(--primary)] transition-colors">
                    {arch.title}
                  </h2>
                  <p className="font-sans text-[13px] text-[var(--muted-foreground)] mb-6 flex-1">{arch.useCase}</p>
                  <div className="flex gap-6 pt-4 border-t border-[var(--border)]">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)] block mb-0.5">Payload</span>
                      <span className="font-mono text-[14px] font-bold">{arch.payload}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)] block mb-0.5">Flight Time</span>
                      <span className="font-mono text-[14px] font-bold">{arch.flightTime}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)] block mb-0.5">Motors</span>
                      <span className="font-mono text-[14px] font-bold">{arch.motors}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    
  );
}
