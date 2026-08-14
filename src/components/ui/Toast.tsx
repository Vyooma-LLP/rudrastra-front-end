"use client";

import React, { useEffect, useState } from "react";

export function ToastContainer() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleToast = (e: any) => {
      setMessage(e.detail);
      setTimeout(() => setMessage(null), 3000);
    };
    window.addEventListener("app-toast", handleToast);
    return () => window.removeEventListener("app-toast", handleToast);
  }, []);

  if (!message) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-5">
      <div className="bg-[#111111] text-white px-6 py-3 rounded-full shadow-lg font-sans text-sm font-semibold flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        {message}
      </div>
    </div>
  );
}

export function toast(message: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("app-toast", { detail: message }));
  }
}
