import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Event } from "@/models/Event";
import { verifyAccess } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let payload;
  try {
    payload = verifyAccess(token) as { id: string };
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }

  await dbConnect();
  const { id } = await params;
  const event = await Event.findById(id);
  if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const uid = payload.id;
  const interested = event.interested.map((u: { toString: () => string }) => u.toString());
  const index = interested.indexOf(uid);

  if (index !== -1) {
    event.interested.splice(index, 1);
  } else {
    event.interested.push(uid);
  }
  await event.save();

  return NextResponse.json({ interested: event.interested.length });
}
