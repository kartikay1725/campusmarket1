import { Schema, model, models, Types } from "mongoose";

export interface IWithdrawal {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    amount: number;
    upiId?: string;
    bankAccount?: {
        accountNumber: string;
        ifscCode: string;
        accountHolderName: string;
    };
    status: "pending" | "processing" | "completed" | "rejected";
    rejectionReason?: string;
    processedAt?: Date;
    transactionId?: string;
    createdAt: Date;
    updatedAt: Date;
}

const withdrawalSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true, min: 100 }, // Minimum ₹100 withdrawal
    upiId: { type: String },
    bankAccount: {
        accountNumber: { type: String },
        ifscCode: { type: String },
        accountHolderName: { type: String },
    },
    status: {
        type: String,
        enum: ["pending", "processing", "completed", "rejected"],
        default: "pending"
    },
    rejectionReason: { type: String },
    processedAt: { type: Date },
    transactionId: { type: String },
}, { timestamps: true });

// Index for user withdrawals
withdrawalSchema.index({ user: 1, createdAt: -1 });
withdrawalSchema.index({ status: 1 });

export const Withdrawal = models.Withdrawal || model<IWithdrawal>("Withdrawal", withdrawalSchema);
