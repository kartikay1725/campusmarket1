"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
    UserPlus,
    Camera,
    Search,
    ShoppingCart,
    Shield,
    Package,
    CheckCircle,
    Wallet,
    ArrowRight,
    Sparkles
} from "lucide-react";

const buyerSteps = [
    {
        step: 1,
        title: "Create Your Account",
        description: "Sign up with your college email and verify your student status",
        icon: UserPlus,
        color: "from-blue-500 to-cyan-500"
    },
    {
        step: 2,
        title: "Browse & Search",
        description: "Explore products from students at your campus or filter by category",
        icon: Search,
        color: "from-violet-500 to-purple-500"
    },
    {
        step: 3,
        title: "Secure Checkout",
        description: "Pay securely - your money is held in escrow until delivery",
        icon: ShoppingCart,
        color: "from-emerald-500 to-teal-500"
    },
    {
        step: 4,
        title: "Meet & Receive",
        description: "Meet the seller at your chosen campus location and confirm delivery",
        icon: CheckCircle,
        color: "from-amber-500 to-orange-500"
    }
];

const sellerSteps = [
    {
        step: 1,
        title: "List Your Item",
        description: "Take photos, add description, set your price, and publish",
        icon: Camera,
        color: "from-pink-500 to-rose-500"
    },
    {
        step: 2,
        title: "Get Notified",
        description: "Receive instant notifications when someone places an order",
        icon: Sparkles,
        color: "from-indigo-500 to-blue-500"
    },
    {
        step: 3,
        title: "Deliver the Item",
        description: "Meet the buyer at the agreed campus location",
        icon: Package,
        color: "from-teal-500 to-cyan-500"
    },
    {
        step: 4,
        title: "Get Paid",
        description: "Money is released to your wallet once buyer confirms receipt",
        icon: Wallet,
        color: "from-emerald-500 to-green-500"
    }
];

const features = [
    {
        title: "Secure Escrow",
        description: "Money is held safely until delivery is confirmed by the buyer",
        icon: Shield
    },
    {
        title: "Campus Only",
        description: "Trade exclusively with verified students from your college",
        icon: UserPlus
    },
    {
        title: "No COD Hassles",
        description: "All transactions are prepaid - no awkward cash exchanges",
        icon: Wallet
    }
];

export default function HowItWorksPage() {
    return (
        <div className="min-h-screen py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                        How <span className="gradient-text">CampusMarket</span> Works
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        A safe and simple way to buy and sell within your campus community.
                        No strangers, no scams, just students helping students.
                    </p>
                </div>

                {/* For Buyers */}
                <section className="mb-20">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                            <ShoppingCart size={20} className="text-white" />
                        </div>
                        <h2 className="text-2xl font-bold">For Buyers</h2>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {buyerSteps.map((item, index) => (
                            <div
                                key={item.step}
                                className="relative fade-in-up"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Connector line */}
                                {index < buyerSteps.length - 1 && (
                                    <div className="hidden lg:block absolute top-10 left-[60%] w-[calc(100%-20px)] h-0.5 bg-gradient-to-r from-border to-transparent" />
                                )}

                                <Card variant="glass" className="p-6 h-full">
                                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4`}>
                                        <item.icon size={24} className="text-white" />
                                    </div>
                                    <div className="text-xs font-bold text-primary mb-2">STEP {item.step}</div>
                                    <h3 className="font-semibold mb-2">{item.title}</h3>
                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                </Card>
                            </div>
                        ))}
                    </div>
                </section>

                {/* For Sellers */}
                <section className="mb-20">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                            <Camera size={20} className="text-white" />
                        </div>
                        <h2 className="text-2xl font-bold">For Sellers</h2>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {sellerSteps.map((item, index) => (
                            <div
                                key={item.step}
                                className="relative fade-in-up"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Connector line */}
                                {index < sellerSteps.length - 1 && (
                                    <div className="hidden lg:block absolute top-10 left-[60%] w-[calc(100%-20px)] h-0.5 bg-gradient-to-r from-border to-transparent" />
                                )}

                                <Card variant="glass" className="p-6 h-full">
                                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4`}>
                                        <item.icon size={24} className="text-white" />
                                    </div>
                                    <div className="text-xs font-bold text-primary mb-2">STEP {item.step}</div>
                                    <h3 className="font-semibold mb-2">{item.title}</h3>
                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                </Card>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Trust Features */}
                <section className="mb-20">
                    <h2 className="text-2xl font-bold text-center mb-8">Why CampusMarket?</h2>
                    <div className="grid sm:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <Card
                                key={feature.title}
                                variant="gradient"
                                className="p-6 text-center fade-in-up"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="w-14 h-14 mx-auto rounded-2xl bg-white/10 flex items-center justify-center mb-4">
                                    <feature.icon size={28} className="text-primary" />
                                </div>
                                <h3 className="font-semibold mb-2">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground">{feature.description}</p>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="text-center">
                    <Card variant="glass" className="p-8 sm:p-12 glow">
                        <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
                        <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                            Join thousands of students already using CampusMarket to buy and sell within their campus.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/register">
                                <Button variant="accent" size="lg" icon={<Sparkles size={18} />}>
                                    Create Account
                                </Button>
                            </Link>
                            <Link href="/browse">
                                <Button variant="outline" size="lg" icon={<ArrowRight size={18} />}>
                                    Start Browsing
                                </Button>
                            </Link>
                        </div>
                    </Card>
                </section>
            </div>
        </div>
    );
}
