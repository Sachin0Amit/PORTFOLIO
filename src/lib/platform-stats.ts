
import type {
  CodeforcesStats,
  DayCount,
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

type FetchResult<T> =
  | { ok: true; stats: T; ttlMs?: number }
  | { ok: false; error: string; ttlMs?: number };

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
  const raw = await fetchTextRaw(url, init);
  if (!raw.ok) return raw;
  try {
    return { ok: true, data: JSON.parse(raw.text) };
  } catch {
    return { ok: false, error: "UPSTREAM MALFORMED" };
  }
}

/** Shared transport (timeout + rate-limit mapping) for JSON and HTML fetches. */
async function fetchTextRaw(
  url: string,
  init?: RequestInit
): Promise<{ ok: true; text: string } | { ok: false; error: string }> {
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
    return { ok: true, text: await res.text() };
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
    expiresAt:
      Date.now() +
      (value.ok
        ? value.ttlMs ?? SUCCESS_TTL_MS
        : value.ttlMs ?? FAILURE_TTL_MS),
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
    tagProblemCounts {
      fundamental { tagName problemsSolved }
      intermediate { tagName problemsSolved }
      advanced { tagName problemsSolved }
    }
    userCalendar { streak totalActiveDays submissionCalendar }
  }
  userContestRanking(username: $username) { rating attendedContestsCount }
  recentAcSubmissionList(username: $username, limit: 3) {
    title
    titleSlug
    timestamp
  }
}`;

interface LcTagCount {
  tagName?: string;
  problemsSolved?: number;
}

interface LcResponse {
  data?: {
    matchedUser?: {
      profile?: { ranking?: number; userAvatar?: string };
      submitStatsGlobal?: {
        acSubmissionNum?: { difficulty?: string; count?: number }[];
      };
      tagProblemCounts?: {
        fundamental?: LcTagCount[];
        intermediate?: LcTagCount[];
        advanced?: LcTagCount[];
      };
      userCalendar?: {
        streak?: number;
        totalActiveDays?: number;
        submissionCalendar?: string;
      };
    } | null;
    userContestRanking?: {
      rating?: number;
      attendedContestsCount?: number;
    } | null;
    recentAcSubmissionList?: {
      title?: string;
      titleSlug?: string;
      timestamp?: string;
    }[] | null;
  };
}

/** Parse LeetCode's submissionCalendar JSON string into sparse day-counts. */
function parseLcCalendar(raw: string | undefined): DayCount[] {
  if (!raw) return [];
  try {
    const cal = JSON.parse(raw) as Record<string, number>;
    return Object.entries(cal)
      .map(([ts, count]) => ({
        date: new Date(Number(ts) * 1000).toISOString().slice(0, 10),
        count,
      }))
      .filter((d) => d.count > 0)
      .sort((a, b) => a.date.localeCompare(b.date));
  } catch {
    return [];
  }
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

    // Recent accepted submissions → problem feed (skip malformed rows)
    const recentSolves = (json.data?.recentAcSubmissionList ?? [])
      .filter(
        (s): s is { title: string; titleSlug: string; timestamp: string } =>
          Boolean(s.title && s.titleSlug && s.timestamp)
      )
      .slice(0, 3)
      .map((s) => ({
        title: s.title,
        titleSlug: s.titleSlug,
        // LeetCode returns unix seconds as a string
        timestamp: new Date(Number(s.timestamp) * 1000).toISOString(),
      }));

    // Skill tags from solved-problem topic counts (dedup, most-solved first)
    const tagMap = new Map<string, number>();
    for (const tier of [
      user.tagProblemCounts?.fundamental,
      user.tagProblemCounts?.intermediate,
      user.tagProblemCounts?.advanced,
    ]) {
      for (const tag of tier ?? []) {
        if (!tag.tagName) continue;
        tagMap.set(
          tag.tagName,
          Math.max(tagMap.get(tag.tagName) ?? 0, tag.problemsSolved ?? 0)
        );
      }
    }
    const skillTags = [...tagMap.entries()]
      .filter(([, n]) => n > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([name]) => name);

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
      contestsAttended:
        json.data?.userContestRanking?.attendedContestsCount ?? 0,
      avatarUrl: user.profile?.userAvatar ?? null,
      recentSolves,
      skillTags,
      submissionDays: parseLcCalendar(user.userCalendar?.submissionCalendar),
      streak: user.userCalendar?.streak ?? null,
      totalActiveDays: user.userCalendar?.totalActiveDays ?? null,
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

interface CfRatingEntry {
  contestId?: number;
  contestName?: string;
  rank?: number;
  ratingUpdateTimeSeconds?: number;
  newRating?: number;
}

interface CfRatingResponse {
  status?: string;
  result?: CfRatingEntry[];
}

const CF_HISTORY_CAP = 30;

export function fetchCodeforces(handle: string): Promise<FetchResult<CodeforcesStats>> {
  return withCache("codeforces", async () => {
    const res = await fetchJson(
      `https://codeforces.com/api/user.info?handles=${encodeURIComponent(handle)}`
    );
    if (!res.ok) return res;
    const json = res.data as CfResponse;
    const user = json.result?.[0];
    if (!user) return { ok: false, error: "PROFILE NOT FOUND" };

    // Rating trajectory (optional — profile stays live if history unavailable)
    let ratingHistory: CodeforcesStats["ratingHistory"] = [];
    let contestsCount: number | null = null;
    const histRes = await fetchJson(
      `https://codeforces.com/api/user.rating?handle=${encodeURIComponent(handle)}`
    );
    if (histRes.ok) {
      const entries = (histRes.data as CfRatingResponse).result ?? [];
      contestsCount = entries.length;
      ratingHistory = entries.slice(-CF_HISTORY_CAP).map((e) => ({
        contest: e.contestName ?? "Contest",
        rating: e.newRating ?? 0,
        rank: e.rank ?? null,
        date: new Date(
          (e.ratingUpdateTimeSeconds ?? 0) * 1000
        ).toISOString(),
      }));
    }

    const stats: CodeforcesStats = {
      rating: user.rating ?? null,
      maxRating: user.maxRating ?? null,
      rank: user.rank ?? null,
      maxRank: user.maxRank ?? null,
      contribution: user.contribution ?? 0,
      avatarUrl: user.avatar ?? user.titlePhoto ?? null,
      ratingHistory,
      contestsCount,
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

/**
 * Scrape the public contributions calendar from github.com/users/{h}/contributions.
 * The page ships a server-rendered grid: <td data-date id="contribution-day-component-D-W"
 * data-level> cells + <tool-tip for="..."> elements holding exact counts.
 * Returns null whenever the structure doesn't match (grid simply not shown).
 */
const GH_SCRAPE_UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

function parseGhContributions(html: string): DayCount[] | null {
  const counts = new Map<string, number>();
  for (const m of html.matchAll(
    /for="(contribution-day-component-\d+-\d+)"[^>]*>([\s\S]*?)<\/tool-tip>/g
  )) {
    const text = m[2].replace(/<[^>]+>/g, " ");
    const n = text.match(/(\d+)\s+contributions?/);
    if (n) counts.set(m[1], parseInt(n[1], 10));
  }

  const days: DayCount[] = [];
  let parsedCells = 0;
  for (const m of html.matchAll(
    /data-date="(\d{4}-\d{2}-\d{2})"[^>]*id="(contribution-day-component-\d+-\d+)"[^>]*data-level="(\d)"/g
  )) {
    parsedCells++;
    const count = counts.get(m[2]) ?? 0;
    if (count > 0) days.push({ date: m[1], count });
  }
  // A full year renders 364-372 cells; fewer means GitHub changed the page.
  if (parsedCells < 300) return null;
  days.sort((a, b) => a.date.localeCompare(b.date));
  return days;
}

async function fetchGhContributions(
  handle: string
): Promise<{ days: DayCount[] | null }> {
  const res = await fetchTextRaw(
    `https://github.com/users/${encodeURIComponent(handle)}/contributions`,
    {
      headers: {
        "User-Agent": GH_SCRAPE_UA,
        Accept: "text/html",
      },
    }
  );
  if (!res.ok) return { days: null };
  return { days: parseGhContributions(res.text) };
}

/* ---- token-less fallback scrapers (different rate bucket than the API) ---- */

/** "1.2k" / "3,400" / "12" → number. */
function parseGhCount(raw: string): number {
  const s = raw.trim().replace(/,/g, "");
  const n = parseFloat(s);
  if (Number.isNaN(n)) return 0;
  return Math.round(/k/i.test(s) ? n * 1000 : n);
}

interface GhProfileScrape {
  avatarUrl: string | null;
  repos: number | null;
}

/**
 * The signed-out profile page ships `<meta property="og:description"
 * content="{user} has N repositories available…">` and an og:image avatar.
 * Both are stable GitHub metadata tags.
 */
function parseGhProfileHtml(html: string): GhProfileScrape {
  const avatarUrl =
    html.match(/<meta property="og:image" content="([^"]+)"/)?.[1] ?? null;
  const repoMatch = html.match(/has ([\d.,]+) repositories? available/);
  return {
    avatarUrl,
    repos: repoMatch ? parseGhCount(repoMatch[1]) : null,
  };
}

/**
 * The public repositories tab lists each repo with
 * `<span id="repo-stars-counter-star">N</span>` (omitted at 0 stars) and
 * `<span itemprop="programmingLanguage">X</span>` chips.
 */
function parseGhReposHtml(html: string): {
  stars: number;
  languages: [string, number][];
} {
  let stars = 0;
  for (const m of html.matchAll(/repo-stars-counter-star[^>]*>([\d.,]+[kK]?)/g)) {
    stars += parseGhCount(m[1]);
  }
  const langCounts = new Map<string, number>();
  for (const m of html.matchAll(/itemprop="programmingLanguage">([^<]+)</g)) {
    const lang = m[1].trim();
    if (lang) langCounts.set(lang, (langCounts.get(lang) ?? 0) + 1);
  }
  return { stars, languages: [...langCounts.entries()] };
}

async function fetchGhHtml(
  path: string
): Promise<{ ok: true; text: string } | { ok: false }> {
  const res = await fetchTextRaw(`https://github.com${path}`, {
    headers: { "User-Agent": GH_SCRAPE_UA, Accept: "text/html" },
  });
  return res.ok ? { ok: true, text: res.text } : { ok: false };
}

export function fetchGitHub(handle: string): Promise<FetchResult<GitHubStats>> {
  return withCache("github", async () => {
    const enc = encodeURIComponent(handle);
    // API profile, API repos and the HTML contribution grid are independent —
    // fetch them in parallel so one slow upstream never blocks the card.
    const [userRes, reposRes, contribRes] = await Promise.all([
      fetchJson(`https://api.github.com/users/${enc}`, {
        headers: githubHeaders(),
      }),
      fetchJson(
        `https://api.github.com/users/${enc}/repos?per_page=100&sort=pushed`,
        { headers: githubHeaders() }
      ),
      fetchGhContributions(handle),
    ]);

    if (!userRes.ok) {
      // 404 etc. are real errors; rate limiting gets the HTML fallback.
      if (userRes.error !== "UPSTREAM RATE LIMITED") return userRes;
      return ghScrapeFallback(handle, contribRes.days);
    }

    const user = userRes.data as GhUser;

    // Sum stars + top languages from the most recently pushed repos.
    let stars = 0;
    const langCounts = new Map<string, number>();
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
      contributions: contribRes.days,
      totalContributions:
        contribRes.days == null
          ? null
          : contribRes.days.reduce((sum, d) => sum + d.count, 0),
    };
    return { ok: true, stats };
  });
}

/**
 * API throttled → rebuild the card from public HTML pages (profile +
 * repositories tab + contribution grid, all outside the API rate bucket).
 * Follower/following counts aren't exposed there, so the UI marks the
 * feed "partial". Cached for the failure TTL only, so the full API is
 * retried soon after the hourly quota resets.
 */
async function ghScrapeFallback(
  handle: string,
  contributions: DayCount[] | null
): Promise<FetchResult<GitHubStats>> {
  const [profileRes, reposTabRes] = await Promise.all([
    fetchGhHtml(`/${encodeURIComponent(handle)}`),
    fetchGhHtml(`/${encodeURIComponent(handle)}?tab=repositories`),
  ]);
  const profile =
    profileRes.ok ? parseGhProfileHtml(profileRes.text) : null;
  const reposTab = reposTabRes.ok ? parseGhReposHtml(reposTabRes.text) : null;

  if (!profile && contributions == null) {
    return { ok: false, error: "UPSTREAM RATE LIMITED" };
  }

  const stats: GitHubStats = {
    repos: profile?.repos ?? 0,
    stars: reposTab?.stars ?? 0,
    followers: 0,
    following: 0,
    memberSince: null,
    topLanguages: [...(reposTab?.languages ?? [])]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([lang]) => lang),
    avatarUrl: profile?.avatarUrl ?? null,
    contributions,
    totalContributions:
      contributions == null
        ? null
        : contributions.reduce((sum, d) => sum + d.count, 0),
    partial: true,
  };
  return { ok: true, stats, ttlMs: FAILURE_TTL_MS };
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
