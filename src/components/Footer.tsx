"use client";

import React from "react";
import Link from "next/link";
import { ShoppingBag, Github, Twitter, Mail, Heart } from "lucide-react";

const footerLinks = {
    marketplace: [
        { label: "Browse Products", href: "/browse" },
        { label: "Sell Items", href: "/sell" },
        { label: "Categories", href: "/categories" },
        { label: "How it Works", href: "/how-it-works" },
    ],
    support: [
        { label: "Help Center", href: "/help" },
        { label: "Safety Tips", href: "/safety" },
        { label: "Contact Us", href: "/contact" },
        { label: "Report Issue", href: "/report" },
    ],
    legal: [
        { label: "Terms of Service", href: "/terms" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Refund Policy", href: "/refunds" },
    ],
};

export function Footer() {
    return (
        <footer className="border-t border-border bg-card/30 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <img
                                src="/logo.svg"
                                alt="CampusMarket Logo"
                                className="w-10 h-10 object-contain rounded-xl"
                            />
                            <span className="text-lg font-bold gradient-text">CampusMarket</span>
                        </Link>
                        <p className="text-sm text-muted-foreground mb-4">
                            The trusted marketplace for students to buy and sell within their campus community.
                        </p>
                        <div className="flex items-center gap-3">
                            <a href="#" className="p-2 rounded-lg hover:bg-muted transition-colors">
                                <Twitter size={18} className="text-muted-foreground hover:text-primary" />
                            </a>
                            <a href="#" className="p-2 rounded-lg hover:bg-muted transition-colors">
                                <Github size={18} className="text-muted-foreground hover:text-primary" />
                            </a>
                            <a href="#" className="p-2 rounded-lg hover:bg-muted transition-colors">
                                <Mail size={18} className="text-muted-foreground hover:text-primary" />
                            </a>
                        </div>
                    </div>

                    {/* Marketplace links */}
                    <div>
                        <h3 className="font-semibold mb-4">Marketplace</h3>
                        <ul className="space-y-2">
                            {footerLinks.marketplace.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support links */}
                    <div>
                        <h3 className="font-semibold mb-4">Support</h3>
                        <ul className="space-y-2">
                            {footerLinks.support.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal links */}
                    <div>
                        <h3 className="font-semibold mb-4">Legal</h3>
                        <ul className="space-y-2">
                            {footerLinks.legal.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} CampusMarket. All rights reserved.
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                        Made with <Heart size={14} className="text-rose-500" fill="currentColor" /> for students
                    </p>
                </div>
            </div>
        </footer>
    );
}
