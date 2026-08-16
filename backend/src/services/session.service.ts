import { redis } from "../config/redis.js";

const SESSION_PREFIX = "auth:session:";

export class SessionService {
  private getKey(sessionId: string) {
    return `${SESSION_PREFIX}${sessionId}`;
  }

  async createSession(
    sessionId: string,
    userId: number,
    ttlSeconds: number,
  ) {
    await redis.set(
      this.getKey(sessionId),
      userId.toString(),
      {
        EX: ttlSeconds,
      },
    );
  }

  async getUserId(sessionId: string) {
    const userId = await redis.get(
      this.getKey(sessionId),
    );

    return userId ? Number(userId) : null;
  }

  async deleteSession(sessionId: string) {
    await redis.del(this.getKey(sessionId));
  }
}