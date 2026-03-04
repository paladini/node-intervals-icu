/**
 * Custom item types from the Intervals.icu API
 */
import type { CustomItemType, Visibility } from './enums.js';
import type { AthleteSearchResult } from './athlete.js';

/** Custom item (chart, field, etc.) */
export interface CustomItem {
  id?: number;
  athlete_id?: string;
  type?: CustomItemType;
  visibility?: Visibility;
  name?: string;
  description?: string;
  image?: string;
  content?: Record<string, unknown>;
  usage_count?: number;
  index?: number;
  hide_script?: boolean;
  hidden_by_id?: string;
  updated?: string;
  from_athlete?: AthleteSearchResult;
  from_id?: number;
  [key: string]: unknown;
}

/** New custom item response (includes required_items_created) */
export interface NewCustomItem extends CustomItem {
  required_items_created?: NewCustomItem[];
}
