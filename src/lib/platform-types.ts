/**
 * Shared types for the coding-platform uplink system.
 * Used by both the server (src/lib/platform-stats.ts) and the client
 * (src/components/portfolio/Platforms.tsx).
 */

export type PlatformId = "leetcode" | "codeforces" | "github";

export const PLATFORM_IDS: PlatformId[] = ["leetcode", "codeforces", "github"];

export interface LeetCodeRecentSolve {
  title: string;
  titleSlug: string;
  timestamp: string; // ISO string
}

/** A single day of activity on a platform (heatmap cell). */
export interface DayCount {
  date: string; // YYYY-MM-DD
  count: number;
}

export interface LeetCodeStats {
  totalSolved: number;
  easy: number;
  medium: number;
  hard: number;
  ranking: number | null;
  contestRating: number | null;
  contestsAttended: number | null;
  avatarUrl: string | null;
  recentSolves: LeetCodeRecentSolve[];
  skillTags: string[];
  /** Sparse list of days with accepted submissions (UTC dates). */
  submissionDays: DayCount[];
  streak: number | null;
  totalActiveDays: number | null;
}

export interface CodeforcesHistoryPoint {
  contest: string;
  rating: number;
  rank: number | null;
  date: string; // ISO string
}

export interface CodeforcesStats {
  rating: number | null;
  maxRating: number | null;
  rank: string | null;
  maxRank: string | null;
  contribution: number;
  avatarUrl: string | null;
  /** Most recent contests (capped), oldest → newest. */
  ratingHistory: CodeforcesHistoryPoint[];
  /** Total contests ever attended (null = history unavailable). */
  contestsCount: number | null;
}

export interface GitHubStats {
  repos: number;
  stars: number;
  followers: number;
  following: number;
  memberSince: string | null;
  topLanguages: string[];
  avatarUrl: string | null;
  /** Sparse public contribution days for the trailing year (null = unavailable). */
  contributions: DayCount[] | null;
  totalContributions: number | null;
}

export type PlatformStats =
  | LeetCodeStats
  | CodeforcesStats
  | GitHubStats;

export interface PlatformResponse {
  platform: PlatformId;
  label: string;
  connected: boolean;
  handle: string | null;
  profileUrl: string | null;
  enabled: boolean;
  status: "live" | "standby" | "degraded" | "disabled";
  stats: PlatformStats | null;
  error: string | null;
  fetchedAt: string | null;
}
