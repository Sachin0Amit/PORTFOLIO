
import type {
  CodeforcesStats,
  GitHubStats,
  LeetCodeStats,
  PlatformId,
} from "./platform-types";

/**
 * Server-side fetchers for public coding-platform stats.
 *
 *  - LeetCode   → public GraphQL endpoint (no auth)
 *  - Codeforces → official REST API (no auth)
 *  - GitHub     → REST API (no auth; optional GITHUB_TOKEN env to lift rate limits)
 *
 * Results are cached in-process: 10 min on success, 2 min on failure
 * (so a flaky upstream doesn't get hammered). All requests time out at 8s.
 */

const SUCCESS_TTL_MS = 10 * 60 * 1000;
const FAILURE_TTL_MS = 2 * 60 * 1000;
const FETCH_TIMEOUT_MS = 8000;

type FetchResult<T> = { ok: true; stats: T } | { ok: false; error: string };

interface CacheEntry {
  expiresAt: number;
  value: { ok: boolean; stats?: unknown; error?: string };
}

const cache = new Map<string, CacheEntry>();

export function clearPlatformCache(platform?: PlatformId) {
  if (platform) cache.delete(platform);
  else cache.clear();
}

async function fetchJson(
  url: string,
  init?: RequestInit
): Promise<{ ok: true; data: unknown } | { ok: false; error: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        "User-Agent": "portfolio-uplink/1.0",
        ...(init?.headers ?? {}),
      },
      cache: "no-store",
    });
    if (!res.ok) {
      const rateLimited = res.status === 403 || res.status === 429;
      return {
        ok: false,
        error: rateLimited
          ? "UPSTREAM RATE LIMITED"
          : `UPSTREAM HTTP ${res.status}`,
      };
    }
    return { ok: true, data: await res.json() };
  } catch (err) {
    const timedOut = err instanceof Error && err.name === "AbortError";
    return { ok: false, error: timedOut ? "TIMEOUT" : "NETWORK UNREACHABLE" };
  } finally {
    clearTimeout(timer);
  }
}

async function withCache<T>(key: string, fetcher: () => Promise<FetchResult<T>>): Promise<FetchResult<T>> {
  const hit = cache.get(key);
  if (hit && hit.expiresAt > Date.now()) {
    return (hit.value.ok
      ? { ok: true, stats: hit.value.stats }
      : { ok: false, error: hit.value.error ?? "UNKNOWN" }) as FetchResult<T>;
  }
  const value = await fetcher();
  cache.set(key, {
    expiresAt: Date.now() + (value.ok ? SUCCESS_TTL_MS : FAILURE_TTL_MS),
    value: value.ok
      ? { ok: true, stats: value.stats }
      : { ok: false, error: value.error },
  });
  return value;
}

/* ================= LeetCode ================= */

const LC_QUERY = `query userPublicProfile($username: String!) {
  matchedUser(username: $username) {
    profile { ranking userAvatar }
    submitStatsGlobal { acSubmissionNum { difficulty count } }
  }
  userContestRanking(username: $username) { rating }
}`;

interface LcResponse {
  data?: {
    matchedUser?: {
      profile?: { ranking?: number; userAvatar?: string };
      submitStatsGlobal?: {
        acSubmissionNum?: { difficulty?: string; count?: number }[];
      };
    } | null;
    userContestRanking?: { rating?: number } | null;
  };
}

export function fetchLeetCode(handle: string): Promise<FetchResult<LeetCodeStats>> {
  return withCache("leetcode", async () => {
    const res = await fetchJson("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: "https://leetcode.com",
      },
      body: JSON.stringify({
        query: LC_QUERY,
        variables: { username: handle },
      }),
    });
    if (!res.ok) return res;
    const json = res.data as LcResponse;
    const user = json.data?.matchedUser;
    if (!user) {
      return { ok: false, error: "PROFILE NOT FOUND" };
    }
    const counts = { easy: 0, medium: 0, hard: 0, total: 0 };
    for (const row of user.submitStatsGlobal?.acSubmissionNum ?? []) {
      if (row.difficulty === "Easy") counts.easy = row.count ?? 0;
      else if (row.difficulty === "Medium") counts.medium = row.count ?? 0;
      else if (row.difficulty === "Hard") counts.hard = row.count ?? 0;
      else if (row.difficulty === "All") counts.total = row.count ?? 0;
    }
    const stats: LeetCodeStats = {
      totalSolved: counts.total || counts.easy + counts.medium + counts.hard,
      easy: counts.easy,
      medium: counts.medium,
      hard: counts.hard,
      ranking: user.profile?.ranking ?? null,
      contestRating:
        json.data?.userContestRanking?.rating != null
          ? Math.round(json.data.userContestRanking.rating)
          : null,
      avatarUrl: user.profile?.userAvatar ?? null,
    };
    return { ok: true, stats };
  });
}

/* ================= Codeforces ================= */

interface CfUser {
  rating?: number;
  maxRating?: number;
  rank?: string;
  maxRank?: string;
  contribution?: number;
  avatar?: string;
  titlePhoto?: string;
}

interface CfResponse {
  status?: string;
  result?: CfUser[];
}

export function fetchCodeforces(handle: string): Promise<FetchResult<CodeforcesStats>> {
  return withCache("codeforces", async () => {
    const res = await fetchJson(
      `https://codeforces.com/api/user.info?handles=${encodeURIComponent(handle)}`
    );
    if (!res.ok) return res;
    const json = res.data as CfResponse;
    const user = json.result?.[0];
    if (!user) return { ok: false, error: "PROFILE NOT FOUND" };
    const stats: CodeforcesStats = {
      rating: user.rating ?? null,
      maxRating: user.maxRating ?? null,
      rank: user.rank ?? null,
      maxRank: user.maxRank ?? null,
      contribution: user.contribution ?? 0,
      avatarUrl: user.avatar ?? user.titlePhoto ?? null,
    };
    return { ok: true, stats };
  });
}

/* ================= GitHub ================= */

interface GhUser {
  login?: string;
  avatar_url?: string;
  public_repos?: number;
  followers?: number;
  following?: number;
  created_at?: string;
}

interface GhRepo {
  stargazers_count?: number;
  language?: string | null;
  fork?: boolean;
}

function githubHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export function fetchGitHub(handle: string): Promise<FetchResult<GitHubStats>> {
  return withCache("github", async () => {
    const userRes = await fetchJson(
      `https://api.github.com/users/${encodeURIComponent(handle)}`,
      { headers: githubHeaders() }
    );
    if (!userRes.ok) return userRes;
    const user = userRes.data as GhUser;

    // Sum stars + top languages from the most recently pushed repos.
    let stars = 0;
    const langCounts = new Map<string, number>();
    const reposRes = await fetchJson(
      `https://api.github.com/users/${encodeURIComponent(handle)}/repos?per_page=100&sort=pushed`,
      { headers: githubHeaders() }
    );
    if (reposRes.ok) {
      for (const repo of reposRes.data as GhRepo[]) {
        if (repo.fork) continue;
        stars += repo.stargazers_count ?? 0;
        if (repo.language) {
          langCounts.set(repo.language, (langCounts.get(repo.language) ?? 0) + 1);
        }
      }
    }

    const stats: GitHubStats = {
      repos: user.public_repos ?? 0,
      stars,
      followers: user.followers ?? 0,
      following: user.following ?? 0,
      memberSince: user.created_at ?? null,
      topLanguages: [...langCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([lang]) => lang),
      avatarUrl: user.avatar_url ?? null,
    };
    return { ok: true, stats };
  });
}

/* ================= dispatcher ================= */

export const PLATFORM_FETCHERS: Record<
  PlatformId,
  (handle: string) => Promise<FetchResult<LeetCodeStats | CodeforcesStats | GitHubStats>>
> = {
  leetcode: fetchLeetCode,
  codeforces: fetchCodeforces,
  github: fetchGitHub,
};

export const PLATFORM_LABELS: Record<PlatformId, string> = {
  leetcode: "LeetCode",
  codeforces: "Codeforces",
  github: "GitHub",
};

export const PLATFORM_PROFILE_TEMPLATES: Record<PlatformId, string> = {
  leetcode: "https://leetcode.com/u/",
  codeforces: "https://codeforces.com/profile/",
  github: "https://github.com/",
};
