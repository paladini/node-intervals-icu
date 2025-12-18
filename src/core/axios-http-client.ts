import axios, { AxiosInstance, AxiosError } from 'axios';
import type { IHttpClient, HttpRequestConfig } from './http-client.interface.js';
import type { IntervalsConfig } from '../types.js';
import { ErrorHandler } from './error-handler.js';
import { RateLimitTracker } from './rate-limit-tracker.js';

/**
 * Axios-based implementation of HTTP client
 * Follows Single Responsibility Principle - only handles HTTP communication
 */
export class AxiosHttpClient implements IHttpClient {
  private client: AxiosInstance;
  private errorHandler: ErrorHandler;
  private rateLimitTracker: RateLimitTracker;

  constructor(config: IntervalsConfig, errorHandler: ErrorHandler, rateLimitTracker: RateLimitTracker) {
    this.errorHandler = errorHandler;
    this.rateLimitTracker = rateLimitTracker;

    this.client = axios.create({
      baseURL: config.baseURL || 'https://intervals.icu/api/v1',
      timeout: config.timeout || 10000,
      headers: {
        'Authorization': `Basic ${Buffer.from(`API_KEY:${config.apiKey}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.response.use(
      (response) => {
        this.rateLimitTracker.updateFromHeaders(response.headers);
        return response;
      },
      (error: AxiosError) => {
        if (error.response) {
          this.rateLimitTracker.updateFromHeaders(error.response.headers);
        }
        return Promise.reject(this.errorHandler.handleError(error, this.rateLimitTracker));
      }
    );
  }

  async request<T>(config: HttpRequestConfig): Promise<T> {
    const response = await this.client.request<T>(config);
    return response.data;
  }
}
