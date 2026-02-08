"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
    ShieldCheck,
    MapPin,
    Users,
    AlertTriangle,
    Heart,
    Eye,
    CheckCircle,
    MessageCircle,
    Phone
} from "lucide-react";
import Link from "next/link";

const safetyTips = [
    {
        icon: MapPin,
        title: "Meet in Public Areas",
        description: "Always meet in well-lit, busy campus locations like the library, cafeteria, or near security booths.",
        color: "from-blue-500 to-indigo-500"
    },
    {
        icon: Users,
        title: "Bring a Friend",
        description: "If possible, bring a friend along when meeting a buyer or seller. There's safety in numbers.",
        color: "from-purple-500 to-violet-500"
    },
    {
        icon: Eye,
        title: "Inspect Before Paying",
        description: "Thoroughly check the item's condition and functionality before confirming the delivery in the app.",
        color: "from-emerald-500 to-teal-500"
    },
    {
        icon: AlertTriangle,
        title: "Avoid Cash Deals",
        description: "Use our secure escrow system. Never pay outside the app via external links or direct cash.",
        color: "from-amber-500 to-orange-500"
    }
];

export default function SafetyTipsPage() {
    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 mb-6 font-medium">
                        <ShieldCheck size={18} />
                        Your Safety is Our Priority
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold mb-6">Stay Safe on Campus</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        At CampusMarket, we want to ensure every transaction is safe and positive.
                        Follow these guidelines for a secure marketplace experience.
                    </p>
                </div>

                {/* Main Tips Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {safetyTips.map((tip, idx) => (
                        <Card
                            key={tip.title}
                            variant="glass"
                            className="p-8 hover-lift animate-in fade-in slide-in-from-bottom-4"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tip.color} flex items-center justify-center mb-6 glow`}>
                                <tip.icon className="text-white" size={28} />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">{tip.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {tip.description}
                            </p>
                        </Card>
                    ))}
                </div>

                {/* Reporting Section */}
                <Card variant="gradient" className="p-8 md:p-12 mb-16 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: "400ms" }}>
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="text-center md:text-left flex-1">
                            <h2 className="text-2xl sm:text-3xl font-bold mb-4">See something suspicious?</h2>
                            <p className="text-muted-foreground mb-6 text-lg">
                                If you encounter a fraudulent listing, suspicious user, or any harassment,
                                please report it immediately. We take these reports very seriously.
                            </p>
                            <Link href="/report">
                                <Button variant="primary" size="lg" className="font-bold">
                                    Report Incident
                                </Button>
                            </Link>
                        </div>
                        <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-destructive/10 flex items-center justify-center shrink-0 border-4 border-destructive/20">
                            <AlertTriangle size={64} className="text-destructive animate-pulse" />
                        </div>
                    </div>
                </Card>

                {/* Trust Indicators */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: "500ms" }}>
                    <div>
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle size={24} className="text-primary" />
                        </div>
                        <h4 className="font-bold mb-1">Campus Verified</h4>
                        <p className="text-sm text-muted-foreground">Only students from your college can trade with you.</p>
                    </div>
                    <div>
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShieldCheck size={24} className="text-primary" />
                        </div>
                        <h4 className="font-bold mb-1">Secure Escrow</h4>
                        <p className="text-sm text-muted-foreground">Funds are released only when you receive the item.</p>
                    </div>
                    <div>
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Heart size={24} className="text-primary" />
                        </div>
                        <h4 className="font-bold mb-1">Community Rating</h4>
                        <p className="text-sm text-muted-foreground">Transparent ratings and reviews for every user.</p>
                    </div>
                </div>

                {/* Help Links Footer */}
                <div className="mt-20 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6 animate-in fade-in">
                    <p className="text-muted-foreground">Need more information?</p>
                    <div className="flex gap-4">
                        <Link href="/help">
                            <Button variant="ghost" size="sm" icon={<MessageCircle size={16} />}>Help Center</Button>
                        </Link>
                        <Link href="/contact">
                            <Button variant="ghost" size="sm" icon={<Phone size={16} />}>Contact Us</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
