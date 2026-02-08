import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { verifyAccessSafe } from "@/lib/auth";

// POST /api/orders/[id]/cancel - Cancel order and refund
export async function POST(
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

        const order = await Order.findById(id);
        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        const isBuyer = order.buyer.toString() === payload.id;
        const isSeller = order.seller.toString() === payload.id;

        if (!isBuyer && !isSeller) {
            return NextResponse.json({ error: "Not authorized" }, { status: 403 });
        }

        if (order.orderStatus === "delivered" || order.orderStatus === "cancelled") {
            return NextResponse.json({ error: "Order cannot be cancelled" }, { status: 400 });
        }

        // Update order status
        order.orderStatus = "cancelled";
        order.paymentStatus = "refunded";
        await order.save();

        // Make product available again
        await Product.findByIdAndUpdate(order.product, { status: "available" });

        return NextResponse.json({
            order,
            message: "Order cancelled. Payment has been refunded."
        });
    } catch (error) {
        console.error("Error cancelling order:", error);
        return NextResponse.json({ error: "Failed to cancel order" }, { status: 500 });
    }
}
