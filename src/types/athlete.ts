/**
 * Athlete types from the Intervals.icu API
 */
import type {
  ActivityType, AthleteStatus, Visibility, Plan, Permission,
  WindSpeedUnit, RainUnit, HeightUnit, WeightSync, GarminPowerTarget,
} from './enums.js';
import type { SportSettings } from './sport-settings.js';
import type { CustomItem } from './custom-item.js';
import type { Folder } from './folder.js';

/** Strava gear reference */
export interface StravaGear {
  id?: string;
  name?: string;
  primary?: boolean;
  distance?: number;
}

/** Activity filter used in various settings */
export interface ActivityFilter {
  field?: string;
  op?: string;
  value?: string;
}

/** Coach tick */
export interface CoachTick {
  type?: string;
  label?: string;
}

/** Training availability per day */
export interface AthleteTrainingAvailability {
  day?: number;
  hours?: number;
}

/** Settings per activity type */
export interface TypeSettings {
  type?: string;
  [key: string]: unknown;
}

/**
 * Full athlete information (GET /api/v1/athlete/{id} returns WithSportSettings)
 */
export interface Athlete {
  id?: string;
  name?: string;
  firstname?: string;
  lastname?: string;
  profile_medium?: string;
  measurement_preference?: string;
  weight_pref_lb?: boolean;
  fahrenheit?: boolean;
  wind_speed?: WindSpeedUnit;
  rain?: RainUnit;
  weight?: number;
  email?: string;
  sex?: string;
  city?: string;
  state?: string;
  country?: string;
  bikes?: StravaGear[];
  shoes?: StravaGear[];
  timezone?: string;
  locale?: string;
  date_format?: string;
  time_format?: string;
  visibility?: Visibility;
  icu_last_seen?: string;
  status?: AthleteStatus;
  status_updated?: string;
  icu_resting_hr?: number;
  icu_weight?: number;
  icu_weight_sync?: WeightSync;
  icu_activated?: string;
  icu_queue_pos?: number;
  icu_admin?: boolean;
  icu_friend_invite_token?: string;
  icu_permission?: Permission;
  icu_effort_secs?: number[];
  icu_coach?: boolean;
  bio?: string;
  website?: string;
  icu_date_of_birth?: string;
  icu_api_key?: string;
  icu_type_settings?: TypeSettings[];
  icu_form_as_percent?: boolean;
  icu_mmp_days?: number;
  icu_wellness_prompt?: boolean;
  wellness_last_prompt_date?: string;
  icu_wellness_keys?: string[];
  private_wellness_keys?: string[];
  icu_track_menstrual_cycle?: boolean;
  icu_menstrual_cycle_perm?: Permission;
  activity_rpe_prompt?: boolean;
  coach_ticks?: CoachTick[];

  // Device integrations
  icu_garmin_health?: boolean;
  icu_garmin_training?: boolean;
  icu_garmin_sync_activities?: boolean;
  garmin_sync_activity_types?: ActivityType[];
  garmin_sync_after?: string;
  icu_garmin_download_wellness?: boolean;
  icu_garmin_upload_workouts?: boolean;
  icu_garmin_outdoor_power_range?: number;
  icu_garmin_hr_range?: number;
  garmin_pace_range?: number;
  garmin_power_target?: GarminPowerTarget;
  icu_garmin_last_upload?: string;
  icu_garmin_upload_filters?: ActivityFilter[];
  icu_garmin_wellness_keys?: string[];
  open_step_duration?: number;

  polar_scope?: string;
  polar_sync_activities?: boolean;
  polar_sync_activity_types?: ActivityType[];
  polar_download_wellness?: boolean;
  polar_wellness_keys?: string[];

  suunto_scope?: string;
  suunto_user_id?: string;
  suunto_sync_activities?: boolean;
  suunto_sync_activity_types?: ActivityType[];
  suunto_upload_workouts?: boolean;
  suunto_outdoor_power_range?: number;
  suunto_hr_range?: number;
  suunto_pace_range?: number;
  suunto_last_upload?: string;
  suunto_upload_filters?: ActivityFilter[];
  suunto_download_wellness?: boolean;

  coros_user_id?: string;
  coros_sync_activities?: boolean;
  coros_upload_workouts?: boolean;
  coros_download_wellness?: boolean;
  coros_last_upload?: string;

  concept2_user_id?: string;
  concept2_sync_activities?: boolean;

  zepp_user_id?: string;
  zepp_sync_activities?: boolean;
  zepp_upload_workouts?: boolean;
  zepp_download_wellness?: boolean;

  huawei_user_id?: string;
  huawei_sync_activities?: boolean;
  huawei_upload_workouts?: boolean;
  huawei_download_wellness?: boolean;

  wahoo_user_id?: string;
  wahoo_sync_activities?: boolean;
  wahoo_upload_workouts?: boolean;

  zwift_user_id?: string;
  zwift_sync_activities?: boolean;
  zwift_upload_workouts?: boolean;

  dropbox_scope?: string;
  oura_scope?: string;
  oura_wellness_keys?: string[];
  whoop_scope?: string;
  whoop_wellness_keys?: string[];
  google_scope?: string;
  google_wellness_keys?: string[];

  // Email/notification preferences
  icu_email_verified?: boolean;
  icu_email_disabled?: string;
  icu_send_achievements?: boolean;
  icu_send_newsletter?: boolean;
  icu_send_private_chat?: boolean;
  icu_send_private_msg?: boolean;
  icu_send_follow_req?: boolean;
  icu_send_group_chat?: boolean;
  icu_send_group_msg?: boolean;
  icu_send_activity_chat?: boolean;
  icu_send_followed_activity_chat?: boolean;
  icu_send_coached_activity_chat?: boolean;
  icu_send_activity_msg?: boolean;
  icu_send_coach_me_req?: boolean;
  icu_send_gear_alerts?: boolean;
  icu_send_plan_for_week?: boolean;
  include_descr_in_plan_for_week?: boolean;
  icu_send_followed_new_activity?: boolean;
  icu_send_coached_new_activity?: boolean;
  icu_send_coach_tick?: boolean;

  // Strava
  strava_allowed?: boolean;
  strava_id?: number;
  scope?: string;
  strava_sync_activities?: boolean;
  strava_sync_activity_types?: ActivityType[];
  strava_sync_other_activities?: boolean;
  ignore_strava_gear?: boolean;
  update_strava_name?: boolean;
  add_weather_to_strava_descr?: boolean;
  strava_authorized?: boolean;

  // Profile
  height?: number;
  height_units?: HeightUnit;
  plan?: Plan;
  plan_expires?: string;
  trial_end_date?: string;
  sponsored_by_chat_id?: number;
  has_password?: boolean;
  beta_user?: boolean;
  currency?: string;

  // Training plan
  training_plan_id?: number;
  training_plan_start_date?: string;
  training_availability?: AthleteTrainingAvailability[];

  // Included in WithSportSettings response
  sportSettings?: SportSettings[];
  custom_items?: CustomItem[];

  /** Generic catch-all for fields not yet typed */
  [key: string]: unknown;
}

/** DTO for updating an athlete */
export interface AthleteUpdateDTO {
  name?: string;
  firstname?: string;
  lastname?: string;
  sex?: string;
  city?: string;
  state?: string;
  country?: string;
  weight?: number;
  icu_resting_hr?: number;
  icu_weight?: number;
  icu_date_of_birth?: string;
  bio?: string;
  website?: string;
  height?: number;
  height_units?: HeightUnit;
  measurement_preference?: string;
  fahrenheit?: boolean;
  wind_speed?: WindSpeedUnit;
  rain?: RainUnit;
  visibility?: Visibility;
  [key: string]: unknown;
}

/** Athlete training plan */
export interface AthleteTrainingPlan {
  folder_id?: number;
  start_date_local?: string;
  [key: string]: unknown;
}

/** DTO for updating athlete training plan */
export interface AthleteTrainingPlanUpdate {
  athlete_id?: string;
  folder_id?: number;
  start_date_local?: string;
  [key: string]: unknown;
}

/** Athlete search result (compact) */
export interface AthleteSearchResult {
  id?: string;
  name?: string;
  profile_medium?: string;
  [key: string]: unknown;
}

/** Athlete profile with shared folders and custom items */
export interface AthleteProfile {
  athlete?: AthleteSearchResult;
  sharedFolders?: Folder[];
  customItems?: CustomItem[];
}
