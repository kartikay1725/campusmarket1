import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Withdrawal } from "@/models/Withdrawal";
import { User } from "@/models/User";
import { Order } from "@/models/Order";
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

// GET /api/admin/dashboard - Get admin dashboard stats
export async function GET(req: NextRequest) {
    try {
        const admin = await verifyAdmin(req);
        if (!admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // Get stats
        const [
            pendingWithdrawals,
            totalWithdrawals,
            completedOrders,
            totalUsers,
            platformEarnings
        ] = await Promise.all([
            Withdrawal.countDocuments({ status: "pending" }),
            Withdrawal.find().sort({ createdAt: -1 }).limit(50).populate("user", "name email"),
            Order.countDocuments({ orderStatus: "delivered" }),
            User.countDocuments(),
            Order.aggregate([
                { $match: { orderStatus: "delivered" } },
                { $group: { _id: null, total: { $sum: { $add: ["$buyerFee", "$sellerFee"] } } } }
            ])
        ]);

        return NextResponse.json({
            stats: {
                pendingWithdrawals,
                completedOrders,
                totalUsers,
                platformEarnings: platformEarnings[0]?.total || 0
            },
            withdrawals: totalWithdrawals
        });
    } catch (error) {
        console.error("Admin dashboard error:", error);
        return NextResponse.json({ error: "Failed to load dashboard" }, { status: 500 });
    }
}
