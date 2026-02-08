"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Wallet,
    Users,
    ShoppingBag,
    TrendingUp,
    CheckCircle,
    XCircle,
    Clock,
    ExternalLink,
    Copy,
    AlertTriangle
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
    user: {
        _id: string;
        name: string;
        email: string;
    };
    createdAt: string;
    transactionId?: string;
}

interface Stats {
    pendingWithdrawals: number;
    completedOrders: number;
    totalUsers: number;
    platformEarnings: number;
}

export default function AdminPanel() {
    const router = useRouter();
    const [stats, setStats] = useState<Stats | null>(null);
    const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [processing, setProcessing] = useState<string | null>(null);
    const [copied, setCopied] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }
        fetchData();
    }, [router]);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/admin/dashboard", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.status === 403) {
                setError("Access denied. Admin privileges required.");
                setLoading(false);
                return;
            }

            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }

            setStats(data.stats);
            setWithdrawals(data.withdrawals);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, status: string, transactionId?: string) => {
        setProcessing(id);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/admin/withdrawals/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status, transactionId }),
            });

            if (!res.ok) {
                throw new Error("Failed to update");
            }

            fetchData();
        } catch (err) {
            alert("Error updating withdrawal");
        } finally {
            setProcessing(null);
        }
    };

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        setCopied(label);
        setTimeout(() => setCopied(""), 2000);
    };

    const markAsCompleted = (w: Withdrawal) => {
        const txnId = prompt("Enter transaction ID/reference (optional):");
        handleStatusUpdate(w._id, "completed", txnId || undefined);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
                    <p className="text-red-400 text-lg">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                        Admin Panel
                    </h1>
                    <p className="text-gray-400 mt-1">CampusMarket Management</p>
                </div>

                {/* Stats Grid */}
                {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-amber-500/20">
                                    <Clock size={24} className="text-amber-500" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{stats.pendingWithdrawals}</p>
                                    <p className="text-xs text-gray-400">Pending Withdrawals</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-emerald-500/20">
                                    <ShoppingBag size={24} className="text-emerald-500" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{stats.completedOrders}</p>
                                    <p className="text-xs text-gray-400">Completed Orders</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-500/20">
                                    <Users size={24} className="text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{stats.totalUsers}</p>
                                    <p className="text-xs text-gray-400">Total Users</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-purple-500/20">
                                    <TrendingUp size={24} className="text-purple-500" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">₹{stats.platformEarnings.toLocaleString()}</p>
                                    <p className="text-xs text-gray-400">Platform Earnings</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Withdrawals Section */}
                <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                    <div className="p-5 border-b border-gray-700">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <Wallet size={20} />
                            Withdrawal Requests
                        </h2>
                    </div>

                    {withdrawals.length === 0 ? (
                        <div className="p-10 text-center text-gray-400">
                            No withdrawal requests yet
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-700">
                            {withdrawals.map((w) => (
                                <div key={w._id} className="p-5 hover:bg-gray-750">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        {/* User & Amount Info */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-xl font-bold text-emerald-400">
                                                    ₹{w.amount.toLocaleString()}
                                                </span>
                                                <span className={`text-xs px-2 py-1 rounded-full capitalize ${w.status === "pending" ? "bg-amber-500/20 text-amber-400" :
                                                        w.status === "processing" ? "bg-blue-500/20 text-blue-400" :
                                                            w.status === "completed" ? "bg-emerald-500/20 text-emerald-400" :
                                                                "bg-red-500/20 text-red-400"
                                                    }`}>
                                                    {w.status}
                                                </span>
                                            </div>
                                            <p className="text-sm">{w.user.name}</p>
                                            <p className="text-xs text-gray-400">{w.user.email}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {new Date(w.createdAt).toLocaleString()}
                                            </p>
                                        </div>

                                        {/* Payment Details */}
                                        <div className="flex-1 bg-gray-900 rounded-lg p-3">
                                            {w.upiId ? (
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-xs text-gray-400">UPI ID</p>
                                                        <p className="font-mono">{w.upiId}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => copyToClipboard(w.upiId!, "upi-" + w._id)}
                                                        className="p-2 hover:bg-gray-700 rounded"
                                                    >
                                                        {copied === "upi-" + w._id ? (
                                                            <CheckCircle size={16} className="text-emerald-400" />
                                                        ) : (
                                                            <Copy size={16} />
                                                        )}
                                                    </button>
                                                </div>
                                            ) : w.bankAccount ? (
                                                <div className="space-y-1">
                                                    <div className="flex justify-between">
                                                        <span className="text-xs text-gray-400">Account</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-mono text-sm">{w.bankAccount.accountNumber}</span>
                                                            <button
                                                                onClick={() => copyToClipboard(w.bankAccount!.accountNumber, "acc-" + w._id)}
                                                                className="p-1 hover:bg-gray-700 rounded"
                                                            >
                                                                {copied === "acc-" + w._id ? (
                                                                    <CheckCircle size={14} className="text-emerald-400" />
                                                                ) : (
                                                                    <Copy size={14} />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-xs text-gray-400">IFSC</span>
                                                        <span className="font-mono text-sm">{w.bankAccount.ifscCode}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-xs text-gray-400">Name</span>
                                                        <span className="text-sm">{w.bankAccount.accountHolderName}</span>
                                                    </div>
                                                </div>
                                            ) : null}
                                        </div>

                                        {/* Actions */}
                                        {w.status === "pending" && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => markAsCompleted(w)}
                                                    disabled={processing === w._id}
                                                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm font-medium disabled:opacity-50"
                                                >
                                                    <CheckCircle size={16} />
                                                    Complete
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(w._id, "rejected")}
                                                    disabled={processing === w._id}
                                                    className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg text-sm font-medium disabled:opacity-50"
                                                >
                                                    <XCircle size={16} />
                                                    Reject
                                                </button>
                                            </div>
                                        )}

                                        {w.status === "completed" && w.transactionId && (
                                            <div className="text-xs text-gray-400">
                                                Txn: {w.transactionId}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-gray-500 text-sm">
                    <p>🔒 Admin Panel - Access Restricted</p>
                </div>
            </div>
        </div>
    );
}
