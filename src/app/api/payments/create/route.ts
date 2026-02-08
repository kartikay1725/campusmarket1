import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Product } from "@/models/Product";
import { verifyAccess } from "@/lib/auth";

// Check if Razorpay is configured
const RAZORPAY_CONFIGURED = process.env.RAZORPAY_KEY_ID &&
    process.env.RAZORPAY_KEY_SECRET &&
    !process.env.RAZORPAY_KEY_ID.includes("your_");

// POST /api/payments/create - Create Razorpay order
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
        const { productId } = body;

        if (!productId) {
            return NextResponse.json({ error: "Product ID required" }, { status: 400 });
        }

        // Get product
        const product = await Product.findById(productId).populate("seller", "name");
        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        if (product.status !== "available") {
            return NextResponse.json({ error: "Product not available" }, { status: 400 });
        }

        if (product.seller._id.toString() === payload.id) {
            return NextResponse.json({ error: "Cannot buy your own product" }, { status: 400 });
        }

        // Calculate fees (5% from each side)
        const productPrice = product.price;
        const buyerFee = Math.round(productPrice * 0.05);  // +5% buyer pays
        const sellerFee = Math.round(productPrice * 0.05); // -5% from seller
        const totalAmount = productPrice + buyerFee;       // What buyer pays

        // If Razorpay not configured, use simulated mode
        if (!RAZORPAY_CONFIGURED) {
            return NextResponse.json({
                orderId: `sim_${Date.now()}`,
                amount: totalAmount,
                productPrice,
                buyerFee,
                sellerFee,
                sellerReceives: productPrice - sellerFee,
                currency: "INR",
                keyId: "SIMULATED",
                simulated: true, // Flag for frontend
            });
        }

        // Real Razorpay integration
        const Razorpay = (await import("razorpay")).default;
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!,
        });

        const razorpayOrder = await razorpay.orders.create({
            amount: totalAmount * 100, // Convert to paise
            currency: "INR",
            receipt: `rcpt_${Date.now()}`,
            notes: {
                productId: productId,
                buyerId: payload.id,
                sellerId: product.seller._id.toString(),
                productPrice: productPrice.toString(),
                buyerFee: buyerFee.toString(),
                sellerFee: sellerFee.toString(),
            }
        });

        return NextResponse.json({
            orderId: razorpayOrder.id,
            amount: totalAmount,
            productPrice,
            buyerFee,
            sellerFee,
            sellerReceives: productPrice - sellerFee,
            currency: "INR",
            keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            simulated: false,
        });
    } catch (error) {
        console.error("Error creating payment:", error);
        return NextResponse.json({ error: "Failed to create payment" }, { status: 500 });
    }
}
