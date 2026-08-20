/**
 * MockExams: Redis Caching Layer
 * Handles leaderboard, streaks, badges, session caching
 * TTL: 24 hours for leaderboard, 7 days for streaks
 */

import Redis from "ioredis";

interface LeaderboardEntry {
  rank: number;
  studentId: string;
  studentName: string;
  totalPoints: number;
  testsPassed: number;
  averageScore: number;
  streak: number;
}

interface StudentStreak {
  studentId: string;
  currentStreak: number;
  longestStreak: number;
  lastReviewDate: string;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedDate: string;
}

export class RedisCache {
  private client: Redis;
  private TTL = {
    LEADERBOARD: 24 * 60 * 60, // 24 hours
    STREAK: 7 * 24 * 60 * 60, // 7 days
    SESSION: 24 * 60 * 60, // 24 hours
    BADGES: 7 * 24 * 60 * 60, // 7 days
  };

  constructor(redisUrl: string = process.env.REDIS_URL || "redis://localhost:6379") {
    this.client = new Redis(redisUrl);
    this.setupErrorHandling();
  }

  /**
   * Setup error handling for Redis
   */
  private setupErrorHandling(): void {
    this.client.on("error", (err) => {
      console.error("Redis error:", err);
    });

    this.client.on("reconnecting", () => {
      console.log("Redis reconnecting...");
    });
  }

  /**
   * Update leaderboard (top 100 students)
   */
  async updateLeaderboard(entries: LeaderboardEntry[]): Promise<void> {
    const key = "leaderboard:global:top100";

    // Clear existing leaderboard
    await this.client.del(key);

    // Add new entries
    for (const entry of entries.slice(0, 100)) {
      await this.client.zadd(
        key,
        -(entry.totalPoints), // Negative score for descending order
        JSON.stringify(entry)
      );
    }

    // Set expiration
    await this.client.expire(key, this.TTL.LEADERBOARD);
  }

  /**
   * Get top N students from leaderboard
   */
  async getTopStudents(limit: number = 10): Promise<LeaderboardEntry[]> {
    const key = "leaderboard:global:top100";

    const results = await this.client.zrange(key, 0, limit - 1);

    if (!results || results.length === 0) {
      return [];
    }

    return results.map((r) => JSON.parse(r));
  }

  /**
   * Get student rank from leaderboard
   */
  async getStudentRank(studentId: string): Promise<number | null> {
    const key = "leaderboard:global:top100";

    const entries = await this.client.zrange(key, 0, -1);

    for (let i = 0; i < (entries || []).length; i++) {
      const entry = JSON.parse(entries![i]);
      if (entry.studentId === studentId) {
        return i + 1;
      }
    }

    return null;
  }

  /**
   * Update student streak
   */
  async updateStreak(
    studentId: string,
    currentStreak: number,
    longestStreak: number
  ): Promise<void> {
    const key = `streak:${studentId}`;

    const data: StudentStreak = {
      studentId,
      currentStreak,
      longestStreak,
      lastReviewDate: new Date().toISOString(),
    };

    await this.client.setex(
      key,
      this.TTL.STREAK,
      JSON.stringify(data)
    );
  }

  /**
   * Get student streak
   */
  async getStreak(studentId: string): Promise<StudentStreak | null> {
    const key = `streak:${studentId}`;

    const data = await this.client.get(key);

    return data ? JSON.parse(data) : null;
  }

  /**
   * Increment daily streak
   */
  async incrementStreak(studentId: string): Promise<StudentStreak> {
    const key = `streak:${studentId}`;

    const existing = await this.getStreak(studentId);

    const today = new Date().toDateString();
    const lastDate = existing?.lastReviewDate
      ? new Date(existing.lastReviewDate).toDateString()
      : null;

    let newStreak = 1;
    let longestStreak = 1;

    if (lastDate === today) {
      // Already reviewed today
      newStreak = existing?.currentStreak || 1;
      longestStreak = existing?.longestStreak || 1;
    } else if (lastDate) {
      // Yesterday was the last review
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (lastDate === yesterday.toDateString()) {
        newStreak = (existing?.currentStreak || 0) + 1;
        longestStreak = Math.max(newStreak, existing?.longestStreak || 1);
      }
    }

    const updated: StudentStreak = {
      studentId,
      currentStreak: newStreak,
      longestStreak,
      lastReviewDate: new Date().toISOString(),
    };

    await this.client.setex(key, this.TTL.STREAK, JSON.stringify(updated));

    return updated;
  }

  /**
   * Add badge to student
   */
  async addBadge(studentId: string, badge: Badge): Promise<void> {
    const key = `badges:${studentId}`;

    await this.client.lpush(key, JSON.stringify(badge));
    await this.client.expire(key, this.TTL.BADGES);
  }

  /**
   * Get student badges
   */
  async getBadges(studentId: string): Promise<Badge[]> {
    const key = `badges:${studentId}`;

    const badges = await this.client.lrange(key, 0, -1);

    return (badges || []).map((b) => JSON.parse(b));
  }

  /**
   * Check if student has badge
   */
  async hasBadge(studentId: string, badgeId: string): Promise<boolean> {
    const badges = await this.getBadges(studentId);
    return badges.some((b) => b.id === badgeId);
  }

  /**
   * Cache session data
   */
  async setSession(
    sessionId: string,
    data: Record<string, unknown>
  ): Promise<void> {
    const key = `session:${sessionId}`;

    await this.client.setex(
      key,
      this.TTL.SESSION,
      JSON.stringify(data)
    );
  }

  /**
   * Get session data
   */
  async getSession(sessionId: string): Promise<Record<string, unknown> | null> {
    const key = `session:${sessionId}`;

    const data = await this.client.get(key);

    return data ? JSON.parse(data) : null;
  }

  /**
   * Delete session
   */
  async deleteSession(sessionId: string): Promise<void> {
    const key = `session:${sessionId}`;
    await this.client.del(key);
  }

  /**
   * Cache frequently accessed data (e.g., topic stats)
   */
  async cacheTopicStats(
    studentId: string,
    nodeId: string,
    stats: Record<string, unknown>
  ): Promise<void> {
    const key = `stats:${studentId}:${nodeId}`;

    await this.client.setex(
      key,
      this.TTL.LEADERBOARD,
      JSON.stringify(stats)
    );
  }

  /**
   * Get cached topic stats
   */
  async getTopicStats(
    studentId: string,
    nodeId: string
  ): Promise<Record<string, unknown> | null> {
    const key = `stats:${studentId}:${nodeId}`;

    const data = await this.client.get(key);

    return data ? JSON.parse(data) : null;
  }

  /**
   * Invalidate cache by pattern
   */
  async invalidateByPattern(pattern: string): Promise<void> {
    const keys = await this.client.keys(pattern);

    if (keys.length > 0) {
      await this.client.del(...keys);
    }
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<{
    connectedClients: number;
    usedMemory: string;
    keysCount: number;
  }> {
    const info = await this.client.info("stats");
    const memoryInfo = await this.client.info("memory");

    const stats = this.parseRedisInfo(info);
    const memory = this.parseRedisInfo(memoryInfo);

    const dbSize = await this.client.dbsize();

    return {
      connectedClients: parseInt(stats.connected_clients || "0"),
      usedMemory: memory.used_memory_human || "0B",
      keysCount: dbSize,
    };
  }

  /**
   * Parse Redis INFO response
   */
  private parseRedisInfo(
    info: string
  ): Record<string, string> {
    const result: Record<string, string> = {};

    info.split("\r\n").forEach((line) => {
      if (!line.startsWith("#")) {
        const [key, value] = line.split(":");
        if (key && value) {
          result[key] = value;
        }
      }
    });

    return result;
  }

  /**
   * Flush all cache (use with caution!)
   */
  async flushAll(): Promise<void> {
    await this.client.flushall();
  }

  /**
   * Close Redis connection
   */
  async disconnect(): Promise<void> {
    await this.client.quit();
  }
}

/**
 * Initialize Redis cache
 */
export function initializeRedisCache(): RedisCache {
  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    console.warn(
      "REDIS_URL not configured. Using in-memory mock (NOT for production)"
    );
  }

  return new RedisCache(redisUrl);
}
