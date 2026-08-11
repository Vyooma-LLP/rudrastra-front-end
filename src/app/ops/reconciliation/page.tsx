import React from 'react';

export default function OpsReconciliationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-[#111111] tracking-tight">Financial Ledger & Payout Reconciliation</h1>
        <p className="text-xs text-[#777777]">Audit double-entry ledger balance (`SUM(debits) == SUM(credits)`) and Razorpay payouts.</p>
      </div>

      <div className="bg-[#F5F5F5] border border-[#E5E5E5] overflow-hidden text-xs">
        <table className="w-full text-left">
          <thead className="bg-white border-b border-[#E5E5E5] text-[#777777] font-semibold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="p-4">Journal Entry ID</th>
              <th className="p-4">Transaction Code</th>
              <th className="p-4">Total Debits</th>
              <th className="p-4">Total Credits</th>
              <th className="p-4">Ledger Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E5E5] text-[#111111] font-mono">
            <tr>
              <td className="p-4 font-bold text-[#305CDE]">JRN-2026-99201</td>
              <td className="p-4 font-sans font-semibold">Order Payment Capture (#RUD-88941)</td>
              <td className="p-4">₹58,174.00</td>
              <td className="p-4">₹58,174.00</td>
              <td className="p-4 text-[#138808] font-sans font-semibold">BALANCED (POSTED)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
