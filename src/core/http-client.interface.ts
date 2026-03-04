/**
 * HTTP Request configuration
 */
export interface HttpRequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  data?: unknown;
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  responseType?: 'json' | 'arraybuffer' | 'stream';
}

/**
 * HTTP Response headers
 */
export interface HttpHeaders {
  [key: string]: unknown;
}

/**
 * Configuration for multipart file uploads
 */
export interface UploadConfig {
  url: string;
  file: Buffer | Blob | NodeJS.ReadableStream;
  fileName: string;
  params?: Record<string, unknown>;
  fieldName?: string;
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

  /**
   * Upload a file via multipart/form-data
   */
  upload<T>(config: UploadConfig): Promise<T>;

  /**
   * Download a file as a Buffer
   */
  download(url: string, params?: Record<string, unknown>): Promise<Buffer>;
}
