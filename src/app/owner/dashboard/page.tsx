import { Users, AlertTriangle, ShieldCheck, Activity, Box, IndianRupee } from "lucide-react";

export default function OwnerDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end border-b border-[#E5E5E5] pb-4">
        <div>
          <h1 className="font-heading font-bold text-[28px] tracking-tight">Platform Owner Dashboard</h1>
          <p className="font-sans text-[14px] text-[var(--muted-foreground)]">System overview, metrics, and super admin controls.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Users", value: "842", sub: "+12% this week", icon: Users, color: "text-blue-600" },
          { label: "Platform Revenue", value: "₹45.2L", sub: "+5.2% this week", icon: IndianRupee, color: "text-green-600" },
          { label: "Total Sellers", value: "14", sub: "3 pending approval", icon: Box, color: "text-amber-600" },
          { label: "System Alerts", value: "2", sub: "Action required", icon: AlertTriangle, color: "text-rose-600" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 border border-[#E5E5E5] rounded-xl shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <span className="font-sans text-[13px] font-bold text-slate-500 uppercase tracking-wider">{stat.label}</span>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <div className="font-heading font-bold text-[28px] text-slate-900">{stat.value}</div>
              <div className="font-sans text-[12px] text-slate-500 mt-1">{stat.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* System Status & Audits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-[#E5E5E5] rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#E5E5E5] bg-slate-50 flex items-center justify-between">
            <h3 className="font-heading font-bold text-[16px]">Recent Platform Activity</h3>
            <button className="text-[12px] font-bold text-blue-600 hover:underline">View Audit Logs</button>
          </div>
          <div className="divide-y divide-[#E5E5E5]">
            {[
              { time: "10 mins ago", action: "Seller 'DroneHub' updated inventory for 42 items.", type: "inventory" },
              { time: "1 hour ago", action: "Ops Agent approved 14 new catalog products.", type: "catalog" },
              { time: "3 hours ago", action: "New organization workspace 'AeroTech India' created.", type: "org" },
              { time: "Yesterday", action: "Platform-wide Typesense reindex completed successfully.", type: "system" }
            ].map((log, i) => (
              <div key={i} className="p-4 flex gap-4 text-[14px]">
                <div className="w-24 flex-shrink-0 text-[12px] text-slate-500 font-medium">{log.time}</div>
                <div className="flex-1 text-slate-800">{log.action}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-[#E5E5E5] rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#E5E5E5] bg-slate-50">
            <h3 className="font-heading font-bold text-[16px]">System Status</h3>
          </div>
          <div className="p-4 space-y-4">
            {[
              { service: "PostgreSQL Database", status: "Healthy" },
              { service: "Typesense Search", status: "Healthy" },
              { service: "Edge Network (CDN)", status: "Healthy" },
              { service: "Razorpay Route API", status: "Degraded" },
            ].map((svc, i) => (
              <div key={i} className="flex justify-between items-center text-[14px]">
                <span className="text-slate-600 font-medium">{svc.service}</span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${svc.status === 'Healthy' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {svc.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
