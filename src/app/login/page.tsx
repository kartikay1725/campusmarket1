"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Mail, Lock, ShoppingBag } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Login failed");
            }

            localStorage.setItem("token", data.access);
            localStorage.setItem("refreshToken", data.refresh);
            localStorage.setItem("user", JSON.stringify(data.user));

            router.push("/dashboard");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
            {/* Background decoration */}
            <div className="absolute inset-0 hero-gradient pointer-events-none" />
            <div className="floating-shape w-96 h-96 bg-indigo-500/20 top-20 -left-48" />
            <div className="floating-shape w-64 h-64 bg-rose-500/20 bottom-20 right-20" style={{ animationDelay: "-3s" }} />

            <Card variant="glass" className="relative w-full max-w-md p-8">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center mb-4">
                        <ShoppingBag size={32} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold">Welcome Back</h1>
                    <p className="text-muted-foreground mt-1">Sign in to your account</p>
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
                        label="Email"
                        type="email"
                        placeholder="you@college.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        icon={<Mail size={18} />}
                        required
                    />

                    <Input
                        label="Password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        icon={<Lock size={18} />}
                        required
                    />

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="rounded border-border" />
                            <span className="text-muted-foreground">Remember me</span>
                        </label>
                        <Link href="/forgot-password" className="text-primary hover:underline">
                            Forgot password?
                        </Link>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full"
                        loading={loading}
                    >
                        Sign In
                    </Button>
                </form>

                {/* Register link */}
                <p className="text-center text-muted-foreground mt-6">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="text-primary font-medium hover:underline">
                        Sign up
                    </Link>
                </p>
            </Card>
        </div>
    );
}
