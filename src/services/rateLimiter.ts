import { CONFIG } from '../config/constants';

export interface RateLimitInfo {
  minute: number;
  hour: number;
}

export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private cache: Map<string, { response: string; timestamp: number }> = new Map();

  isRateLimited(userId: string): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(userId) || [];
    
    // Clean old requests
    const recentRequests = userRequests.filter(time => now - time < 60000); // Last minute
    const hourlyRequests = userRequests.filter(time => now - time < 3600000); // Last hour
    
    // Update requests
    this.requests.set(userId, [...recentRequests, now]);
    
    return recentRequests.length >= CONFIG.MAX_REQUESTS_PER_MINUTE || 
           hourlyRequests.length >= CONFIG.MAX_REQUESTS_PER_HOUR;
  }

  getCachedResponse(prompt: string): string | null {
    const cached = this.cache.get(prompt);
    if (cached && Date.now() - cached.timestamp < CONFIG.CACHE_TTL) {
      return cached.response;
    }
    return null;
  }

  cacheResponse(prompt: string, response: string): void {
    this.cache.set(prompt, { response, timestamp: Date.now() });
  }

  getRemainingRequests(userId: string): RateLimitInfo {
    const now = Date.now();
    const userRequests = this.requests.get(userId) || [];
    
    const recentRequests = userRequests.filter(time => now - time < 60000);
    const hourlyRequests = userRequests.filter(time => now - time < 3600000);
    
    return {
      minute: Math.max(0, CONFIG.MAX_REQUESTS_PER_MINUTE - recentRequests.length),
      hour: Math.max(0, CONFIG.MAX_REQUESTS_PER_HOUR - hourlyRequests.length)
    };
  }

  // Clean up old data periodically
  cleanup(): void {
    const now = Date.now();
    
    // Clean old requests
    for (const [userId, requests] of this.requests.entries()) {
      const validRequests = requests.filter(time => now - time < 3600000); // Keep last hour
      if (validRequests.length === 0) {
        this.requests.delete(userId);
      } else {
        this.requests.set(userId, validRequests);
      }
    }
    
    // Clean old cache entries
    for (const [prompt, cached] of this.cache.entries()) {
      if (now - cached.timestamp > CONFIG.CACHE_TTL) {
        this.cache.delete(prompt);
      }
    }
  }
} 