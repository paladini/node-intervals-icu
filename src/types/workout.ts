/**
 * Workout types from the Intervals.icu API
 */
import type { ActivityType } from './enums.js';

/**
 * Workout in the library (folder/plan)
 */
export interface Workout {
  id?: number;
  athlete_id?: string;
  folder_id?: number;
  /** Day offset within a plan (0-based) */
  day?: number;
  type?: ActivityType | string;
  name?: string;
  description?: string;
  /** Structured workout document */
  workout_doc?: any;
  /** Raw file contents (zwo, mrc, erg, fit) */
  file_contents?: string;
  /** Base64-encoded file contents */
  file_contents_base64?: string;
  indoor?: boolean;
  color?: string;
  moving_time?: number;
  distance?: number;
  icu_training_load?: number;
  joules?: number;
  intensity?: number;
  hide_from_athlete?: boolean;
  plan_applied?: string;
  [key: string]: unknown;
}

/** Extended workout data for create/update (includes file content fields) */
export type WorkoutEx = Workout;

/** Input for creating/updating a workout */
export type WorkoutInput = Omit<Workout, 'id' | 'athlete_id'>;

/** DTO for duplicating workouts */
export interface DuplicateWorkoutsDTO {
  numCopies?: number;
  weeksBetween?: number;
  workoutIds?: number[];
}
