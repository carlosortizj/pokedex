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
}