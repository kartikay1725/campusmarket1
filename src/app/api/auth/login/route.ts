import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { User } from "@/models/User";
import { College } from "@/models/College";
import { verifyPassword, signAccess, signRefresh, setRefreshCookie } from "@/lib/auth";

import { rateLimiter, getClientId, RATE_LIMITS } from "@/lib/rateLimit";

// Ensure College model is registered for populate
void College;

export async function POST(req: Request) {
  // Rate limiting
  const clientId = getClientId(req);
  const rateCheck = rateLimiter.check(clientId, RATE_LIMITS.AUTH.maxRequests, RATE_LIMITS.AUTH.windowMs);

  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: "Too many login attempts. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(rateCheck.resetIn / 1000)) }
      }
    );
  }

  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  await dbConnect();

  const user = await User.findOne({ email: email.toLowerCase() })
    .populate("college", "name shortCode");

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const access = signAccess({ id: user._id, role: user.role });
  const refresh = signRefresh({ id: user._id, role: user.role });
  await setRefreshCookie(refresh);

  return NextResponse.json({
    access,
    refresh,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      college: user.college,
      wallet: user.wallet
    }
  });
}
