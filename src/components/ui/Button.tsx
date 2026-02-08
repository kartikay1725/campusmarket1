"use client";

import React, { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "accent" | "ghost" | "outline" | "danger";
    size?: "sm" | "md" | "lg";
    loading?: boolean;
    icon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", loading, icon, children, disabled, ...props }, ref) => {
        const baseStyles = "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 cursor-pointer border-none outline-none rounded-lg disabled:opacity-50 disabled:cursor-not-allowed";

        const variants = {
            primary: "bg-gradient-to-r from-indigo-500 to-violet-500 text-white hover:opacity-90 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30",
            secondary: "bg-secondary text-secondary-foreground hover:bg-muted",
            accent: "bg-gradient-to-r from-rose-500 to-pink-400 text-white hover:opacity-90 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-rose-500/30",
            ghost: "bg-transparent text-foreground hover:bg-muted",
            outline: "bg-transparent border border-border text-foreground hover:bg-muted hover:border-primary",
            danger: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:opacity-90",
        };

        const sizes = {
            sm: "px-3 py-1.5 text-xs",
            md: "px-4 py-2.5 text-sm",
            lg: "px-6 py-3 text-base",
        };

        return (
            <button
                ref={ref}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                disabled={disabled || loading}
                {...props}
            >
                {loading && (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                )}
                {icon && !loading && icon}
                {children}
            </button>
        );
    }
);

Button.displayName = "Button";
export { Button };
