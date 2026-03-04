/**
 * Weather types from the Intervals.icu API
 */

/** Weather forecast entry */
export interface Forecast {
  time?: string;
  temp?: number;
  feels_like?: number;
  humidity?: number;
  wind_speed?: number;
  wind_deg?: number;
  wind_gust?: number;
  rain?: number;
  showers?: number;
  snow?: number;
  clouds?: number;
  pressure?: number;
  weather_code?: number;
  [key: string]: unknown;
}

/** Weather DTO response */
export interface WeatherDTO {
  forecasts?: Forecast[];
}

/** Weather config for an athlete */
export interface WeatherConfig {
  latitude?: number;
  longitude?: number;
  location_name?: string;
  [key: string]: unknown;
}
