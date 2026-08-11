"use client";

import React, { ReactNode } from "react";

interface InfiniteMarqueeProps {
  children: ReactNode;
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
}

export function InfiniteMarquee({
  children,
  direction = "left",
  speed = "normal",
  pauseOnHover = true,
}: InfiniteMarqueeProps) {
  const animationClass = direction === "left" ? "marquee-left" : "marquee-right";
  const hoverClass = pauseOnHover ? "marquee-track" : "";

  return (
    <div className="w-full relative flex overflow-hidden group">
      <div className={`flex shrink-0 ${animationClass} ${hoverClass}`}>
        <div className="flex shrink-0 items-center justify-center">
          {children}
        </div>
        <div className="flex shrink-0 items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}
