/**
 * node-intervals-icu v2.0
 *
 * Comprehensive TypeScript client library for the Intervals.icu API.
 * Supports 100+ endpoints across 13 resource groups with full type safety.
 *
 * @packageDocumentation
 */

// Main client
export { IntervalsClient } from './client.js';
export { IntervalsAPIError } from './core/error-handler.js';

// Services (for advanced usage / custom composition)
export { AthleteService } from './services/athlete.service.js';
export { ActivityService } from './services/activity.service.js';
export { EventService } from './services/event.service.js';
export { WellnessService } from './services/wellness.service.js';
export { WorkoutService } from './services/workout.service.js';
export { SportSettingsService } from './services/sport-settings.service.js';
export { FolderService } from './services/folder.service.js';
export { GearService } from './services/gear.service.js';
export { ChatService } from './services/chat.service.js';
export { WeatherService } from './services/weather.service.js';
export { RouteService } from './services/route.service.js';
export { CustomItemService } from './services/custom-item.service.js';
export { SharedEventService } from './services/shared-event.service.js';
export { FitnessService } from './services/fitness.service.js';
export { PerformanceService } from './services/performance.service.js';
export { SearchService } from './services/search.service.js';

// Core (for advanced usage)
export type { IHttpClient, HttpRequestConfig, UploadConfig } from './core/http-client.interface.js';

// All types
export type {
  // Config & options
  IntervalsConfig, APIError, PaginationOptions, ListActivitiesOptions,
  ListEventsOptions, DeleteEventsRangeOptions, DeleteEventOptions,

  // Enums
  ActivityType, EventCategory, SubType, ActivitySource, Visibility,
  FolderType, WorkoutTarget, ChatType, ChatRole, JoinPolicy, MessageType,
  Plan, AthleteStatus, Permission, WindSpeedUnit, RainUnit, HeightUnit,
  WeightSync, GAPModel, HRLoadType, PaceLoadType, GarminPowerTarget,
  CustomItemType, AchievementType, TIZOrder, PaceModelType, PowerModelType,
  DataCurveType,

  // Athlete
  Athlete, AthleteUpdateDTO, AthleteTrainingPlan, AthleteTrainingPlanUpdate,
  AthleteSearchResult, AthleteProfile, StravaGear, ActivityFilter,
  CoachTick, AthleteTrainingAvailability, TypeSettings,

  // Activity
  Activity, ActivityInput, ActivitySearchResult, UploadActivityOptions,
  Interval, IntervalGroup, IntervalsDTO, ActivityStream, UpdateStreamsResult,
  ActivityId, UploadResponse, ZoneInfo, ZoneSet, ZoneTime, HRRecovery,
  IcuAchievement, IgnorePart, Attachment, Effort, BestEfforts,
  PowerVsHRBucket, CurveFit, PowerVsHRPlot, HRLoadModel, IcuSegment,
  MapData, WeatherTime, WeatherPoint, WeatherClosest, ActivityWeather,
  WindRose, ActivityWeatherSummary, ActivityMini,

  // Event
  Event, EventEx, EventInput, DoomedEvent, DeleteEventsResponse,
  DuplicateEventsDTO, ApplyPlanDTO,

  // Wellness
  Wellness, WellnessInput,

  // Workout
  Workout, WorkoutEx, WorkoutInput, DuplicateWorkoutsDTO,

  // Sport Settings
  SportSettings,

  // Folder
  Folder, CreateFolderDTO, SharedWith,

  // Gear
  Gear, GearReminder, GearStats,

  // Chat
  Chat, ChatMember, Message, NewMessage, NewActivityMsg, SendResponse, NewMsg,

  // Weather
  Forecast, WeatherDTO, WeatherConfig,

  // Route
  AthleteRoute, RouteSimilarity,

  // Custom Item
  CustomItem, NewCustomItem,

  // Shared Event
  SharedEvent,

  // Performance
  PowerModel, PaceModel, Rank, HRPlot, DataCurvePt,
  PowerCurve, PowerCurveSet, PaceCurve, PaceCurveSet,
  HRCurve, HRCurveSet, PowerHRCurve,
  ActivityPowerCurve, ActivityPowerCurvePayload,
  ActivityHRCurve, ActivityHRCurvePayload, PaceDistancesDTO,

  // Fitness
  CategorySummary, SummaryWithCats,
} from './types/index.js';
