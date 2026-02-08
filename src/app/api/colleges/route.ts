import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { College } from "@/models/College";
import { cache, CACHE_TTL } from "@/lib/cache";

// GET /api/colleges - List all colleges
export async function GET() {
    try {
        // Try cache first (colleges rarely change)
        const cacheKey = "colleges:all";
        const cachedColleges = cache.get(cacheKey);
        if (cachedColleges) {
            return NextResponse.json(cachedColleges);
        }

        await dbConnect();

        const colleges = await College.find()
            .select("name shortCode city deliveryLocations")
            .sort({ name: 1 })
            .lean();

        const result = { colleges };

        // Cache for 1 hour (colleges rarely change)
        cache.set(cacheKey, result, CACHE_TTL.HOUR);

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error fetching colleges:", error);
        return NextResponse.json({ error: "Failed to fetch colleges" }, { status: 500 });
    }
}

// POST /api/colleges - Create college (admin only in production)
export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const body = await req.json();
        const { name, shortCode, city, deliveryLocations } = body;

        if (!name || !shortCode || !city) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const college = await College.create({
            name,
            shortCode: shortCode.toUpperCase(),
            city,
            deliveryLocations: deliveryLocations || []
        });

        return NextResponse.json({ college }, { status: 201 });
    } catch (error) {
        console.error("Error creating college:", error);
        return NextResponse.json({ error: "Failed to create college" }, { status: 500 });
    }
}
