"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import { Mail, Lock, User, Phone, ShoppingBag, GraduationCap } from "lucide-react";

interface College {
    _id: string;
    name: string;
    shortCode: string;
}

export default function RegisterPage() {
    const router = useRouter();
    const [colleges, setColleges] = useState<College[]>([]);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        college: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("/api/colleges")
            .then((res) => res.json())
            .then((data) => setColleges(data.colleges || []))
            .catch(console.error);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    phone: formData.phone,
                    college: formData.college || undefined,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Registration failed");
            }

            localStorage.setItem("token", data.access);
            localStorage.setItem("refreshToken", data.refresh);
            localStorage.setItem("user", JSON.stringify(data.user));

            router.push("/dashboard");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
            {/* Background decoration */}
            <div className="absolute inset-0 hero-gradient pointer-events-none" />
            <div className="floating-shape w-96 h-96 bg-violet-500/20 top-20 -right-48" />
            <div className="floating-shape w-64 h-64 bg-indigo-500/20 bottom-20 left-20" style={{ animationDelay: "-3s" }} />

            <Card variant="glass" className="relative w-full max-w-md p-8">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center mb-4">
                        <ShoppingBag size={32} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold">Create Account</h1>
                    <p className="text-muted-foreground mt-1">Join your campus community</p>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Full Name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        icon={<User size={18} />}
                        required
                    />

                    <Input
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="you@college.edu"
                        value={formData.email}
                        onChange={handleChange}
                        icon={<Mail size={18} />}
                        required
                    />

                    <Input
                        label="Phone Number"
                        name="phone"
                        type="tel"
                        placeholder="+91 9876543210"
                        value={formData.phone}
                        onChange={handleChange}
                        icon={<Phone size={18} />}
                        required
                    />

                    <Select
                        label="College"
                        name="college"
                        value={formData.college}
                        onChange={handleChange}
                        options={[
                            { value: "", label: "Select your college" },
                            ...colleges.map(c => ({ value: c._id, label: `${c.name} (${c.shortCode})` }))
                        ]}
                    />

                    <Input
                        label="Password"
                        name="password"
                        type="password"
                        placeholder="At least 6 characters"
                        value={formData.password}
                        onChange={handleChange}
                        icon={<Lock size={18} />}
                        required
                    />

                    <Input
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        icon={<Lock size={18} />}
                        required
                    />

                    <div className="flex items-start gap-2 text-sm">
                        <input type="checkbox" id="terms" className="mt-1 rounded border-border" required />
                        <label htmlFor="terms" className="text-muted-foreground">
                            I agree to the{" "}
                            <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
                            {" "}and{" "}
                            <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                        </label>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full"
                        loading={loading}
                    >
                        Create Account
                    </Button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-4 my-6">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-muted-foreground text-sm">or</span>
                    <div className="flex-1 h-px bg-border" />
                </div>

                {/* Social login */}
                <Button variant="outline" className="w-full">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                </Button>

                {/* Login link */}
                <p className="text-center text-muted-foreground mt-6">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary font-medium hover:underline">
                        Sign in
                    </Link>
                </p>
            </Card>
        </div>
    );
}
