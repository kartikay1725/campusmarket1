"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import {
    BookOpen,
    Laptop,
    Shirt,
    Armchair,
    Dumbbell,
    Pencil,
    Briefcase,
    Package,
    ArrowRight
} from "lucide-react";

const categories = [
    {
        id: "books",
        name: "Books & Textbooks",
        description: "Course materials, novels, reference books, and study guides",
        icon: BookOpen,
        color: "from-blue-500 to-cyan-500",
        bgColor: "bg-blue-500/10",
        count: "2.5k+ items"
    },
    {
        id: "electronics",
        name: "Electronics",
        description: "Laptops, phones, tablets, chargers, and accessories",
        icon: Laptop,
        color: "from-violet-500 to-purple-500",
        bgColor: "bg-violet-500/10",
        count: "1.8k+ items"
    },
    {
        id: "clothing",
        name: "Clothing & Fashion",
        description: "Casual wear, formal attire, shoes, and accessories",
        icon: Shirt,
        color: "from-pink-500 to-rose-500",
        bgColor: "bg-pink-500/10",
        count: "3.2k+ items"
    },
    {
        id: "furniture",
        name: "Furniture",
        description: "Desks, chairs, shelves, mattresses, and room decor",
        icon: Armchair,
        color: "from-amber-500 to-orange-500",
        bgColor: "bg-amber-500/10",
        count: "800+ items"
    },
    {
        id: "sports",
        name: "Sports & Fitness",
        description: "Gym equipment, sports gear, bicycles, and outdoor items",
        icon: Dumbbell,
        color: "from-emerald-500 to-teal-500",
        bgColor: "bg-emerald-500/10",
        count: "1.2k+ items"
    },
    {
        id: "stationery",
        name: "Stationery",
        description: "Notebooks, pens, art supplies, and office essentials",
        icon: Pencil,
        color: "from-yellow-500 to-amber-500",
        bgColor: "bg-yellow-500/10",
        count: "900+ items"
    },
    {
        id: "accessories",
        name: "Bags & Accessories",
        description: "Backpacks, handbags, watches, and jewelry",
        icon: Briefcase,
        color: "from-indigo-500 to-blue-500",
        bgColor: "bg-indigo-500/10",
        count: "1.5k+ items"
    },
    {
        id: "other",
        name: "Other",
        description: "Kitchen items, collectibles, instruments, and more",
        icon: Package,
        color: "from-slate-500 to-gray-500",
        bgColor: "bg-slate-500/10",
        count: "2k+ items"
    }
];

export default function CategoriesPage() {
    return (
        <div className="min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                        Browse by <span className="gradient-text">Category</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Find exactly what you need from our wide range of categories.
                        Every item is from a verified student in your campus.
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categories.map((category, index) => (
                        <Link
                            key={category.id}
                            href={`/browse?category=${category.id}`}
                            className="group"
                        >
                            <Card
                                variant="glass"
                                hover
                                className="h-full p-6 transition-all duration-300 fade-in-up"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {/* Icon */}
                                <div className={`w-14 h-14 rounded-2xl ${category.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                                        <category.icon size={22} className="text-white" />
                                    </div>
                                </div>

                                {/* Content */}
                                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                                    {category.name}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                    {category.description}
                                </p>

                                {/* Footer */}
                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-xs font-medium text-primary">
                                        {category.count}
                                    </span>
                                    <ArrowRight
                                        size={18}
                                        className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all"
                                    />
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-16 text-center">
                    <Card variant="gradient" className="p-8 sm:p-12 inline-block">
                        <h2 className="text-2xl font-bold mb-3">Can't find what you're looking for?</h2>
                        <p className="text-muted-foreground mb-6">
                            Try our search feature or post a request
                        </p>
                        <Link
                            href="/browse"
                            className="btn-primary inline-flex items-center gap-2"
                        >
                            Browse All Products
                            <ArrowRight size={18} />
                        </Link>
                    </Card>
                </div>
            </div>
        </div>
    );
}
