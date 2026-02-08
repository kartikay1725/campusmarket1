import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Society } from "@/models/Society";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  await dbConnect();
  const { slug } = await params;
  const society = await Society.findOne({ slug });
  if (!society) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ society });
}
