/**
 * Gear types from the Intervals.icu API
 */

/** Gear reminder */
export interface GearReminder {
  id?: number;
  type?: string;
  threshold?: number;
  message?: string;
  snoozed_until?: string;
  [key: string]: unknown;
}

/** Gear or component */
export interface Gear {
  id?: string;
  athlete_id?: string;
  name?: string;
  type?: string;
  sub_type?: string;
  parent_id?: string;
  default_for_activity_type?: string;
  retired?: string;
  distance?: number;
  elapsed_time?: number;
  activities?: number;
  brand?: string;
  model?: string;
  link?: string;
  notes?: string;
  reminders?: GearReminder[];
  [key: string]: unknown;
}

/** Gear usage stats */
export interface GearStats {
  distance?: number;
  elapsed_time?: number;
  moving_time?: number;
  activities?: number;
}
