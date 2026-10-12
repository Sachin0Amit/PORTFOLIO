import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";
import { requireAdminKey } from "@/lib/admin-auth";
import {
  bodyErrorResponse,
  rateLimitedResponse,
  readJsonBody,
} from "@/lib/api-utils";
import { TestimonialSchema, firstIssue } from "@/lib/api-schemas";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Allowlist for the user-supplied verification link. Accepts http(s) URLs
 * and plain email addresses only — rejects `javascript:`, `data:` and any
 * other scheme so the stored value is safe to render as an href.
 */
export function sanitizeVerifyLink(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const v = raw.trim().slice(0, 300);
  if (!v) return null;
  if (EMAIL_RE.test(v)) return v;
  try {
    const u = new URL(v);
    if (u.protocol === "http:" || u.protocol === "https:") return u.toString();
  } catch {
    // not an absolute URL
  }
  return null;
}

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
 * appears immediately (admin can hide via DELETE below).
 */
export async function POST(req: Request) {
  try {
    if (!checkRateLimit(req, "testimonials", { limit: 5, windowMs: 60_000 })) {
      return rateLimitedResponse("Too many broadcasts — retry in a minute");
    }

    const parsed = TestimonialSchema.safeParse(await readJsonBody(req));
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: firstIssue(parsed) },
        { status: 400 }
      );
    }
    const { author, role, relation, quote, rating, accent, verifyLink } =
      parsed.data;

    const record = await db.testimonial.create({
      data: {
        author,
        role,
        relation: relation || "Visitor",
        quote,
        rating,
        accent,
        verifyLink: sanitizeVerifyLink(verifyLink),
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
    const bodyErr = bodyErrorResponse(err);
    if (bodyErr) return bodyErr;
    console.error("[TESTIMONIALS] POST failed:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to broadcast testimonial" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/testimonials?id=… — hide a testimonial (soft moderation:
 * sets approved=false). Admin key required.
 */
export async function DELETE(req: Request) {
  try {
    const denied = requireAdminKey(req);
    if (denied) return denied;
    if (!checkRateLimit(req, "testimonials-admin", { limit: 60, windowMs: 60_000 })) {
      return rateLimitedResponse();
    }

    const id = new URL(req.url).searchParams.get("id")?.trim() ?? "";
    if (!id || id.length > 64) {
      return NextResponse.json(
        { ok: false, error: "id query param required" },
        { status: 400 }
      );
    }

    await db.testimonial.update({
      where: { id },
      data: { approved: false },
    });
    return NextResponse.json({ ok: true, id, approved: false });
  } catch (err) {
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code?: string }).code === "P2025"
    ) {
      return NextResponse.json(
        { ok: false, error: "Testimonial not found" },
        { status: 404 }
      );
    }
    console.error("[TESTIMONIALS] DELETE failed:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to hide testimonial" },
      { status: 500 }
    );
  }
}
