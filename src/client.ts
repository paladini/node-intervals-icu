import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import type {
  IntervalsConfig,
  APIError,
  Athlete,
  Event,
  EventInput,
  Wellness,
  WellnessInput,
  Workout,
  WorkoutInput,
  Activity,
  ActivityInput,
  PaginationOptions,
  ActivityStream,
  StreamsOptions,
  UpdateStreamsResult,
  Interval,
  IntervalsDTO,
  UpdateIntervalsOptions,
  BulkEventInput,
  DoomedEvent,
  DeleteEventsResponse,
} from './types.js';

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
 * Intervals.icu API Client
 * 
 * A lightweight TypeScript client for the Intervals.icu API.
 * Supports all major endpoints including athletes, events, wellness, workouts, and activities.
 * 
 * @example
 * ```typescript
 * const client = new IntervalsClient({
 *   apiKey: 'your-api-key',
 *   athleteId: 'i12345' // optional, defaults to 'me'
 * });
 * 
 * // Get athlete info
 * const athlete = await client.getAthlete();
 * 
 * // Get events
 * const events = await client.getEvents({ oldest: '2024-01-01', newest: '2024-12-31' });
 * 
 * // Create wellness entry
 * await client.createWellness({ date: '2024-01-15', weight: 70, restingHR: 50 });
 * ```
 */
export class IntervalsClient {
  private httpClient: AxiosInstance;
  private athleteId: string;
  private rateLimitRemaining?: number;
  private rateLimitReset?: Date;

  /**
   * Creates a new Intervals.icu API client
   * 
   * @param config - Configuration object with API key and optional settings
   */
  constructor(config: IntervalsConfig) {
    this.athleteId = config.athleteId || 'me';
    
    this.httpClient = axios.create({
      baseURL: config.baseURL || 'https://intervals.icu/api/v1',
      timeout: config.timeout || 10000,
      headers: {
        'Authorization': `Basic ${Buffer.from(`API_KEY:${config.apiKey}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
    });

    // Add response interceptor for rate limit tracking
    this.httpClient.interceptors.response.use(
      (response) => {
        this.updateRateLimitInfo(response.headers);
        return response;
      },
      (error: AxiosError) => {
        if (error.response) {
          this.updateRateLimitInfo(error.response.headers);
        }
        return Promise.reject(this.handleError(error));
      }
    );
  }

  /**
   * Updates rate limit information from response headers
   */
  private updateRateLimitInfo(headers: Record<string, unknown>): void {
    const remaining = headers['x-ratelimit-remaining'];
    const reset = headers['x-ratelimit-reset'];
    
    if (typeof remaining === 'string') {
      this.rateLimitRemaining = parseInt(remaining, 10);
    }
    if (typeof reset === 'string') {
      this.rateLimitReset = new Date(parseInt(reset, 10) * 1000);
    }
  }

  /**
   * Gets the current rate limit remaining count
   * 
   * @returns The number of remaining API calls, or undefined if not yet determined
   */
  public getRateLimitRemaining(): number | undefined {
    return this.rateLimitRemaining;
  }

  /**
   * Gets the time when the rate limit will reset
   * 
   * @returns The reset time, or undefined if not yet determined
   */
  public getRateLimitReset(): Date | undefined {
    return this.rateLimitReset;
  }

  /**
   * Handles API errors and converts them to IntervalsAPIError
   */
  private handleError(error: AxiosError): IntervalsAPIError {
    if (error.response) {
      const status = error.response.status;
      const message = (error.response.data as { message?: string })?.message || error.message;
      
      if (status === 429) {
        return new IntervalsAPIError(
          `Rate limit exceeded. ${this.rateLimitReset ? `Resets at ${this.rateLimitReset.toISOString()}` : ''}`,
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

  /**
   * Makes a request to the API
   */
  private async request<T>(config: AxiosRequestConfig): Promise<T> {
    const response = await this.httpClient.request<T>(config);
    return response.data;
  }

  // ==================== ATHLETE ENDPOINTS ====================

  /**
   * Gets athlete information
   * 
   * @param athleteId - Athlete ID (defaults to the configured athlete or 'me')
   * @returns Athlete information
   * 
   * @example
   * ```typescript
   * const athlete = await client.getAthlete();
   * console.log(athlete.name, athlete.ftp);
   * ```
   */
  public async getAthlete(athleteId?: string): Promise<Athlete> {
    const id = athleteId || this.athleteId;
    return this.request<Athlete>({
      method: 'GET',
      url: `/athlete/${id}`,
    });
  }

  /**
   * Updates athlete information
   * 
   * @param data - Partial athlete data to update
   * @param athleteId - Athlete ID (defaults to the configured athlete or 'me')
   * @returns Updated athlete information
   * 
   * @example
   * ```typescript
   * const updated = await client.updateAthlete({ ftp: 250, weight: 70 });
   * ```
   */
  public async updateAthlete(data: Partial<Athlete>, athleteId?: string): Promise<Athlete> {
    const id = athleteId || this.athleteId;
    return this.request<Athlete>({
      method: 'PUT',
      url: `/athlete/${id}`,
      data,
    });
  }

  // ==================== EVENT ENDPOINTS ====================

  /**
   * Gets events for an athlete
   * 
   * @param options - Pagination and filter options
   * @param athleteId - Athlete ID (defaults to the configured athlete or 'me')
   * @returns Array of events
   * 
   * @example
   * ```typescript
   * const events = await client.getEvents({ 
   *   oldest: '2024-01-01', 
   *   newest: '2024-12-31' 
   * });
   * ```
   */
  public async getEvents(options?: PaginationOptions, athleteId?: string): Promise<Event[]> {
    const id = athleteId || this.athleteId;
    return this.request<Event[]>({
      method: 'GET',
      url: `/athlete/${id}/events`,
      params: options,
    });
  }

  /**
   * Gets a specific event by ID
   * 
   * @param eventId - Event ID
   * @param athleteId - Athlete ID (defaults to the configured athlete or 'me')
   * @returns Event data
   * 
   * @example
   * ```typescript
   * const event = await client.getEvent(12345);
   * ```
   */
  public async getEvent(eventId: number, athleteId?: string): Promise<Event> {
    const id = athleteId || this.athleteId;
    return this.request<Event>({
      method: 'GET',
      url: `/athlete/${id}/events/${eventId}`,
    });
  }

  /**
   * Creates a new event
   * 
   * @param data - Event data
   * @param athleteId - Athlete ID (defaults to the configured athlete or 'me')
   * @returns Created event
   * 
   * @example
   * ```typescript
   * const event = await client.createEvent({
   *   start_date_local: '2024-01-15',
   *   name: 'Race Day',
   *   category: 'RACE'
   * });
   * ```
   */
  public async createEvent(data: EventInput, athleteId?: string): Promise<Event> {
    const id = athleteId || this.athleteId;
    return this.request<Event>({
      method: 'POST',
      url: `/athlete/${id}/events`,
      data,
    });
  }

  /**
   * Updates an existing event
   * 
   * @param eventId - Event ID
   * @param data - Event data to update
   * @param athleteId - Athlete ID (defaults to the configured athlete or 'me')
   * @returns Updated event
   * 
   * @example
   * ```typescript
   * await client.updateEvent(12345, { name: 'Updated Race Day' });
   * ```
   */
  public async updateEvent(eventId: number, data: Partial<EventInput>, athleteId?: string): Promise<Event> {
    const id = athleteId || this.athleteId;
    return this.request<Event>({
      method: 'PUT',
      url: `/athlete/${id}/events/${eventId}`,
      data,
    });
  }

  /**
   * Deletes an event
   * 
   * @param eventId - Event ID
   * @param athleteId - Athlete ID (defaults to the configured athlete or 'me')
   * 
   * @example
   * ```typescript
   * await client.deleteEvent(12345);
   * ```
   */
  public async deleteEvent(eventId: number, athleteId?: string): Promise<void> {
    const id = athleteId || this.athleteId;
    await this.request<void>({
      method: 'DELETE',
      url: `/athlete/${id}/events/${eventId}`,
    });
  }

  // ==================== WELLNESS ENDPOINTS ====================

  /**
   * Gets wellness data for an athlete
   * 
   * @param options - Pagination and filter options
   * @param athleteId - Athlete ID (defaults to the configured athlete or 'me')
   * @returns Array of wellness entries
   * 
   * @example
   * ```typescript
   * const wellness = await client.getWellness({ 
   *   oldest: '2024-01-01', 
   *   newest: '2024-01-31' 
   * });
   * ```
   */
  public async getWellness(options?: PaginationOptions, athleteId?: string): Promise<Wellness[]> {
    const id = athleteId || this.athleteId;
    return this.request<Wellness[]>({
      method: 'GET',
      url: `/athlete/${id}/wellness`,
      params: options,
    });
  }

  /**
   * Creates a new wellness entry
   * 
   * @param data - Wellness data
   * @param athleteId - Athlete ID (defaults to the configured athlete or 'me')
   * @returns Created wellness entry
   * 
   * @example
   * ```typescript
   * const wellness = await client.createWellness({
   *   date: '2024-01-15',
   *   weight: 70,
   *   restingHR: 50,
   *   sleepSecs: 28800
   * });
   * ```
   */
  public async createWellness(data: WellnessInput, athleteId?: string): Promise<Wellness> {
    const id = athleteId || this.athleteId;
    return this.request<Wellness>({
      method: 'POST',
      url: `/athlete/${id}/wellness`,
      data,
    });
  }

  /**
   * Updates an existing wellness entry
   * 
   * @param date - Date of the wellness entry (YYYY-MM-DD format)
   * @param data - Wellness data to update
   * @param athleteId - Athlete ID (defaults to the configured athlete or 'me')
   * @returns Updated wellness entry
   * 
   * @example
   * ```typescript
   * await client.updateWellness('2024-01-15', { weight: 69.5 });
   * ```
   */
  public async updateWellness(date: string, data: Partial<WellnessInput>, athleteId?: string): Promise<Wellness> {
    const id = athleteId || this.athleteId;
    return this.request<Wellness>({
      method: 'PUT',
      url: `/athlete/${id}/wellness/${date}`,
      data,
    });
  }

  /**
   * Deletes a wellness entry
   * 
   * @param date - Date of the wellness entry (YYYY-MM-DD format)
   * @param athleteId - Athlete ID (defaults to the configured athlete or 'me')
   * 
   * @example
   * ```typescript
   * await client.deleteWellness('2024-01-15');
   * ```
   */
  public async deleteWellness(date: string, athleteId?: string): Promise<void> {
    const id = athleteId || this.athleteId;
    await this.request<void>({
      method: 'DELETE',
      url: `/athlete/${id}/wellness/${date}`,
    });
  }

  // ==================== WORKOUT ENDPOINTS ====================

  /**
   * Gets workouts for an athlete
   * 
   * @param options - Pagination and filter options
   * @param athleteId - Athlete ID (defaults to the configured athlete or 'me')
   * @returns Array of workouts
   * 
   * @example
   * ```typescript
   * const workouts = await client.getWorkouts({ 
   *   oldest: '2024-01-01', 
   *   newest: '2024-01-31' 
   * });
   * ```
   */
  public async getWorkouts(options?: PaginationOptions, athleteId?: string): Promise<Workout[]> {
    const id = athleteId || this.athleteId;
    return this.request<Workout[]>({
      method: 'GET',
      url: `/athlete/${id}/workouts`,
      params: options,
    });
  }

  /**
   * Gets a specific workout by ID
   * 
   * @param workoutId - Workout ID
   * @param athleteId - Athlete ID (defaults to the configured athlete or 'me')
   * @returns Workout data
   * 
   * @example
   * ```typescript
   * const workout = await client.getWorkout(12345);
   * ```
   */
  public async getWorkout(workoutId: number, athleteId?: string): Promise<Workout> {
    const id = athleteId || this.athleteId;
    return this.request<Workout>({
      method: 'GET',
      url: `/athlete/${id}/workouts/${workoutId}`,
    });
  }

  /**
   * Creates a new workout
   * 
   * @param data - Workout data
   * @param athleteId - Athlete ID (defaults to the configured athlete or 'me')
   * @returns Created workout
   * 
   * @example
   * ```typescript
   * const workout = await client.createWorkout({
   *   start_date_local: '2024-01-15',
   *   name: 'Tempo Run',
   *   description: '45 min tempo'
   * });
   * ```
   */
  public async createWorkout(data: WorkoutInput, athleteId?: string): Promise<Workout> {
    const id = athleteId || this.athleteId;
    return this.request<Workout>({
      method: 'POST',
      url: `/athlete/${id}/workouts`,
      data,
    });
  }

  /**
   * Updates an existing workout
   * 
   * @param workoutId - Workout ID
   * @param data - Workout data to update
   * @param athleteId - Athlete ID (defaults to the configured athlete or 'me')
   * @returns Updated workout
   * 
   * @example
   * ```typescript
   * await client.updateWorkout(12345, { name: 'Updated Tempo Run' });
   * ```
   */
  public async updateWorkout(workoutId: number, data: Partial<WorkoutInput>, athleteId?: string): Promise<Workout> {
    const id = athleteId || this.athleteId;
    return this.request<Workout>({
      method: 'PUT',
      url: `/athlete/${id}/workouts/${workoutId}`,
      data,
    });
  }

  /**
   * Deletes a workout
   * 
   * @param workoutId - Workout ID
   * @param athleteId - Athlete ID (defaults to the configured athlete or 'me')
   * 
   * @example
   * ```typescript
   * await client.deleteWorkout(12345);
   * ```
   */
  public async deleteWorkout(workoutId: number, athleteId?: string): Promise<void> {
    const id = athleteId || this.athleteId;
    await this.request<void>({
      method: 'DELETE',
      url: `/athlete/${id}/workouts/${workoutId}`,
    });
  }

  // ==================== ACTIVITY ENDPOINTS ====================

  /**
   * Gets activities for an athlete
   * 
   * @param options - Pagination and filter options
   * @param athleteId - Athlete ID (defaults to the configured athlete or 'me')
   * @returns Array of activities
   * 
   * @example
   * ```typescript
   * const activities = await client.getActivities({ 
   *   oldest: '2024-01-01', 
   *   newest: '2024-01-31' 
   * });
   * ```
   */
  public async getActivities(options?: PaginationOptions, athleteId?: string): Promise<Activity[]> {
    const id = athleteId || this.athleteId;
    return this.request<Activity[]>({
      method: 'GET',
      url: `/athlete/${id}/activities`,
      params: options,
    });
  }

  /**
   * Gets a specific activity by ID
   * 
   * @param activityId - Activity ID
   * @param athleteId - Athlete ID (defaults to the configured athlete or 'me')
   * @returns Activity data
   * 
   * @example
   * ```typescript
   * const activity = await client.getActivity(12345);
   * ```
   */
  public async getActivity(activityId: number, athleteId?: string): Promise<Activity> {
    const id = athleteId || this.athleteId;
    return this.request<Activity>({
      method: 'GET',
      url: `/athlete/${id}/activities/${activityId}`,
    });
  }

  /**
   * Updates an existing activity
   * 
   * @param activityId - Activity ID
   * @param data - Activity data to update
   * @param athleteId - Athlete ID (defaults to the configured athlete or 'me')
   * @returns Updated activity
   * 
   * @example
   * ```typescript
   * await client.updateActivity(12345, { 
   *   name: 'Morning Run',
   *   description: 'Easy recovery run'
   * });
   * ```
   */
  public async updateActivity(activityId: number, data: ActivityInput, athleteId?: string): Promise<Activity> {
    const id = athleteId || this.athleteId;
    return this.request<Activity>({
      method: 'PUT',
      url: `/athlete/${id}/activities/${activityId}`,
      data,
    });
  }

  /**
   * Deletes an activity
   *
   * @param activityId - Activity ID
   * @param athleteId - Athlete ID (defaults to the configured athlete or 'me')
   *
   * @example
   * ```typescript
   * await client.deleteActivity(12345);
   * ```
   */
  public async deleteActivity(activityId: number, athleteId?: string): Promise<void> {
    const id = athleteId || this.athleteId;
    await this.request<void>({
      method: 'DELETE',
      url: `/athlete/${id}/activities/${activityId}`,
    });
  }

  // ==================== ACTIVITY STREAMS ENDPOINTS ====================

  /**
   * Gets activity streams (time-series data)
   *
   * @param activityId - Activity ID
   * @param options - Stream options (types, format, etc.)
   * @returns Array of activity streams with data
   *
   * @example
   * ```typescript
   * // Get all streams for an activity
   * const streams = await client.getActivityStreams(12345);
   *
   * // Get specific stream types
   * const powerAndHr = await client.getActivityStreams(12345, {
   *   types: ['watts', 'heartrate']
   * });
   *
   * // Get streams as CSV
   * const csvData = await client.getActivityStreams(12345, {
   *   types: 'watts',
   *   format: 'csv'
   * });
   * ```
   */
  public async getActivityStreams(
    activityId: number,
    options?: StreamsOptions
  ): Promise<ActivityStream[]> {
    const params: Record<string, string | boolean> = {};

    if (options?.types) {
      if (Array.isArray(options.types)) {
        params.types = options.types.join(',');
      } else {
        params.types = options.types;
      }
    }
    if (options?.includeDefaults !== undefined) {
      params.includeDefaults = options.includeDefaults;
    }

    const extension = options?.format === 'csv' ? '.csv' : '.json';
    return this.request<ActivityStream[]>({
      method: 'GET',
      url: `/activity/${activityId}/streams${extension}`,
      params,
    });
  }

  /**
   * Updates activity streams from JSON
   *
   * @param activityId - Activity ID
   * @param streams - Array of streams to update
   * @returns Update result
   *
   * @example
   * ```typescript
   * const result = await client.updateActivityStreams(12345, [
   *   { type: 'watts', data: [100, 150, 200, ...] },
   *   { type: 'heartrate', data: [120, 130, 140, ...] }
   * ]);
   * ```
   */
  public async updateActivityStreams(
    activityId: number,
    streams: ActivityStream[]
  ): Promise<UpdateStreamsResult> {
    return this.request<UpdateStreamsResult>({
      method: 'PUT',
      url: `/activity/${activityId}/streams`,
      data: streams,
    });
  }

  /**
   * Updates activity streams from CSV
   *
   * @param activityId - Activity ID
   * @param csvFile - CSV file content (multipart form data)
   * @returns Update result
   *
   * @example
   * ```typescript
   * const formData = new FormData();
   * formData.append('file', csvFileBlob);
   * const result = await client.updateActivityStreamsFromCSV(12345, formData);
   * ```
   */
  public async updateActivityStreamsFromCSV(
    activityId: number,
    csvFile: FormData
  ): Promise<UpdateStreamsResult> {
    const response = await this.httpClient.request<UpdateStreamsResult>({
      method: 'PUT',
      url: `/activity/${activityId}/streams.csv`,
      data: csvFile,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // ==================== ACTIVITY INTERVALS ENDPOINTS ====================

  /**
   * Gets activity intervals/laps
   *
   * @param activityId - Activity ID
   * @returns Intervals data with laps
   *
   * @example
   * ```typescript
   * const intervals = await client.getActivityIntervals(12345);
   * console.log(`Found ${intervals.count} intervals`);
   * intervals.intervals.forEach(interval => {
   *   console.log(`${interval.name}: ${interval.average_watts}W avg`);
   * });
   * ```
   */
  public async getActivityIntervals(activityId: number): Promise<IntervalsDTO> {
    return this.request<IntervalsDTO>({
      method: 'GET',
      url: `/activity/${activityId}/intervals`,
    });
  }

  /**
   * Updates activity intervals
   *
   * @param activityId - Activity ID
   * @param intervals - Array of intervals to set
   * @param options - Update options (all=true replaces all intervals)
   * @returns Updated intervals data
   *
   * @example
   * ```typescript
   * const intervals = await client.updateActivityIntervals(12345, [
   *   {
   *     start_index: 0,
   *     end_index: 600,
   *     name: 'Warm up',
   *     elapsed_time: 600
   *   },
   *   {
   *     start_index: 600,
   *     end_index: 1800,
   *     name: 'Main set',
   *     elapsed_time: 1200
   *   }
   * ], { all: true });
   * ```
   */
  public async updateActivityIntervals(
    activityId: number,
    intervals: Interval[],
    options?: UpdateIntervalsOptions
  ): Promise<IntervalsDTO> {
    const params: Record<string, boolean> = {};
    if (options?.all !== undefined) {
      params.all = options.all;
    }

    return this.request<IntervalsDTO>({
      method: 'PUT',
      url: `/activity/${activityId}/intervals`,
      params,
      data: intervals,
    });
  }

  /**
   * Deletes specific intervals from an activity
   *
   * @param activityId - Activity ID
   * @param intervals - Intervals to delete
   * @returns Remaining intervals
   *
   * @example
   * ```typescript
   * const result = await client.deleteActivityIntervals(12345, [
   *   { id: 1, start_index: 0, end_index: 600 },
   *   { id: 2, start_index: 600, end_index: 1200 }
   * ]);
   * ```
   */
  public async deleteActivityIntervals(
    activityId: number,
    intervals: Interval[]
  ): Promise<IntervalsDTO> {
    return this.request<IntervalsDTO>({
      method: 'PUT',
      url: `/activity/${activityId}/delete-intervals`,
      data: intervals,
    });
  }

  /**
   * Splits an interval at a specific index
   *
   * @param activityId - Activity ID
   * @param splitAt - Index to split the interval at
   * @returns Updated intervals
   *
   * @example
   * ```typescript
   * const result = await client.splitInterval(12345, 600);
   * ```
   */
  public async splitInterval(
    activityId: number,
    splitAt: number
  ): Promise<IntervalsDTO> {
    return this.request<IntervalsDTO>({
      method: 'PUT',
      url: `/activity/${activityId}/split-interval`,
      params: { splitAt },
    });
  }

  /**
   * Updates or creates a specific interval
   *
   * @param activityId - Activity ID
   * @param intervalId - Interval ID
   * @param interval - Interval data
   * @returns Updated intervals
   *
   * @example
   * ```typescript
   * const result = await client.updateInterval(12345, 1, {
   *   start_index: 0,
   *   end_index: 600,
   *   name: 'Updated interval name'
   * });
   * ```
   */
  public async updateInterval(
    activityId: number,
    intervalId: number,
    interval: Interval
  ): Promise<IntervalsDTO> {
    return this.request<IntervalsDTO>({
      method: 'PUT',
      url: `/activity/${activityId}/intervals/${intervalId}`,
      data: interval,
    });
  }

  /**
   * Gets activity with intervals included
   *
   * @param activityId - Activity ID
   * @returns Activity with intervals data
   *
   * @example
   * ```typescript
   * const activity = await client.getActivityWithIntervals(12345);
   * console.log(activity.name, activity.intervals);
   * ```
   */
  public async getActivityWithIntervals(
    activityId: number
  ): Promise<Activity & { intervals?: Interval[] }> {
    return this.request<Activity & { intervals?: Interval[] }>({
      method: 'GET',
      url: `/activity/${activityId}`,
      params: { intervals: true },
    });
  }

  // ==================== BULK EVENTS OPERATIONS ====================

  /**
   * Creates multiple events at once
   *
   * @param events - Array of events to create
   * @param athleteId - Athlete ID (defaults to configured athlete)
   * @param options - Bulk options (upsertOnUid)
   * @returns Array of created events
   *
   * @example
   * ```typescript
   * const events = await client.createEventsBulk([
   *   {
   *     start_date_local: '2024-01-15',
   *     name: 'Morning Workout',
   *     category: 'WORKOUT'
   *   },
   *   {
   *     start_date_local: '2024-01-16',
   *     name: 'Evening Workout',
   *     category: 'WORKOUT'
   *   }
   * ]);
   * ```
   */
  public async createEventsBulk(
    events: BulkEventInput[],
    athleteId?: string,
    options?: { upsertOnUid?: boolean }
  ): Promise<Event[]> {
    const id = athleteId || this.athleteId;
    const params: Record<string, boolean> = {};
    if (options?.upsertOnUid !== undefined) {
      params.upsertOnUid = options.upsertOnUid;
    }

    // Use Promise.all to create all events in parallel
    const promises = events.map(event =>
      this.request<Event>({
        method: 'POST',
        url: `/athlete/${id}/events`,
        params,
        data: event,
      })
    );

    return Promise.all(promises);
  }

  /**
   * Deletes multiple events by ID or external_id
   *
   * @param doomedEvents - Array of events to delete (with id or external_id)
   * @param athleteId - Athlete ID (defaults to configured athlete)
   * @returns Delete response with deleted count and IDs
   *
   * @example
   * ```typescript
   * // Delete by internal IDs
   * const result = await client.deleteEventsBulk([
   *   { id: 12345 },
   *   { id: 12346 }
   * ]);
   *
   * // Delete by external IDs
   * const result = await client.deleteEventsBulk([
   *   { external_id: 'ext-001' },
   *   { external_id: 'ext-002' }
   * ]);
   * ```
   */
  public async deleteEventsBulk(
    doomedEvents: DoomedEvent[],
    athleteId?: string
  ): Promise<DeleteEventsResponse> {
    const id = athleteId || this.athleteId;
    return this.request<DeleteEventsResponse>({
      method: 'PUT',
      url: `/athlete/${id}/events/bulk-delete`,
      data: doomedEvents,
    });
  }

  /**
   * Deletes a range of events by category
   *
   * @param options - Delete options (oldest, newest, category, etc.)
   * @param athleteId - Athlete ID (defaults to configured athlete)
   *
   * @example
   * ```typescript
   * // Delete all workouts in January 2024
   * await client.deleteEventsRange({
   *   oldest: '2024-01-01',
   *   newest: '2024-01-31',
   *   category: ['WORKOUT']
   * });
   *
   * // Delete all future events created by specific athlete
   * await client.deleteEventsRange({
   *   oldest: new Date().toISOString().split('T')[0],
   *   category: ['WORKOUT', 'NOTE'],
   *   createdById: 'coach_athlete_id'
   * });
   * ```
   */
  public async deleteEventsRange(
    options: {
      oldest: string;
      newest?: string;
      category: string[];
      createdById?: string;
    },
    athleteId?: string
  ): Promise<void> {
    const id = athleteId || this.athleteId;
    await this.request<void>({
      method: 'DELETE',
      url: `/athlete/${id}/events`,
      params: options,
    });
  }

  /**
   * Updates multiple events in a date range at once
   * Only hide_from_athlete and athlete_cannot_edit can be updated
   *
   * @param oldest - Oldest date to update (ISO-8601)
   * @param newest - Newest date to update (ISO-8601)
   * @param data - Event data to update (only hide_from_athlete, athlete_cannot_edit)
   * @param athleteId - Athlete ID (defaults to configured athlete)
   * @returns Array of updated events
   *
   * @example
   * ```typescript
   * const updated = await client.updateEventsRange(
   *   '2024-01-01',
   *   '2024-01-31',
   *   { hide_from_athlete: true }
   * );
   * ```
   */
  public async updateEventsRange(
    oldest: string,
    newest: string,
    data: Partial<Pick<Event, 'hide_from_athlete' | 'athlete_cannot_edit'>>,
    athleteId?: string
  ): Promise<Event[]> {
    const id = athleteId || this.athleteId;
    return this.request<Event[]>({
      method: 'PUT',
      url: `/athlete/${id}/events`,
      params: { oldest, newest },
      data,
    });
  }

  /**
   * Updates wellness records in bulk
   *
   * @param wellnessRecords - Array of wellness records to update
   * @param athleteId - Athlete ID (defaults to configured athlete)
   *
   * @example
   * ```typescript
   * await client.updateWellnessBulk([
   *   { id: '2024-01-15', weight: 70.5, restingHR: 52 },
   *   { id: '2024-01-16', weight: 70.3, restingHR: 51 },
   *   { id: '2024-01-17', weight: 70.1, restingHR: 50 }
   * ]);
   * ```
   */
  public async updateWellnessBulk(
    wellnessRecords: Wellness[],
    athleteId?: string
  ): Promise<void> {
    const id = athleteId || this.athleteId;
    await this.request<void>({
      method: 'PUT',
      url: `/athlete/${id}/wellness-bulk`,
      data: wellnessRecords,
    });
  }
}
