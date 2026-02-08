"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { ConditionBadge, StatusBadge } from "@/components/ui/Badge";
import {
    ArrowLeft,
    Heart,
    Share2,
    MapPin,
    Calendar,
    MessageCircle,
    ShieldCheck,
    ChevronLeft,
    ChevronRight,
    AlertTriangle,
    Clock
} from "lucide-react";

interface Product {
    _id: string;
    title: string;
    description: string;
    price: number;
    images: string[];
    condition: string;
    status: string;
    category: string;
    seller: {
        _id: string;
        name: string;
        profileImage?: string;
        bio?: string;
        createdAt: string;
    };
    college: {
        _id: string;
        name: string;
        shortCode: string;
        city: string;
        deliveryLocations: { name: string; building: string }[];
    };
    availableDays?: string[];
    availableTimeStart?: string;
    availableTimeEnd?: string;
    availableNote?: string;
    createdAt: string;
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

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentImage, setCurrentImage] = useState(0);
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${id}`);
                const data = await res.json();

                if (data.product) {
                    setProduct(data.product);

                    // Check if current user is owner
                    const user = localStorage.getItem("user");
                    if (user) {
                        const userData = JSON.parse(user);
                        setIsOwner(userData.id === data.product.seller._id);
                    }
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card variant="glass" className="p-12 text-center">
                    <AlertTriangle size={48} className="mx-auto text-warning mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Product Not Found</h2>
                    <p className="text-muted-foreground mb-6">This product may have been removed or sold.</p>
                    <Link href="/browse">
                        <Button variant="primary">Browse Products</Button>
                    </Link>
                </Card>
            </div>
        );
    }

    const defaultImage = `https://placehold.co/800x600/1a1a3a/6366f1?text=${encodeURIComponent(product.category)}`;
    const images = product.images.length > 0 ? product.images : [defaultImage];

    const memberSince = new Date(product.seller.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
    });
    const listedDate = new Date(product.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });

    return (
        <div className="min-h-screen py-4 sm:py-8 pb-24 sm:pb-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back button */}
                <Link href="/browse" className="inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground mb-4 sm:mb-6 transition-colors">
                    <ArrowLeft size={16} className="sm:w-5 sm:h-5" />
                    Back to browse
                </Link>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Image gallery */}
                    <div className="space-y-4">
                        <Card variant="glass" className="relative aspect-[4/3] overflow-hidden">
                            <Image
                                src={images[currentImage]}
                                alt={product.title}
                                fill
                                className="object-cover"
                                priority
                                unoptimized
                            />

                            {/* Status overlay */}
                            {product.status !== "available" && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                    <StatusBadge status={product.status} />
                                </div>
                            )}

                            {/* Navigation arrows */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={() => setCurrentImage((currentImage - 1 + images.length) % images.length)}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                                    >
                                        <ChevronLeft size={24} className="text-white" />
                                    </button>
                                    <button
                                        onClick={() => setCurrentImage((currentImage + 1) % images.length)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                                    >
                                        <ChevronRight size={24} className="text-white" />
                                    </button>
                                </>
                            )}

                            {/* Category icon */}
                            <div className="absolute top-4 left-4 text-3xl filter drop-shadow-lg">
                                {categoryIcons[product.category] || categoryIcons.other}
                            </div>
                        </Card>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImage(index)}
                                        className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 ring-2 transition-all relative ${currentImage === index ? "ring-primary" : "ring-transparent"
                                            }`}
                                    >
                                        <Image
                                            src={img}
                                            alt=""
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product details */}
                    <div className="space-y-6">
                        {/* Header */}
                        <div>
                            <div className="flex items-center gap-2 text-[10px] sm:text-xs text-muted-foreground mb-1 sm:mb-2 text-wrap">
                                <span className="text-indigo-400 font-medium">{product.college.shortCode}</span>
                                <span>•</span>
                                <span className="capitalize">{product.category}</span>
                                <span>•</span>
                                <span>Listed {listedDate}</span>
                            </div>
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3">{product.title}</h1>
                            <div className="flex items-center gap-3">
                                <span className="text-2xl sm:text-3xl font-bold text-emerald-500">
                                    ₹{product.price.toLocaleString()}
                                </span>
                                <ConditionBadge condition={product.condition} size="sm" />
                            </div>
                        </div>

                        {/* Actions (Desktop) */}
                        <div className="hidden sm:flex gap-3">
                            {product.status === "available" && !isOwner && (
                                <Link href={`/checkout/${product._id}`} className="flex-1">
                                    <Button variant="primary" className="w-full" size="lg">
                                        Buy Now
                                    </Button>
                                </Link>
                            )}
                            {isOwner && (
                                <Link href={`/dashboard`} className="flex-1">
                                    <Button variant="outline" className="w-full" size="lg">
                                        Manage Listing
                                    </Button>
                                </Link>
                            )}
                            <Button variant="outline" size="lg" icon={<Heart size={20} />}>
                                Save
                            </Button>
                            <Button variant="outline" size="lg" icon={<Share2 size={20} />}>
                                Share
                            </Button>
                        </div>

                        {/* Escrow info */}
                        <Card variant="gradient" className="p-4">
                            <div className="flex items-start gap-3">
                                <ShieldCheck size={24} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold text-sm">Secure Escrow Payment</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Your payment is held safely until you confirm delivery. No COD.
                                    </p>
                                </div>
                            </div>
                        </Card>

                        {/* Description */}
                        <div>
                            <h2 className="font-semibold mb-2">Description</h2>
                            <p className="text-muted-foreground whitespace-pre-line">
                                {product.description}
                            </p>
                        </div>

                        {/* Location */}
                        <div>
                            <h2 className="font-semibold mb-2">Pickup Locations</h2>
                            <Card variant="glass" className="p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <MapPin size={18} className="text-primary" />
                                    <span className="font-medium">{product.college.name}</span>
                                    <span className="text-muted-foreground">• {product.college.city}</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {product.college.deliveryLocations?.map((loc, index) => (
                                        <span key={index} className="px-3 py-1 rounded-full bg-muted text-sm">
                                            {loc.name}
                                        </span>
                                    ))}
                                    {(!product.college.deliveryLocations || product.college.deliveryLocations.length === 0) && (
                                        <span className="text-sm text-muted-foreground">
                                            Contact seller for pickup location
                                        </span>
                                    )}
                                </div>
                            </Card>
                        </div>

                        {/* Seller Availability */}
                        {product.availableDays && product.availableDays.length > 0 && (
                            <Card variant="glass" className="p-4">
                                <h2 className="font-semibold mb-3 flex items-center gap-2">
                                    <Clock size={18} className="text-primary" />
                                    Seller Availability
                                </h2>
                                <div className="space-y-2">
                                    <div className="flex flex-wrap gap-2">
                                        {product.availableDays.map((day) => (
                                            <span key={day} className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm capitalize">
                                                {day}
                                            </span>
                                        ))}
                                    </div>
                                    {product.availableTimeStart && product.availableTimeEnd && (
                                        <p className="text-sm text-muted-foreground">
                                            {product.availableTimeStart} - {product.availableTimeEnd}
                                        </p>
                                    )}
                                    {product.availableNote && (
                                        <p className="text-xs text-muted-foreground mt-1">&quot;{product.availableNote}&quot;</p>
                                    )}
                                </div>
                            </Card>
                        )}

                        {/* Seller info */}
                        <Card variant="glass" className="p-4">
                            <h2 className="font-semibold mb-3">Seller</h2>
                            <div className="flex items-center gap-3">
                                <Avatar
                                    src={product.seller.profileImage}
                                    name={product.seller.name}
                                    size="lg"
                                />
                                <div className="flex-1">
                                    <p className="font-medium">{product.seller.name}</p>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                                        <Calendar size={14} />
                                        Member since {memberSince}
                                    </p>
                                </div>
                                {!isOwner && (
                                    <Button variant="outline" size="sm" icon={<MessageCircle size={16} />}>
                                        Contact
                                    </Button>
                                )}
                            </div>
                            {product.seller.bio && (
                                <p className="mt-3 text-sm text-muted-foreground">{product.seller.bio}</p>
                            )}
                        </Card>
                    </div>
                </div>
            </div>

            {/* Sticky Mobile Buy Bar */}
            {!isOwner && product.status === "available" && (
                <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-border p-4 z-40 sm:hidden animate-in slide-in-from-bottom" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)' }}>
                    <div className="flex items-center justify-between gap-4 max-w-6xl mx-auto">
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider leading-none mb-1">Total Price</span>
                            <span className="text-xl font-bold text-emerald-500 leading-none">₹{product.price.toLocaleString()}</span>
                        </div>
                        <div className="flex gap-2 flex-grow max-w-[200px]">
                            <Button variant="outline" size="md" className="p-3" icon={<Heart size={18} />} />
                            <Link href={`/checkout/${product._id}`} className="flex-1">
                                <Button variant="primary" size="md" className="w-full py-2.5 font-bold">
                                    Buy Now
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
