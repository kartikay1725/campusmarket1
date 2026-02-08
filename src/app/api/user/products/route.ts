import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Product } from "@/models/Product";
import { verifyAccessSafe } from "@/lib/auth";

// GET /api/user/products - Get current user's listings
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
        const status = searchParams.get("status");

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = { seller: payload.id };
        if (status) query.status = status;

        const products = await Product.find(query)
            .populate("college", "name shortCode")
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ products });
    } catch (error) {
        console.error("Error fetching user products:", error);
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}
