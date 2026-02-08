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

import { cache, CACHE_TTL } from "@/lib/cache";

// GET /api/admin/dashboard - Get admin dashboard stats
export async function GET(req: NextRequest) {
    try {
        const admin = await verifyAdmin(req);
        if (!admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");

        // Cache expensive stats for 1 minute
        const statsCacheKey = "admin:dashboard:stats";
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let stats = cache.get<any>(statsCacheKey);

        if (!stats) {
            const [
                pendingWithdrawalsCount,
                completedOrders,
                totalUsers,
                platformEarnings
            ] = await Promise.all([
                Withdrawal.countDocuments({ status: "pending" }),
                Order.countDocuments({ orderStatus: "delivered" }),
                User.countDocuments(),
                Order.aggregate([
                    { $match: { orderStatus: "delivered" } },
                    { $group: { _id: null, total: { $sum: { $add: ["$buyerFee", "$sellerFee"] } } } }
                ])
            ]);

            stats = {
                pendingWithdrawals: pendingWithdrawalsCount,
                completedOrders,
                totalUsers,
                platformEarnings: platformEarnings[0]?.total || 0
            };

            cache.set(statsCacheKey, stats, CACHE_TTL.SHORT * 2); // 60s
        }

        // Get paginated withdrawals (always fresh)
        const skip = (page - 1) * limit;
        const [withdrawals, totalWithdrawals] = await Promise.all([
            Withdrawal.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate("user", "name email"),
            Withdrawal.countDocuments()
        ]);

        return NextResponse.json({
            stats,
            withdrawals,
            pagination: {
                page,
                limit,
                total: totalWithdrawals,
                pages: Math.ceil(totalWithdrawals / limit)
            }
        });
    } catch (error) {
        console.error("Admin dashboard error:", error);
        return NextResponse.json({ error: "Failed to load dashboard" }, { status: 500 });
    }
}
