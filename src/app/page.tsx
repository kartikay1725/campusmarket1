"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import {
  ArrowRight,
  ShieldCheck,
  MapPin,
  Banknote,
  Search,
  BookOpen,
  Laptop,
  Shirt,
  Armchair,
  Dumbbell,
  Pencil,
  Sparkles,
  TrendingUp
} from "lucide-react";

const categories = [
  { id: "books", label: "Books", icon: BookOpen, color: "from-blue-500 to-cyan-500" },
  { id: "electronics", label: "Electronics", icon: Laptop, color: "from-violet-500 to-purple-500" },
  { id: "clothing", label: "Clothing", icon: Shirt, color: "from-pink-500 to-rose-500" },
  { id: "furniture", label: "Furniture", icon: Armchair, color: "from-amber-500 to-orange-500" },
  { id: "sports", label: "Sports", icon: Dumbbell, color: "from-emerald-500 to-teal-500" },
  { id: "stationery", label: "Stationery", icon: Pencil, color: "from-red-500 to-pink-500" },
];

const features = [
  {
    icon: ShieldCheck,
    title: "Secure Escrow",
    description: "Your payment is held safely until you confirm delivery",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: MapPin,
    title: "Campus Delivery",
    description: "Pick up at mess, lab, library, or anywhere on campus",
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    icon: Banknote,
    title: "No COD Hassles",
    description: "All payments processed securely through our platform",
    gradient: "from-violet-500 to-purple-500",
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockProducts: any[] = [
  {
    _id: "1",
    title: "Engineering Mathematics Textbook - 3rd Edition",
    price: 350,
    images: [],
    condition: "good",
    status: "available",
    category: "books",
    seller: { name: "Rahul Sharma" },
    college: { shortCode: "IITD", name: "IIT Delhi" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    _id: "2",
    title: "MacBook Air M1 2020 - Excellent Condition",
    price: 65000,
    images: [],
    condition: "like-new",
    status: "available",
    category: "electronics",
    seller: { name: "Priya Patel" },
    college: { shortCode: "BITS", name: "BITS Pilani" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    _id: "3",
    title: "Study Table with Bookshelf - Minimal Use",
    price: 2500,
    images: [],
    condition: "good",
    status: "available",
    category: "furniture",
    seller: { name: "Amit Kumar" },
    college: { shortCode: "IITB", name: "IIT Bombay" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    _id: "4",
    title: "TI-84 Plus Calculator - Works Perfectly",
    price: 4500,
    images: [],
    condition: "like-new",
    status: "available",
    category: "electronics",
    seller: { name: "Sneha Reddy" },
    college: { shortCode: "NIT", name: "NIT Trichy" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
];

export default function HomePage() {
  const [products, setProducts] = useState(mockProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);

    // Fetch products
    fetch("/api/products?limit=8")
      .then((res) => res.json())
      .then((data) => {
        if (data.products?.length > 0) {
          setProducts(data.products);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative hero-gradient overflow-hidden">
        {/* Floating shapes */}
        <div className="floating-shape w-96 h-96 bg-primary/40 top-20 -left-48" />
        <div className="floating-shape w-64 h-64 bg-accent/30 bottom-20 right-20" style={{ animationDelay: "-3s" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6 animate-in fade-in slide-in-from-bottom-4">
              <Sparkles size={16} />
              <span className="text-sm font-medium">Trusted by 10,000+ students</span>
            </div>

            {/* Main heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: "100ms" }}>
              Buy & Sell Within Your
              <span className="gradient-text block mt-2">Campus Community</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: "200ms" }}>
              The trusted marketplace for students. Secure payments, campus delivery,
              and a community you can trust.
            </p>

            {/* Search bar */}
            <div className="max-w-2xl mx-auto mb-8 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: "300ms" }}>
              <div className="relative flex flex-col sm:block gap-3">
                <div className="relative flex-1">
                  <Search size={20} className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search for items..."
                    className="w-full bg-card/80 backdrop-blur-sm border border-border rounded-xl sm:rounded-2xl pl-12 sm:pl-14 pr-4 sm:pr-36 py-3.5 sm:py-4 text-sm sm:text-lg focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all"
                  />
                </div>
                <Button
                  variant="primary"
                  className="sm:absolute sm:right-2 sm:top-1/2 sm:-translate-y-1/2 h-12 sm:h-auto font-bold"
                >
                  Search
                </Button>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: "400ms" }}>
              <Link href="/browse">
                <Button variant="primary" size="lg" icon={<ArrowRight size={18} />}>
                  Start Browsing
                </Button>
              </Link>
              <Link href="/sell">
                <Button variant="outline" size="lg">
                  Sell Your Items
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16 text-center animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: "500ms" }}>
            <div>
              <div className="text-3xl sm:text-4xl font-bold gradient-text">50+</div>
              <div className="text-sm text-muted-foreground mt-1">Colleges</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold gradient-text">10K+</div>
              <div className="text-sm text-muted-foreground mt-1">Products</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold gradient-text">₹50L+</div>
              <div className="text-sm text-muted-foreground mt-1">Saved</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Browse by Category</h2>
            <p className="text-muted-foreground">Find what you need in our most popular categories</p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                href={`/browse?category=${category.id}`}
                className="fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Card
                  variant="glass"
                  hover
                  className="p-3 sm:p-6 text-center group h-full flex flex-col items-center justify-center"
                >
                  <div className={`w-10 h-10 sm:w-14 sm:h-14 mx-auto rounded-lg sm:rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-2 sm:mb-4 group-hover:scale-110 transition-transform`}>
                    <category.icon size={20} className="sm:w-7 sm:h-7 text-white" />
                  </div>
                  <h3 className="text-xs sm:text-base font-medium">{category.label}</h3>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-transparent via-card/30 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why CampusMarket?</h2>
            <p className="text-muted-foreground">Built for students, by students</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                variant="gradient"
                className="p-6 sm:p-8 text-center fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-xl sm:rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 sm:mb-6 glow`}>
                  <feature.icon size={24} className="sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Products */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-2 flex items-center gap-3">
                <TrendingUp className="text-primary" />
                Fresh Arrivals
              </h2>
              <p className="text-muted-foreground">Just listed by students near you</p>
            </div>
            <Link href="/browse">
              <Button variant="ghost" icon={<ArrowRight size={18} />}>
                View All
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
              : products.slice(0, 4).map((product, index) => (
                <div
                  key={product._id}
                  className="fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))
            }
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card variant="gradient" className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-rose-500/20" />
            <div className="floating-shape w-64 h-64 bg-indigo-500/30 -top-32 -right-32" />
            <div className="floating-shape w-48 h-48 bg-rose-500/30 -bottom-24 -left-24" />

            <div className="relative p-8 sm:p-12 lg:p-16 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to sell your stuff?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Turn your unused items into cash. List in minutes, sell to your campus community.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register">
                  <Button variant="primary" size="lg">
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button variant="ghost" size="lg">
                    Learn How it Works
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
