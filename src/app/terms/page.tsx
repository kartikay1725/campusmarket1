"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { FileText, Shield, Clock, Users } from "lucide-react";

export default function TermsPage() {
    const sections = [
        {
            title: "1. Acceptance of Terms",
            content: "By accessing and using CampusMarket, you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not use the application."
        },
        {
            title: "2. Eligibility",
            content: "CampusMarket is exclusively for students, faculty, and staff of registered colleges. A valid college email address or identification is required for account verification."
        },
        {
            title: "3. User Accounts",
            content: "You are responsible for maintaining the confidentiality of your account credentials. All activities under your account are your responsibility."
        },
        {
            title: "4. Escrow & Payments",
            content: "Payments made through the platform are held in escrow. Funds are only released to the seller upon confirmation of delivery by the buyer. Fees may apply for specific services."
        },
        {
            title: "5. Prohibited Items",
            content: "Users are prohibited from listing illegal goods, weapons, drugs, or items that violate campus policies. We reserve the right to remove any listing and suspend accounts."
        },
        {
            title: "6. User Conduct",
            content: "Users must interact respectfully. Harassment, fraud, or attempts to bypass the platform's payment system are grounds for permanent suspension."
        }
    ];

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-card/10">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                        <FileText className="text-primary" size={32} />
                    </div>
                    <h1 className="text-4xl font-bold mb-4 font-outfit">Terms of Service</h1>
                    <p className="text-muted-foreground">Last Updated: February 8, 2026</p>
                </div>

                {/* Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: "100ms" }}>
                    <Card variant="outline" className="p-4 flex items-center gap-3">
                        <Shield className="text-primary" size={20} />
                        <span className="text-sm font-medium">Secure Trading</span>
                    </Card>
                    <Card variant="outline" className="p-4 flex items-center gap-3">
                        <Clock className="text-primary" size={20} />
                        <span className="text-sm font-medium">Fast Payouts</span>
                    </Card>
                    <Card variant="outline" className="p-4 flex items-center gap-3">
                        <Users className="text-primary" size={20} />
                        <span className="text-sm font-medium">Campus Verified</span>
                    </Card>
                </div>

                {/* Content */}
                <Card variant="glass" className="p-8 md:p-12 prose prose-invert max-w-none animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: "200ms" }}>
                    <div className="space-y-8">
                        {sections.map(section => (
                            <div key={section.title}>
                                <h2 className="text-2xl font-bold mb-4 text-foreground">{section.title}</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    {section.content}
                                </p>
                            </div>
                        ))}

                        <div className="pt-8 border-t border-border">
                            <h2 className="text-2xl font-bold mb-4 text-foreground">7. Contact Us</h2>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                                If you have any questions about these Terms, please contact our legal team:
                            </p>
                            <div className="bg-muted/50 rounded-xl p-4 inline-block">
                                <p className="text-sm font-medium text-primary">legal@campusmarket.edu</p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Simple Footer */}
                <div className="mt-12 text-center text-sm text-muted-foreground">
                    <p>© 2026 CampusMarket Tech Solutions. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}
