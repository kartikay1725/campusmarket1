"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { StatusBadge } from "@/components/ui/Badge";
import { useAuth } from "@/context/AuthContext";
import {
    Package,
    ShoppingBag,
    DollarSign,
    Clock,
    PlusCircle,
    CheckCircle,
    XCircle,
    Truck,
    Eye,
    Wallet,
    TrendingUp
} from "lucide-react";

type TabType = "listings" | "purchases" | "sales";

interface Product {
    _id: string;
    title: string;
    price: number;
    images: string[];
    status: string;
    category: string;
    createdAt: string;
}

interface Order {
    _id: string;
    product: {
        _id: string;
        title: string;
        images: string[];
        price: number;
    };
    buyer?: {
        name: string;
        phone?: string;
    };
    seller?: {
        name: string;
        phone?: string;
    };
    amount: number;
    orderStatus: string;
    paymentStatus: string;
    deliveryLocation: {
        name: string;
        building: string;
    };
    deliveryTime: string;
    createdAt: string;
}

interface UserData {
    id: string;
    name: string;
    email: string;
    wallet: number;
    profileImage?: string;
    college?: {
        name: string;
        shortCode: string;
    };
}

export default function DashboardPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading: authLoading, getToken, logout } = useAuth();
    const [activeTab, setActiveTab] = useState<TabType>("listings");
    const [userData, setUserData] = useState<UserData | null>(null);
    const [listings, setListings] = useState<Product[]>([]);
    const [purchases, setPurchases] = useState<Order[]>([]);
    const [sales, setSales] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            const token = await getToken();
            if (!token) {
                logout();
                return;
            }

            const headers = { Authorization: `Bearer ${token}` };

            const [listingsRes, purchasesRes, salesRes] = await Promise.all([
                fetch("/api/user/products", { headers }),
                fetch("/api/orders?role=buyer", { headers }),
                fetch("/api/orders?role=seller", { headers }),
            ]);

            // Handle 401 responses
            if (listingsRes.status === 401 || purchasesRes.status === 401 || salesRes.status === 401) {
                logout();
                return;
            }

            const [listingsData, purchasesData, salesData] = await Promise.all([
                listingsRes.json(),
                purchasesRes.json(),
                salesRes.json(),
            ]);

            setListings(listingsData.products || []);
            setPurchases(purchasesData.orders || []);
            setSales(salesData.orders || []);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    }, [getToken, logout]);

    useEffect(() => {
        if (authLoading) return;

        if (!isAuthenticated) {
            router.push("/login?redirect=/dashboard");
            return;
        }

        if (user) {
            setUserData(user as UserData);
        }

        fetchData();
    }, [authLoading, isAuthenticated, user, router, fetchData]);

    const handleOrderAction = async (orderId: string, action: "confirm" | "delivered" | "cancel") => {
        try {
            const token = await getToken();
            if (!token) {
                logout();
                return;
            }

            const res = await fetch(`/api/orders/${orderId}/${action}`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();

            if (!res.ok) {
                if (res.status === 401) {
                    logout();
                    return;
                }
                throw new Error(data.error);
            }

            // Refresh orders
            const [purchasesRes, salesRes] = await Promise.all([
                fetch("/api/orders?role=buyer", { headers: { Authorization: `Bearer ${token}` } }),
                fetch("/api/orders?role=seller", { headers: { Authorization: `Bearer ${token}` } }),
            ]);

            const [purchasesData, salesData] = await Promise.all([
                purchasesRes.json(),
                salesRes.json(),
            ]);

            setPurchases(purchasesData.orders || []);
            setSales(salesData.orders || []);

            // Update wallet if payment released
            if (action === "delivered") {
                const meRes = await fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } });
                const meData = await meRes.json();
                if (meData.user) {
                    localStorage.setItem("user", JSON.stringify({
                        ...userData,
                        wallet: meData.user.wallet
                    }));
                    setUserData((prev: UserData | null) => prev ? { ...prev, wallet: meData.user.wallet } : null);
                }
            }

            alert(data.message || "Action completed successfully!");
        } catch (error) {
            console.error("Error:", error);
            alert("Action failed. Please try again.");
        }
    };

    const stats = [
        {
            label: "Active Listings",
            value: listings.filter(p => p.status === "available").length,
            icon: Package,
            color: "from-indigo-500 to-violet-500"
        },
        {
            label: "Pending Orders",
            value: sales.filter(o => o.orderStatus === "placed" || o.orderStatus === "confirmed").length,
            icon: Clock,
            color: "from-amber-500 to-orange-500"
        },
        {
            label: "Completed Sales",
            value: sales.filter(o => o.orderStatus === "delivered").length,
            icon: TrendingUp,
            color: "from-emerald-500 to-teal-500"
        },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <Avatar src={userData?.profileImage} name={userData?.name || "User"} size="xl" />
                        <div>
                            <h1 className="text-2xl font-bold">{userData?.name}</h1>
                            {userData?.college && (
                                <span className="text-sm text-primary">{userData.college.shortCode}</span>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Card variant="gradient" className="px-4 py-2 flex items-center gap-2">
                            <Wallet size={20} className="text-emerald-500" />
                            <span className="text-sm text-muted-foreground">Wallet:</span>
                            <span className="font-bold text-emerald-500">₹{(userData?.wallet || 0).toLocaleString()}</span>
                        </Card>
                        <Link href="/sell">
                            <Button variant="primary" icon={<PlusCircle size={18} />}>
                                Sell Item
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid sm:grid-cols-3 gap-4 mb-8">
                    {stats.map((stat) => (
                        <Card key={stat.label} variant="glass" className="p-6">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                                    <stat.icon size={24} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{stat.value}</p>
                                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 border-b border-border overflow-x-auto">
                    {[
                        { id: "listings" as TabType, label: "My Listings", icon: Package, count: listings.length },
                        { id: "purchases" as TabType, label: "My Purchases", icon: ShoppingBag, count: purchases.length },
                        { id: "sales" as TabType, label: "My Sales", icon: DollarSign, count: sales.length },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                                ? "border-primary text-primary"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                            {tab.count > 0 && (
                                <span className="px-2 py-0.5 rounded-full bg-muted text-xs">
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {activeTab === "listings" && (
                    <div className="space-y-4">
                        {listings.length === 0 ? (
                            <Card variant="glass" className="p-12 text-center">
                                <Package size={48} className="mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-xl font-semibold mb-2">No listings yet</h3>
                                <p className="text-muted-foreground mb-6">Start selling your unused items!</p>
                                <Link href="/sell">
                                    <Button variant="primary" icon={<PlusCircle size={18} />}>
                                        Create Listing
                                    </Button>
                                </Link>
                            </Card>
                        ) : (
                            listings.map((product) => (
                                <Card key={product._id} variant="glass" className="p-4">
                                    <div className="flex gap-4">
                                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                            <img
                                                src={product.images[0] || `https://placehold.co/80x80/1a1a3a/6366f1?text=${product.category}`}
                                                alt={product.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <h3 className="font-medium line-clamp-1">{product.title}</h3>
                                                    <p className="text-lg font-bold text-emerald-500">₹{product.price.toLocaleString()}</p>
                                                </div>
                                                <StatusBadge status={product.status} />
                                            </div>
                                            <div className="flex items-center gap-2 mt-3">
                                                <Link href={`/product/${product._id}`}>
                                                    <Button variant="ghost" size="sm" icon={<Eye size={16} />}>
                                                        View
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                )}

                {activeTab === "purchases" && (
                    <div className="space-y-4">
                        {purchases.length === 0 ? (
                            <Card variant="glass" className="p-12 text-center">
                                <ShoppingBag size={48} className="mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-xl font-semibold mb-2">No purchases yet</h3>
                                <p className="text-muted-foreground mb-6">Start shopping from your campus community!</p>
                                <Link href="/browse">
                                    <Button variant="primary">Browse Products</Button>
                                </Link>
                            </Card>
                        ) : (
                            purchases.map((order) => (
                                <Card key={order._id} variant="glass" className="p-4">
                                    <div className="flex gap-4">
                                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                            <img
                                                src={order.product.images?.[0] || "https://placehold.co/80x80/1a1a3a/6366f1"}
                                                alt={order.product.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <div>
                                                    <h3 className="font-medium line-clamp-1">{order.product.title}</h3>
                                                    <p className="text-sm text-muted-foreground">from {order.seller?.name}</p>
                                                </div>
                                                <StatusBadge status={order.orderStatus} />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="text-sm text-muted-foreground">
                                                    <span className="font-medium text-foreground">₹{order.amount.toLocaleString()}</span>
                                                    {" • "}
                                                    {order.deliveryLocation.name}
                                                </div>
                                                <div className="flex gap-2">
                                                    {order.orderStatus === "confirmed" && (
                                                        <Button
                                                            variant="primary"
                                                            size="sm"
                                                            icon={<CheckCircle size={16} />}
                                                            onClick={() => handleOrderAction(order._id, "delivered")}
                                                        >
                                                            Confirm Delivery
                                                        </Button>
                                                    )}
                                                    {(order.orderStatus === "placed" || order.orderStatus === "confirmed") && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            icon={<XCircle size={16} />}
                                                            onClick={() => handleOrderAction(order._id, "cancel")}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                )}

                {activeTab === "sales" && (
                    <div className="space-y-4">
                        {sales.length === 0 ? (
                            <Card variant="glass" className="p-12 text-center">
                                <DollarSign size={48} className="mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-xl font-semibold mb-2">No sales yet</h3>
                                <p className="text-muted-foreground mb-6">List your items to start selling!</p>
                                <Link href="/sell">
                                    <Button variant="primary" icon={<PlusCircle size={18} />}>
                                        Create Listing
                                    </Button>
                                </Link>
                            </Card>
                        ) : (
                            sales.map((order) => (
                                <Card key={order._id} variant="glass" className="p-4">
                                    <div className="flex gap-4">
                                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                            <img
                                                src={order.product.images?.[0] || "https://placehold.co/80x80/1a1a3a/6366f1"}
                                                alt={order.product.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <div>
                                                    <h3 className="font-medium line-clamp-1">{order.product.title}</h3>
                                                    <p className="text-sm text-muted-foreground">to {order.buyer?.name}</p>
                                                </div>
                                                <StatusBadge status={order.orderStatus} />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="text-sm text-muted-foreground">
                                                    <span className="font-medium text-foreground">₹{order.amount.toLocaleString()}</span>
                                                    {" • "}
                                                    {order.deliveryLocation.name}
                                                </div>
                                                <div className="flex gap-2">
                                                    {order.orderStatus === "placed" && (
                                                        <Button
                                                            variant="primary"
                                                            size="sm"
                                                            icon={<Truck size={16} />}
                                                            onClick={() => handleOrderAction(order._id, "confirm")}
                                                        >
                                                            Confirm Order
                                                        </Button>
                                                    )}
                                                    {order.orderStatus === "placed" && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            icon={<XCircle size={16} />}
                                                            onClick={() => handleOrderAction(order._id, "cancel")}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
