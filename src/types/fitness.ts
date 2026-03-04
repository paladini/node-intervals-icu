/**
 * Fitness and summary types from the Intervals.icu API
 */
import type { ActivityType } from './enums.js';

/** Category summary (per activity type) */
export interface CategorySummary {
  count?: number;
  time?: number;
  moving_time?: number;
  elapsed_time?: number;
  calories?: number;
  total_elevation_gain?: number;
  training_load?: number;
  srpe?: number;
  distance?: number;
  eftp?: number;
  eftpPerKg?: number;
  category?: ActivityType;
}

/** Summary with categories (fitness/summaries response) */
export interface SummaryWithCats {
  count?: number;
  time?: number;
  moving_time?: number;
  elapsed_time?: number;
  calories?: number;
  total_elevation_gain?: number;
  training_load?: number;
  srpe?: number;
  distance?: number;
  eftp?: number;
  eftpPerKg?: number;
  date?: string;
  athlete_id?: string;
  athlete_name?: string;
  email?: string;
  external_id?: string;
  fitness?: number;
  fatigue?: number;
  form?: number;
  rampRate?: number;
  weight?: number;
  timeInZones?: number[];
  timeInZonesTot?: number;
  byCategory?: CategorySummary[];
  mostRecentWellnessId?: string;
}
