// src/app/api/society/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Society } from "@/models/Society";
import { verifyAccess } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer "))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const token = auth.split(" ")[1];
  const payload = verifyAccess(token); // { id, role, iat, exp }

  if (!payload || payload.role !== "society") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await dbConnect();
  const society = await Society.findOne({ createdBy: payload.id });
  return NextResponse.json({ society }); // can be null if not set up yet
}
