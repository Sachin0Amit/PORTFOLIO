import { NextResponse } from "next/server";

/**
 * Shared admin guard for mutating/reading private API surface
 * (uplink config, message inbox, testimonial moderation).
 *
 * - UPLINK_ADMIN_KEY set   → request must send `x-uplink-key: <same value>`
 * - Key unset + production → fail-closed (503), never silently open
 * - Key unset + dev        → open (local development convenience)
 *
 * Returns an error response when denied, or null when allowed.
 */
export function requireAdminKey(req: Request): NextResponse | null {
  const adminKey = process.env.UPLINK_ADMIN_KEY;
  if (!adminKey) {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { ok: false, error: "Admin access is not configured" },
        { status: 503 }
      );
    }
    return null;
  }
  if (req.headers.get("x-uplink-key") !== adminKey) {
    return NextResponse.json(
      { ok: false, error: "Invalid admin key" },
      { status: 401 }
    );
  }
  return null;
}
