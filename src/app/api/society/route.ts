import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Society } from "@/models/Society";
import { verifyAccess } from "@/lib/auth";

export async function POST(req: Request) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let payload;
  try { payload = verifyAccess(token); } catch { return NextResponse.json({ error: "Invalid token" }, { status: 403 }); }

  const { name, tagline, description, slug, socials } = await req.json();

  await dbConnect();
  const society = await Society.create({
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    name, tagline, description, slug, socials, createdBy: (payload as any).id
  });

  return NextResponse.json({ society });
}

export async function PUT(req: Request) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let payload;
  try { payload = verifyAccess(token); } catch { return NextResponse.json({ error: "Invalid token" }, { status: 403 }); }

  const { id, ...updates } = await req.json();

  await dbConnect();
  const society = await Society.findOneAndUpdate(
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    { _id: id, createdBy: (payload as any).id },
    updates,
    { new: true }
  );
  if (!society) return NextResponse.json({ error: "Not found or no permission" }, { status: 404 });

  return NextResponse.json({ society });
}
