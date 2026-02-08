import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { verifyAccessSafe } from "@/lib/auth";

// GET /api/orders - Get user's orders
export async function GET(req: NextRequest) {
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

        const { searchParams } = new URL(req.url);
        const role = searchParams.get("role") || "buyer"; // buyer or seller
        const status = searchParams.get("status");

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = role === "seller"
            ? { seller: payload.id }
            : { buyer: payload.id };

        if (status) query.orderStatus = status;

        const orders = await Order.find(query)
            .populate("product", "title images price")
            .populate("buyer", "name phone")
            .populate("seller", "name phone")
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ orders });
    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
}

// POST /api/orders - Create order (initiate escrow)
export async function POST(req: NextRequest) {
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

        const body = await req.json();
        const { productId, deliveryLocation, deliveryTime } = body;

        if (!productId || !deliveryLocation || !deliveryTime) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Get product details
        const product = await Product.findById(productId);
        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        if (product.status !== "available") {
            return NextResponse.json({ error: "Product is no longer available" }, { status: 400 });
        }

        if (product.seller.toString() === payload.id) {
            return NextResponse.json({ error: "Cannot buy your own product" }, { status: 400 });
        }

        // Calculate fees (5% platform fee)
        const platformFee = Math.round(product.price * 0.05);
        const amount = product.price;

        // Create order with escrow
        const order = await Order.create({
            buyer: payload.id,
            seller: product.seller,
            product: productId,
            amount,
            platformFee,
            paymentStatus: "held", // Simulated escrow - payment held
            deliveryLocation,
            deliveryTime,
            orderStatus: "placed"
        });

        // Mark product as reserved
        await Product.findByIdAndUpdate(productId, { status: "reserved" });

        return NextResponse.json({
            order,
            message: "Order placed! Payment is held in escrow until delivery is confirmed."
        }, { status: 201 });
    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
}
