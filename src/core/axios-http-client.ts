import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import type { IHttpClient, HttpRequestConfig, UploadConfig } from './http-client.interface.js';
import type { IntervalsConfig } from '../types/index.js';
import { ErrorHandler, IntervalsAPIError } from './error-handler.js';
import { RateLimitTracker } from './rate-limit-tracker.js';

const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_RETRY_DELAY_MS = 1000;

/**
 * Axios-based implementation of HTTP client
 * Supports API key auth, OAuth bearer tokens, file upload/download, and auto-retry
 */
export class AxiosHttpClient implements IHttpClient {
  private client: AxiosInstance;
  private errorHandler: ErrorHandler;
  private rateLimitTracker: RateLimitTracker;
  private maxRetries: number;
  private retryDelayMs: number;

  constructor(config: IntervalsConfig, errorHandler: ErrorHandler, rateLimitTracker: RateLimitTracker) {
    this.errorHandler = errorHandler;
    this.rateLimitTracker = rateLimitTracker;
    this.maxRetries = config.maxRetries ?? DEFAULT_MAX_RETRIES;
    this.retryDelayMs = config.retryDelayMs ?? DEFAULT_RETRY_DELAY_MS;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (config.accessToken) {
      headers['Authorization'] = `Bearer ${config.accessToken}`;
    } else if (config.apiKey) {
      const authString = `API_KEY:${config.apiKey}`;
      let encodedAuth: string;
      if (typeof globalThis !== 'undefined' && typeof (globalThis as any).btoa === 'function') {
        encodedAuth = (globalThis as any).btoa(authString);
      } else {
        encodedAuth = Buffer.from(authString).toString('base64');
      }
      headers['Authorization'] = `Basic ${encodedAuth}`;
    }

    this.client = axios.create({
      baseURL: config.baseURL || 'https://intervals.icu/api/v1',
      timeout: config.timeout || 30000,
      headers,
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

  private async withRetry<T>(fn: () => Promise<T>): Promise<T> {
    let lastError: unknown;
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error: unknown) {
        lastError = error;
        const isRetryable =
          error instanceof Error &&
          'status' in error &&
          ((error as { status?: number }).status === 429 ||
            (error as { status?: number }).status === 502 ||
            (error as { status?: number }).status === 503 ||
            (error as { status?: number }).status === 504);

        if (!isRetryable || attempt === this.maxRetries) {
          throw error;
        }

        const retryAfter = error instanceof IntervalsAPIError ? error.retryAfter : undefined;
        const delay = typeof retryAfter === 'number' && retryAfter > 0
          ? retryAfter * 1000
          : this.retryDelayMs * Math.pow(2, attempt) * (0.5 + Math.random() * 0.5);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw lastError;
  }

  async request<T>(config: HttpRequestConfig): Promise<T> {
    return this.withRetry(async () => {
      const axiosConfig: AxiosRequestConfig = {
        method: config.method,
        url: config.url,
        data: config.data,
        params: config.params,
        headers: config.headers,
        responseType: config.responseType as AxiosRequestConfig['responseType'],
      };
      const response = await this.client.request<T>(axiosConfig);
      return response.data;
    });
  }

  async upload<T>(config: UploadConfig): Promise<T> {
    return this.withRetry(async () => {
      const form = new FormData();
      const blob = config.file instanceof Blob
        ? config.file
        : new Blob([config.file]);
      form.append(config.fieldName || 'file', blob, config.fileName);

      const response = await this.client.post<T>(config.url, form, {
        params: config.params,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });
      return response.data;
    });
  }

  async download(url: string, params?: Record<string, unknown>): Promise<Buffer> {
    return this.withRetry(async () => {
      const response = await this.client.get(url, {
        params,
        responseType: 'arraybuffer',
      });
      return Buffer.from(response.data);
    });
  }
}
