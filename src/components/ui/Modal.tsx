"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
    size?: "sm" | "md" | "lg" | "xl" | "full";
    className?: string;
}

export function Modal({ isOpen, onClose, children, title, size = "md", className }: ModalProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            document.body.style.overflow = "hidden";
        } else {
            const timer = setTimeout(() => setIsVisible(false), 200);
            document.body.style.overflow = "";
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isVisible) return null;

    const sizes = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        full: "max-w-4xl",
    };

    return (
        <div
            className={cn(
                "fixed inset-0 z-50 flex items-center justify-center p-4",
                isOpen ? "animate-in fade-in" : "animate-out fade-out"
            )}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className={cn(
                    "relative w-full bg-card border border-border rounded-2xl shadow-2xl overflow-hidden",
                    "transform transition-all duration-200",
                    isOpen ? "animate-in slide-in-from-bottom-4 zoom-in-95" : "animate-out slide-out-to-bottom-4 zoom-out-95",
                    sizes[size],
                    className
                )}
            >
                {/* Header */}
                {title && (
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                        <h2 className="text-lg font-semibold">{title}</h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-muted transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                )}

                {/* Close button if no title */}
                {!title && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition-colors z-10"
                    >
                        <X size={20} />
                    </button>
                )}

                {/* Content */}
                <div className="max-h-[80vh] overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}
