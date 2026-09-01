import { NextResponse } from "next/server";
import { db } from "@/lib/db";

interface TestimonialPayload {
  author?: string;
  role?: string;
  relation?: string;
  quote?: string;
  rating?: number;
  accent?: string;
  verifyLink?: string;
}

const ACCENTS = new Set(["alien", "cyan", "plasma"]);
const MAX_QUOTE = 600;
const MAX_FIELD = 120;

/**
 * GET /api/testimonials — returns all approved testimonials, newest first.
 */
export async function GET() {
  try {
    const rows = await db.testimonial.findMany({
      where: { approved: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        author: true,
        role: true,
        relation: true,
        quote: true,
        rating: true,
        accent: true,
        verifyLink: true,
        createdAt: true,
      },
    });
    return NextResponse.json({
      ok: true,
      total: rows.length,
      testimonials: rows.map((r) => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
      })),
    });
  } catch (err) {
    console.error("[TESTIMONIALS] GET failed:", err);
    return NextResponse.json(
      { ok: true, total: 0, testimonials: [], degraded: true },
      { status: 200 }
    );
  }
}

/**
 * POST /api/testimonials — submit a new testimonial. Auto-approved so it
 * appears immediately (admin can flip approved=false later to hide).
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as TestimonialPayload;

    // Validate required fields
    if (!body.author || !body.role || !body.quote) {
      return NextResponse.json(
        {
          ok: false,
          error: "Missing required fields: author, role, quote",
        },
        { status: 400 }
      );
    }

    const author = body.author.trim().slice(0, MAX_FIELD);
    const role = body.role.trim().slice(0, MAX_FIELD);
    const relation = (body.relation ?? "Visitor").trim().slice(0, MAX_FIELD);
    const quote = body.quote.trim().slice(0, MAX_QUOTE);
    const rating = Math.min(5, Math.max(1, Number(body.rating) || 5));
    const accent = ACCENTS.has(body.accent ?? "")
      ? (body.accent as string)
      : "alien";
    const verifyLink = body.verifyLink?.trim().slice(0, 300) || null;

    if (author.length < 2) {
      return NextResponse.json(
        { ok: false, error: "Name must be at least 2 characters" },
        { status: 400 }
      );
    }
    if (quote.length < 10) {
      return NextResponse.json(
        { ok: false, error: "Testimonial must be at least 10 characters" },
        { status: 400 }
      );
    }

    const record = await db.testimonial.create({
      data: {
        author,
        role,
        relation,
        quote,
        rating,
        accent,
        verifyLink,
        approved: true,
      },
    });

    console.log("[TESTIMONIALS] New testimonial from:", author);

    return NextResponse.json({
      ok: true,
      id: record.id,
      message: "Testimonial broadcast successfully.",
    });
  } catch (err) {
    console.error("[TESTIMONIALS] POST failed:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to broadcast testimonial" },
      { status: 500 }
    );
  }
}
