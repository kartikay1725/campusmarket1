"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";
import {
    Menu,
    X,
    Search,
    ShoppingBag,
    PlusCircle,
    User,
    LogOut,
    LayoutDashboard,
    Sun,
    Moon,
    Wallet
} from "lucide-react";

interface User {
    id: string;
    name: string;
    email: string;
    wallet?: number;
    profileImage?: string;
    college?: {
        name: string;
        shortCode: string;
    };
}

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isDark, setIsDark] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const pathname = usePathname();

    // Check scroll position
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Load user from localStorage
    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    // Theme toggle
    useEffect(() => {
        document.documentElement.classList.toggle("light", !isDark);
    }, [isDark]);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        window.location.href = "/";
    };

    const navLinks = [
        { href: "/browse", label: "Browse" },
        { href: "/categories", label: "Categories" },
        { href: "/how-it-works", label: "How it Works" },
    ];

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled
                    ? "bg-background/80 backdrop-blur-lg border-b border-border shadow-lg"
                    : "bg-transparent"
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/logo.svg"
                            alt="CampusMarket Logo"
                            width={40}
                            height={40}
                            className="object-contain rounded-xl"
                        />
                        <span className="text-xl font-bold gradient-text hidden sm:block">
                            CampusMarket
                        </span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-primary",
                                    pathname === link.href ? "text-primary" : "text-muted-foreground"
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Search (Desktop) */}
                    <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
                        <div className="relative w-full">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search for books, electronics, furniture..."
                                className="w-full bg-input border border-border rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                    </div>

                    {/* Right side actions */}
                    <div className="flex items-center gap-3">
                        {/* Theme toggle */}
                        <button
                            onClick={() => setIsDark(!isDark)}
                            className="p-2 rounded-lg hover:bg-muted transition-colors hidden sm:flex"
                        >
                            {isDark ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {user ? (
                            <>
                                {/* Sell button */}
                                <Link href="/sell">
                                    <Button variant="primary" size="sm" icon={<PlusCircle size={16} />} className="hidden sm:flex">
                                        Sell
                                    </Button>
                                </Link>

                                {/* Profile dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center gap-2 p-1.5 rounded-full hover:bg-muted transition-colors"
                                    >
                                        <Avatar src={user.profileImage} name={user.name} size="sm" />
                                    </button>

                                    {isProfileOpen && (
                                        <>
                                            <div
                                                className="fixed inset-0"
                                                onClick={() => setIsProfileOpen(false)}
                                            />
                                            <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-xl shadow-xl overflow-hidden animate-in slide-in-from-top-2">
                                                <div className="p-4 border-b border-border">
                                                    <p className="font-semibold">{user.name}</p>
                                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                                    {user.college && (
                                                        <span className="inline-block mt-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                                            {user.college.shortCode}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="p-2">
                                                    <Link
                                                        href="/dashboard"
                                                        className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors"
                                                    >
                                                        <LayoutDashboard size={18} />
                                                        Dashboard
                                                    </Link>
                                                    <Link
                                                        href="/profile"
                                                        className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors"
                                                    >
                                                        <User size={18} />
                                                        Profile
                                                    </Link>
                                                    <div className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg bg-gradient-to-r from-emerald-500/10 to-transparent">
                                                        <Wallet size={18} className="text-emerald-500" />
                                                        <span>Wallet:</span>
                                                        <span className="font-semibold text-emerald-500">
                                                            ₹{(user.wallet || 0).toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="p-2 border-t border-border">
                                                    <button
                                                        onClick={handleLogout}
                                                        className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-destructive/10 text-destructive w-full transition-colors"
                                                    >
                                                        <LogOut size={18} />
                                                        Logout
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link href="/login">
                                    <Button variant="ghost" size="sm">Login</Button>
                                </Link>
                                <Link href="/register">
                                    <Button variant="primary" size="sm">Get Started</Button>
                                </Link>
                            </div>
                        )}

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-lg hover:bg-muted transition-colors md:hidden"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Mobile menu drawer */}
            <div className={cn(
                "fixed top-0 right-0 bottom-0 w-[280px] bg-card border-l border-border z-50 md:hidden transition-transform duration-300 ease-in-out transform",
                isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
            )}>
                <div className="flex flex-col h-full">
                    {/* Drawer Header */}
                    <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
                        <span className="font-bold gradient-text">CampusMarket</span>
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="p-1 rounded-lg hover:bg-muted"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                        {/* User Profile info in drawer */}
                        {user ? (
                            <div className="bg-muted/50 rounded-xl p-4 border border-border">
                                <div className="flex items-center gap-3 mb-4">
                                    <Avatar src={user.profileImage} name={user.name} size="md" />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold truncate">{user.name}</p>
                                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="bg-background rounded-lg p-2 border border-border">
                                        <p className="text-[10px] text-muted-foreground uppercase">Wallet</p>
                                        <p className="text-sm font-bold text-emerald-500">₹{(user.wallet || 0).toLocaleString()}</p>
                                    </div>
                                    <div className="bg-background rounded-lg p-2 border border-border">
                                        <p className="text-[10px] text-muted-foreground uppercase">College</p>
                                        <p className="text-sm font-bold text-primary truncate">{user.college?.shortCode || "N/A"}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button variant="outline" className="w-full">Login</Button>
                                </Link>
                                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button variant="primary" className="w-full">Get Started</Button>
                                </Link>
                            </div>
                        )}

                        {/* Navigation Section */}
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase px-3 mb-2">Navigation</p>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                        pathname === link.href
                                            ? "bg-primary/10 text-primary"
                                            : "hover:bg-muted"
                                    )}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.label === "Browse" && <ShoppingBag size={18} />}
                                    {link.label === "Categories" && <LayoutDashboard size={18} />}
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* Account Section */}
                        {user && (
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase px-3 mb-2">Account</p>
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <LayoutDashboard size={18} />
                                    Dashboard
                                </Link>
                                <Link
                                    href="/profile"
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <User size={18} />
                                    Profile
                                </Link>
                                <Link
                                    href="/sell"
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <PlusCircle size={18} />
                                    Sell Item
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Drawer Footer */}
                    <div className="p-4 border-t border-border">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs text-muted-foreground">Dark mode</span>
                            <button
                                onClick={() => setIsDark(!isDark)}
                                className="p-2 rounded-lg bg-muted transition-colors"
                            >
                                {isDark ? <Sun size={18} /> : <Moon size={18} />}
                            </button>
                        </div>
                        {user && (
                            <button
                                onClick={handleLogout}
                                className="flex items-center justify-center gap-3 px-3 py-3 rounded-lg bg-destructive/10 text-destructive text-sm font-bold w-full hover:bg-destructive/20 transition-colors"
                            >
                                <LogOut size={18} />
                                Logout
                            </button>
                        )}
                    </div>
                </div>
            </div>

        </nav>
    );
}
