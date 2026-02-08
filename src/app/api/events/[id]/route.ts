import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Event } from "@/models/Event";
import { verifyAccess } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    verifyAccess(token);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }

  const updates = await req.json();
  await dbConnect();
  const { id } = await params;
  const event = await Event.findByIdAndUpdate(id, updates, { new: true });
  return NextResponse.json({ event });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    verifyAccess(token);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }

  await dbConnect();
  const { id } = await params;
  await Event.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
