"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
    Mail,
    MessageSquare,
    Twitter,
    Instagram,
    Github,
    Send,
    Clock,
    MapPin
} from "lucide-react";

export default function ContactPage() {
    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4">Contact Our Team</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Have a question, feedback, or need help? We&apos;re here to support
                        the CampusMarket community.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Info Side */}
                    <div className="space-y-6 lg:col-span-1 animate-in fade-in slide-in-from-left-4">
                        <Card variant="glass" className="p-6">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                    <Mail className="text-primary" size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold">Email Support</h3>
                                    <p className="text-sm text-muted-foreground mb-2">support@campusmarket.edu</p>
                                    <p className="text-xs text-muted-foreground italic">Response time: &lt; 24 hours</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                    <Clock className="text-primary" size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold">Support Hours</h3>
                                    <p className="text-sm text-muted-foreground">Mon - Fri: 9 AM - 6 PM</p>
                                    <p className="text-sm text-muted-foreground">Sat: 10 AM - 2 PM</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                    <MapPin className="text-primary" size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold">Headquarters</h3>
                                    <p className="text-sm text-muted-foreground">Innovation Lab, Block A</p>
                                    <p className="text-sm text-muted-foreground">New Delhi, India</p>
                                </div>
                            </div>
                        </Card>

                        <Card variant="outline" className="p-6">
                            <h3 className="font-bold mb-4">Follow Us</h3>
                            <div className="flex gap-4">
                                <button className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-primary hover:border-primary transition-all group">
                                    <Twitter size={18} className="group-hover:text-white" />
                                </button>
                                <button className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-primary hover:border-primary transition-all group">
                                    <Instagram size={18} className="group-hover:text-white" />
                                </button>
                                <button className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-primary hover:border-primary transition-all group">
                                    <Github size={18} className="group-hover:text-white" />
                                </button>
                            </div>
                        </Card>
                    </div>

                    {/* Form Side */}
                    <div className="lg:col-span-2 animate-in fade-in slide-in-from-right-4">
                        <Card variant="glass" className="p-8">
                            <div className="flex items-center gap-3 mb-8">
                                <MessageSquare className="text-primary" size={24} />
                                <h2 className="text-2xl font-bold">Send a Message</h2>
                            </div>

                            <form className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Full Name</label>
                                        <input
                                            type="text"
                                            placeholder="Your name"
                                            className="w-full bg-input border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Email Address</label>
                                        <input
                                            type="email"
                                            placeholder="your@email.com"
                                            className="w-full bg-input border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Subject</label>
                                    <select className="w-full bg-input border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none">
                                        <option>General Inquiry</option>
                                        <option>Order Support</option>
                                        <option>Account Safety</option>
                                        <option>Partnership</option>
                                        <option>Other</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Message</label>
                                    <textarea
                                        rows={6}
                                        placeholder="Describe how we can help..."
                                        className="w-full bg-input border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                                    ></textarea>
                                </div>

                                <Button variant="primary" size="lg" className="w-full font-bold" icon={<Send size={18} />}>
                                    Send Message
                                </Button>
                            </form>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
