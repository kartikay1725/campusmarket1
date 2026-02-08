import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Order } from "@/models/Order";
import { verifyAccessSafe } from "@/lib/auth";

// POST /api/orders/[id]/confirm - Seller confirms order
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

        if (order.seller.toString() !== payload.id) {
            return NextResponse.json({ error: "Only seller can confirm order" }, { status: 403 });
        }

        if (order.orderStatus !== "placed") {
            return NextResponse.json({ error: "Order cannot be confirmed in current state" }, { status: 400 });
        }

        order.orderStatus = "confirmed";
        await order.save();

        return NextResponse.json({
            order,
            message: "Order confirmed! Please prepare for delivery."
        });
    } catch (error) {
        console.error("Error confirming order:", error);
        return NextResponse.json({ error: "Failed to confirm order" }, { status: 500 });
    }
}
