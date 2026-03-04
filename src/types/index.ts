/**
 * Type definitions barrel export for the Intervals.icu API
 */

// Config & options
export type {
  IntervalsConfig,
  APIError,
  PaginationOptions,
  ListActivitiesOptions,
  ListEventsOptions,
  DeleteEventsRangeOptions,
  DeleteEventOptions,
} from './config.js';

// Enums
export type {
  ActivityType,
  EventCategory,
  SubType,
  ActivitySource,
  Visibility,
  FolderType,
  WorkoutTarget,
  ChatType,
  ChatRole,
  JoinPolicy,
  MessageType,
  Plan,
  AthleteStatus,
  Permission,
  WindSpeedUnit,
  RainUnit,
  HeightUnit,
  WeightSync,
  GAPModel,
  HRLoadType,
  PaceLoadType,
  GarminPowerTarget,
  CustomItemType,
  AchievementType,
  TIZOrder,
  PaceModelType,
  PowerModelType,
  DataCurveType,
} from './enums.js';

// Athlete
export type {
  Athlete,
  AthleteUpdateDTO,
  AthleteTrainingPlan,
  AthleteTrainingPlanUpdate,
  AthleteSearchResult,
  AthleteProfile,
  StravaGear,
  ActivityFilter,
  CoachTick,
  AthleteTrainingAvailability,
  TypeSettings,
} from './athlete.js';

// Activity
export type {
  Activity,
  ActivityInput,
  ActivitySearchResult,
  UploadActivityOptions,
  Interval,
  IntervalGroup,
  IntervalsDTO,
  ActivityStream,
  UpdateStreamsResult,
  ActivityId,
  UploadResponse,
  ZoneInfo,
  ZoneSet,
  ZoneTime,
  HRRecovery,
  IcuAchievement,
  IgnorePart,
  Attachment,
  Effort,
  BestEfforts,
  PowerVsHRBucket,
  CurveFit,
  PowerVsHRPlot,
  HRLoadModel,
  IcuSegment,
  MapData,
  WeatherTime,
  WeatherPoint,
  WeatherClosest,
  ActivityWeather,
  WindRose,
  ActivityWeatherSummary,
  ActivityMini,
} from './activity.js';

// Event
export type {
  Event,
  EventEx,
  EventInput,
  DoomedEvent,
  DeleteEventsResponse,
  DuplicateEventsDTO,
  ApplyPlanDTO,
} from './event.js';

// Wellness
export type {
  Wellness,
  WellnessInput,
} from './wellness.js';

// Workout
export type {
  Workout,
  WorkoutEx,
  WorkoutInput,
  DuplicateWorkoutsDTO,
} from './workout.js';

// Sport Settings
export type {
  SportSettings,
} from './sport-settings.js';

// Folder
export type {
  Folder,
  CreateFolderDTO,
  SharedWith,
} from './folder.js';

// Gear
export type {
  Gear,
  GearReminder,
  GearStats,
} from './gear.js';

// Chat
export type {
  Chat,
  ChatMember,
  Message,
  NewMessage,
  NewActivityMsg,
  SendResponse,
  NewMsg,
} from './chat.js';

// Weather
export type {
  Forecast,
  WeatherDTO,
  WeatherConfig,
} from './weather.js';

// Route
export type {
  AthleteRoute,
  RouteSimilarity,
} from './route.js';

// Custom Item
export type {
  CustomItem,
  NewCustomItem,
} from './custom-item.js';

// Shared Event
export type {
  SharedEvent,
} from './shared-event.js';

// Performance
export type {
  PowerModel,
  PaceModel,
  Rank,
  HRPlot,
  DataCurvePt,
  PowerCurve,
  PowerCurveSet,
  PaceCurve,
  PaceCurveSet,
  HRCurve,
  HRCurveSet,
  PowerHRCurve,
  ActivityPowerCurve,
  ActivityPowerCurvePayload,
  ActivityHRCurve,
  ActivityHRCurvePayload,
  PaceDistancesDTO,
} from './performance.js';

// Fitness
export type {
  CategorySummary,
  SummaryWithCats,
} from './fitness.js';
