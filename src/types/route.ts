/**
 * Route types from the Intervals.icu API
 */

/** Athlete route */
export interface AthleteRoute {
  athlete_id?: string;
  route_id?: number;
  name?: string;
  rename_activities?: boolean;
  commute?: boolean;
  tags?: string[];
  description?: string;
  replaced_by_route_id?: number;
  latlngs?: number[][];
  distance?: number;
  activity_count?: number;
  most_recent_id?: string;
  most_recent_start_date_local?: string;
  most_recent_type?: string;
  [key: string]: unknown;
}

/** Route similarity comparison */
export interface RouteSimilarity {
  route?: AthleteRoute;
  route_distance?: number;
  route_activity_count?: number;
  other?: AthleteRoute;
  other_distance?: number;
  other_activity_count?: number;
  similarity?: number;
  bounds?: number[][];
}
