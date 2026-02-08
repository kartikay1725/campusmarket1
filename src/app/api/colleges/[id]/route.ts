import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { College } from "@/models/College";

// GET /api/colleges/[id] - Get college with delivery locations
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;

        const college = await College.findById(id).lean();

        if (!college) {
            return NextResponse.json({ error: "College not found" }, { status: 404 });
        }

        return NextResponse.json({ college });
    } catch (error) {
        console.error("Error fetching college:", error);
        return NextResponse.json({ error: "Failed to fetch college" }, { status: 500 });
    }
}

// PUT /api/colleges/[id] - Update college (add delivery locations, etc.)
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;

        const body = await req.json();
        const { name, shortCode, city, deliveryLocations } = body;

        const updates: Record<string, unknown> = {};
        if (name) updates.name = name;
        if (shortCode) updates.shortCode = shortCode.toUpperCase();
        if (city) updates.city = city;
        if (deliveryLocations) updates.deliveryLocations = deliveryLocations;

        const college = await College.findByIdAndUpdate(id, updates, { new: true });

        if (!college) {
            return NextResponse.json({ error: "College not found" }, { status: 404 });
        }

        return NextResponse.json({ college });
    } catch (error) {
        console.error("Error updating college:", error);
        return NextResponse.json({ error: "Failed to update college" }, { status: 500 });
    }
}
