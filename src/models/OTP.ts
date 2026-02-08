import { Schema, model, models, Types } from "mongoose";

export interface IOTP {
    _id: Types.ObjectId;
    email: string;
    otp: string;
    purpose: "profile_update" | "email_change" | "password_reset" | "login";
    userId?: Types.ObjectId;
    expiresAt: Date;
    verified: boolean;
    attempts: number;
    createdAt: Date;
}

const otpSchema = new Schema({
    email: { type: String, required: true, lowercase: true },
    otp: { type: String, required: true },
    purpose: {
        type: String,
        enum: ["profile_update", "email_change", "password_reset", "login"],
        required: true
    },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    expiresAt: { type: Date, required: true },
    verified: { type: Boolean, default: false },
    attempts: { type: Number, default: 0 },
}, { timestamps: true });

// Auto-expire OTPs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
// Lookup index
otpSchema.index({ email: 1, purpose: 1, verified: 1 });

export const OTP = models.OTP || model<IOTP>("OTP", otpSchema);
