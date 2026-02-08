import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Order } from "@/models/Order";
import { verifyAccessSafe } from "@/lib/auth";

// GET /api/orders/[id] - Get order details
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        const result = verifyAccessSafe(token);
        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 401 });
        }
        const payload = result.payload;

        await dbConnect();
        const { id } = await params;

        const order = await Order.findById(id)
            .populate("product")
            .populate("buyer", "name phone email")
            .populate("seller", "name phone email")
            .lean() as {
                _id: string;
                buyer: { _id: string; name: string; phone?: string; email: string };
                seller: { _id: string; name: string; phone?: string; email: string };
                [key: string]: unknown;
            } | null;

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        // Only buyer or seller can view order
        const isBuyer = order.buyer._id.toString() === payload.id;
        const isSeller = order.seller._id.toString() === payload.id;

        if (!isBuyer && !isSeller) {
            return NextResponse.json({ error: "Not authorized" }, { status: 403 });
        }

        return NextResponse.json({ order });
    } catch (error) {
        console.error("Error fetching order:", error);
        return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
    }
}
