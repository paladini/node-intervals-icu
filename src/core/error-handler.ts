import { AxiosError } from 'axios';
import type { APIError } from '../types.js';
import type { RateLimitTracker } from './rate-limit-tracker.js';

/**
 * Custom error class for Intervals.icu API errors
 */
export class IntervalsAPIError extends Error implements APIError {
  status?: number;
  code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = 'IntervalsAPIError';
    this.status = status;
    this.code = code;
    Object.setPrototypeOf(this, IntervalsAPIError.prototype);
  }
}

/**
 * Error handler service
 * Follows Single Responsibility Principle - only handles error transformation
 */
export class ErrorHandler {
  handleError(error: AxiosError, rateLimitTracker: RateLimitTracker): IntervalsAPIError {
    if (error.response) {
      const status = error.response.status;
      const message = (error.response.data as { message?: string })?.message || error.message;
      
      if (status === 429) {
        const resetTime = rateLimitTracker.getReset();
        return new IntervalsAPIError(
          `Rate limit exceeded. ${resetTime ? `Resets at ${resetTime.toISOString()}` : ''}`,
          status,
          'RATE_LIMIT_EXCEEDED'
        );
      }
      
      if (status === 401) {
        return new IntervalsAPIError('Invalid API key or authentication failed', status, 'AUTH_FAILED');
      }
      
      if (status === 404) {
        return new IntervalsAPIError('Resource not found', status, 'NOT_FOUND');
      }
      
      return new IntervalsAPIError(message, status);
    }
    
    if (error.code === 'ECONNABORTED') {
      return new IntervalsAPIError('Request timeout', undefined, 'TIMEOUT');
    }
    
    return new IntervalsAPIError(error.message || 'Unknown error occurred');
  }
}
