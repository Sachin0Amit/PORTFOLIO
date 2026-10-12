import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { requireAdminKey } from "@/lib/admin-auth";
import {
  bodyErrorResponse,
  rateLimitedResponse,
  readJsonBody,
} from "@/lib/api-utils";
import { PlatformUpdateSchema, firstIssue } from "@/lib/api-schemas";
import { db } from "@/lib/db";
import {
  PLATFORM_FETCHERS,
  PLATFORM_LABELS,
  PLATFORM_PROFILE_TEMPLATES,
  clearPlatformCache,
} from "@/lib/platform-stats";
import {
  PLATFORM_IDS,
  type PlatformId,
  type PlatformResponse,
} from "@/lib/platform-types";

/**
 * GET /api/platforms — live stats for every coding-platform uplink.
 * Platforms without a stored handle come back as `standby` (awaiting uplink).
 */
export async function GET() {
  // Read DB configs (missing rows are fine — defaults are synthesized)
  let rows: Awaited<ReturnType<typeof db.platformConfig.findMany>> = [];
  try {
    rows = await db.platformConfig.findMany();
  } catch (err) {
    console.error("[UPLINK] GET config read failed:", err);
  }
  const byPlatform = new Map(rows.map((r) => [r.platform, r]));

  const results = await Promise.all(
    PLATFORM_IDS.map(async (platform): Promise<PlatformResponse> => {
      const row = byPlatform.get(platform);
      const connected = Boolean(row?.handle);
      const handle = row?.handle ?? null;
      const profileUrl =
        row?.profileUrl ??
        (handle ? PLATFORM_PROFILE_TEMPLATES[platform] + handle : null);
      const enabled = row?.enabled ?? true;

      if (!enabled) {
        return {
          platform,
          label: PLATFORM_LABELS[platform],
          connected: false,
          handle: null,
          profileUrl,
          enabled: false,
          status: "disabled",
          stats: null,
          error: null,
          fetchedAt: null,
        };
      }

      if (!connected || !handle) {
        return {
          platform,
          label: PLATFORM_LABELS[platform],
          connected: false,
          handle: null,
          profileUrl,
          enabled: true,
          status: "standby",
          stats: null,
          error: null,
          fetchedAt: null,
        };
      }

      // One platform's failure must never take down the other cards.
      let res: Awaited<ReturnType<(typeof PLATFORM_FETCHERS)[typeof platform]>>;
      try {
        res = await PLATFORM_FETCHERS[platform](handle);
      } catch (err) {
        console.error(`[UPLINK] ${platform} fetcher threw:`, err);
        res = { ok: false, error: "UPSTREAM UNREACHABLE" };
      }
      if (res.ok) {
        return {
          platform,
          label: PLATFORM_LABELS[platform],
          connected: true,
          handle,
          profileUrl,
          enabled: true,
          status: "live",
          stats: res.stats,
          error: null,
          fetchedAt: new Date().toISOString(),
        };
      }
      return {
        platform,
        label: PLATFORM_LABELS[platform],
        connected: true,
        handle,
        profileUrl,
        enabled: true,
        status: "degraded",
        stats: null,
        error: res.error,
        fetchedAt: null,
      };
    })
  );

  return NextResponse.json({ ok: true, platforms: results });
}

/**
 * POST /api/platforms — connect (or update) a platform uplink.
 * Body: { platform: "leetcode" | "codeforces" | "github",
 *         handle: "username", profileUrl?: "https://..." }
 *
 * Admin key required (see requireAdminKey — fail-closed in production).
 */
export async function POST(req: Request) {
  try {
    const denied = requireAdminKey(req);
    if (denied) return denied;
    if (!checkRateLimit(req, "platforms", { limit: 20, windowMs: 60_000 })) {
      return rateLimitedResponse();
    }

    const parsed = PlatformUpdateSchema.safeParse(await readJsonBody(req));
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: firstIssue(parsed) },
        { status: 400 }
      );
    }
    const { platform, handle, profileUrl, enabled } = parsed.data;

    const record = await db.platformConfig.upsert({
      where: { platform },
      update: {
        handle,
        profileUrl,
        ...(typeof enabled === "boolean" ? { enabled } : {}),
      },
      create: {
        platform,
        handle,
        profileUrl,
        enabled: enabled ?? true,
        sortOrder: PLATFORM_IDS.indexOf(platform),
      },
    });

    // Fresh stats on next GET
    clearPlatformCache(platform);

    console.log(`[UPLINK] ${platform} ${handle ? `connected as @${handle}` : "disconnected"}`);
    return NextResponse.json({
      ok: true,
      platform: record.platform,
      handle: record.handle,
      profileUrl: record.profileUrl,
      enabled: record.enabled,
    });
  } catch (err) {
    const bodyErr = bodyErrorResponse(err);
    if (bodyErr) return bodyErr;
    console.error("[UPLINK] POST failed:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to save uplink config" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/platforms?platform=leetcode — disconnect a platform
 * (clears the handle, card returns to standby).
 */
export async function DELETE(req: Request) {
  try {
    const denied = requireAdminKey(req);
    if (denied) return denied;
    if (!checkRateLimit(req, "platforms", { limit: 20, windowMs: 60_000 })) {
      return rateLimitedResponse();
    }

    const platform = new URL(req.url).searchParams.get("platform") as
      | PlatformId
      | null;
    if (!platform || !PLATFORM_IDS.includes(platform)) {
      return NextResponse.json(
        { ok: false, error: "platform query param required" },
        { status: 400 }
      );
    }

    await db.platformConfig.update({
      where: { platform },
      data: { handle: null, profileUrl: null },
    });
    clearPlatformCache(platform);

    return NextResponse.json({ ok: true, platform, handle: null });
  } catch (err) {
    console.error("[UPLINK] DELETE failed:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to disconnect uplink" },
      { status: 500 }
    );
  }
}
