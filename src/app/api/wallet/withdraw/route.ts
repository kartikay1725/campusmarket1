import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { User } from "@/models/User";
import { Withdrawal } from "@/models/Withdrawal";
import { verifyAccess } from "@/lib/auth";

// GET /api/wallet/withdraw - Get user's withdrawal history
export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        const payload = verifyAccess(token);

        await dbConnect();

        const withdrawals = await Withdrawal.find({ user: payload.id })
            .sort({ createdAt: -1 })
            .limit(20)
            .lean();

        return NextResponse.json({ withdrawals });
    } catch (error) {
        console.error("Error fetching withdrawals:", error);
        return NextResponse.json({ error: "Failed to fetch withdrawals" }, { status: 500 });
    }
}

// POST /api/wallet/withdraw - Request a withdrawal
export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        const payload = verifyAccess(token);

        await dbConnect();

        const body = await req.json();
        const { amount, upiId, bankAccount } = body;

        // Validate amount
        if (!amount || amount < 100) {
            return NextResponse.json({ error: "Minimum withdrawal is ₹100" }, { status: 400 });
        }

        // Validate payment method
        if (!upiId && !bankAccount?.accountNumber) {
            return NextResponse.json({ error: "Please provide UPI ID or bank account details" }, { status: 400 });
        }

        // Bank account validation
        if (bankAccount?.accountNumber) {
            if (!bankAccount.ifscCode || !bankAccount.accountHolderName) {
                return NextResponse.json({ error: "Bank account details incomplete" }, { status: 400 });
            }
        }

        // Get user and check balance
        const user = await User.findById(payload.id);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (user.wallet < amount) {
            return NextResponse.json({
                error: `Insufficient balance. Available: ₹${user.wallet}`
            }, { status: 400 });
        }

        // Check for pending withdrawals
        const pendingWithdrawal = await Withdrawal.findOne({
            user: payload.id,
            status: { $in: ["pending", "processing"] }
        });

        if (pendingWithdrawal) {
            return NextResponse.json({
                error: "You have a pending withdrawal. Please wait for it to complete."
            }, { status: 400 });
        }

        // Create withdrawal request
        const withdrawal = await Withdrawal.create({
            user: payload.id,
            amount,
            upiId: upiId?.trim(),
            bankAccount: bankAccount?.accountNumber ? {
                accountNumber: bankAccount.accountNumber.trim(),
                ifscCode: bankAccount.ifscCode.trim().toUpperCase(),
                accountHolderName: bankAccount.accountHolderName.trim(),
            } : undefined,
            status: "pending"
        });

        // Deduct from wallet immediately (held until processed)
        await User.findByIdAndUpdate(payload.id, {
            $inc: { wallet: -amount }
        });

        return NextResponse.json({
            withdrawal,
            message: `Withdrawal request of ₹${amount} submitted successfully. It will be processed within 24-48 hours.`,
            newBalance: user.wallet - amount
        }, { status: 201 });
    } catch (error) {
        console.error("Error creating withdrawal:", error);
        return NextResponse.json({ error: "Failed to process withdrawal" }, { status: 500 });
    }
}
