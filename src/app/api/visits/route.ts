import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const path = typeof body.path === "string" ? body.path.slice(0, 200) : "/";
    const referrer =
      typeof body.referrer === "string" ? body.referrer.slice(0, 300) : "";

    await db.siteVisit.create({ data: { path, referrer } });
    const total = await db.siteVisit.count();

    return NextResponse.json({ success: true, total });
  } catch (error) {
    console.error("Visits API error:", error);
    return NextResponse.json({ success: false, total: 0 }, { status: 500 });
  }
}

export async function GET() {
  try {
    const total = await db.siteVisit.count();
    return NextResponse.json({ success: true, total });
  } catch {
    return NextResponse.json({ success: true, total: 0 });
  }
}
