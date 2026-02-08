import { Schema, model, models, Types } from "mongoose";

export type ProductCategory =
    | "books"
    | "electronics"
    | "clothing"
    | "furniture"
    | "sports"
    | "stationery"
    | "accessories"
    | "other";

export type ProductCondition = "new" | "like-new" | "good" | "fair";
export type ProductStatus = "available" | "sold" | "reserved";

export interface IProduct {
    _id: Types.ObjectId;
    seller: Types.ObjectId;
    college: Types.ObjectId;
    title: string;
    description: string;
    price: number;
    category: ProductCategory;
    images: string[];
    condition: ProductCondition;
    status: ProductStatus;
    createdAt: Date;
    updatedAt: Date;
}

const productSchema = new Schema({
    seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
    college: { type: Schema.Types.ObjectId, ref: "College", required: true },
    title: { type: String, required: true, maxlength: 100 },
    description: { type: String, required: true, maxlength: 2000 },
    price: { type: Number, required: true, min: 0 },
    category: {
        type: String,
        enum: ["books", "electronics", "clothing", "furniture", "sports", "stationery", "accessories", "other"],
        required: true
    },
    images: [{ type: String }],
    condition: {
        type: String,
        enum: ["new", "like-new", "good", "fair"],
        required: true
    },
    status: {
        type: String,
        enum: ["available", "sold", "reserved"],
        default: "available"
    },
    // Seller availability for delivery
    availableDays: [{
        type: String,
        enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
    }],
    availableTimeStart: { type: String }, // e.g., "14:00"
    availableTimeEnd: { type: String },   // e.g., "18:00"
    availableNote: { type: String, maxlength: 200 } // e.g., "Free after 3rd lecture"
}, { timestamps: true });

// Index for efficient queries
productSchema.index({ college: 1, status: 1, category: 1 });
productSchema.index({ title: "text", description: "text" });

export const Product = models.Product || model<IProduct>("Product", productSchema);
