import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export default function Forbidden() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5] font-sans">
      <div className="text-center p-8 bg-white border border-[#E5E5E5] shadow-sm max-w-md w-full">
        <ShieldCheck className="w-12 h-12 text-rose-600 mx-auto mb-4" />
        <h1 className="text-xl font-bold font-heading text-[#111111] mb-2">404 Not Found</h1>
        <p className="text-sm text-[#777777] mb-6">The page you are looking for does not exist or you do not have permissions to access it.</p>
        <Link href="/" className="bg-[#111111] text-white px-6 py-2.5 font-bold text-xs uppercase tracking-wider hover:bg-[#333333] transition-colors inline-block">
          Return to Store
        </Link>
      </div>
    </div>
  );
}
