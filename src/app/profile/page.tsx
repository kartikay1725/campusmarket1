"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { OTPModal } from "@/components/ui/OTPModal";
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    GraduationCap,
    Edit3,
    Save,
    X,
    Shield,
    CheckCircle,
    Wallet
} from "lucide-react";

interface UserProfile {
    id: string;
    name: string;
    email: string;
    phone?: string;
    bio?: string;
    profileImage?: string;
    college?: {
        _id: string;
        name: string;
        shortCode: string;
    };
    wallet: number;
    createdAt: string;
}

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    // OTP state
    const [showOTPModal, setShowOTPModal] = useState(false);
    const [otpPurpose, setOtpPurpose] = useState<"profile_update" | "email_change">("profile_update");
    const [otpEmail, setOtpEmail] = useState("");
    const [otpError, setOtpError] = useState("");
    const [otpLoading, setOtpLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        bio: "",
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login?redirect=/profile");
            return;
        }
        fetchProfile();
    }, [router]);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/user/profile", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                throw new Error("Failed to fetch profile");
            }

            const data = await res.json();
            setUser(data.user);
            setFormData({
                name: data.user.name || "",
                email: data.user.email || "",
                phone: data.user.phone || "",
                bio: data.user.bio || "",
            });
        } catch (error) {
            console.error("Error fetching profile:", error);
            router.push("/login");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Check if email is being changed
    const isEmailChanging = user && formData.email.toLowerCase() !== user.email.toLowerCase();

    // Send OTP and show modal
    const handleSave = async () => {
        setSaving(true);
        setError("");

        try {
            const token = localStorage.getItem("token");

            // Determine purpose and target email
            const purpose = isEmailChanging ? "email_change" : "profile_update";
            const targetEmail = isEmailChanging ? formData.email : user?.email;

            // Send OTP
            const res = await fetch("/api/otp/send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    purpose,
                    email: isEmailChanging ? formData.email : undefined
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to send OTP");
            }

            // Show OTP modal
            setOtpPurpose(purpose);
            setOtpEmail(data.email || targetEmail || "");
            setOtpError("");
            setShowOTPModal(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to send OTP");
        } finally {
            setSaving(false);
        }
    };

    // Verify OTP and update profile
    const handleVerifyOTP = async (otp: string) => {
        setOtpLoading(true);
        setOtpError("");

        try {
            const token = localStorage.getItem("token");

            const body: Record<string, unknown> = {
                otp,
                purpose: otpPurpose,
            };

            if (otpPurpose === "email_change") {
                body.email = formData.email;
            } else {
                body.profileData = {
                    name: formData.name,
                    phone: formData.phone,
                    bio: formData.bio,
                };
            }

            const res = await fetch("/api/otp/verify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to verify OTP");
            }

            // Success!
            setShowOTPModal(false);
            setEditing(false);
            setSuccess(true);

            // Refresh profile
            await fetchProfile();

            // Update local storage
            if (data.user) {
                const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
                localStorage.setItem("user", JSON.stringify({
                    ...storedUser,
                    name: data.user.name,
                    email: data.user.email,
                }));
            }

            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setOtpError(err instanceof Error ? err.message : "Failed to verify");
        } finally {
            setOtpLoading(false);
        }
    };

    // Resend OTP
    const handleResendOTP = async () => {
        const token = localStorage.getItem("token");

        const res = await fetch("/api/otp/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                purpose: otpPurpose,
                email: otpPurpose === "email_change" ? formData.email : undefined,
            }),
        });

        const data = await res.json();
        if (!res.ok) {
            setOtpError(data.error || "Failed to resend OTP");
        }
    };

    const handleCancel = () => {
        setEditing(false);
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                bio: user.bio || "",
            });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!user) return null;

    const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-2xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => router.back()}
                        className="p-2 rounded-full hover:bg-muted transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-bold">Profile</h1>
                </div>

                {/* Success message */}
                {success && (
                    <div className="mb-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
                        <CheckCircle size={20} className="text-emerald-500" />
                        <span className="text-emerald-400">Profile updated successfully!</span>
                    </div>
                )}

                {/* Error message */}
                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
                        {error}
                    </div>
                )}

                {/* Profile Card */}
                <Card variant="glass" className="p-6 mb-6">
                    {/* Avatar and basic info */}
                    <div className="flex items-start gap-6 mb-6">
                        <Avatar
                            src={user.profileImage}
                            name={user.name}
                            size="xl"
                        />
                        <div className="flex-1">
                            <h2 className="text-xl font-bold">{user.name}</h2>
                            <p className="text-muted-foreground">{user.email}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Member since {memberSince}
                            </p>
                        </div>
                        {!editing && (
                            <Button
                                variant="outline"
                                size="sm"
                                icon={<Edit3 size={16} />}
                                onClick={() => setEditing(true)}
                            >
                                Edit
                            </Button>
                        )}
                    </div>

                    {/* Editable fields */}
                    <div className="space-y-4">
                        {editing ? (
                            <>
                                <Input
                                    label="Full Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    icon={<User size={18} />}
                                    required
                                />

                                <Input
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    icon={<Mail size={18} />}
                                    required
                                />

                                <Input
                                    label="Phone Number"
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    icon={<Phone size={18} />}
                                    placeholder="+91 9876543210"
                                />

                                <div>
                                    <label className="block text-sm font-medium mb-2">Bio</label>
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        className="w-full bg-input border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary min-h-[100px] resize-none"
                                        placeholder="Tell others about yourself..."
                                        maxLength={500}
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {formData.bio.length}/500 characters
                                    </p>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button
                                        variant="primary"
                                        icon={<Save size={18} />}
                                        onClick={handleSave}
                                        loading={saving}
                                    >
                                        Save Changes
                                    </Button>
                                    <Button
                                        variant="outline"
                                        icon={<X size={18} />}
                                        onClick={handleCancel}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                                    <Mail size={18} className="text-muted-foreground" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Email</p>
                                        <p>{user.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                                    <Phone size={18} className="text-muted-foreground" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Phone</p>
                                        <p>{user.phone || "Not set"}</p>
                                    </div>
                                </div>

                                {user.college && (
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                                        <GraduationCap size={18} className="text-muted-foreground" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">College</p>
                                            <p>{user.college.name} ({user.college.shortCode})</p>
                                        </div>
                                    </div>
                                )}

                                {user.bio && (
                                    <div className="p-3 rounded-lg bg-muted/30">
                                        <p className="text-xs text-muted-foreground mb-1">Bio</p>
                                        <p className="text-sm">{user.bio}</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </Card>

                {/* Wallet Card */}
                <Link href="/wallet">
                    <Card variant="gradient" className="p-6 mb-6 cursor-pointer hover:scale-[1.02] transition-transform">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                    <Wallet size={24} className="text-emerald-500" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Wallet Balance</p>
                                    <p className="text-2xl font-bold text-emerald-500">
                                        ₹{user.wallet?.toLocaleString() || "0"}
                                    </p>
                                </div>
                            </div>
                            <ArrowLeft size={20} className="rotate-180 text-muted-foreground" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-4">
                            Tap to manage your wallet and request withdrawals
                        </p>
                    </Card>
                </Link>

                {/* Security Card */}
                <Card variant="glass" className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Shield size={20} className="text-primary" />
                        <h3 className="font-semibold">Account Security</h3>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                            <span className="text-sm">Password</span>
                            <Button variant="outline" size="sm" disabled>
                                Change Password
                            </Button>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                            <span className="text-sm">Two-Factor Auth</span>
                            <span className="text-xs text-muted-foreground">Coming soon</span>
                        </div>
                    </div>
                </Card>

                {/* Quick Links */}
                <div className="mt-8 flex gap-4 justify-center">
                    <Link href="/dashboard">
                        <Button variant="outline">Dashboard</Button>
                    </Link>
                    <Link href="/sell">
                        <Button variant="primary">Sell Something</Button>
                    </Link>
                </div>
            </div>

            {/* OTP Verification Modal */}
            <OTPModal
                isOpen={showOTPModal}
                onClose={() => setShowOTPModal(false)}
                onVerify={handleVerifyOTP}
                onResend={handleResendOTP}
                email={otpEmail}
                purpose={otpPurpose}
                loading={otpLoading}
                error={otpError}
            />
        </div>
    );
}
