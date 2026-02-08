"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import {
    Banknote,
    ShieldCheck,
    AlertCircle,
    CheckCircle2,
    XCircle
} from "lucide-react";

export default function RefundPage() {
    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                        <Banknote className="text-primary" size={32} />
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Refund & Escrow Policy</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Our escrow system is designed to protect both buyers and sellers.
                        Here is how refunds and disputes are handled.
                    </p>
                </div>

                {/* How it works */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    <Card variant="glass" className="p-8 border-emerald-500/20 bg-emerald-500/5">
                        <div className="flex items-center gap-3 mb-4">
                            <CheckCircle2 className="text-emerald-500" size={24} />
                            <h3 className="text-xl font-bold">Automatic Refunds</h3>
                        </div>
                        <ul className="space-y-4">
                            <li className="flex gap-3 text-sm text-muted-foreground">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                                <span>The seller cancels the order before delivery.</span>
                            </li>
                            <li className="flex gap-3 text-sm text-muted-foreground">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                                <span>The order is not marked as delivered within 72 hours.</span>
                            </li>
                            <li className="flex gap-3 text-sm text-muted-foreground">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                                <span>The buyer cancels the order before the seller accepts.</span>
                            </li>
                        </ul>
                    </Card>

                    <Card variant="glass" className="p-8 border-amber-500/20 bg-amber-500/5">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertCircle className="text-amber-500" size={24} />
                            <h3 className="text-xl font-bold">Dispute Resolution</h3>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                            If an item is not as described, you can raise a dispute
                            <strong> before </strong> confirming delivery.
                        </p>
                        <p className="text-xs text-muted-foreground italic">
                            Note: Once you confirm delivery, funds are released to the seller
                            and a refund through CampusMarket is no longer possible.
                        </p>
                    </Card>
                </div>

                {/* Process Steps */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold mb-8 text-center">Refund Process</h2>
                    <div className="relative space-y-8">
                        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border hidden sm:block" />

                        {[
                            {
                                title: "Initiate Request",
                                desc: "Go to your orders and select 'Raise Dispute' or 'Cancel Request'."
                            },
                            {
                                title: "Review Period",
                                desc: "Our support team or the seller reviews the request within 24 hours."
                            },
                            {
                                title: "Credit to Wallet",
                                desc: "Approved refunds are instantly credited back to your CampusMarket Wallet."
                            }
                        ].map((step, idx) => (
                            <div key={idx} className="relative flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold z-10 shrink-0 shadow-lg">
                                    {idx + 1}
                                </div>
                                <Card variant="outline" className="p-6 flex-1 w-full">
                                    <h4 className="font-bold mb-1">{step.title}</h4>
                                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Final Terms */}
                <Card variant="outline" className="p-6 border-destructive/20 bg-destructive/5 flex gap-4">
                    <XCircle className="text-destructive shrink-0" size={24} />
                    <div>
                        <h3 className="font-bold text-destructive mb-2">Non-Refundable Items</h3>
                        <p className="text-sm text-muted-foreground">
                            Services, digital goods, and successfully completed transactions
                            (confirmed by buyer) are strictly non-refundable through our platform.
                            Always inspect physical items carefully during pickup.
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
