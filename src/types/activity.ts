/**
 * Activity types from the Intervals.icu API
 */
import type {
  ActivityType, SubType, ActivitySource, GAPModel, HRLoadType,
  PaceLoadType, TIZOrder, AchievementType,
} from './enums.js';
import type { StravaGear } from './athlete.js';

/** Zone info for an activity */
export interface ZoneInfo {
  id?: string;
  start?: number;
  end?: number;
  start_value?: number;
  end_value?: number;
  secs?: number;
}

/** Zone set */
export interface ZoneSet {
  code?: string;
  zones?: ZoneInfo[];
}

/** Zone time */
export interface ZoneTime {
  id?: string;
  secs?: number;
}

/** HR Recovery data */
export interface HRRecovery {
  start_index?: number;
  end_index?: number;
  start_time?: number;
  end_time?: number;
  start_bpm?: number;
  end_bpm?: number;
  average_watts?: number;
  hrr?: number;
}

/** Achievement */
export interface IcuAchievement {
  id?: string;
  type?: AchievementType;
  message?: string;
  watts?: number;
  secs?: number;
  value?: number;
  distance?: number;
  pace?: number;
}

/** Ignored section */
export interface IgnorePart {
  start_index?: number;
  end_index?: number;
  power?: boolean;
  pace?: boolean;
  hr?: boolean;
}

/** Attachment on an activity */
export interface Attachment {
  id?: string;
  url?: string;
  mime_type?: string;
  name?: string;
}

/** Interval data */
export interface Interval {
  id?: number;
  start_index?: number;
  end_index?: number;
  type?: string;
  label?: string;
  group_id?: number;
  moving_time?: number;
  elapsed_time?: number;
  distance?: number;
  average_watts?: number;
  average_watts_kg?: number;
  intensity?: number;
  average_heartrate?: number;
  max_heartrate?: number;
  average_cadence?: number;
  average_speed?: number;
  average_pace?: number;
  gap?: number;
  total_elevation_gain?: number;
  average_stride?: number;
  [key: string]: unknown;
}

/** Interval group */
export interface IntervalGroup {
  id?: number;
  label?: string;
  color?: string;
  [key: string]: unknown;
}

/** Intervals DTO (response from interval endpoints) */
export interface IntervalsDTO {
  icu_intervals?: Interval[];
  icu_groups?: IntervalGroup[];
  [key: string]: unknown;
}

/** Activity stream */
export interface ActivityStream {
  type?: string;
  data?: number[];
  [key: string]: unknown;
}

/** Result of updating streams */
export interface UpdateStreamsResult {
  [key: string]: unknown;
}

/** Activity ID reference */
export interface ActivityId {
  icu_athlete_id?: string;
  id?: string;
}

/** Upload response */
export interface UploadResponse {
  icu_athlete_id?: string;
  id?: string;
  activities?: ActivityId[];
}

/**
 * Full activity data
 */
export interface Activity {
  id?: string;
  start_date_local?: string;
  type?: ActivityType;
  icu_ignore_time?: boolean;
  icu_pm_cp?: number;
  icu_pm_w_prime?: number;
  icu_pm_p_max?: number;
  icu_pm_ftp?: number;
  icu_pm_ftp_secs?: number;
  icu_pm_ftp_watts?: number;
  icu_ignore_power?: boolean;
  icu_rolling_cp?: number;
  icu_rolling_w_prime?: number;
  icu_rolling_p_max?: number;
  icu_rolling_ftp?: number;
  icu_rolling_ftp_delta?: number;
  icu_training_load?: number;
  icu_atl?: number;
  icu_ctl?: number;
  ss_p_max?: number;
  ss_w_prime?: number;
  ss_cp?: number;
  paired_event_id?: number;
  icu_ftp?: number;
  icu_joules?: number;
  icu_recording_time?: number;
  elapsed_time?: number;
  icu_weighted_avg_watts?: number;
  carbs_used?: number;
  name?: string;
  description?: string;
  start_date?: string;
  distance?: number;
  icu_distance?: number;
  moving_time?: number;
  coasting_time?: number;
  total_elevation_gain?: number;
  total_elevation_loss?: number;
  timezone?: string;
  trainer?: boolean;
  sub_type?: SubType;
  commute?: boolean;
  race?: boolean;
  max_speed?: number;
  average_speed?: number;
  device_watts?: boolean;
  has_heartrate?: boolean;
  max_heartrate?: number;
  average_heartrate?: number;
  average_cadence?: number;
  calories?: number;
  average_temp?: number;
  min_temp?: number;
  max_temp?: number;
  avg_lr_balance?: number;
  gap?: number;
  gap_model?: GAPModel;
  use_elevation_correction?: boolean;
  gear?: StravaGear;
  perceived_exertion?: number;
  device_name?: string;
  power_meter?: string;
  power_meter_serial?: string;
  power_meter_battery?: string;
  crank_length?: number;
  external_id?: string;
  file_sport_index?: number;
  file_type?: string;
  icu_athlete_id?: string;
  created?: string;
  icu_sync_date?: string;
  analyzed?: string;
  icu_w_prime?: number;
  p_max?: number;
  threshold_pace?: number;
  icu_hr_zones?: number[];
  pace_zones?: number[];
  lthr?: number;
  icu_resting_hr?: number;
  icu_weight?: number;
  icu_power_zones?: number[];
  icu_sweet_spot_min?: number;
  icu_sweet_spot_max?: number;
  icu_power_spike_threshold?: number;
  trimp?: number;
  icu_warmup_time?: number;
  icu_cooldown_time?: number;
  icu_chat_id?: number;
  icu_ignore_hr?: boolean;
  ignore_velocity?: boolean;
  ignore_pace?: boolean;
  ignore_parts?: IgnorePart[];
  icu_training_load_data?: number;
  interval_summary?: string[];
  stream_types?: string[];
  has_weather?: boolean;
  has_segments?: boolean;
  power_field_names?: string[];
  power_field?: string;
  icu_zone_times?: ZoneTime[];
  icu_hr_zone_times?: number[];
  pace_zone_times?: number[];
  gap_zone_times?: number[];
  use_gap_zone_times?: boolean;
  custom_zones?: ZoneSet[];
  tiz_order?: TIZOrder;
  polarization_index?: number;
  icu_achievements?: IcuAchievement[];
  icu_intervals_edited?: boolean;
  lock_intervals?: boolean;
  icu_lap_count?: number;
  icu_joules_above_ftp?: number;
  icu_max_wbal_depletion?: number;
  icu_hrr?: HRRecovery;
  icu_sync_error?: string;
  icu_color?: string;
  icu_power_hr_z2?: number;
  icu_power_hr_z2_mins?: number;
  icu_cadence_z2?: number;
  icu_rpe?: number;
  feel?: number;
  kg_lifted?: number;
  decoupling?: number;
  icu_median_time_delta?: number;
  p30s_exponent?: number;
  workout_shift_secs?: number;
  strava_id?: string;
  lengths?: number;
  pool_length?: number;
  compliance?: number;
  coach_tick?: number;
  source?: ActivitySource;
  oauth_client_id?: number;
  oauth_client_name?: string;
  average_altitude?: number;
  min_altitude?: number;
  max_altitude?: number;
  power_load?: number;
  hr_load?: number;
  pace_load?: number;
  hr_load_type?: HRLoadType;
  pace_load_type?: PaceLoadType;
  tags?: string[];
  attachments?: Attachment[];
  recording_stops?: number[];

  // Weather fields
  average_weather_temp?: number;
  min_weather_temp?: number;
  max_weather_temp?: number;
  average_feels_like?: number;
  min_feels_like?: number;
  max_feels_like?: number;
  average_wind_speed?: number;
  average_wind_gust?: number;
  prevailing_wind_deg?: number;
  headwind_percent?: number;
  tailwind_percent?: number;
  average_clouds?: number;
  max_rain?: number;
  max_snow?: number;

  carbs_ingested?: number;
  route_id?: number;
  pace?: number;
  athlete_max_hr?: number;
  group?: string;
  icu_intensity?: number;
  icu_efficiency_factor?: number;
  icu_power_hr?: number;
  session_rpe?: number;
  average_stride?: number;
  icu_average_watts?: number;
  icu_variability_index?: number;
  strain_score?: number;

  // Present in ActivityWithIntervals
  icu_intervals?: Interval[];
  icu_groups?: IntervalGroup[];

  [key: string]: unknown;
}

/** Options for updating an activity */
export type ActivityInput = Partial<Omit<Activity, 'id' | 'icu_athlete_id' | 'created'>>;

/** Activity search result (compact) */
export interface ActivitySearchResult {
  id?: string;
  name?: string;
  start_date_local?: string;
  type?: string;
  race?: boolean;
  distance?: number;
  moving_time?: number;
  tags?: string[];
  description?: string;
}

/** Options for uploading an activity */
export interface UploadActivityOptions {
  name?: string;
  description?: string;
  device_name?: string;
  external_id?: string;
  paired_event_id?: number;
}

// ── Performance curves (activity-level) ──

/** Best effort */
export interface Effort {
  start_index?: number;
  end_index?: number;
  average?: number;
  duration?: number;
  distance?: number;
}

/** Best efforts response */
export interface BestEfforts {
  efforts?: Effort[];
}

/** Bucket for power vs HR plot */
export interface PowerVsHRBucket {
  start?: number;
  secs?: number;
  movingSecs?: number;
  watts?: number;
  hr?: number;
  cadence?: number;
}

/** Curve fit */
export interface CurveFit {
  id?: string;
  coefficients?: number[];
  r2?: number;
}

/** Power vs HR plot */
export interface PowerVsHRPlot {
  bucketSize?: number;
  warmup?: number;
  cooldown?: number;
  elapsedTime?: number;
  hrLag?: number;
  powerHr?: number;
  powerHrFirst?: number;
  powerHrSecond?: number;
  decoupling?: number;
  powerHrZ2?: number;
  medianCadenceZ2?: number;
  avgCadenceZ2?: number;
  hrZ2BucketCount?: number;
  start?: number;
  mid?: number;
  end?: number;
  series?: PowerVsHRBucket[];
  curves?: CurveFit[];
  ratioCoefficients?: number[];
}

/** HR load model */
export interface HRLoadModel {
  type?: HRLoadType;
  icu_training_load?: number;
  trainingDataCount?: number;
}

/** Segment */
export interface IcuSegment {
  id?: number;
  start_index?: number;
  end_index?: number;
  name?: string;
  segment_id?: number;
  starred?: boolean;
}

// ── Map data ──

export interface MapData {
  bounds?: number[][];
  latlngs?: number[][];
  route?: unknown;
  weather?: ActivityWeather;
}

// ── Activity weather ──

export interface WeatherTime {
  start_secs?: number;
  end_secs?: number;
  index?: number;
  temp?: number;
  feels_like?: number;
  humidity?: number;
  wind_speed?: number;
  wind_deg?: number;
  wind_gust?: number;
  rain?: number;
  showers?: number;
  snow?: number;
  clouds?: number;
  pressure?: number;
  weather_code?: number;
}

export interface WeatherPoint {
  latitude?: number;
  longitude?: number;
  times?: WeatherTime[];
}

export interface WeatherClosest {
  start_secs?: number;
  p1_index?: number;
  p2_index?: number;
  p3_index?: number;
}

export interface ActivityWeather {
  points?: WeatherPoint[];
  closest_points?: WeatherClosest[];
}

/** Wind rose data */
export interface WindRose {
  avg_speed?: number[];
  count?: number[];
}

/** Activity weather summary */
export interface ActivityWeatherSummary {
  start_index?: number;
  end_index?: number;
  start_secs?: number;
  end_secs?: number;
  moving_time?: number;
  whole_activity?: boolean;
  wind_speed?: WindRose;
  wind_gust?: WindRose;
  apparent_wind_speed?: WindRose;
  apparent_wind_gust?: WindRose;
  average_temp?: number;
  min_temp?: number;
  max_temp?: number;
  average_weather_temp?: number;
  min_weather_temp?: number;
  max_weather_temp?: number;
  average_feels_like?: number;
  min_feels_like?: number;
  max_feels_like?: number;
  average_wind_speed?: number;
  min_wind_speed?: number;
  max_wind_speed?: number;
  average_wind_gust?: number;
  min_wind_gust?: number;
  max_wind_gust?: number;
  prevailing_wind_deg?: number;
  average_yaw?: number;
  headwind_percent?: number;
  tailwind_percent?: number;
  max_rain?: number;
  max_showers?: number;
  max_snow?: number;
  average_clouds?: number;
  description?: string;
}

/** Activity mini (compact reference) */
export interface ActivityMini {
  id?: string;
  start_date_local?: string;
  type?: string;
  name?: string;
}
