import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.REDIS_URL || '',
  token: process.env.REDIS_TOKEN || '',
});

interface CacheOptions {
  ttl?: number; // Time to live in seconds
}

export class Cache {
  private static instance: Cache;
  private redis: Redis;

  private constructor() {
    this.redis = redis;
  }

  public static getInstance(): Cache {
    if (!Cache.instance) {
      Cache.instance = new Cache();
    }
    return Cache.instance;
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.redis.get<T>(key);
      return data;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key: string, value: any, options: CacheOptions = {}): Promise<void> {
    try {
      if (options.ttl) {
        await this.redis.set(key, value, { ex: options.ttl });
      } else {
        await this.redis.set(key, value);
      }
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  async clear(): Promise<void> {
    try {
      await this.redis.flushall();
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      return (await this.redis.exists(key)) === 1;
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  }

  async increment(key: string): Promise<number> {
    try {
      return await this.redis.incr(key);
    } catch (error) {
      console.error('Cache increment error:', error);
      return 0;
    }
  }

  async decrement(key: string): Promise<number> {
    try {
      return await this.redis.decr(key);
    } catch (error) {
      console.error('Cache decrement error:', error);
      return 0;
    }
  }
}

export const cache = Cache.getInstance(); 