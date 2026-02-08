import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { User } from "@/models/User";
import { hashPassword, signAccess, signRefresh, setRefreshCookie } from "@/lib/auth";

export async function POST(req: Request) {
  const { email, password, name, phone, college } = await req.json();

  if (!email || !password || !name) {
    return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 });
  }

  await dbConnect();

  const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json({ error: "User already exists" }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const user = await User.create({
    email: email.toLowerCase(),
    passwordHash,
    name,
    phone,
    college,
    role: "student",
    wallet: 0
  });

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
      college: user.college
    },
  });
}
