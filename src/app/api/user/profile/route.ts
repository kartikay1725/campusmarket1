import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { User, IUser } from "@/models/User";
import { verifyAccess } from "@/lib/auth";

// GET /api/user/profile - Get current user's profile
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
            .populate("college", "name shortCode city") as IUser | null;

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                bio: user.bio,
                profileImage: user.profileImage,
                college: user.college,
                wallet: user.wallet || 0,
                createdAt: user.createdAt,
            }
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
    }
}

// PUT /api/user/profile - Update current user's profile
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
        const { name, email, phone, bio } = body;

        // Validate required fields
        if (!name || name.trim().length === 0) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        if (!email || email.trim().length === 0) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
        }

        // Check if email is already taken by another user
        const existingUser = await User.findOne({
            email: email.toLowerCase(),
            _id: { $ne: payload.id }
        });
        if (existingUser) {
            return NextResponse.json({ error: "Email is already in use" }, { status: 409 });
        }

        // Validate bio length
        if (bio && bio.length > 500) {
            return NextResponse.json({ error: "Bio must be 500 characters or less" }, { status: 400 });
        }

        const updatedUser = await User.findByIdAndUpdate(
            payload.id,
            {
                name: name.trim(),
                email: email.trim().toLowerCase(),
                phone: phone?.trim() || undefined,
                bio: bio?.trim() || undefined,
            },
            { new: true }
        )
            .select("-passwordHash")
            .populate("college", "name shortCode city") as IUser | null;

        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                bio: updatedUser.bio,
                profileImage: updatedUser.profileImage,
                college: updatedUser.college,
                wallet: updatedUser.wallet || 0,
                createdAt: updatedUser.createdAt,
            },
            message: "Profile updated successfully"
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
}
