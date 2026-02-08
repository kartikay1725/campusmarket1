"use client";

import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface AvatarProps {
    src?: string;
    name: string;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    className?: string;
}

export function Avatar({ src, name, size = "md", className }: AvatarProps) {
    const sizes = {
        xs: "w-6 h-6 text-[10px]",
        sm: "w-8 h-8 text-xs",
        md: "w-10 h-10 text-sm",
        lg: "w-12 h-12 text-base",
        xl: "w-16 h-16 text-lg",
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    // Generate consistent color from name
    const getColorClass = (name: string) => {
        const colors = [
            "bg-gradient-to-br from-indigo-500 to-violet-500",
            "bg-gradient-to-br from-rose-500 to-pink-500",
            "bg-gradient-to-br from-emerald-500 to-teal-500",
            "bg-gradient-to-br from-amber-500 to-orange-500",
            "bg-gradient-to-br from-cyan-500 to-blue-500",
            "bg-gradient-to-br from-fuchsia-500 to-purple-500",
        ];
        const index = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[index % colors.length];
    };

    if (src) {
        return (
            <div className={cn(
                "relative rounded-full overflow-hidden border-2 border-border",
                sizes[size],
                className
            )}>
                <Image
                    src={src}
                    alt={name}
                    fill
                    className="object-cover"
                    unoptimized
                />
            </div>
        );
    }

    return (
        <div
            className={cn(
                "rounded-full flex items-center justify-center font-semibold text-white",
                sizes[size],
                getColorClass(name),
                className
            )}
        >
            {getInitials(name)}
        </div>
    );
}
