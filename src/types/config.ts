/**
 * Configuration and common option types for the Intervals.icu client
 */

/**
 * Configuration for the Intervals.icu client.
 * Provide either `apiKey` (for personal use) or `accessToken` (from OAuth flow).
 */
export interface IntervalsConfig {
  /** API key for basic authentication (personal use). Mutually exclusive with accessToken. */
  apiKey?: string;

  /** OAuth access token for bearer authentication. Mutually exclusive with apiKey. */
  accessToken?: string;

  /** Athlete ID (defaults to 'me' for the authenticated athlete). Use '0' to auto-detect from token. */
  athleteId?: string;

  /** Base URL for the API (defaults to https://intervals.icu/api/v1) */
  baseURL?: string;

  /** Request timeout in milliseconds (defaults to 30000) */
  timeout?: number;

  /** Maximum number of automatic retries for 429/5xx errors (defaults to 3, set 0 to disable) */
  maxRetries?: number;

  /** Base delay in ms between retries, doubles each attempt (defaults to 1000) */
  retryDelayMs?: number;
}

/**
 * Error response from the API
 */
export interface APIError {
  message: string;
  status?: number;
  code?: string;
}

/**
 * Pagination / date-range options for list endpoints
 */
export interface PaginationOptions {
  /** Oldest date to return (ISO 8601 format, e.g. '2024-01-01') */
  oldest?: string;

  /** Newest date to return (ISO 8601 format, inclusive) */
  newest?: string;

  /** Limit the number of results */
  limit?: number;

  /** Offset for pagination */
  offset?: number;

  /** Resolve nested objects (e.g. pace values in workouts to actual m/s) */
  resolve?: boolean;
}

/**
 * Options for listing activities
 */
export interface ListActivitiesOptions extends PaginationOptions {
  /** Only return activities on this route */
  route_id?: number;

  /** Comma separated list of field names to include (default is all). Also excludes null values. */
  fields?: string[];
}

/**
 * Options for listing events
 */
export interface ListEventsOptions extends PaginationOptions {
  /** Comma separated list of event categories to filter */
  category?: string[];
}

/**
 * Options for deleting events in a range
 */
export interface DeleteEventsRangeOptions {
  /** Local date (ISO-8601) of oldest event to delete */
  oldest: string;
  /** Local date (ISO-8601) of newest event to delete (inclusive, default is all future events) */
  newest?: string;
  /** If provided only events created by this athlete are deleted */
  createdById?: string;
  /** Comma separated list of event categories to delete (e.g. 'WORKOUT') */
  category: string[];
}

/**
 * Options for deleting a single event
 */
export interface DeleteEventOptions {
  /** If true then other events added at the same time are also deleted */
  others?: boolean;
  /** Do not delete other events on the calendar before this local date (ISO-8601) */
  notBefore?: string;
}
