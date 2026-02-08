"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { ShieldCheck, Eye, Lock, Database } from "lucide-react";

export default function PrivacyPage() {
    const sections = [
        {
            icon: Eye,
            title: "Data Visibility",
            content: "We only share your public profile information and college affiliation with other verified students. Your email and full contact details are kept private until a transaction is initiated."
        },
        {
            icon: Database,
            title: "Information Collection",
            content: "We collect information such as your name, college email, profile picture, and transaction history to provide and improve our services."
        },
        {
            icon: Lock,
            title: "Account Security",
            content: "Your data is encrypted and stored securely. We do not store full credit card details on our servers; all payments are processed through PCI-compliant gateways."
        },
        {
            icon: ShieldCheck,
            title: "Your Rights",
            content: "You have the right to access, update, or request deletion of your personal data at any time through your profile settings or by contacting our privacy officer."
        }
    ];

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                        <Lock className="text-primary" size={32} />
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
                    <p className="text-muted-foreground">Effective Date: February 8, 2026</p>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: "100ms" }}>
                    {sections.map((section, idx) => (
                        <Card key={idx} variant="glass" className="p-6">
                            <div className="flex gap-4 items-start">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                    <section.icon size={20} className="text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold mb-2">{section.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {section.content}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Detailed text */}
                <Card variant="outline" className="p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: "200ms" }}>
                    <div className="prose prose-invert max-w-none space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold mb-4">Cookies and Tracking</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                CampusMarket uses cookies to maintain your session and remember your preferences.
                                We also use anonymized analytics to understand how our community interacts with
                                the platform, allowing us to improve the experience for everyone.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">Third-Party Services</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We may use trusted third-party services for email delivery, error tracking,
                                and payment processing. These partners are strictly required to handle your
                                data according to our privacy standards.
                            </p>
                        </section>

                        <div className="pt-8 border-t border-border mt-8">
                            <h2 className="text-xl font-bold mb-4">Privacy Concerns?</h2>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                                Our Data Protection Officer is available to answer any questions:
                            </p>
                            <p className="text-primary font-bold">privacy@campusmarket.edu</p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
