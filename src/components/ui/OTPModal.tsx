"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { X, Mail, Shield, RefreshCw } from "lucide-react";

interface OTPModalProps {
    isOpen: boolean;
    onClose: () => void;
    onVerify: (otp: string) => Promise<void>;
    onResend: () => Promise<void>;
    email: string;
    purpose: "profile_update" | "email_change";
    loading: boolean;
    error: string;
}

export function OTPModal({
    isOpen,
    onClose,
    onVerify,
    onResend,
    email,
    purpose,
    loading,
    error
}: OTPModalProps) {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [resending, setResending] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (isOpen) {
            setOtp(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-submit when complete
        if (newOtp.every(digit => digit) && newOtp.join("").length === 6) {
            onVerify(newOtp.join(""));
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        const newOtp = [...otp];
        pasted.split("").forEach((char, i) => {
            if (i < 6) newOtp[i] = char;
        });
        setOtp(newOtp);
        if (pasted.length === 6) {
            onVerify(pasted);
        }
    };

    const handleResend = async () => {
        setResending(true);
        try {
            await onResend();
            setCooldown(60);
        } finally {
            setResending(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="text-center mb-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                        <Shield size={32} className="text-primary" />
                    </div>
                    <h2 className="text-xl font-bold mb-2">Verify Your Identity</h2>
                    <p className="text-muted-foreground text-sm">
                        {purpose === "email_change"
                            ? "Enter the OTP sent to your new email"
                            : "Enter the OTP sent to your email"}
                    </p>
                    <p className="text-primary text-sm mt-1 flex items-center justify-center gap-2">
                        <Mail size={14} />
                        {email}
                    </p>
                </div>

                {/* OTP Input */}
                <div className="flex justify-center gap-2 mb-6" onPaste={handlePaste}>
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => { inputRefs.current[index] = el; }}
                            type="text"
                            inputMode="numeric"
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className="w-12 h-14 text-center text-2xl font-bold bg-muted border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                            maxLength={1}
                            disabled={loading}
                        />
                    ))}
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                        {error}
                    </div>
                )}

                {/* Actions */}
                <div className="space-y-3">
                    <Button
                        variant="primary"
                        onClick={() => onVerify(otp.join(""))}
                        loading={loading}
                        disabled={otp.some(d => !d)}
                        className="w-full"
                    >
                        Verify & Save
                    </Button>

                    <button
                        onClick={handleResend}
                        disabled={cooldown > 0 || resending}
                        className="w-full text-sm text-muted-foreground hover:text-primary disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        <RefreshCw size={14} className={resending ? "animate-spin" : ""} />
                        {cooldown > 0
                            ? `Resend in ${cooldown}s`
                            : "Resend OTP"}
                    </button>
                </div>

                <p className="text-xs text-muted-foreground text-center mt-4">
                    OTP expires in 10 minutes
                </p>
            </div>
        </div>
    );
}
