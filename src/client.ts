import type {
  IntervalsConfig,
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
  SportSettings,
} from './types.js';
import { AxiosHttpClient } from './core/axios-http-client.js';
import { ErrorHandler } from './core/error-handler.js';
import { RateLimitTracker } from './core/rate-limit-tracker.js';
import { AthleteService } from './services/athlete.service.js';
import { EventService } from './services/event.service.js';
import { WellnessService } from './services/wellness.service.js';
import { WorkoutService } from './services/workout.service.js';
import { ActivityService } from './services/activity.service.js';

// Re-export for backwards compatibility
export { IntervalsAPIError } from './core/error-handler.js';

/**
 * Intervals.icu API Client
 * 
 * A lightweight TypeScript client for the Intervals.icu API.
 * Supports all major endpoints including athletes, events, wellness, workouts, and activities.
 * 
 * This client follows SOLID principles:
 * - Single Responsibility: Delegates to specialized services
 * - Open/Closed: Extensible through service composition
 * - Interface Segregation: Services implement focused interfaces
 * - Dependency Inversion: Depends on abstractions (IHttpClient)
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
  private rateLimitTracker: RateLimitTracker;
  private athleteService: AthleteService;
  private eventService: EventService;
  private wellnessService: WellnessService;
  private workoutService: WorkoutService;
  private activityService: ActivityService;

  /**
   * Creates a new Intervals.icu API client
   * 
   * @param config - Configuration object with API key and optional settings
   */
  constructor(config: IntervalsConfig) {
    const athleteId = config.athleteId || 'me';

    // Initialize core services following Dependency Inversion Principle
    this.rateLimitTracker = new RateLimitTracker();
    const errorHandler = new ErrorHandler();
    const httpClient = new AxiosHttpClient(config, errorHandler, this.rateLimitTracker);

    // Initialize resource-specific services following Single Responsibility Principle
    this.athleteService = new AthleteService(httpClient, athleteId);
    this.eventService = new EventService(httpClient, athleteId);
    this.wellnessService = new WellnessService(httpClient, athleteId);
    this.workoutService = new WorkoutService(httpClient, athleteId);
    this.activityService = new ActivityService(httpClient, athleteId);
  }

  /**
   * Gets the current rate limit remaining count
   * 
   * @returns The number of remaining API calls, or undefined if not yet determined
   */
  public getRateLimitRemaining(): number | undefined {
    return this.rateLimitTracker.getRemaining();
  }

  /**
   * Gets the time when the rate limit will reset
   * 
   * @returns The reset time, or undefined if not yet determined
   */
  public getRateLimitReset(): Date | undefined {
    return this.rateLimitTracker.getReset();
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
    return this.athleteService.getAthlete(athleteId);
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
    return this.athleteService.updateAthlete(data, athleteId);
  }

  /**
   * Gets sport settings (thresholds, zones) for an athlete
   * 
   * @param athleteId - Athlete ID (defaults to the configured athlete or 'me')
   * @returns Array of SportSettings (one for each sport type group)
   * 
   * @example
   * ```typescript
   * const settings = await client.getSportSettings();
   * const runSettings = settings.find(s => s.types.includes('Run'));
   * console.log(runSettings.threshold_pace);
   * ```
   */
  public async getSportSettings(athleteId?: string): Promise<SportSettings[]> {
    return this.athleteService.getSportSettings(athleteId);
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
    return this.eventService.getEvents(options, athleteId);
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
    return this.eventService.getEvent(eventId, athleteId);
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
    return this.eventService.createEvent(data, athleteId);
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
    return this.eventService.updateEvent(eventId, data, athleteId);
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
    return this.eventService.deleteEvent(eventId, athleteId);
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
    return this.wellnessService.getWellness(options, athleteId);
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
    return this.wellnessService.createWellness(data, athleteId);
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
    return this.wellnessService.updateWellness(date, data, athleteId);
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
    return this.wellnessService.deleteWellness(date, athleteId);
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
    return this.workoutService.getWorkouts(options, athleteId);
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
    return this.workoutService.getWorkout(workoutId, athleteId);
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
    return this.workoutService.createWorkout(data, athleteId);
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
    return this.workoutService.updateWorkout(workoutId, data, athleteId);
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
    return this.workoutService.deleteWorkout(workoutId, athleteId);
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
    return this.activityService.getActivities(options, athleteId);
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
    return this.activityService.getActivity(activityId, athleteId);
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
    return this.activityService.updateActivity(activityId, data, athleteId);
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
    return this.activityService.deleteActivity(activityId, athleteId);
  }
}
