import { Schema, model, models, Types } from "mongoose";

export type PaymentStatus = "pending" | "held" | "released" | "refunded";
export type OrderStatus = "placed" | "confirmed" | "delivered" | "cancelled";

export interface IOrder {
    _id: Types.ObjectId;
    buyer: Types.ObjectId;
    seller: Types.ObjectId;
    product: Types.ObjectId;
    amount: number;
    buyerFee: number;      // 5% charged to buyer
    sellerFee: number;     // 5% deducted from seller
    totalPaid: number;     // amount + buyerFee
    sellerReceives: number; // amount - sellerFee
    paymentStatus: PaymentStatus;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    deliveryLocation: {
        name: string;
        building: string;
    };
    deliveryTime: string;
    orderStatus: OrderStatus;
    // Digital Agreement
    agreementAcceptedAt?: Date;
    agreementTerms?: string;
    buyerSignature?: string;  // Buyer's name as signature
    sellerSignature?: string; // Seller's name as signature
    createdAt: Date;
}

const orderSchema = new Schema({
    buyer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    amount: { type: Number, required: true },
    buyerFee: { type: Number, required: true },    // 5% of amount
    sellerFee: { type: Number, required: true },   // 5% of amount
    totalPaid: { type: Number, required: true },   // amount + buyerFee
    sellerReceives: { type: Number, required: true }, // amount - sellerFee
    paymentStatus: {
        type: String,
        enum: ["pending", "held", "released", "refunded"],
        default: "pending"
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    deliveryLocation: {
        name: { type: String, required: true },
        building: { type: String, required: true }
    },
    deliveryTime: { type: String, required: true },
    orderStatus: {
        type: String,
        enum: ["placed", "confirmed", "delivered", "cancelled"],
        default: "placed"
    },
    // Digital Agreement
    agreementAcceptedAt: { type: Date },
    agreementTerms: { type: String },
    buyerSignature: { type: String },
    sellerSignature: { type: String }
}, { timestamps: true });

// Index for efficient queries
orderSchema.index({ buyer: 1, orderStatus: 1 });
orderSchema.index({ seller: 1, orderStatus: 1 });
orderSchema.index({ razorpayOrderId: 1 });

export const Order = models.Order || model<IOrder>("Order", orderSchema);
