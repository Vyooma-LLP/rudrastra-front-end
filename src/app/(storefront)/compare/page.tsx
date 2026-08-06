import Link from "next/link";
import Image from "next/image";

/**
 * P0: Compare Components
 * Engineering comparison of specifications.
 */
export default function ComparePage() {
  const components = [
    { id: "RUD-MOT-MN4014", mfg: "T-Motor", mpn: "MN4014", img: "/images/products/rudrastra_motor_1785921295587.png", price: "₹12,450", kv: "400", voltage: "6S-12S", weight: "168g", current: "30A", thrust: "8.2kg" },
    { id: "RUD-MOT-MN3510", mfg: "T-Motor", mpn: "MN3510", img: "/images/products/rudrastra_motor_1785921295587.png", price: "₹8,900", kv: "360", voltage: "6S-8S", weight: "140g", current: "22A", thrust: "4.5kg" },
    { id: "RUD-MOT-MN4010", mfg: "T-Motor", mpn: "MN4010", img: "/images/products/rudrastra_motor_1785921295587.png", price: "₹10,200", kv: "420", voltage: "6S-12S", weight: "155g", current: "28A", thrust: "6.8kg" },
  ];

  return (
    <div className="w-full flex flex-col min-h-screen bg-[#F5F5F5]">
      {/* HERO */}
      <section className="w-full bg-white border-b border-[var(--border)] px-6 lg:px-10 py-16">
        <h1 className="font-heading font-extrabold text-[40px] md:text-[56px] leading-[1.05] tracking-tight max-w-3xl mb-4">
          <span className="text-[var(--primary)]">Compare</span> components without opening ten tabs.
        </h1>
        <p className="font-sans text-[16px] text-[var(--muted-foreground)] max-w-2xl">
          Evaluate technical specifications side-by-side to make the right engineering decision.
        </p>
      </section>

      {/* COMPARISON TABLE */}
      <section className="w-full max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="bg-white border border-[var(--border)] overflow-x-auto">
          <table className="w-full text-left font-sans text-[14px]">
            <thead>
              <tr>
                <th className="p-6 border-b border-r border-[var(--border)] bg-[#FAFAFA] w-[200px] shrink-0 min-w-[150px]">
                  {/* Empty corner */}
                </th>
                {components.map(c => (
                  <th key={c.id} className="p-6 border-b border-[var(--border)] bg-white min-w-[250px] relative group">
                    <button className="absolute top-4 right-4 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="square" strokeLinejoin="miter" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                    <div className="flex flex-col items-center text-center">
                      <Image src={c.img} alt={c.mpn} width={100} height={100} className="object-contain mb-4" />
                      <span className="text-[11px] font-bold text-[var(--muted-foreground)] uppercase">{c.mfg}</span>
                      <Link href={`/products/${c.id}`} className="font-heading font-bold text-[18px] hover:text-[var(--primary)] transition-colors mt-1 mb-2">{c.mpn}</Link>
                      <span className="font-bold text-[16px]">{c.price}</span>
                    </div>
                  </th>
                ))}
                {/* Add new column */}
                <th className="p-6 border-b border-l border-[var(--border)] bg-[#FAFAFA] min-w-[200px]">
                  <button className="w-full h-[180px] border-2 border-dashed border-[var(--border)] hover:border-[var(--foreground)] hover:bg-white transition-colors duration-fast flex flex-col items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                    <svg className="w-6 h-6 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="square" strokeLinejoin="miter" d="M12 4v16m8-8H4" /></svg>
                    <span className="font-semibold text-[13px]">Add Component</span>
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {[
                { label: "KV Rating", key: "kv" },
                { label: "Operating Voltage", key: "voltage" },
                { label: "Weight", key: "weight" },
                { label: "Max Current", key: "current" },
                { label: "Max Thrust", key: "thrust" },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-[#FAFAFA] transition-colors duration-fast">
                  <td className="p-6 font-semibold text-[13px] text-[var(--muted-foreground)] uppercase tracking-wider border-r border-[var(--border)]">
                    {row.label}
                  </td>
                  {components.map(c => (
                    <td key={c.id} className="p-6 font-medium text-center relative">
                      {/* Highlight differences subtly */}
                      <span className={`${row.key === 'voltage' && c.voltage !== '6S-12S' ? 'bg-yellow-50 px-2 py-1 border border-yellow-200 text-yellow-800' : ''}`}>
                        {c[row.key as keyof typeof c]}
                      </span>
                    </td>
                  ))}
                  <td className="p-6 border-l border-[var(--border)]"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex justify-end">
          <Link href="/rfq" className="bg-[var(--foreground)] text-white font-sans font-bold px-8 py-3.5 hover:bg-[var(--primary)] transition-colors duration-fast">
            Request quote for selected components
          </Link>
        </div>
      </section>
    </div>
  );
}
