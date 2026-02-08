"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { Avatar } from "@/components/ui/Avatar";
import { AgreementModal } from "@/components/AgreementModal";
import {
    ArrowLeft,
    Shield,
    MapPin,
    Clock,
    Wallet,
    CreditCard,
    AlertCircle,
    CheckCircle,
    Phone,
    MessageCircle,
    Calendar
} from "lucide-react";
import Link from "next/link";

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Razorpay: any;
    }
}

interface DeliveryLocation {
    name: string;
    building: string;
}

interface Seller {
    _id: string;
    name: string;
    phone?: string;
}

interface Product {
    _id: string;
    title: string;
    description: string;
    price: number;
    images: string[];
    condition: string;
    seller: Seller;
    college: {
        _id: string;
        name: string;
        deliveryLocations: DeliveryLocation[];
    };
    availableDays?: string[];
    availableTimeStart?: string;
    availableTimeEnd?: string;
    availableNote?: string;
}

export default function CheckoutPage({ params }: { params: Promise<{ productId: string }> }) {
    const { productId } = use(params);
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [showAgreement, setShowAgreement] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [sellerContact, setSellerContact] = useState<{ name: string; phone: string } | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [orderId, setOrderId] = useState<string | null>(null);
    const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null);

    // Fee calculations
    const productPrice = product?.price || 0;
    const buyerFee = Math.round(productPrice * 0.05);
    const sellerFee = Math.round(productPrice * 0.05);
    const totalAmount = productPrice + buyerFee;
    const sellerReceives = productPrice - sellerFee;

    useEffect(() => {
        // Load Razorpay script
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push(`/login?redirect=/checkout/${productId}`);
            return;
        }

        const userData = localStorage.getItem("user");
        if (userData) {
            setUser(JSON.parse(userData));
        }

        fetchProduct();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productId, router]);

    const fetchProduct = async () => {
        try {
            const res = await fetch(`/api/products/${productId}`);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error);
            }

            setProduct(data.product);
        } catch (error) {
            console.error("Error fetching product:", error);
            router.push("/browse");
        } finally {
            setLoading(false);
        }
    };

    const handleProceedToPayment = () => {
        if (!selectedLocation || !selectedTime) {
            alert("Please select delivery location and time");
            return;
        }
        setShowAgreement(true);
    };

    const handleAgreementAccept = async (terms: string, signature: string) => {
        setShowAgreement(false);
        setProcessing(true);

        try {
            const token = localStorage.getItem("token");

            // Create payment order
            const createRes = await fetch("/api/payments/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ productId }),
            });

            const createData = await createRes.json();

            if (!createRes.ok) {
                throw new Error(createData.error || "Failed to create payment");
            }

            // Get delivery location
            const location = product?.college?.deliveryLocations.find(
                l => `${l.name} - ${l.building}` === selectedLocation
            );

            // Check if simulated mode
            if (createData.simulated) {
                // Simulated payment - skip Razorpay, go directly to verification
                const verifyRes = await fetch("/api/payments/verify", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        razorpayOrderId: createData.orderId,
                        razorpayPaymentId: `sim_pay_${Date.now()}`,
                        razorpaySignature: "simulated",
                        productId,
                        deliveryLocation: location || { name: selectedLocation, building: "" },
                        deliveryTime: selectedTime,
                        agreementTerms: terms,
                        buyerSignature: signature,
                        simulated: true,
                    }),
                });

                const verifyData = await verifyRes.json();

                if (verifyData.success) {
                    setPaymentSuccess(true);
                    setSellerContact(verifyData.sellerContact);
                    setOrderId(verifyData.order._id);
                } else {
                    throw new Error("Verification failed");
                }
                return;
            }

            // Real Razorpay checkout
            const options = {
                key: createData.keyId,
                amount: createData.amount * 100,
                currency: createData.currency,
                name: "CampusMarket",
                description: `Purchase: ${product?.title}`,
                order_id: createData.orderId,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                handler: async function (response: any) {
                    const verifyRes = await fetch("/api/payments/verify", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                            productId,
                            deliveryLocation: location || { name: selectedLocation, building: "" },
                            deliveryTime: selectedTime,
                            agreementTerms: terms,
                            buyerSignature: signature,
                            simulated: false,
                        }),
                    });

                    const verifyData = await verifyRes.json();

                    if (verifyData.success) {
                        setPaymentSuccess(true);
                        setSellerContact(verifyData.sellerContact);
                        setOrderId(verifyData.order._id);
                    } else {
                        throw new Error("Payment verification failed");
                    }
                },
                prefill: {
                    name: user?.name || "",
                    email: user?.email || "",
                },
                theme: {
                    color: "#6366f1",
                },
                modal: {
                    ondismiss: function () {
                        setProcessing(false);
                    },
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error("Payment error:", error);
            alert("Payment failed. Please try again.");
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!product) {
        return null;
    }

    // Payment Success View
    if (paymentSuccess && sellerContact) {
        return (
            <div className="min-h-screen py-8">
                <div className="max-w-2xl mx-auto px-4">
                    <Card variant="glass" className="p-8 text-center">
                        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-6">
                            <CheckCircle size={40} className="text-white" />
                        </div>

                        <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
                        <p className="text-muted-foreground mb-8">
                            Your payment is held securely in escrow until you confirm delivery.
                        </p>

                        {/* Order summary */}
                        <div className="p-4 rounded-xl bg-muted/30 mb-6 text-left">
                            <h3 className="font-medium mb-3">Order Summary</h3>
                            <div className="flex gap-4">
                                <div className="w-20 h-20 rounded-lg overflow-hidden relative flex-shrink-0">
                                    <Image
                                        src={product.images[0] || "/placeholder.jpg"}
                                        alt={product.title}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>
                                <div>
                                    <p className="font-medium">{product.title}</p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {selectedLocation}
                                    </p>
                                    <p className="text-lg font-bold text-primary mt-2">
                                        ₹{totalAmount.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Seller Contact - revealed after payment */}
                        <Card variant="gradient" className="p-6 mb-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Phone size={20} className="text-primary" />
                                <h3 className="font-semibold">Contact Seller</h3>
                            </div>

                            <div className="flex items-center gap-4 mb-4">
                                <Avatar name={sellerContact.name} size="lg" />
                                <div className="text-left">
                                    <p className="font-medium text-lg">{sellerContact.name}</p>
                                    <p className="text-primary font-mono text-lg">{sellerContact.phone || "Phone not available"}</p>
                                </div>
                            </div>

                            <p className="text-sm text-muted-foreground mb-4">
                                Coordinate with the seller to arrange pickup at your selected location and time.
                            </p>

                            {sellerContact.phone && (
                                <div className="flex gap-3">
                                    <Button
                                        variant="primary"
                                        className="flex-1"
                                        icon={<Phone size={18} />}
                                        onClick={() => window.open(`tel:${sellerContact.phone}`)}
                                    >
                                        Call Seller
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        icon={<MessageCircle size={18} />}
                                        onClick={() => window.open(`https://wa.me/91${sellerContact.phone?.replace(/\D/g, '')}`)}
                                    >
                                        WhatsApp
                                    </Button>
                                </div>
                            )}
                        </Card>

                        {/* Important notes */}
                        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-left mb-6">
                            <div className="flex items-start gap-3">
                                <AlertCircle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
                                <div className="text-sm">
                                    <p className="font-medium text-amber-200 mb-1">Important</p>
                                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                        <li>Inspect the product carefully before confirming delivery</li>
                                        <li>Payment will be released to seller after you confirm receipt</li>
                                        <li>Contact support if there are any issues</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <Link href="/dashboard">
                            <Button variant="outline" className="w-full">
                                Go to Dashboard
                            </Button>
                        </Link>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => router.back()}
                        className="p-2 rounded-full hover:bg-muted transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-bold">Checkout</h1>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Product Summary */}
                        <Card variant="glass" className="p-6">
                            <h2 className="font-semibold mb-4">Product</h2>
                            <div className="flex gap-4">
                                <div className="w-24 h-24 rounded-lg overflow-hidden relative flex-shrink-0">
                                    <Image
                                        src={product.images[0] || "/placeholder.jpg"}
                                        alt={product.title}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>
                                <div>
                                    <h3 className="font-medium">{product.title}</h3>
                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                        {product.description}
                                    </p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <Avatar name={product.seller.name} size="sm" />
                                        <span className="text-sm">{product.seller.name}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Seller Availability */}
                            {product.availableDays && product.availableDays.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-border">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar size={16} className="text-primary" />
                                        <span className="text-sm font-medium">Seller Availability</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {product.availableDays.map(d => d.charAt(0).toUpperCase() + d.slice(1, 3)).join(", ")}
                                        {product.availableTimeStart && product.availableTimeEnd && (
                                            <span> • {product.availableTimeStart} - {product.availableTimeEnd}</span>
                                        )}
                                    </p>
                                    {product.availableNote && (
                                        <p className="text-xs text-muted-foreground mt-1 italic">
                                            &quot;{product.availableNote}&quot;
                                        </p>
                                    )}
                                </div>
                            )}
                        </Card>

                        {/* Delivery Location */}
                        <Card variant="glass" className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <MapPin size={20} className="text-primary" />
                                <h2 className="font-semibold">Delivery Location</h2>
                            </div>
                            <Select
                                label="Select pickup point"
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                                options={[
                                    { value: "", label: "Choose a location" },
                                    ...(product.college?.deliveryLocations?.map(loc => ({
                                        value: `${loc.name} - ${loc.building}`,
                                        label: `${loc.name} - ${loc.building}`
                                    })) || [])
                                ]}
                            />
                        </Card>

                        {/* Delivery Time */}
                        <Card variant="glass" className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Clock size={20} className="text-primary" />
                                <h2 className="font-semibold">Preferred Time</h2>
                            </div>
                            <input
                                type="datetime-local"
                                value={selectedTime}
                                onChange={(e) => setSelectedTime(e.target.value)}
                                className="w-full bg-input border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary"
                                min={new Date().toISOString().slice(0, 16)}
                            />
                            <p className="text-xs text-muted-foreground mt-2">
                                Coordinate with seller&apos;s availability shown above
                            </p>
                        </Card>

                        {/* Escrow Info */}
                        <Card className="p-4 bg-emerald-500/10 border border-emerald-500/20">
                            <div className="flex items-start gap-3">
                                <Shield size={24} className="text-emerald-500 flex-shrink-0" />
                                <div>
                                    <h3 className="font-medium text-emerald-400">Secure Escrow Payment</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Your payment is held safely until you receive and confirm the product.
                                        No Cash on Delivery - 100% secure transactions.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <Card variant="glass" className="p-6 sticky top-24">
                            <h2 className="font-semibold mb-4">Order Summary</h2>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Product Price</span>
                                    <span>₹{productPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Platform Fee (5%)</span>
                                    <span>₹{buyerFee.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between pt-3 border-t border-border text-lg font-semibold">
                                    <span>Total</span>
                                    <span className="text-primary">₹{totalAmount.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="mt-4 p-3 rounded-lg bg-muted/30 text-xs text-muted-foreground">
                                <p>Seller receives: ₹{sellerReceives.toLocaleString()} (after 5% fee)</p>
                            </div>

                            <Button
                                variant="accent"
                                className="w-full mt-6"
                                size="lg"
                                onClick={handleProceedToPayment}
                                loading={processing}
                                disabled={!selectedLocation || !selectedTime}
                                icon={<CreditCard size={20} />}
                            >
                                Proceed to Pay
                            </Button>

                            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
                                <Wallet size={14} />
                                <span>Powered by Razorpay</span>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Agreement Modal */}
            {user && product && (
                <AgreementModal
                    isOpen={showAgreement}
                    onClose={() => setShowAgreement(false)}
                    onAccept={handleAgreementAccept}
                    product={{ title: product.title, price: productPrice }}
                    seller={{ name: product.seller.name }}
                    buyer={{ name: user.name }}
                    totalAmount={totalAmount}
                    buyerFee={buyerFee}
                    sellerFee={sellerFee}
                />
            )}
        </div>
    );
}
