"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
    Search,
    BookOpen,
    ShieldCheck,
    User,
    ShoppingBag,
    MessageCircle,
    ArrowRight,
    HelpCircle
} from "lucide-react";
import Link from "next/link";

const categories = [
    {
        icon: ShoppingBag,
        title: "Buying",
        description: "Learn how to find items, place orders, and pick up on campus.",
        links: ["Finding items", "Using Escrow", "Delivery locations"]
    },
    {
        icon: BookOpen,
        title: "Selling",
        description: "Tips on listing your items, pricing, and getting paid fast.",
        links: ["Creating a listing", "Selling safely", "Managing orders"]
    },
    {
        icon: ShieldCheck,
        title: "Trust & Safety",
        description: "Our community guidelines and tips for staying safe.",
        links: ["Privacy", "Campus Safety", "Reporting issues"]
    },
    {
        icon: User,
        title: "Account",
        description: "Managing your profile, wallet, and college verification.",
        links: ["KYC/Verification", "Wallet recharge", "Profile settings"]
    }
];

const faqs = [
    {
        q: "How does the campus delivery work?",
        a: "When you buy an item, you choose a delivery location like the Library or Main Gate. Once the seller delivers it, you confirm in the app to release the payment."
    },
    {
        q: "Is my payment safe?",
        a: "Yes! CampusMarket uses an escrow system. Your money is held securely and only released to the seller after you confirm receipt of the item."
    },
    {
        q: "How do I list an item for sale?",
        a: "Click on the 'Sell' button in the navbar, upload photos, set a price, and choose your college. It takes less than 2 minutes!"
    }
];

export default function HelpCenterPage() {
    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4">
                    <h1 className="text-4xl font-bold mb-4">How can we help you?</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Find answers to common questions or browse categories to learn more about using CampusMarket.
                    </p>

                    {/* Search Bar */}
                    <div className="mt-8 max-w-xl mx-auto relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                        <input
                            type="text"
                            placeholder="Search for articles, guides..."
                            className="w-full bg-input border border-border rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all text-lg"
                        />
                    </div>
                </div>

                {/* Categories */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                    {categories.map((cat, idx) => (
                        <Card key={cat.title} variant="glass" className="p-6 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${idx * 100}ms` }}>
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                    <cat.icon className="text-primary" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">{cat.title}</h3>
                                    <p className="text-muted-foreground text-sm mb-4">{cat.description}</p>
                                    <ul className="space-y-2">
                                        {cat.links.map(link => (
                                            <li key={link}>
                                                <button className="text-primary hover:underline text-sm flex items-center gap-2 group">
                                                    {link}
                                                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* FAQs */}
                <div className="mb-16 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: "400ms" }}>
                    <div className="flex items-center gap-3 mb-8">
                        <HelpCircle className="text-primary" size={28} />
                        <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
                    </div>
                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <Card key={idx} variant="outline" className="p-6 hover:border-primary/50 transition-colors">
                                <h4 className="text-lg font-semibold mb-2">{faq.q}</h4>
                                <p className="text-muted-foreground">{faq.a}</p>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Contact CTA */}
                <Card variant="gradient" className="p-8 text-center animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: "500ms" }}>
                    <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
                    <p className="text-muted-foreground mb-6">Our support team is always ready to assist you with any issues.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/contact">
                            <Button variant="primary" size="lg" icon={<MessageCircle size={18} />}>
                                Contact Support
                            </Button>
                        </Link>
                        <Link href="/report">
                            <Button variant="outline" size="lg">
                                Report an Issue
                            </Button>
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
}
