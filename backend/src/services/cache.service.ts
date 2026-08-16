import { redis } from "../config/redis.js";

export class CacheService {
  async get<T>(key: string): Promise<T | null> {
    const value = await redis.get(key);

    if (!value) {
      return null;
    }

    return JSON.parse(value) as T;
  }

  async set<T>(
    key: string,
    value: T,
    ttlSeconds: number,
  ): Promise<void> {
    await redis.set(key, JSON.stringify(value), {
      EX: ttlSeconds,
    });
  }

  async delete(key: string): Promise<void> {
    await redis.del(key);
  }

  async deleteByPattern(pattern: string): Promise<void> {
    let cursor = "0";

    do {
      const result = await redis.scan(cursor, {
        MATCH: pattern,
        COUNT: 100,
      });

      cursor = result.cursor;

      if (result.keys.length > 0) {
        await redis.del(result.keys);
      }
    } while (cursor !== "0");
  }
}