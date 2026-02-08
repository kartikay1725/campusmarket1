import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Event } from "@/models/Event";
import { verifyAccess } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let payload;
  try { payload = verifyAccess(token); } catch { return NextResponse.json({ error: "Invalid token" }, { status: 403 }); }

  await dbConnect();
  const event = await Event.findById(params.id);
  if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });
    //eslint-disable-next-line
  const uid = (payload as any).id;
  //eslint-disable-next-line
  const already = event.interested.find((u: any) => u.toString() === uid);
  if (already) {
    //eslint-disable-next-line
    event.interested = event.interested.filter((u: any) => u.toString() !== uid);
  } else {
    event.interested.push(uid);
  }
  await event.save();

  return NextResponse.json({ interested: event.interested.length });
}
