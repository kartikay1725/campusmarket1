"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
    children: React.ReactNode;
    variant?: "default" | "success" | "warning" | "danger" | "primary" | "outline";
    size?: "sm" | "md";
    pulse?: boolean;
    className?: string;
}

export function Badge({
    children,
    variant = "default",
    size = "sm",
    pulse = false,
    className
}: BadgeProps) {
    const variants = {
        default: "bg-muted text-muted-foreground",
        success: "bg-emerald-500/15 text-emerald-500",
        warning: "bg-amber-500/15 text-amber-500",
        danger: "bg-red-500/15 text-red-500",
        primary: "bg-indigo-500/15 text-indigo-400",
        outline: "bg-transparent border border-border text-muted-foreground",
    };

    const sizes = {
        sm: "px-2 py-0.5 text-xs",
        md: "px-3 py-1 text-sm",
    };

    return (
        <span
            className={cn(
                "inline-flex items-center font-medium rounded-full uppercase tracking-wide",
                variants[variant],
                sizes[size],
                pulse && "animate-pulse",
                className
            )}
        >
            {children}
        </span>
    );
}

// Condition badge helper
export function ConditionBadge({
    condition,
    className,
    size = "sm"
}: {
    condition: string;
    className?: string;
    size?: BadgeProps["size"];
}) {
    const conditionConfig: Record<string, { label: string; variant: BadgeProps["variant"] }> = {
        new: { label: "New", variant: "success" },
        "like-new": { label: "Like New", variant: "primary" },
        good: { label: "Good", variant: "warning" },
        fair: { label: "Fair", variant: "default" },
    };

    const config = conditionConfig[condition] || conditionConfig.fair;

    return <Badge variant={config.variant} className={className} size={size}>{config.label}</Badge>;
}

// Status badge helper
export function StatusBadge({
    status,
    className,
    size = "sm"
}: {
    status: string;
    className?: string;
    size?: BadgeProps["size"];
}) {
    const statusConfig: Record<string, { label: string; variant: BadgeProps["variant"]; pulse?: boolean }> = {
        available: { label: "Available", variant: "success" },
        reserved: { label: "Reserved", variant: "warning", pulse: true },
        sold: { label: "Sold", variant: "danger" },
        placed: { label: "Placed", variant: "primary" },
        confirmed: { label: "Confirmed", variant: "warning" },
        delivered: { label: "Delivered", variant: "success" },
        cancelled: { label: "Cancelled", variant: "danger" },
        pending: { label: "Pending", variant: "warning", pulse: true },
        held: { label: "Held in Escrow", variant: "primary" },
        released: { label: "Released", variant: "success" },
        refunded: { label: "Refunded", variant: "danger" },
    };

    const config = statusConfig[status] || { label: status, variant: "default" };

    return (
        <Badge
            variant={config.variant}
            pulse={config.pulse}
            className={className}
            size={size}
        >
            {config.label}
        </Badge>
    );
}
