/**
 * Folder and plan types from the Intervals.icu API
 */
import type { ActivityType, FolderType, Visibility, WorkoutTarget } from './enums.js';
import type { AthleteSearchResult } from './athlete.js';
import type { Workout } from './workout.js';

/**
 * Workout folder or training plan
 */
export interface Folder {
  athlete_id?: string;
  id?: number;
  type?: FolderType;
  name?: string;
  description?: string;
  children?: Workout[];
  visibility?: Visibility;
  start_date_local?: string;
  rollout_weeks?: number;
  auto_rollout_day?: number;
  read_only_workouts?: boolean;
  starting_ctl?: number;
  starting_atl?: number;
  activity_types?: ActivityType[];
  num_workouts?: number;
  duration_weeks?: number;
  hours_per_week_min?: number;
  hours_per_week_max?: number;
  workout_targets?: WorkoutTarget[];
  blurb?: string;
  canEdit?: boolean;
  sharedWithCount?: number;
  shareToken?: string;
  owner?: AthleteSearchResult;
  [key: string]: unknown;
}

/** DTO for creating a folder */
export interface CreateFolderDTO extends Folder {
  copy_folder_id?: number;
}

/** Shared-with entry */
export interface SharedWith {
  athlete_id?: string;
  name?: string;
  [key: string]: unknown;
}
