import React from 'react';
import Link from 'next/link';

export default function ComingSoon() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-4xl font-bold font-heading text-[#111111] mb-4">Coming Soon</h1>
      <p className="text-[#777777] max-w-md mx-auto mb-8">
        We are working hard to bring you this feature. Check back soon for updates.
      </p>
      <Link href="/" className="px-6 py-3 bg-[#305CDE] text-white rounded-lg font-semibold hover:bg-[#305CDE]/90 transition-colors">
        Return Home
      </Link>
    </div>
  );
}
