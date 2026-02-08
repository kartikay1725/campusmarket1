"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
    Search,
    SlidersHorizontal,
    X,
    BookOpen,
    Laptop,
    Shirt,
    Armchair,
    Dumbbell,
    Pencil,
    Package,
    ChevronDown
} from "lucide-react";

const categories = [
    { value: "", label: "All Categories" },
    { value: "books", label: "Books", icon: BookOpen },
    { value: "electronics", label: "Electronics", icon: Laptop },
    { value: "clothing", label: "Clothing", icon: Shirt },
    { value: "furniture", label: "Furniture", icon: Armchair },
    { value: "sports", label: "Sports", icon: Dumbbell },
    { value: "stationery", label: "Stationery", icon: Pencil },
    { value: "accessories", label: "Accessories", icon: Package },
    { value: "other", label: "Other", icon: Package },
];

const conditions = [
    { value: "", label: "Any Condition" },
    { value: "new", label: "New" },
    { value: "like-new", label: "Like New" },
    { value: "good", label: "Good" },
    { value: "fair", label: "Fair" },
];

const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
];

interface College {
    _id: string;
    name: string;
    shortCode: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Product {
    _id: string;
    title: string;
    price: number;
    images: string[];
    condition: string;
    status: string;
    category: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    seller?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    college?: any;
    createdAt: string;
}

export default function BrowsePage() {
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [colleges, setColleges] = useState<College[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    // Filter states
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [category, setCategory] = useState(searchParams.get("category") || "");
    const [condition, setCondition] = useState("");
    const [college, setCollege] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sort, setSort] = useState("newest");

    // Pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Active filters count
    const activeFilters = [category, condition, college, minPrice, maxPrice].filter(Boolean).length;

    // Fetch colleges
    useEffect(() => {
        fetch("/api/colleges")
            .then((res) => res.json())
            .then((data) => setColleges(data.colleges || []))
            .catch(console.error);
    }, []);

    // Fetch products
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.set("search", search);
            if (category) params.set("category", category);
            if (condition) params.set("condition", condition);
            if (college) params.set("college", college);
            if (minPrice) params.set("minPrice", minPrice);
            if (maxPrice) params.set("maxPrice", maxPrice);
            params.set("sort", sort);
            params.set("page", page.toString());
            params.set("limit", "12");

            const res = await fetch(`/api/products?${params}`);
            const data = await res.json();

            setProducts(data.products || []);
            setTotalPages(data.pagination?.pages || 1);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    }, [search, category, condition, college, minPrice, maxPrice, sort, page]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const clearFilters = () => {
        setCategory("");
        setCondition("");
        setCollege("");
        setMinPrice("");
        setMaxPrice("");
        setPage(1);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchProducts();
    };

    return (
        <div className="min-h-screen py-4 sm:py-8">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">Browse Products</h1>
                    <p className="text-sm sm:text-base text-muted-foreground">
                        Discover amazing deals from students at your campus
                    </p>
                </div>

                {/* Search and filters bar */}
                <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8">
                    {/* Search */}
                    <form onSubmit={handleSearch} className="w-full">
                        <div className="relative">
                            <Search size={18} className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search products..."
                                className="w-full bg-card border border-border rounded-xl pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                    </form>

                    {/* Filter toggle & Sort */}
                    <div className="flex gap-2 sm:gap-3">
                        <Button
                            variant={showFilters ? "primary" : "outline"}
                            onClick={() => setShowFilters(!showFilters)}
                            icon={<SlidersHorizontal size={16} />}
                            className="relative flex-1 sm:flex-none text-sm sm:text-base"
                        >
                            <span className="hidden sm:inline">Filters</span>
                            <span className="sm:hidden">Filter</span>
                            {activeFilters > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-accent text-white text-[10px] sm:text-xs rounded-full flex items-center justify-center">
                                    {activeFilters}
                                </span>
                            )}
                        </Button>

                        <Select
                            options={sortOptions}
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="flex-1 sm:flex-none sm:w-44 text-sm"
                        />
                    </div>
                </div>

                {/* Filters panel */}
                {showFilters && (
                    <Card variant="glass" className="p-4 sm:p-6 mb-6 sm:mb-8 animate-in slide-in-from-top-2">
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <h3 className="font-semibold text-sm sm:text-base">Filters</h3>
                            {activeFilters > 0 && (
                                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs sm:text-sm">
                                    Clear all
                                </Button>
                            )}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                            <Select
                                label="College"
                                options={[{ value: "", label: "All Colleges" }, ...colleges.map(c => ({ value: c._id, label: c.shortCode }))]}
                                value={college}
                                onChange={(e) => { setCollege(e.target.value); setPage(1); }}
                            />

                            <Select
                                label="Category"
                                options={categories}
                                value={category}
                                onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                            />

                            <Select
                                label="Condition"
                                options={conditions}
                                value={condition}
                                onChange={(e) => { setCondition(e.target.value); setPage(1); }}
                            />

                            <Input
                                label="Min ₹"
                                type="number"
                                placeholder="0"
                                value={minPrice}
                                onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                            />

                            <Input
                                label="Max ₹"
                                type="number"
                                placeholder="Any"
                                value={maxPrice}
                                onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                                className="col-span-2 sm:col-span-1"
                            />
                        </div>
                    </Card>
                )}

                {/* Active filter tags */}
                {activeFilters > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {category && (
                            <Badge variant="primary" className="flex items-center gap-1">
                                {categories.find(c => c.value === category)?.label}
                                <X size={14} className="cursor-pointer" onClick={() => setCategory("")} />
                            </Badge>
                        )}
                        {condition && (
                            <Badge variant="primary" className="flex items-center gap-1">
                                {conditions.find(c => c.value === condition)?.label}
                                <X size={14} className="cursor-pointer" onClick={() => setCondition("")} />
                            </Badge>
                        )}
                        {college && (
                            <Badge variant="primary" className="flex items-center gap-1">
                                {colleges.find(c => c._id === college)?.shortCode}
                                <X size={14} className="cursor-pointer" onClick={() => setCollege("")} />
                            </Badge>
                        )}
                        {minPrice && (
                            <Badge variant="primary" className="flex items-center gap-1">
                                Min ₹{minPrice}
                                <X size={14} className="cursor-pointer" onClick={() => setMinPrice("")} />
                            </Badge>
                        )}
                        {maxPrice && (
                            <Badge variant="primary" className="flex items-center gap-1">
                                Max ₹{maxPrice}
                                <X size={14} className="cursor-pointer" onClick={() => setMaxPrice("")} />
                            </Badge>
                        )}
                    </div>
                )}

                {/* Category pills (quick filter) - Horizontal scroll on mobile */}
                <div className="-mx-3 sm:mx-0 px-3 sm:px-0 mb-6 sm:mb-8">
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory sm:flex-wrap sm:overflow-visible">
                        {categories.slice(1).map((cat) => (
                            <button
                                key={cat.value}
                                onClick={() => { setCategory(category === cat.value ? "" : cat.value); setPage(1); }}
                                className={`category-pill whitespace-nowrap snap-start flex-shrink-0 text-xs sm:text-sm py-2 px-3 sm:py-2.5 sm:px-4 ${category === cat.value ? "active" : ""}`}
                            >
                                {cat.icon && <cat.icon size={14} className="sm:w-4 sm:h-4" />}
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Products grid */}
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <ProductCardSkeleton key={i} />
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <Card variant="glass" className="p-12 text-center">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                            <Package size={40} className="text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No products found</h3>
                        <p className="text-muted-foreground mb-6">
                            Try adjusting your filters or search terms
                        </p>
                        <Button variant="outline" onClick={clearFilters}>
                            Clear Filters
                        </Button>
                    </Card>
                ) : (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                            {products.map((product, index) => (
                                <div
                                    key={product._id}
                                    className="fade-in-up"
                                    style={{ animationDelay: `${index * 30}ms` }}
                                >
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-12">
                                <Button
                                    variant="outline"
                                    disabled={page === 1}
                                    onClick={() => setPage(page - 1)}
                                >
                                    Previous
                                </Button>
                                <span className="px-4 text-muted-foreground">
                                    Page {page} of {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    disabled={page === totalPages}
                                    onClick={() => setPage(page + 1)}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
