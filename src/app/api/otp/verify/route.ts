import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { OTP } from "@/models/OTP";
import { User } from "@/models/User";
import { verifyAccess } from "@/lib/auth";

// POST /api/otp/verify - Verify OTP and perform action
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
        const { otp, purpose, email, profileData } = body;

        if (!otp || !purpose) {
            return NextResponse.json({ error: "OTP and purpose required" }, { status: 400 });
        }

        // For email change, we need the new email
        const targetEmail = purpose === "email_change" && email
            ? email.toLowerCase()
            : (await User.findById(payload.id))?.email;

        if (!targetEmail) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Find the OTP
        const otpRecord = await OTP.findOne({
            email: targetEmail,
            purpose,
            verified: false,
            expiresAt: { $gt: new Date() }
        });

        if (!otpRecord) {
            return NextResponse.json({ error: "OTP expired or not found. Please request a new one." }, { status: 400 });
        }

        // Check attempts
        if (otpRecord.attempts >= 5) {
            await OTP.deleteOne({ _id: otpRecord._id });
            return NextResponse.json({ error: "Too many failed attempts. Please request a new OTP." }, { status: 400 });
        }

        // Verify OTP
        if (otpRecord.otp !== otp) {
            otpRecord.attempts += 1;
            await otpRecord.save();
            return NextResponse.json({
                error: `Invalid OTP. ${5 - otpRecord.attempts} attempts remaining.`
            }, { status: 400 });
        }

        // OTP is valid - mark as verified
        otpRecord.verified = true;
        await otpRecord.save();

        // Perform the action based on purpose
        let updatedUser;

        if (purpose === "profile_update" && profileData) {
            // Update profile (excluding email)
            updatedUser = await User.findByIdAndUpdate(
                payload.id,
                {
                    name: profileData.name?.trim(),
                    phone: profileData.phone?.trim() || undefined,
                    bio: profileData.bio?.trim() || undefined,
                },
                { new: true }
            ).select("-passwordHash");
        } else if (purpose === "email_change" && email) {
            // Update email
            updatedUser = await User.findByIdAndUpdate(
                payload.id,
                { email: email.toLowerCase() },
                { new: true }
            ).select("-passwordHash");
        }

        // Delete used OTP
        await OTP.deleteOne({ _id: otpRecord._id });

        return NextResponse.json({
            success: true,
            message: purpose === "email_change"
                ? "Email updated successfully!"
                : "Profile updated successfully!",
            user: updatedUser ? {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                bio: updatedUser.bio,
            } : undefined
        });
    } catch (error: unknown) {
        console.error("Error verifying OTP:", error);
        return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 });
    }
}
