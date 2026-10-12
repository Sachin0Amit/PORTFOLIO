import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api — service health. Reports liveness plus database reachability
 * so uptime monitors and the deploy pipeline can tell "up" from "degraded".
 */
export async function GET() {
  let database: "up" | "down" = "up";
  try {
    await db.$queryRaw`SELECT 1`;
  } catch {
    database = "down";
  }
  return NextResponse.json(
    {
      ok: database === "up",
      service: "portfolio",
      time: new Date().toISOString(),
      database,
    },
    { status: database === "up" ? 200 : 503 }
  );
}
