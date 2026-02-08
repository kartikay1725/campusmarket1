import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { User } from "@/models/User";
import { verifyAccess } from "@/lib/auth";

// GET /api/auth/me - Get current user profile
export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        const payload = verifyAccess(token);

        await dbConnect();

        const user = await User.findById(payload.id)
            .select("-passwordHash")
            .populate("college", "name shortCode city deliveryLocations")
            .lean();

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ user });
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
    }
}

// PUT /api/auth/me - Update profile
export async function PUT(req: NextRequest) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        const payload = verifyAccess(token);

        await dbConnect();

        const body = await req.json();
        const { name, phone, bio, profileImage, college } = body;

        const updates: Record<string, unknown> = {};
        if (name) updates.name = name;
        if (phone) updates.phone = phone;
        if (bio !== undefined) updates.bio = bio;
        if (profileImage) updates.profileImage = profileImage;
        if (college) updates.college = college;

        const user = await User.findByIdAndUpdate(payload.id, updates, { new: true })
            .select("-passwordHash")
            .populate("college", "name shortCode city");

        return NextResponse.json({ user });
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}
