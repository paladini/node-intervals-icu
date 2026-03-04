import type {
  IntervalsConfig, Athlete, AthleteUpdateDTO, Event, EventInput,
  Wellness, WellnessInput, Workout, WorkoutInput, Activity, ActivityInput,
  PaginationOptions, ListActivitiesOptions, ListEventsOptions, SportSettings,
  PaceDistancesDTO,
} from './types/index.js';
import { AxiosHttpClient } from './core/axios-http-client.js';
import { ErrorHandler } from './core/error-handler.js';
import { RateLimitTracker } from './core/rate-limit-tracker.js';
import { AthleteService } from './services/athlete.service.js';
import { EventService } from './services/event.service.js';
import { WellnessService } from './services/wellness.service.js';
import { WorkoutService } from './services/workout.service.js';
import { ActivityService } from './services/activity.service.js';
import { SportSettingsService } from './services/sport-settings.service.js';
import { FolderService } from './services/folder.service.js';
import { GearService } from './services/gear.service.js';
import { ChatService } from './services/chat.service.js';
import { WeatherService } from './services/weather.service.js';
import { RouteService } from './services/route.service.js';
import { CustomItemService } from './services/custom-item.service.js';
import { SharedEventService } from './services/shared-event.service.js';
import { FitnessService } from './services/fitness.service.js';
import { PerformanceService } from './services/performance.service.js';
import { SearchService } from './services/search.service.js';
import type { IHttpClient } from './core/http-client.interface.js';

// Re-export for backwards compatibility
export { IntervalsAPIError } from './core/error-handler.js';

/**
 * Intervals.icu API Client (v2.0)
 *
 * Comprehensive TypeScript client for the Intervals.icu API.
 * Supports 100+ endpoints across 13 resource groups.
 *
 * **Two ways to use:**
 * 1. **Service accessors** (recommended for new code):
 *    `client.athletes.getAthlete()`, `client.activities.getStreams('i123')`
 * 2. **Facade methods** (backward compatible with v1.x):
 *    `client.getAthlete()`, `client.getEvents()`
 *
 * @example
 * ```typescript
 * // API key auth (personal use)
 * const client = new IntervalsClient({ apiKey: 'your-api-key', athleteId: 'i12345' });
 *
 * // OAuth bearer token auth (apps)
 * const client = new IntervalsClient({ accessToken: 'oauth-token' });
 *
 * // Service accessor pattern (recommended)
 * const streams = await client.activities.getStreams('i55610271');
 * const settings = await client.sportSettings.list();
 * await client.chats.sendMessage({ to_athlete_id: '123', content: 'Hello!' });
 *
 * // Facade methods (backward compatible)
 * const athlete = await client.getAthlete();
 * const events = await client.getEvents({ oldest: '2024-01-01', newest: '2024-12-31' });
 * ```
 */
export class IntervalsClient {
  private rateLimitTracker: RateLimitTracker;
  private httpClient: IHttpClient;

  // ── Service accessors (recommended API) ──

  /** Athlete profile, training plans */
  public readonly athletes: AthleteService;
  /** Calendar events (workouts, notes, races) */
  public readonly events: EventService;
  /** Wellness data (weight, HRV, sleep, etc.) */
  public readonly wellness: WellnessService;
  /** Library workouts (templates in folders/plans) */
  public readonly workouts: WorkoutService;
  /** Activities (completed or uploaded) — streams, intervals, files, curves */
  public readonly activities: ActivityService;
  /** Sport settings (thresholds, zones, load settings) */
  public readonly sportSettings: SportSettingsService;
  /** Workout folders and training plans */
  public readonly folders: FolderService;
  /** Gear and equipment management */
  public readonly gear: GearService;
  /** Chats and messages */
  public readonly chats: ChatService;
  /** Weather forecasts and config */
  public readonly weather: WeatherService;
  /** Activity routes */
  public readonly routes: RouteService;
  /** Custom items (charts, fields, etc.) */
  public readonly customItems: CustomItemService;
  /** Shared events (races, group events) */
  public readonly sharedEvents: SharedEventService;
  /** Fitness data (CTL, ATL, TSB) and activity summaries */
  public readonly fitness: FitnessService;
  /** Athlete-level performance curves (power, pace, HR) */
  public readonly performance: PerformanceService;
  /** Search activities and athletes */
  public readonly search: SearchService;

  constructor(config: IntervalsConfig) {
    if (!config.apiKey && !config.accessToken) {
      throw new Error('IntervalsClient requires either apiKey or accessToken');
    }

    const athleteId = config.athleteId || '0';

    this.rateLimitTracker = new RateLimitTracker();
    const errorHandler = new ErrorHandler();
    this.httpClient = new AxiosHttpClient(config, errorHandler, this.rateLimitTracker);

    this.athletes = new AthleteService(this.httpClient, athleteId);
    this.events = new EventService(this.httpClient, athleteId);
    this.wellness = new WellnessService(this.httpClient, athleteId);
    this.workouts = new WorkoutService(this.httpClient, athleteId);
    this.activities = new ActivityService(this.httpClient, athleteId);
    this.sportSettings = new SportSettingsService(this.httpClient, athleteId);
    this.folders = new FolderService(this.httpClient, athleteId);
    this.gear = new GearService(this.httpClient, athleteId);
    this.chats = new ChatService(this.httpClient);
    this.weather = new WeatherService(this.httpClient, athleteId);
    this.routes = new RouteService(this.httpClient, athleteId);
    this.customItems = new CustomItemService(this.httpClient, athleteId);
    this.sharedEvents = new SharedEventService(this.httpClient);
    this.fitness = new FitnessService(this.httpClient, athleteId);
    this.performance = new PerformanceService(this.httpClient, athleteId);
    this.search = new SearchService(this.httpClient, athleteId);
  }

  // ── Rate limiting ──

  /** Get remaining API calls before rate limit */
  public getRateLimitRemaining(): number | undefined {
    return this.rateLimitTracker.getRemaining();
  }

  /** Get time when rate limit resets */
  public getRateLimitReset(): Date | undefined {
    return this.rateLimitTracker.getReset();
  }

  // ── Misc endpoints (no service) ──

  /** Get pace distances configuration */
  public async getPaceDistances(): Promise<PaceDistancesDTO> {
    return this.httpClient.request<PaceDistancesDTO>({ method: 'GET', url: '/pace_distances' });
  }

  // ══════════════════════════════════════════════════════════════
  //  BACKWARD-COMPATIBLE FACADE METHODS (v1.x API)
  //  These delegate to the service accessors above.
  //  New code should use the service accessors directly.
  // ══════════════════════════════════════════════════════════════

  // ── Athlete ──

  /** @deprecated Use client.athletes.getAthlete() */
  public async getAthlete(athleteId?: string): Promise<Athlete> {
    return this.athletes.getAthlete(athleteId);
  }

  /** @deprecated Use client.athletes.updateAthlete() */
  public async updateAthlete(data: AthleteUpdateDTO, athleteId?: string): Promise<Athlete> {
    return this.athletes.updateAthlete(data, athleteId);
  }

  /** @deprecated Use client.sportSettings.list() */
  public async getSportSettings(athleteId?: string): Promise<SportSettings[]> {
    return this.sportSettings.list(athleteId);
  }

  // ── Events ──

  /** @deprecated Use client.events.listEvents() */
  public async getEvents(options?: ListEventsOptions, athleteId?: string): Promise<Event[]> {
    return this.events.listEvents(options, athleteId);
  }

  /** @deprecated Use client.events.getEvent() */
  public async getEvent(eventId: number, athleteId?: string): Promise<Event> {
    return this.events.getEvent(eventId, athleteId);
  }

  /** @deprecated Use client.events.createEvent() */
  public async createEvent(data: EventInput, athleteId?: string): Promise<Event> {
    return this.events.createEvent(data, athleteId);
  }

  /** @deprecated Use client.events.updateEvent() */
  public async updateEvent(eventId: number, data: Partial<EventInput>, athleteId?: string): Promise<Event> {
    return this.events.updateEvent(eventId, data, athleteId);
  }

  /** @deprecated Use client.events.deleteEvent() */
  public async deleteEvent(eventId: number, athleteId?: string): Promise<void> {
    return this.events.deleteEvent(eventId, undefined, athleteId);
  }

  // ── Wellness ──

  /** @deprecated Use client.wellness.listWellness() */
  public async getWellness(options?: PaginationOptions, athleteId?: string): Promise<Wellness[]> {
    return this.wellness.listWellness(options, athleteId);
  }

  /** @deprecated Use client.wellness.createWellness() */
  public async createWellness(data: WellnessInput, athleteId?: string): Promise<Wellness> {
    return this.wellness.createWellness(data, athleteId);
  }

  /** @deprecated Use client.wellness.updateWellness() */
  public async updateWellness(date: string, data: Partial<WellnessInput>, athleteId?: string): Promise<Wellness> {
    return this.wellness.updateWellness(date, data, athleteId);
  }

  /** @deprecated Use client.wellness.deleteWellness() */
  public async deleteWellness(date: string, athleteId?: string): Promise<void> {
    return this.wellness.deleteWellness(date, athleteId);
  }

  // ── Workouts ──

  /** @deprecated Use client.workouts.listWorkouts() */
  public async getWorkouts(options?: PaginationOptions, athleteId?: string): Promise<Workout[]> {
    return this.workouts.listWorkouts(options, athleteId);
  }

  /** @deprecated Use client.workouts.getWorkout() */
  public async getWorkout(workoutId: number, athleteId?: string): Promise<Workout> {
    return this.workouts.getWorkout(workoutId, athleteId);
  }

  /** @deprecated Use client.workouts.createWorkout() */
  public async createWorkout(data: WorkoutInput, athleteId?: string): Promise<Workout> {
    return this.workouts.createWorkout(data, athleteId);
  }

  /** @deprecated Use client.workouts.updateWorkout() */
  public async updateWorkout(workoutId: number, data: Partial<WorkoutInput>, athleteId?: string): Promise<Workout> {
    return this.workouts.updateWorkout(workoutId, data, athleteId);
  }

  /** @deprecated Use client.workouts.deleteWorkout() */
  public async deleteWorkout(workoutId: number, athleteId?: string): Promise<void> {
    return this.workouts.deleteWorkout(workoutId, athleteId);
  }

  // ── Activities ──

  /** @deprecated Use client.activities.listActivities() */
  public async getActivities(options?: ListActivitiesOptions, athleteId?: string): Promise<Activity[]> {
    return this.activities.listActivities(options, athleteId);
  }

  /**
   * Get an activity by ID.
   * @deprecated Use client.activities.getActivity() — note: activityId is now string (e.g. 'i55610271')
   */
  public async getActivity(activityId: string | number): Promise<Activity> {
    return this.activities.getActivity(String(activityId));
  }

  /**
   * Update an activity.
   * @deprecated Use client.activities.updateActivity() — note: activityId is now string
   */
  public async updateActivity(activityId: string | number, data: ActivityInput): Promise<Activity> {
    return this.activities.updateActivity(String(activityId), data);
  }

  /**
   * Delete an activity.
   * @deprecated Use client.activities.deleteActivity() — note: activityId is now string
   */
  public async deleteActivity(activityId: string | number): Promise<void> {
    await this.activities.deleteActivity(String(activityId));
  }
}
