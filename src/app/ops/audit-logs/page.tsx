import React from 'react';

export default function OpsAuditLogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-[#111111] tracking-tight">System Audit Trail</h1>
        <p className="text-xs text-[#777777]">Immutable audit log of all security, catalog, inventory, and ledger mutations.</p>
      </div>

      <div className="bg-[#F5F5F5] border border-[#E5E5E5] overflow-hidden text-xs">
        <table className="w-full text-left">
          <thead className="bg-white border-b border-[#E5E5E5] text-[#777777] font-semibold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="p-4">Timestamp</th>
              <th className="p-4">Actor</th>
              <th className="p-4">Action</th>
              <th className="p-4">Entity</th>
              <th className="p-4">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E5E5] text-[#111111] font-mono">
            <tr>
              <td className="p-4 font-sans text-[#777777]">Aug 9, 2026, 10:32 AM</td>
              <td className="p-4 font-sans font-bold">praneeth@vyooma.tech</td>
              <td className="p-4 text-[#138808] font-bold">ORDER_PAYMENT_CAPTURED</td>
              <td className="p-4">Order #RUD-88941</td>
              <td className="p-4">103.156.42.10</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
