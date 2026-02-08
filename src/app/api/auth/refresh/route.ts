import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { dbConnect } from "@/lib/db";
import { User } from "@/models/User";
import { signAccess, signRefresh, setRefreshCookie } from "@/lib/auth";

const REFRESH_SECRET = process.env.REFRESH_SECRET!;

interface RefreshPayload extends JwtPayload {
    id: string;
}

// POST /api/auth/refresh - Refresh access token using refresh token
export async function POST(req: NextRequest) {
    try {
        // Get refresh token from cookie or body
        const refreshToken = req.cookies.get("refresh")?.value;

        // Also check body for mobile/API clients
        let bodyToken: string | undefined;
        try {
            const body = await req.json();
            bodyToken = body.refreshToken;
        } catch {
            // No body, use cookie
        }

        const token = refreshToken || bodyToken;

        if (!token) {
            return NextResponse.json(
                { error: "Refresh token required" },
                { status: 401 }
            );
        }

        // Verify refresh token
        let payload: RefreshPayload;
        try {
            payload = jwt.verify(token, REFRESH_SECRET) as RefreshPayload;
        } catch {
            // Token expired or invalid
            return NextResponse.json(
                { error: "Invalid or expired refresh token. Please login again." },
                { status: 401 }
            );
        }

        await dbConnect();

        // Verify user still exists and is active
        const user = await User.findById(payload.id).select("_id name email role");
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 401 }
            );
        }

        // Generate new tokens
        const newAccessToken = signAccess({ id: user._id.toString() });
        const newRefreshToken = signRefresh({ id: user._id.toString() });

        // Set new refresh token cookie
        await setRefreshCookie(newRefreshToken);

        return NextResponse.json({
            token: newAccessToken,
            refreshToken: newRefreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            }
        });
    } catch (error) {
        console.error("Error refreshing token:", error);
        return NextResponse.json(
            { error: "Failed to refresh token" },
            { status: 500 }
        );
    }
}
