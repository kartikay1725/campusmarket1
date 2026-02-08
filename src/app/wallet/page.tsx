"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import {
    ArrowLeft,
    Wallet,
    ArrowDownCircle,
    Clock,
    CheckCircle,
    XCircle,
    Banknote,
    CreditCard,
    AlertCircle
} from "lucide-react";

interface Withdrawal {
    _id: string;
    amount: number;
    status: "pending" | "processing" | "completed" | "rejected";
    upiId?: string;
    bankAccount?: {
        accountNumber: string;
        ifscCode: string;
        accountHolderName: string;
    };
    rejectionReason?: string;
    createdAt: string;
    processedAt?: string;
}

export default function WalletPage() {
    const router = useRouter();
    const [balance, setBalance] = useState(0);
    const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
    const [loading, setLoading] = useState(true);
    const [showWithdrawForm, setShowWithdrawForm] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const [paymentMethod, setPaymentMethod] = useState<"upi" | "bank">("upi");
    const [formData, setFormData] = useState({
        amount: "",
        upiId: "",
        accountNumber: "",
        ifscCode: "",
        accountHolderName: "",
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login?redirect=/wallet");
            return;
        }
        fetchData();
    }, [router]);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");

            // Fetch profile for balance
            const profileRes = await fetch("/api/user/profile", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const profileData = await profileRes.json();
            if (profileData.user) {
                setBalance(profileData.user.wallet || 0);
            }

            // Fetch withdrawals
            const withdrawRes = await fetch("/api/wallet/withdraw", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const withdrawData = await withdrawRes.json();
            if (withdrawData.withdrawals) {
                setWithdrawals(withdrawData.withdrawals);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setError("");
        setSuccess("");

        try {
            const token = localStorage.getItem("token");
            const body: Record<string, unknown> = {
                amount: parseFloat(formData.amount),
            };

            if (paymentMethod === "upi") {
                body.upiId = formData.upiId;
            } else {
                body.bankAccount = {
                    accountNumber: formData.accountNumber,
                    ifscCode: formData.ifscCode,
                    accountHolderName: formData.accountHolderName,
                };
            }

            const res = await fetch("/api/wallet/withdraw", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to process withdrawal");
            }

            setSuccess(data.message);
            setBalance(data.newBalance);
            setShowWithdrawForm(false);
            setFormData({
                amount: "",
                upiId: "",
                accountNumber: "",
                ifscCode: "",
                accountHolderName: "",
            });
            fetchData();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to process withdrawal");
        } finally {
            setProcessing(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "pending":
                return <Clock size={16} className="text-amber-500" />;
            case "processing":
                return <Clock size={16} className="text-blue-500" />;
            case "completed":
                return <CheckCircle size={16} className="text-emerald-500" />;
            case "rejected":
                return <XCircle size={16} className="text-red-500" />;
            default:
                return null;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "text-amber-400 bg-amber-500/10";
            case "processing":
                return "text-blue-400 bg-blue-500/10";
            case "completed":
                return "text-emerald-400 bg-emerald-500/10";
            case "rejected":
                return "text-red-400 bg-red-500/10";
            default:
                return "";
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

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
                    <h1 className="text-2xl font-bold">Wallet</h1>
                </div>

                {/* Success/Error messages */}
                {success && (
                    <div className="mb-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
                        <CheckCircle size={20} className="text-emerald-500" />
                        <span className="text-emerald-400">{success}</span>
                    </div>
                )}
                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
                        {error}
                    </div>
                )}

                {/* Balance Card */}
                <Card variant="gradient" className="p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                <Wallet size={28} className="text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Available Balance</p>
                                <p className="text-3xl font-bold text-emerald-500">
                                    ₹{balance.toLocaleString()}
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="primary"
                            icon={<ArrowDownCircle size={18} />}
                            onClick={() => setShowWithdrawForm(!showWithdrawForm)}
                            disabled={balance < 100}
                        >
                            Withdraw
                        </Button>
                    </div>
                    {balance < 100 && (
                        <p className="text-xs text-muted-foreground mt-4 flex items-center gap-2">
                            <AlertCircle size={14} />
                            Minimum withdrawal amount is ₹100
                        </p>
                    )}
                </Card>

                {/* Withdraw Form */}
                {showWithdrawForm && (
                    <Card variant="glass" className="p-6 mb-6">
                        <h2 className="font-semibold mb-4">Withdraw Funds</h2>

                        <form onSubmit={handleWithdraw} className="space-y-4">
                            <Input
                                label="Amount (₹)"
                                name="amount"
                                type="number"
                                value={formData.amount}
                                onChange={handleChange}
                                placeholder="Enter amount"
                                min={100}
                                max={balance}
                                required
                            />

                            {/* Payment Method Toggle */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Payment Method</label>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod("upi")}
                                        className={`flex-1 p-3 rounded-lg border flex items-center justify-center gap-2 transition-colors ${paymentMethod === "upi"
                                            ? "border-primary bg-primary/10 text-primary"
                                            : "border-border hover:border-muted-foreground"
                                            }`}
                                    >
                                        <CreditCard size={18} />
                                        UPI
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod("bank")}
                                        className={`flex-1 p-3 rounded-lg border flex items-center justify-center gap-2 transition-colors ${paymentMethod === "bank"
                                            ? "border-primary bg-primary/10 text-primary"
                                            : "border-border hover:border-muted-foreground"
                                            }`}
                                    >
                                        <Banknote size={18} />
                                        Bank Account
                                    </button>
                                </div>
                            </div>

                            {paymentMethod === "upi" ? (
                                <Input
                                    label="UPI ID"
                                    name="upiId"
                                    type="text"
                                    value={formData.upiId}
                                    onChange={handleChange}
                                    placeholder="yourname@upi"
                                    required
                                />
                            ) : (
                                <>
                                    <Input
                                        label="Account Holder Name"
                                        name="accountHolderName"
                                        value={formData.accountHolderName}
                                        onChange={handleChange}
                                        placeholder="As per bank records"
                                        required
                                    />
                                    <Input
                                        label="Account Number"
                                        name="accountNumber"
                                        value={formData.accountNumber}
                                        onChange={handleChange}
                                        placeholder="Enter account number"
                                        required
                                    />
                                    <Input
                                        label="IFSC Code"
                                        name="ifscCode"
                                        value={formData.ifscCode}
                                        onChange={handleChange}
                                        placeholder="e.g., SBIN0001234"
                                        required
                                    />
                                </>
                            )}

                            <div className="flex gap-3 pt-2">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    loading={processing}
                                    className="flex-1"
                                >
                                    Request Withdrawal
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowWithdrawForm(false)}
                                >
                                    Cancel
                                </Button>
                            </div>

                            <p className="text-xs text-muted-foreground text-center">
                                Withdrawals are processed within 24-48 hours
                            </p>
                        </form>
                    </Card>
                )}

                {/* Withdrawal History */}
                <Card variant="glass" className="p-6">
                    <h2 className="font-semibold mb-4">Withdrawal History</h2>

                    {withdrawals.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <ArrowDownCircle size={40} className="mx-auto mb-3 opacity-50" />
                            <p>No withdrawals yet</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {withdrawals.map((w) => (
                                <div
                                    key={w._id}
                                    className="flex items-center justify-between p-4 rounded-lg bg-muted/30"
                                >
                                    <div className="flex items-center gap-3">
                                        {getStatusIcon(w.status)}
                                        <div>
                                            <p className="font-medium">₹{w.amount.toLocaleString()}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {w.upiId || w.bankAccount?.accountNumber?.slice(-4).padStart(w.bankAccount.accountNumber.length, '*')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span
                                            className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusColor(w.status)}`}
                                        >
                                            {w.status}
                                        </span>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {new Date(w.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                {/* Quick Links */}
                <div className="mt-8 flex gap-4 justify-center">
                    <Link href="/profile">
                        <Button variant="outline">Profile</Button>
                    </Link>
                    <Link href="/dashboard">
                        <Button variant="outline">Dashboard</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
