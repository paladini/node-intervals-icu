/**
 * Sport settings types from the Intervals.icu API
 */
import type { ActivityType } from './enums.js';

/**
 * Sport settings (thresholds, zones, load settings) for an athlete
 */
export interface SportSettings {
  id?: number | string;
  athlete_id?: string;
  types?: ActivityType[];
  /** FTP / threshold power in watts */
  ftp?: number;
  /** Threshold HR in bpm */
  lthr?: number;
  /** Max HR in bpm */
  max_hr?: number;
  /** Resting HR in bpm */
  resting_hr?: number;
  /** Threshold pace in m/s */
  threshold_pace?: number;
  /** W' (W prime) in joules */
  w_prime?: number;
  /** P max in watts */
  p_max?: number;
  /** Critical power / speed */
  cp?: number;
  /** Weight in kg */
  weight?: number;

  // Power zones
  power_zones?: number[];
  power_zone_names?: string[];
  sweet_spot_min?: number;
  sweet_spot_max?: number;
  power_spike_threshold?: number;

  // HR zones
  hr_zones?: number[];
  hr_zone_names?: string[];
  hr_load_type?: string;

  // Pace zones
  pace_zones?: number[];
  pace_zone_names?: string[];

  // Training load
  load_type?: string;
  training_load_method?: string;

  // Effort seconds for power curve
  effort_secs?: number[];

  // Display
  workout_targets?: string[];
  indoor_power_range?: number;
  outdoor_power_range?: number;
  hr_range?: number;
  pace_range?: number;

  [key: string]: unknown;
}
