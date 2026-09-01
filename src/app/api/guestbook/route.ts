import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const guestbookSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(60),
  message: z.string().min(3, "Message must be at least 3 characters").max(280),
  country: z.string().max(60).optional().default(""),
});

export async function GET() {
  try {
    const entries = await db.guestbookEntry.findMany({
      orderBy: { createdAt: "desc" },
      take: 30,
    });
    return NextResponse.json({ success: true, entries });
  } catch (error) {
    console.error("Guestbook GET error:", error);
    return NextResponse.json({ success: false, entries: [] }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = guestbookSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const entry = await db.guestbookEntry.create({
      data: parsed.data,
    });

    return NextResponse.json({ success: true, entry });
  } catch (error) {
    console.error("Guestbook POST error:", error);
    return NextResponse.json(
      { success: false, error: "Could not sign the guestbook. Try again." },
      { status: 500 }
    );
  }
}
