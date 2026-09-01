import { NextResponse } from "next/server";
import { db } from "@/lib/db";

interface ContactPayload {
  name?: string;
  email?: string;
  frequency?: string;
  message?: string;
}

/**
 * Receives "transmissions" from the portfolio contact form and persists
 * them to SQLite via Prisma. Falls back to an in-memory buffer if the
 * database is unavailable so the form never hard-fails.
 */
const fallbackBuffer: Array<ContactPayload & { receivedAt: string }> = [];

async function saveTransmission(payload: ContactPayload & { receivedAt: string }) {
  try {
    const record = await db.transmission.create({
      data: {
        name: payload.name!,
        email: payload.email!,
        frequency: payload.frequency ?? "EARTH",
        message: payload.message!,
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
    const body = (await req.json()) as ContactPayload;

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields: name, email, message" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { ok: false, error: "Invalid return frequency (email)" },
        { status: 400 }
      );
    }

    if (body.message.length > 5000) {
      return NextResponse.json(
        { ok: false, error: "Message payload exceeds 5000 characters" },
        { status: 400 }
      );
    }

    const receivedAt = new Date().toISOString();
    const result = await saveTransmission({ ...body, receivedAt });

    console.log("[SIGNAL] New transmission from:", body.email, "→ persisted:", result.persisted);

    return NextResponse.json({
      ok: true,
      id: result.id,
      persisted: result.persisted,
      message: "Signal received and decoded successfully.",
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Failed to decode transmission" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const [total, unread] = await Promise.all([
      db.transmission.count(),
      db.transmission.count({ where: { read: false } }),
    ]);
    const latest = await db.transmission.findFirst({
      orderBy: { createdAt: "desc" },
      select: {
        name: true,
        email: true,
        message: true,
        createdAt: true,
      },
    });
    return NextResponse.json({
      ok: true,
      total,
      unread,
      buffered: fallbackBuffer.length,
      latest: latest
        ? {
            name: latest.name,
            email: latest.email,
            message: latest.message,
            receivedAt: latest.createdAt.toISOString(),
          }
        : fallbackBuffer[fallbackBuffer.length - 1] ?? null,
    });
  } catch {
    // DB unavailable — return the in-memory buffer stats instead
    return NextResponse.json({
      ok: true,
      total: fallbackBuffer.length,
      unread: fallbackBuffer.length,
      buffered: fallbackBuffer.length,
      latest: fallbackBuffer[fallbackBuffer.length - 1] ?? null,
      degraded: true,
    });
  }
}
