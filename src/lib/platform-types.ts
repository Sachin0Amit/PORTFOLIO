/**
 * Shared types for the coding-platform uplink system.
 * Used by both the server (src/lib/platform-stats.ts) and the client
 * (src/components/portfolio/Platforms.tsx).
 */

export type PlatformId = "leetcode" | "codeforces" | "github";

export const PLATFORM_IDS: PlatformId[] = ["leetcode", "codeforces", "github"];

export interface LeetCodeStats {
  totalSolved: number;
  easy: number;
  medium: number;
  hard: number;
  ranking: number | null;
  contestRating: number | null;
  avatarUrl: string | null;
}

export interface CodeforcesStats {
  rating: number | null;
  maxRating: number | null;
  rank: string | null;
  maxRank: string | null;
  contribution: number;
  avatarUrl: string | null;
}

export interface GitHubStats {
  repos: number;
  stars: number;
  followers: number;
  following: number;
  memberSince: string | null;
  topLanguages: string[];
  avatarUrl: string | null;
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
