"use client";

import React, { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "glass" | "gradient" | "outline";
    hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = "default", hover = false, children, ...props }, ref) => {
        const variants = {
            default: "bg-card border border-border",
            glass: "glass-card",
            gradient: "gradient-border bg-card",
            outline: "bg-transparent border border-border",
        };

        return (
            <div
                ref={ref}
                className={cn(
                    "rounded-xl overflow-hidden",
                    variants[variant],
                    hover && "hover-lift cursor-pointer",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = "Card";

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("p-4 sm:p-6", className)} {...props} />
    )
);
CardHeader.displayName = "CardHeader";

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("p-4 sm:p-6 pt-0", className)} {...props} />
    )
);
CardContent.displayName = "CardContent";

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("p-4 sm:p-6 pt-0 flex items-center gap-2", className)} {...props} />
    )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardContent, CardFooter };
