import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const reqHeaders = await headers();
  const sessionUser = reqHeaders.get("x-mock-user");
  const sessionRole = reqHeaders.get("x-mock-role");

  // Only allow Owner to access this area
  if (sessionRole !== "owner") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-[#E5E5E5] flex-shrink-0 relative z-10 hidden md:block">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded bg-amber-600 flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-[16px] leading-tight">Super Admin</h2>
              <p className="font-sans text-[11px] text-amber-600 font-bold uppercase tracking-wider">Owner Portal</p>
            </div>
          </div>

          <nav className="space-y-1">
            <Link href="/owner/dashboard" className="flex items-center gap-3 px-3 py-2 text-[14px] rounded-md bg-slate-100 text-slate-900 font-medium">
              Platform Dashboard
            </Link>
            <Link href="/ops/catalog/products" className="flex items-center gap-3 px-3 py-2 text-[14px] rounded-md text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium">
              Catalog Management
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-[#E5E5E5] p-4 flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-amber-600 flex items-center justify-center text-white">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-[16px] leading-tight">Super Admin</h2>
            <p className="font-sans text-[11px] text-amber-600 font-bold uppercase tracking-wider">Owner Portal</p>
          </div>
        </div>
        
        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
