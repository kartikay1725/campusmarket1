"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
    AlertTriangle,
    Flag,
    Bug,
    ShieldAlert,
    Send,
    Upload,
    Info
} from "lucide-react";

export default function ReportIssuePage() {
    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4">
                    <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-6 shrink-0">
                        <AlertTriangle className="text-destructive" size={32} />
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Report an Issue</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Help us keep CampusMarket safe and bug-free. Please provide detailed
                        information about the issue you encountered.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {/* Issue Types */}
                    <Card variant="glass" className="p-6 text-center animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: "100ms" }}>
                        <Bug className="text-primary mx-auto mb-4" size={24} />
                        <h3 className="font-bold mb-2">Technical Bug</h3>
                        <p className="text-xs text-muted-foreground">App crashes, broken links, or visual glitches.</p>
                    </Card>
                    <Card variant="glass" className="p-6 text-center animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: "200ms" }}>
                        <Flag className="text-amber-500 mx-auto mb-4" size={24} />
                        <h3 className="font-bold mb-2">Fraudulent Listing</h3>
                        <p className="text-xs text-muted-foreground">Scams, fake items, or misleading information.</p>
                    </Card>
                    <Card variant="glass" className="p-6 text-center animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: "300ms" }}>
                        <ShieldAlert className="text-destructive mx-auto mb-4" size={24} />
                        <h3 className="font-bold mb-2">Harassment</h3>
                        <p className="text-xs text-muted-foreground">Disrespectful behavior or inappropriate content.</p>
                    </Card>
                </div>

                <Card variant="glass" className="p-8 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: "400ms" }}>
                    <form className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Issue Category</label>
                            <select className="w-full bg-input border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer">
                                <option>Select a category</option>
                                <option>Technical Bug / Error</option>
                                <option>Report a User</option>
                                <option>Fraudulent / Fake Product</option>
                                <option>Payment / Wallet Issue</option>
                                <option>Suggest an Improvement</option>
                                <option>Other</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Title / Short Summary</label>
                            <input
                                type="text"
                                placeholder="Briefly describe the issue"
                                className="w-full bg-input border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Detailed Description</label>
                            <textarea
                                rows={5}
                                placeholder="What happened? If it's a bug, list the steps to reproduce it."
                                className="w-full bg-input border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                            ></textarea>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Evidence (Optional)</label>
                            <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center gap-3 hover:border-primary/50 transition-colors cursor-pointer group">
                                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                    <Upload className="text-muted-foreground group-hover:text-primary" size={20} />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-medium">Click to upload or drag and drop</p>
                                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG or PDF up to 10MB</p>
                                </div>
                            </div>
                        </div>

                        <Card variant="outline" className="p-4 bg-primary/5 border-primary/20 flex gap-3 items-start">
                            <Info className="text-primary shrink-0 mt-0.5" size={18} />
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Our safety team reviews all reports within 12-24 hours. For serious security concerns,
                                you can also contact us directly at <span className="text-primary font-medium">safety@campusmarket.edu</span>.
                            </p>
                        </Card>

                        <Button variant="primary" size="lg" className="w-full font-bold" icon={<Send size={18} />}>
                            Submit Report
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
}
