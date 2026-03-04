/**
 * Shared event types from the Intervals.icu API
 */

/** Shared event (e.g. race) */
export interface SharedEvent {
  id?: number;
  name?: string;
  description?: string;
  start_date_local?: string;
  end_date_local?: string;
  location?: string;
  url?: string;
  type?: string;
  distance?: number;
  [key: string]: unknown;
}
