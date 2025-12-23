/**
 * HTTP Request configuration
 */
export interface HttpRequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  data?: unknown;
  params?: Record<string, unknown>;
}

/**
 * HTTP Response headers
 */
export interface HttpHeaders {
  [key: string]: unknown;
}

/**
 * Abstraction for HTTP client
 * Follows Dependency Inversion Principle - depend on abstractions, not concretions
 */
export interface IHttpClient {
  /**
   * Make an HTTP request
   */
  request<T>(config: HttpRequestConfig): Promise<T>;
}
