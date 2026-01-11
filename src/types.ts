/**
 * Type definitions for Intervals.icu API responses
 */

/**
 * Athlete information
 */
export interface Athlete {
  id: string;
  name: string;
  email?: string;
  sex?: 'male' | 'female';
  dob?: string;
  weight?: number;
  restingHR?: number;
  maxHR?: number;
  lthr?: number;
  ftp?: number;
  ftpWattsPerKg?: number;
  w1?: number;
  w2?: number;
  w3?: number;
  w4?: number;
  w5?: number;
  w6?: number;
  pMax?: number;
  created?: string;
  updated?: string;
  icu_ftp?: number;
  icu_w1?: number;
  icu_w2?: number;
  icu_w3?: number;
  icu_w4?: number;
  icu_w5?: number;
  icu_w6?: number;
  icu_pm?: number;
}

/**
 * Event/Calendar entry
 */
export interface Event {
  id?: number;
  athlete_id?: string;
  start_date_local: string;
  category?: string;
  type?: string;
  name?: string;
  description?: string;
  color?: string;
  show_as_note?: boolean;
  athlete_cannot_edit?: boolean;
  hide_from_athlete?: boolean;
  external_id?: string;
  uid?: string;
  created?: string;
  updated?: string;
}

/**
 * Wellness entry
 */
export interface Wellness {
  id?: string;
  athlete_id?: string;
  date: string;
  restingHR?: number;
  hrv?: number;
  weight?: number;
  fatigue?: number;
  soreness?: number;
  stress?: number;
  mood?: number;
  motivation?: number;
  injury?: number;
  spO2?: number;
  systolic?: number;
  diastolic?: number;
  hydration?: number;
  hydrationVolume?: number;
  sleepSecs?: number;
  sleepQuality?: number;
  sleepScore?: number;
  menstrualPhase?: number;
  kcalConsumed?: number;
  carbs?: number;
  protein?: number;
  fat?: number;
  comments?: string;
  created?: string;
  updated?: string;
}

/**
 * Workout/Training plan workout
 */
export interface Workout {
  id?: number;
  athlete_id?: string;
  start_date_local: string;
  name?: string;
  description?: string;
  workout_doc?: string;
  workout_filename?: string;
  workout_type?: string;
  indoor?: boolean;
  outdoor?: boolean;
  show_as_note?: boolean;
  category?: string;
  duration_secs?: number;
  distance_meters?: number;
  moving_time?: number;
  tss?: number;
  intensity?: number;
  created?: string;
  updated?: string;
}

/**
 * Activity data
 */
export interface Activity {
  id?: number;
  athlete_id?: string;
  start_date_local: string;
  type?: string;
  name?: string;
  description?: string;
  distance?: number;
  moving_time?: number;
  elapsed_time?: number;
  total_elevation_gain?: number;
  trainer?: boolean;
  commute?: boolean;
  icu_ignore_time?: boolean;
  icu_ignore_hr?: boolean;
  icu_ignore_watts?: boolean;
  icu_ignore_pace?: boolean;
  max_speed?: number;
  average_speed?: number;
  max_watts?: number;
  average_watts?: number;
  weighted_average_watts?: number;
  max_heartrate?: number;
  average_heartrate?: number;
  tss?: number;
  trimp?: number;
  calories?: number;
  average_cadence?: number;
  max_cadence?: number;
  pace?: number;
  gap?: number;
  feel?: number;
  perceived_exertion?: number;
  created?: string;
  updated?: string;
}

// ==================== ACTIVITY STREAMS TYPES ====================

/**
 * Activity Stream data
 * Represents time-series data for an activity (power, heart rate, cadence, etc.)
 */
export interface ActivityStream {
  /** Stream type (e.g., 'watts', 'heartrate', 'cadence', 'speed', 'distance', 'altitude', 'latlng', 'time', 'moving') */
  type: string;
  /** Data points as an array of values */
  data: number[] | number[][];
  /** Sample rate in Hz (if applicable) */
  sample_rate?: number;
}

/**
 * Available stream types for activities
 */
export type StreamType =
  | 'watts'            // Power in watts
  | 'heartrate'        // Heart rate in bpm
  | 'cadence'          // Cadence in rpm
  | 'speed'            // Speed in m/s
  | 'distance'         // Distance in meters
  | 'altitude'         // Altitude in meters
  | 'latlng'           // GPS coordinates [latitude, longitude]
  | 'time'             // Time in seconds
  | 'moving'           // Moving state (boolean as 0/1)
  | 'grade'            // Grade percentage
  | 'velocity_smooth'  // Smoothed velocity in m/s
  | 'temp'             // Temperature in Celsius
  | 'watts_left'       // Left balance power
  | 'watts_right'      // Right balance power
  | 'watts_sample';    // Sample rate for power

/**
 * Options for getting activity streams
 */
export interface StreamsOptions {
  /** Comma-separated list of stream types to retrieve */
  types?: StreamType | StreamType[];
  /** Include default stream types */
  includeDefaults?: boolean;
  /** Return data in CSV format (instead of JSON) */
  format?: 'json' | 'csv';
}

/**
 * Result of updating streams
 */
export interface UpdateStreamsResult {
  success: boolean;
  updated: string[];
  errors?: string[];
}

// ==================== ACTIVITY INTERVALS TYPES ====================

/**
 * Activity Interval/Lap data
 */
export interface Interval {
  id?: number;
  /** Interval start index in the stream data */
  start_index: number;
  /** Interval end index in the stream data */
  end_index: number;
  /** Interval duration in seconds */
  elapsed_time?: number;
  /** Moving time in seconds */
  moving_time?: number;
  /** Distance in meters */
  distance?: number;
  /** Average power in watts */
  average_watts?: number;
  /** Average heart rate in bpm */
  average_heartrate?: number;
  /** Average cadence in rpm */
  average_cadence?: number;
  /** Max power in watts */
  max_watts?: number;
  /** Max heart rate in bpm */
  max_heartrate?: number;
  /** TSS score */
  tss?: number;
  /** Normalized power */
  np?: number;
  /** Intensity factor */
  intensity?: number;
  /** Name/description of the interval */
  name?: string;
}

/**
 * Response containing activity intervals
 */
export interface IntervalsDTO {
  activity_id: string;
  intervals: Interval[];
  /** Count of intervals */
  count: number;
}

/**
 * Options for updating intervals
 */
export interface UpdateIntervalsOptions {
  /** Replace all existing intervals (default: true) */
  all?: boolean;
}

// ==================== BULK OPERATIONS TYPES ====================

/**
 * Event for bulk deletion
 */
export interface DoomedEvent {
  id?: number;
  external_id?: string;
}

/**
 * Response from bulk event deletion
 */
export interface DeleteEventsResponse {
  deleted: number;
  ids: number[];
  external_ids: string[];
}

/**
 * Options for creating events in bulk
 */
export interface BulkEventInput extends EventInput {
  /** External ID for upsert operations */
  external_id?: string;
  /** Unique identifier for upsert */
  uid?: string;
}

// ==================== ORIGINAL TYPES ====================

/**
 * Configuration for the Intervals.icu client
 */
export interface IntervalsConfig {
  /**
   * API key for authentication
   */
  apiKey: string;

  /**
   * Athlete ID (defaults to 'me' for the authenticated athlete)
   */
  athleteId?: string;

  /**
   * Base URL for the API (defaults to https://intervals.icu/api/v1)
   */
  baseURL?: string;

  /**
   * Request timeout in milliseconds (defaults to 10000)
   */
  timeout?: number;
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
 * Pagination options for list endpoints
 */
export interface PaginationOptions {
  /**
   * Oldest date to return (ISO 8601 format)
   */
  oldest?: string;

  /**
   * Newest date to return (ISO 8601 format)
   */
  newest?: string;

  /**
   * Limit the number of results
   */
  limit?: number;

  /**
   * Offset for pagination
   */
  offset?: number;
}

/**
 * Options for creating or updating an event
 */
export type EventInput = Omit<Event, 'id' | 'athlete_id' | 'created' | 'updated'>;

/**
 * Options for creating or updating wellness data
 */
export type WellnessInput = Omit<Wellness, 'id' | 'athlete_id' | 'created' | 'updated'>;

/**
 * Options for creating or updating a workout
 */
export type WorkoutInput = Omit<Workout, 'id' | 'athlete_id' | 'created' | 'updated'>;

/**
 * Options for updating an activity
 */
export type ActivityInput = Partial<Omit<Activity, 'id' | 'athlete_id' | 'created' | 'updated'>>;
