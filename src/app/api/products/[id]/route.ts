import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Product } from "@/models/Product";
import { verifyAccess } from "@/lib/auth";

// GET /api/products/[id] - Get product details
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;

        const product = await Product.findById(id)
            .populate("seller", "name profileImage bio phone createdAt")
            .populate("college", "name shortCode city deliveryLocations")
            .lean();

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({ product });
    } catch (error: unknown) {
        console.error("Error fetching product:", error);
        return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
    }
}

// PUT /api/products/[id] - Update product (owner only)
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        const payload = verifyAccess(token);

        await dbConnect();
        const { id } = await params;

        const product = await Product.findById(id);
        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        if (product.seller.toString() !== payload.id) {
            return NextResponse.json({ error: "Not authorized" }, { status: 403 });
        }

        const body = await req.json();
        const allowedUpdates = ["title", "description", "price", "category", "images", "condition", "status"];
        const updates: Record<string, unknown> = {};

        for (const key of allowedUpdates) {
            if (body[key] !== undefined) {
                updates[key] = body[key];
            }
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true });

        return NextResponse.json({ product: updatedProduct });
    } catch (error: unknown) {
        console.error("Error updating product:", error);
        return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
    }
}

// DELETE /api/products/[id] - Delete product (owner only)
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        const payload = verifyAccess(token);

        await dbConnect();
        const { id } = await params;

        const product = await Product.findById(id);
        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        if (product.seller.toString() !== payload.id) {
            return NextResponse.json({ error: "Not authorized" }, { status: 403 });
        }

        await Product.findByIdAndDelete(id);

        return NextResponse.json({ message: "Product deleted" });
    } catch (error: unknown) {
        console.error("Error deleting product:", error);
        return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
    }
}
