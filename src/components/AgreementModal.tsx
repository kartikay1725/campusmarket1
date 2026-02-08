"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CheckCircle, FileText, Shield, AlertTriangle } from "lucide-react";

interface AgreementModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAccept: (terms: string, signature: string) => void;
    product: {
        title: string;
        price: number;
    };
    seller: {
        name: string;
    };
    buyer: {
        name: string;
    };
    totalAmount: number;
    buyerFee: number;
    sellerFee: number;
}

const AGREEMENT_TERMS = `
PURCHASE AGREEMENT - CAMPUSMARKET

This agreement ("Agreement") is entered into between the Buyer and Seller through CampusMarket platform.

1. PRODUCT SALE
The Seller agrees to sell and the Buyer agrees to purchase the listed product at the agreed price plus applicable platform fees.

2. PAYMENT & ESCROW
• Payment is processed securely through Razorpay
• Funds are held in escrow by CampusMarket until delivery is confirmed
• Platform fee of 5% is charged to both Buyer and Seller

3. DELIVERY TERMS
• Seller must deliver the product at the agreed campus location and time
• Buyer must inspect the product upon receipt
• Buyer must confirm receipt within 24 hours of delivery

4. REFUND POLICY
• If Seller fails to deliver: Full refund to Buyer
• If product differs significantly from description: Buyer may reject and receive refund
• Once delivery is confirmed: No refunds

5. DISPUTE RESOLUTION
• Both parties agree to resolve disputes through CampusMarket support
• CampusMarket's decision on disputes is final

6. LIABILITY
• CampusMarket acts only as a platform facilitator
• Buyer and Seller are responsible for the transaction
• CampusMarket is not liable for product quality or disputes

7. DIGITAL SIGNATURES
• By accepting this agreement, both parties provide their digital signature
• This agreement is legally binding

By proceeding with this transaction, both parties acknowledge they have read, understood, and agree to these terms.
`.trim();

export function AgreementModal({
    isOpen,
    onClose,
    onAccept,
    product,
    seller,
    buyer,
    totalAmount,
    buyerFee,
    sellerFee,
}: AgreementModalProps) {
    const [agreed, setAgreed] = useState(false);
    const [signature, setSignature] = useState("");

    const handleAccept = () => {
        if (!agreed || !signature.trim()) return;
        onAccept(AGREEMENT_TERMS, signature);
    };

    const currentDate = new Date().toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Purchase Agreement" size="lg">
            <div className="p-6 space-y-6">
                {/* Agreement Header */}
                <Card variant="gradient" className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                        <FileText size={24} className="text-primary" />
                        <h3 className="font-semibold">Digital Purchase Agreement</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-muted-foreground">Product:</span>
                            <p className="font-medium">{product.title}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Date:</span>
                            <p className="font-medium">{currentDate}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Seller:</span>
                            <p className="font-medium">{seller.name}</p>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Buyer:</span>
                            <p className="font-medium">{buyer.name}</p>
                        </div>
                    </div>
                </Card>

                {/* Fee Breakdown */}
                <Card className="p-4 bg-muted/30">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Shield size={18} className="text-emerald-500" />
                        Payment Breakdown
                    </h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span>Product Price</span>
                            <span>₹{product.price.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                            <span>Platform Fee (5%)</span>
                            <span>+ ₹{buyerFee.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between font-semibold pt-2 border-t border-border">
                            <span>You Pay</span>
                            <span className="text-primary">₹{totalAmount.toLocaleString()}</span>
                        </div>
                    </div>
                </Card>

                {/* Terms */}
                <div>
                    <h4 className="font-medium mb-2">Terms & Conditions</h4>
                    <div className="h-48 overflow-y-auto p-4 bg-muted/20 rounded-lg border border-border text-sm whitespace-pre-line">
                        {AGREEMENT_TERMS}
                    </div>
                </div>

                {/* Warning */}
                <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <AlertTriangle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-200">
                        By typing your name and accepting, you are digitally signing this agreement.
                        This is a legally binding transaction.
                    </p>
                </div>

                {/* Digital Signature */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Your Digital Signature (Type your full name)
                    </label>
                    <input
                        type="text"
                        value={signature}
                        onChange={(e) => setSignature(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full bg-input border border-border rounded-lg px-4 py-3 text-lg font-signature focus:outline-none focus:border-primary"
                        style={{ fontFamily: "'Brush Script MT', cursive" }}
                    />
                </div>

                {/* Checkbox */}
                <label className="flex items-start gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="mt-1 w-5 h-5 rounded border-border accent-primary"
                    />
                    <span className="text-sm">
                        I have read and agree to the terms and conditions above.
                        I understand this is a binding agreement.
                    </span>
                </label>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-border">
                    <Button variant="ghost" onClick={onClose} className="flex-1">
                        Cancel
                    </Button>
                    <Button
                        variant="accent"
                        onClick={handleAccept}
                        disabled={!agreed || signature.trim().length < 2}
                        icon={<CheckCircle size={18} />}
                        className="flex-1"
                    >
                        Accept & Continue to Payment
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
