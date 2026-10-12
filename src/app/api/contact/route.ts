import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";
import { requireAdminKey } from "@/lib/admin-auth";
import {
  bodyErrorResponse,
  rateLimitedResponse,
  readJsonBody,
} from "@/lib/api-utils";
import {
  ContactPatchSchema,
  ContactSchema,
  firstIssue,
} from "@/lib/api-schemas";

interface ContactPayload {
  name: string;
  email: string;
  frequency: string;
  message: string;
  receivedAt: string;
}

/**
 * Receives "transmissions" from the portfolio contact form and persists
 * them to SQLite via Prisma. Falls back to an in-memory buffer if the
 * database is unavailable so the form never hard-fails.
 */
const fallbackBuffer: ContactPayload[] = [];

async function saveTransmission(payload: ContactPayload) {
  try {
    const record = await db.transmission.create({
      data: {
        name: payload.name,
        email: payload.email,
        frequency: payload.frequency,
        message: payload.message,
      },
    });
    return { persisted: true as const, id: record.id };
  } catch (err) {
    // Fallback: keep in memory so we never lose the message during a DB hiccup
    fallbackBuffer.push(payload);
    if (fallbackBuffer.length > 100) fallbackBuffer.shift();
    console.error("[SIGNAL] DB write failed, buffered in-memory:", err);
    return { persisted: false as const, id: null };
  }
}

export async function POST(req: Request) {
  try {
    if (!checkRateLimit(req, "contact", { limit: 5, windowMs: 60_000 })) {
      return rateLimitedResponse("Too many transmissions — retry in a minute");
    }

    const parsed = ContactSchema.safeParse(await readJsonBody(req));
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: firstIssue(parsed) },
        { status: 400 }
      );
    }

    const receivedAt = new Date().toISOString();
    const result = await saveTransmission({
      name: parsed.data.name,
      email: parsed.data.email,
      frequency: parsed.data.frequency || "EARTH",
      message: parsed.data.message,
      receivedAt,
    });

    console.log("[SIGNAL] New transmission from:", parsed.data.email, "→ persisted:", result.persisted);

    return NextResponse.json({
      ok: true,
      id: result.id,
      persisted: result.persisted,
      message: "Signal received and decoded successfully.",
    });
  } catch (err) {
    const bodyErr = bodyErrorResponse(err);
    if (bodyErr) return bodyErr;
    return NextResponse.json(
      { ok: false, error: "Failed to decode transmission" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);

  // Owner inbox (private): recent messages, newest first. Admin key required.
  if (url.searchParams.get("inbox") === "1") {
    const denied = requireAdminKey(req);
    if (denied) return denied;
    try {
      const messages = await db.transmission.findMany({
        orderBy: { createdAt: "desc" },
        take: 20,
        select: {
          id: true,
          name: true,
          email: true,
          frequency: true,
          message: true,
          read: true,
          createdAt: true,
        },
      });
      return NextResponse.json({
        ok: true,
        messages: messages.map((m) => ({
          ...m,
          createdAt: m.createdAt.toISOString(),
        })),
      });
    } catch (err) {
      console.error("[SIGNAL] Inbox read failed:", err);
      return NextResponse.json(
        { ok: false, error: "Failed to read inbox" },
        { status: 500 }
      );
    }
  }

  // Public endpoint: aggregate counts only. Message contents (name/email/
  // message) are private and never exposed here.
  try {
    const [total, unread] = await Promise.all([
      db.transmission.count(),
      db.transmission.count({ where: { read: false } }),
    ]);
    return NextResponse.json({
      ok: true,
      total,
      unread,
      buffered: fallbackBuffer.length,
    });
  } catch {
    // DB unavailable — return the in-memory buffer stats instead
    return NextResponse.json({
      ok: true,
      total: fallbackBuffer.length,
      unread: fallbackBuffer.length,
      buffered: fallbackBuffer.length,
      degraded: true,
    });
  }
}

/**
 * PATCH /api/contact — mark a transmission read/unread. Admin key required.
 * Body: { id: string, read: boolean }
 */
export async function PATCH(req: Request) {
  try {
    const denied = requireAdminKey(req);
    if (denied) return denied;
    if (!checkRateLimit(req, "contact-admin", { limit: 60, windowMs: 60_000 })) {
      return rateLimitedResponse();
    }

    const parsed = ContactPatchSchema.safeParse(await readJsonBody(req));
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: firstIssue(parsed) },
        { status: 400 }
      );
    }

    await db.transmission.update({
      where: { id: parsed.data.id },
      data: { read: parsed.data.read },
    });
    return NextResponse.json({ ok: true, id: parsed.data.id, read: parsed.data.read });
  } catch (err) {
    const bodyErr = bodyErrorResponse(err);
    if (bodyErr) return bodyErr;
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code?: string }).code === "P2025"
    ) {
      return NextResponse.json(
        { ok: false, error: "Transmission not found" },
        { status: 404 }
      );
    }
    console.error("[SIGNAL] PATCH failed:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to update transmission" },
      { status: 500 }
    );
  }
}
