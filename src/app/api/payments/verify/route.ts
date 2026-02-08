import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { User } from "@/models/User";
import { verifyAccess } from "@/lib/auth";
import crypto from "crypto";

// Check if Razorpay is configured
const RAZORPAY_CONFIGURED = process.env.RAZORPAY_KEY_ID &&
    process.env.RAZORPAY_KEY_SECRET &&
    !process.env.RAZORPAY_KEY_ID.includes("your_");

// POST /api/payments/verify - Verify Razorpay payment and create order
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
        const {
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
            productId,
            deliveryLocation,
            deliveryTime,
            agreementTerms,
            buyerSignature,
            simulated, // Flag for simulated mode
        } = body;

        // For simulated mode, skip signature verification
        if (!simulated && RAZORPAY_CONFIGURED) {
            // Verify signature for real payments
            const generatedSignature = crypto
                .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
                .update(`${razorpayOrderId}|${razorpayPaymentId}`)
                .digest("hex");

            if (generatedSignature !== razorpaySignature) {
                return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
            }
        }

        // Get product details
        const product = await Product.findById(productId).populate("seller", "name phone");
        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        // Get buyer details
        const buyer = await User.findById(payload.id);
        if (!buyer) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Calculate fees
        const productPrice = product.price;
        const buyerFee = Math.round(productPrice * 0.05);
        const sellerFee = Math.round(productPrice * 0.05);
        const totalPaid = productPrice + buyerFee;
        const sellerReceives = productPrice - sellerFee;

        // Create order with payment held in escrow
        const order = await Order.create({
            buyer: payload.id,
            seller: product.seller._id,
            product: productId,
            amount: productPrice,
            buyerFee,
            sellerFee,
            totalPaid,
            sellerReceives,
            paymentStatus: "held", // Money held in escrow
            razorpayOrderId: razorpayOrderId || `sim_${Date.now()}`,
            razorpayPaymentId: razorpayPaymentId || `sim_pay_${Date.now()}`,
            deliveryLocation,
            deliveryTime,
            orderStatus: "placed",
            agreementAcceptedAt: new Date(),
            agreementTerms,
            buyerSignature,
            sellerSignature: product.seller.name, // Seller pre-signed via listing
        });

        // Mark product as reserved
        await Product.findByIdAndUpdate(productId, { status: "reserved" });

        return NextResponse.json({
            success: true,
            order,
            message: simulated
                ? "Simulated payment successful! (Test mode - no real payment)"
                : "Payment successful! Money is held in escrow until delivery is confirmed.",
            sellerContact: {
                name: product.seller.name,
                phone: product.seller.phone,
            }
        }, { status: 201 });
    } catch (error) {
        console.error("Error verifying payment:", error);
        return NextResponse.json({ error: "Payment verification failed" }, { status: 500 });
    }
}
