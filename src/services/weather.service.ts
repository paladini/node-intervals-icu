import type { IHttpClient } from '../core/http-client.interface.js';
import type { WeatherDTO, WeatherConfig } from '../types/index.js';

/**
 * Service for athlete weather configuration and forecasts
 */
export class WeatherService {
  constructor(
    private httpClient: IHttpClient,
    private defaultAthleteId: string
  ) {}

  /** Get weather forecast for the athlete's location */
  async getWeather(athleteId?: string): Promise<WeatherDTO> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<WeatherDTO>({ method: 'GET', url: `/athlete/${id}/weather` });
  }

  /** Get weather configuration (location) */
  async getWeatherConfig(athleteId?: string): Promise<WeatherConfig> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<WeatherConfig>({ method: 'GET', url: `/athlete/${id}/weather-config` });
  }

  /** Update weather configuration (set location) */
  async updateWeatherConfig(data: WeatherConfig, athleteId?: string): Promise<WeatherConfig> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<WeatherConfig>({ method: 'PUT', url: `/athlete/${id}/weather-config`, data });
  }
}
