import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.REDIS_URL || '',
  token: process.env.REDIS_TOKEN || '',
});

interface RateLimitConfig {
  max: number;
  windowMs: number;
}

const defaultConfig: RateLimitConfig = {
  max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
};

export async function rateLimit(
  request: NextRequest,
  config: Partial<RateLimitConfig> = {}
) {
  const { max, windowMs } = { ...defaultConfig, ...config };
  
  // Get the IP address from the request
  const ip = request.ip ?? '127.0.0.1';
  
  // Create a unique key for this IP
  const key = `rate-limit:${ip}`;
  
  try {
    // Get the current count for this IP
    const current = await redis.get<number>(key) ?? 0;
    
    if (current >= max) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests, please try again later.',
          },
        },
        { status: 429 }
      );
    }
    
    // Increment the counter
    await redis.incr(key);
    
    // Set expiry if this is the first request
    if (current === 0) {
      await redis.expire(key, windowMs / 1000);
    }
    
    // Add rate limit headers
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', max.toString());
    response.headers.set('X-RateLimit-Remaining', (max - current - 1).toString());
    response.headers.set('X-RateLimit-Reset', (Date.now() + windowMs).toString());
    
    return response;
  } catch (error) {
    console.error('Rate limiting error:', error);
    // If Redis fails, allow the request to proceed
    return NextResponse.next();
  }
} 