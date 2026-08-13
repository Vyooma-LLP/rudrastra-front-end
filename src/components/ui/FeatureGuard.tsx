"use client";

import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

interface FeatureGuardProps {
    children: React.ReactNode;
    fallbackMessage?: string;
}

export function FeatureGuard({ children, fallbackMessage = "Coming Soon" }: FeatureGuardProps) {
    return (
        <TooltipProvider>
            <Tooltip >
                <TooltipTrigger >
                    {/* display: contents ensures this wrapper does not alter the DOM layout or CSS flex/grid structures.
                        onClickCapture intercepts the click before it reaches the child. */}
                    <div
                        style={{ display: "contents" }}
                        onClickCapture={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                    >
                        {children}
                    </div>
                </TooltipTrigger>
                <TooltipContent side="top" align="center" className="bg-primary text-primary-foreground">
                    <span className="font-semibold">{fallbackMessage}</span>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
