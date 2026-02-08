import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Withdrawal } from "@/models/Withdrawal";
import { User } from "@/models/User";
import { verifyAccess } from "@/lib/auth";

// Middleware to check admin role
async function verifyAdmin(req: NextRequest) {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
        return null;
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyAccess(token);

    await dbConnect();
    const user = await User.findById(payload.id);

    if (!user || user.role !== "admin") {
        return null;
    }

    return user;
}

// PUT /api/admin/withdrawals/[id] - Update withdrawal status
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const admin = await verifyAdmin(req);
        if (!admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const { id } = await params;
        const body = await req.json();
        const { status, transactionId, rejectionReason } = body;

        if (!["processing", "completed", "rejected"].includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        const withdrawal = await Withdrawal.findById(id);
        if (!withdrawal) {
            return NextResponse.json({ error: "Withdrawal not found" }, { status: 404 });
        }

        // If rejecting, refund the amount to user's wallet
        if (status === "rejected" && withdrawal.status !== "rejected") {
            await User.findByIdAndUpdate(withdrawal.user, {
                $inc: { wallet: withdrawal.amount }
            });
        }

        // Update withdrawal
        withdrawal.status = status;
        if (status === "completed") {
            withdrawal.processedAt = new Date();
            withdrawal.transactionId = transactionId;
        }
        if (status === "rejected") {
            withdrawal.rejectionReason = rejectionReason || "Request rejected by admin";
        }
        await withdrawal.save();

        return NextResponse.json({
            withdrawal,
            message: `Withdrawal ${status === "completed" ? "marked as completed" : status === "rejected" ? "rejected and refunded" : "updated"}`
        });
    } catch (error) {
        console.error("Error updating withdrawal:", error);
        return NextResponse.json({ error: "Failed to update withdrawal" }, { status: 500 });
    }
}
