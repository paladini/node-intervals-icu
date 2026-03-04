/**
 * Enums and union types for the Intervals.icu API
 */

/** All supported activity/sport types */
export type ActivityType =
  | 'Ride' | 'Run' | 'Swim' | 'WeightTraining' | 'Hike' | 'Walk'
  | 'AlpineSki' | 'BackcountrySki' | 'Badminton' | 'Canoeing' | 'Crossfit'
  | 'EBikeRide' | 'EMountainBikeRide' | 'Elliptical' | 'Golf' | 'GravelRide'
  | 'TrackRide' | 'Handcycle' | 'HighIntensityIntervalTraining' | 'Hockey'
  | 'IceSkate' | 'InlineSkate' | 'Kayaking' | 'Kitesurf' | 'MountainBikeRide'
  | 'NordicSki' | 'OpenWaterSwim' | 'Padel' | 'Pilates' | 'Pickleball'
  | 'Racquetball' | 'Rugby' | 'RockClimbing' | 'RollerSki' | 'Rowing'
  | 'Sail' | 'Skateboard' | 'Snowboard' | 'Snowshoe' | 'Soccer' | 'Squash'
  | 'StairStepper' | 'StandUpPaddling' | 'Surfing' | 'TableTennis' | 'Tennis'
  | 'TrailRun' | 'Transition' | 'Velomobile' | 'VirtualRide' | 'VirtualRow'
  | 'VirtualRun' | 'VirtualSki' | 'WaterSport' | 'Wheelchair' | 'Windsurf'
  | 'Workout' | 'Yoga' | 'Other';

/** Event categories */
export type EventCategory =
  | 'WORKOUT' | 'RACE' | 'NOTE' | 'SEASON_START' | 'TARGET'
  | 'HOLIDAY' | 'SICK_DAYS' | 'TRIP';

/** Activity sub-types */
export type SubType = 'NONE' | 'COMMUTE' | 'WARMUP' | 'COOLDOWN' | 'RACE';

/** Activity source */
export type ActivitySource =
  | 'STRAVA' | 'UPLOAD' | 'MANUAL' | 'GARMIN_CONNECT' | 'OAUTH_CLIENT'
  | 'DROPBOX' | 'POLAR' | 'SUUNTO' | 'COROS' | 'WAHOO' | 'ZWIFT'
  | 'ZEPP' | 'CONCEPT2' | 'HUAWEI';

/** Visibility levels */
export type Visibility = 'PRIVATE' | 'PUBLIC' | 'HIDDEN';

/** Folder types */
export type FolderType = 'FOLDER' | 'PLAN';

/** Workout targets */
export type WorkoutTarget = 'AUTO' | 'POWER' | 'HR' | 'PACE';

/** Chat types */
export type ChatType = 'PRIVATE' | 'GROUP' | 'ACTIVITY';

/** Chat member roles */
export type ChatRole = 'MEMBER' | 'FOLLOWER' | 'COACH' | 'ADMIN';

/** Chat join policies */
export type JoinPolicy = 'OPEN' | 'ASK' | 'INVITE_ONLY';

/** Message types */
export type MessageType =
  | 'TEXT' | 'FOLLOW_REQ' | 'COACH_REQ' | 'COACH_ME_REQ'
  | 'ACTIVITY' | 'NOTE' | 'JOIN_REQ' | 'ACCEPT_COACHING_GROUP';

/** Subscription plans */
export type Plan = 'FREE' | 'PREMIUM' | 'SUPPORTER' | 'WHITELABEL';

/** Athlete status */
export type AthleteStatus = 'ACTIVE' | 'DORMANT' | 'ARCHIVED';

/** Permission levels */
export type Permission = 'NONE' | 'READ' | 'WRITE';

/** Wind speed units */
export type WindSpeedUnit = 'MPS' | 'KNOTS' | 'KMH' | 'MPH' | 'BFT';

/** Rain units */
export type RainUnit = 'MM' | 'INCHES';

/** Height units */
export type HeightUnit = 'CM' | 'FEET';

/** Weight sync source */
export type WeightSync = 'NONE' | 'STRAVA';

/** GAP model */
export type GAPModel = 'NONE' | 'STRAVA_RUN';

/** HR load model type */
export type HRLoadType = 'AVG_HR' | 'HR_ZONES' | 'HRSS';

/** Pace load type */
export type PaceLoadType = 'SWIM' | 'RUN';

/** Garmin power target type */
export type GarminPowerTarget = 'POWER_LAP' | 'POWER' | 'POWER_3S' | 'POWER_10S' | 'POWER_30S';

/** Custom item types */
export type CustomItemType =
  | 'FITNESS_CHART' | 'FITNESS_TABLE' | 'TRACE_CHART' | 'INPUT_FIELD'
  | 'ACTIVITY_FIELD' | 'INTERVAL_FIELD' | 'ACTIVITY_STREAM' | 'ACTIVITY_CHART'
  | 'ACTIVITY_HISTOGRAM' | 'ACTIVITY_HEATMAP' | 'ACTIVITY_MAP'
  | 'ACTIVITY_PANEL' | 'ZONES';

/** Achievement types */
export type AchievementType = 'BEST_POWER' | 'FTP_UP' | 'LTHR_UP' | 'BEST_PACE';

/** TIZ order */
export type TIZOrder =
  | 'POWER_HR_PACE' | 'POWER_PACE_HR' | 'HR_POWER_PACE'
  | 'HR_PACE_POWER' | 'PACE_POWER_HR' | 'PACE_HR_POWER';

/** Pace/power model types */
export type PaceModelType = 'CS';
export type PowerModelType = string;

/** Data curve type (pace curves) */
export type DataCurveType = 'POWER' | 'HR' | 'PACE' | 'GAP';
