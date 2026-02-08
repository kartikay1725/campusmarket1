import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Event } from "@/models/Event";
import { verifyAccess } from "@/lib/auth";
import { getEvents } from "@/lib/events";

export async function POST(req: Request) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    verifyAccess(token);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }

  const { title, slug, description, location, startDate, endDate, societyId } = await req.json();
  await dbConnect();
  const event = await Event.create({
    title, slug, description, location,
    startDate, endDate, society: societyId
  });
  return NextResponse.json({ event });
}

export async function GET() {
  const events = await getEvents();
  return NextResponse.json({ events });
}
