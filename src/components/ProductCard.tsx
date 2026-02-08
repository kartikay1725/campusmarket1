"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { ConditionBadge, StatusBadge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Heart, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
    product: {
        _id: string;
        title: string;
        price: number;
        images: string[];
        condition: string;
        status: string;
        category: string;
        seller?: {
            name: string;
            profileImage?: string;
        };
        college?: {
            shortCode: string;
            name: string;
        };
        createdAt: string;
    };
    showSeller?: boolean;
    className?: string;
}

const categoryIcons: Record<string, string> = {
    books: "📚",
    electronics: "💻",
    clothing: "👕",
    furniture: "🪑",
    sports: "⚽",
    stationery: "✏️",
    accessories: "👜",
    other: "📦",
};

export function ProductCard({ product, showSeller = true, className }: ProductCardProps) {
    const timeAgo = getTimeAgo(product.createdAt);
    const defaultImage = `https://placehold.co/400x300/1a1a3a/6366f1?text=${encodeURIComponent(product.category)}`;

    return (
        <Link href={`/product/${product._id}`}>
            <Card variant="glass" hover className={cn("group", className)}>
                {/* Image */}
                <div className="product-image-container relative aspect-[4/3] bg-muted">
                    <img
                        src={product.images[0] || defaultImage}
                        alt={product.title}
                        className="product-image w-full h-full object-cover"
                    />

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-3 right-3 flex gap-2">
                            <button
                                className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
                                onClick={(e) => { e.preventDefault(); /* Add to wishlist */ }}
                            >
                                <Heart size={18} className="text-white" />
                            </button>
                            <button className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors">
                                <Eye size={18} className="text-white" />
                            </button>
                        </div>
                    </div>

                    {/* Category icon */}
                    <div className="absolute top-3 left-3">
                        <span className="text-2xl filter drop-shadow-lg">
                            {categoryIcons[product.category] || categoryIcons.other}
                        </span>
                    </div>

                    {/* Status badge */}
                    {product.status !== "available" && (
                        <div className="absolute top-3 right-3">
                            <StatusBadge status={product.status} />
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-3 sm:p-4">
                    {/* College tag */}
                    {product.college && (
                        <span className="text-[10px] sm:text-xs text-indigo-400 font-medium">
                            {product.college.shortCode}
                        </span>
                    )}

                    {/* Title */}
                    <h3 className="text-sm sm:text-base font-semibold text-foreground mt-1 line-clamp-2 group-hover:text-primary transition-colors leading-tight sm:leading-normal">
                        {product.title}
                    </h3>

                    {/* Price & Condition */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-2 sm:mt-3">
                        <span className="price-tag text-xs sm:text-sm">
                            ₹{product.price.toLocaleString()}
                        </span>
                        <div className="flex sm:block">
                            <ConditionBadge condition={product.condition} className="text-[10px] sm:text-xs" />
                        </div>
                    </div>

                    {/* Seller info */}
                    {showSeller && product.seller && (
                        <div className="flex items-center gap-2 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border">
                            <Avatar
                                src={product.seller.profileImage}
                                name={product.seller.name}
                                size="xs"
                                className="sm:w-8 sm:h-8"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-[11px] sm:text-sm font-medium truncate">{product.seller.name}</p>
                                <p className="text-[10px] sm:text-xs text-muted-foreground">{timeAgo}</p>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </Link>
    );
}

// Time ago helper
function getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
}

// Skeleton loader
export function ProductCardSkeleton() {
    return (
        <Card variant="glass" className="overflow-hidden">
            <div className="aspect-[4/3] shimmer" />
            <div className="p-4 space-y-3">
                <div className="h-3 w-12 shimmer rounded" />
                <div className="h-5 w-3/4 shimmer rounded" />
                <div className="flex justify-between">
                    <div className="h-6 w-20 shimmer rounded-full" />
                    <div className="h-5 w-16 shimmer rounded-full" />
                </div>
                <div className="flex items-center gap-2 pt-4 border-t border-border">
                    <div className="w-8 h-8 shimmer rounded-full" />
                    <div className="space-y-1 flex-1">
                        <div className="h-3 w-24 shimmer rounded" />
                        <div className="h-2 w-16 shimmer rounded" />
                    </div>
                </div>
            </div>
        </Card>
    );
}
