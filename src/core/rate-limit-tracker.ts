import type { HttpHeaders } from './http-client.interface.js';

/**
 * Rate limit tracking service
 * Follows Single Responsibility Principle - only tracks rate limit information
 */
export class RateLimitTracker {
  private remaining?: number;
  private reset?: Date;

  updateFromHeaders(headers: HttpHeaders): void {
    const remaining = headers['x-ratelimit-remaining'];
    const reset = headers['x-ratelimit-reset'];
    
    if (typeof remaining === 'string') {
      this.remaining = parseInt(remaining, 10);
    }
    if (typeof reset === 'string') {
      this.reset = new Date(parseInt(reset, 10) * 1000);
    }
  }

  getRemaining(): number | undefined {
    return this.remaining;
  }

  getReset(): Date | undefined {
    return this.reset;
  }
}
