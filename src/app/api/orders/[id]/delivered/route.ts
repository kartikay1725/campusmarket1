import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { User } from "@/models/User";
import { verifyAccessSafe } from "@/lib/auth";
import { sendOrderCompletionEmails } from "@/lib/email";

// POST /api/orders/[id]/delivered - Buyer confirms delivery, releases payment
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

        const order = await Order.findById(id).populate("product", "title");
        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        if (order.buyer.toString() !== payload.id) {
            return NextResponse.json({ error: "Only buyer can confirm delivery" }, { status: 403 });
        }

        if (order.orderStatus !== "confirmed") {
            return NextResponse.json({ error: "Order must be confirmed before marking as delivered" }, { status: 400 });
        }

        // Update order status
        order.orderStatus = "delivered";
        order.paymentStatus = "released";
        await order.save();

        // Mark product as sold
        await Product.findByIdAndUpdate(order.product._id, { status: "sold" });

        // Add amount (minus platform fee) to seller's wallet
        const sellerPayout = order.sellerReceives;
        await User.findByIdAndUpdate(order.seller, {
            $inc: { wallet: sellerPayout }
        });

        // Get buyer and seller details for email
        const [buyer, seller] = await Promise.all([
            User.findById(order.buyer).select("name email"),
            User.findById(order.seller).select("name email"),
        ]);

        // Send completion emails (async, don't wait)
        if (buyer && seller) {
            sendOrderCompletionEmails(
                {
                    orderId: order._id.toString(),
                    productTitle: order.product.title,
                    productPrice: order.amount,
                    buyerFee: order.buyerFee,
                    sellerFee: order.sellerFee,
                    totalPaid: order.totalPaid,
                    sellerReceives: order.sellerReceives,
                    deliveryLocation: order.deliveryLocation?.name || "Campus",
                    deliveryTime: order.deliveryTime || "",
                    agreementTerms: order.agreementTerms || "",
                    buyerSignature: order.buyerSignature || buyer.name,
                    sellerSignature: order.sellerSignature || seller.name,
                    createdAt: order.createdAt,
                    completedAt: new Date(),
                },
                { name: buyer.name, email: buyer.email },
                { name: seller.name, email: seller.email }
            ).catch(err => console.error("Email sending failed:", err));
        }

        return NextResponse.json({
            order,
            message: `Delivery confirmed! ₹${sellerPayout} has been released to the seller.`
        });
    } catch (error) {
        console.error("Error confirming delivery:", error);
        return NextResponse.json({ error: "Failed to confirm delivery" }, { status: 500 });
    }
}
