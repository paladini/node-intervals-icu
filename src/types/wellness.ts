/**
 * Wellness types from the Intervals.icu API
 */

/**
 * Wellness record for a single day
 */
export interface Wellness {
  /** The day (ISO-8601 local date, e.g. '2024-01-15') — also serves as the record ID */
  id?: string;
  athlete_id?: string;
  /** Local date (ISO-8601) */
  date?: string;
  ctl?: number;
  atl?: number;
  rampRate?: number;
  ctlLoad?: number;
  atlLoad?: number;
  sportInfo?: unknown;
  updated?: string;

  // Core wellness fields
  weight?: number;
  restingHR?: number;
  hrv?: number;
  hrvSDNN?: number;
  menstrualPhase?: number;
  menstrualPhasePredicted?: number;
  kcalConsumed?: number;
  sleepSecs?: number;
  sleepScore?: number;
  sleepQuality?: number;
  avgSleepingHR?: number;
  soreness?: number;
  fatigue?: number;
  stress?: number;
  mood?: number;
  motivation?: number;
  injury?: number;
  spO2?: number;
  systolic?: number;
  diastolic?: number;
  hydration?: number;
  hydrationVolume?: number;
  readiness?: number;
  baevsky?: number;
  vo2max?: number;
  comments?: string;

  // Nutrition
  carbs?: number;
  protein?: number;
  fat?: number;

  // Steps / calories
  steps?: number;
  respiration?: number;
  bloodGlucose?: number;
  lactate?: number;
  bodyFat?: number;
  abdomen?: number;
  vo2maxEstimate?: number;

  /** Any custom/unknown wellness keys */
  [key: string]: unknown;
}

/** Input for creating/updating a wellness entry */
export type WellnessInput = Omit<Wellness, 'athlete_id' | 'ctl' | 'atl' | 'rampRate' | 'ctlLoad' | 'atlLoad' | 'sportInfo' | 'updated'>;
