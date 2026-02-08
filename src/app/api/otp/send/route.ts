import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { OTP } from "@/models/OTP";
import { User } from "@/models/User";
import { verifyAccess } from "@/lib/auth";
import nodemailer from "nodemailer";

// Generate 6-digit OTP
function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Create transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Email template
function getOTPEmailHTML(otp: string, purpose: string, name: string): string {
    const purposeText = purpose === "email_change"
        ? "verify your new email address"
        : purpose === "profile_update"
            ? "confirm your profile changes"
            : "verify your request";

    return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', sans-serif; background: #0f0f0f; margin: 0; padding: 20px; }
        .container { max-width: 500px; margin: 0 auto; background: #1a1a1a; border-radius: 16px; overflow: hidden; border: 1px solid #333; }
        .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 30px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 24px; }
        .content { padding: 30px; color: #e5e5e5; }
        .otp-box { background: #2a2a2a; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0; }
        .otp { font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #6366f1; font-family: monospace; }
        .footer { padding: 20px 30px; background: #111; text-align: center; color: #888; font-size: 12px; }
        .warning { background: #422006; border: 1px solid #854d0e; border-radius: 8px; padding: 12px; margin-top: 20px; color: #fbbf24; font-size: 13px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 Verification Code</h1>
        </div>
        <div class="content">
            <p>Hi ${name},</p>
            <p>Use this OTP to ${purposeText}:</p>
            <div class="otp-box">
                <div class="otp">${otp}</div>
            </div>
            <p>This code expires in <strong>10 minutes</strong>.</p>
            <div class="warning">
                ⚠️ Never share this code with anyone. CampusMarket will never ask for your OTP.
            </div>
        </div>
        <div class="footer">
            <p>If you didn't request this, please ignore this email.</p>
            <p>© ${new Date().getFullYear()} CampusMarket</p>
        </div>
    </div>
</body>
</html>
    `;
}

// POST /api/otp/send - Send OTP to email
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
        const { email, purpose } = body;

        // Validate purpose
        if (!["profile_update", "email_change"].includes(purpose)) {
            return NextResponse.json({ error: "Invalid purpose" }, { status: 400 });
        }

        // Get current user
        const user = await User.findById(payload.id);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Determine which email to send to
        const targetEmail = purpose === "email_change" && email
            ? email.toLowerCase()
            : user.email;

        // For email change, verify the new email is not already taken
        if (purpose === "email_change") {
            if (!email) {
                return NextResponse.json({ error: "New email required" }, { status: 400 });
            }
            const existingUser = await User.findOne({
                email: email.toLowerCase(),
                _id: { $ne: payload.id }
            });
            if (existingUser) {
                return NextResponse.json({ error: "Email already in use" }, { status: 409 });
            }
        }

        // Rate limiting: Check if OTP was sent recently (1 minute cooldown)
        const recentOTP = await OTP.findOne({
            email: targetEmail,
            purpose,
            createdAt: { $gt: new Date(Date.now() - 60 * 1000) }
        });

        if (recentOTP) {
            const waitTime = Math.ceil((60000 - (Date.now() - recentOTP.createdAt.getTime())) / 1000);
            return NextResponse.json({
                error: `Please wait ${waitTime} seconds before requesting another OTP`
            }, { status: 429 });
        }

        // Generate OTP
        const otp = generateOTP();

        // Delete any existing OTPs for this email+purpose
        await OTP.deleteMany({ email: targetEmail, purpose });

        // Create new OTP
        await OTP.create({
            email: targetEmail,
            otp,
            purpose,
            userId: payload.id,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        });

        // Send email
        if (process.env.SMTP_USER && process.env.SMTP_PASS) {
            await transporter.sendMail({
                from: `"CampusMarket" <${process.env.SMTP_USER}>`,
                to: targetEmail,
                subject: `Your CampusMarket Verification Code: ${otp}`,
                html: getOTPEmailHTML(otp, purpose, user.name),
            });
        } else {
            // For testing without SMTP
            console.log(`[DEV] OTP for ${targetEmail}: ${otp}`);
        }

        return NextResponse.json({
            success: true,
            message: `OTP sent to ${targetEmail.replace(/(.{3})(.*)(@.*)/, "$1***$3")}`,
            email: targetEmail.replace(/(.{3})(.*)(@.*)/, "$1***$3"), // Masked email
        });
    } catch (error) {
        console.error("Error sending OTP:", error);
        return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
    }
}
