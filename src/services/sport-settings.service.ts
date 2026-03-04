import type { IHttpClient } from '../core/http-client.interface.js';
import type { SportSettings } from '../types/index.js';

/**
 * Service for sport settings (thresholds, zones, load settings per sport type group)
 */
export class SportSettingsService {
  constructor(
    private httpClient: IHttpClient,
    private defaultAthleteId: string
  ) {}

  /** List all sport settings for an athlete */
  async list(athleteId?: string): Promise<SportSettings[]> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<SportSettings[]>({ method: 'GET', url: `/athlete/${id}/sport-settings` });
  }

  /** Get a single sport settings entry by ID */
  async get(settingsId: number | string, athleteId?: string): Promise<SportSettings> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<SportSettings>({ method: 'GET', url: `/athlete/${id}/sport-settings/${settingsId}` });
  }

  /** Create a new sport settings entry */
  async create(data: Partial<SportSettings>, athleteId?: string): Promise<SportSettings> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<SportSettings>({ method: 'POST', url: `/athlete/${id}/sport-settings`, data });
  }

  /** Update a single sport settings entry */
  async update(settingsId: number | string, data: Partial<SportSettings>, athleteId?: string): Promise<SportSettings> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<SportSettings>({ method: 'PUT', url: `/athlete/${id}/sport-settings/${settingsId}`, data });
  }

  /** Update multiple sport settings at once */
  async updateMultiple(data: SportSettings[], athleteId?: string): Promise<SportSettings[]> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<SportSettings[]>({ method: 'PUT', url: `/athlete/${id}/sport-settings`, data });
  }

  /** Delete a sport settings entry */
  async delete(settingsId: number | string, athleteId?: string): Promise<void> {
    const id = athleteId || this.defaultAthleteId;
    await this.httpClient.request<void>({ method: 'DELETE', url: `/athlete/${id}/sport-settings/${settingsId}` });
  }

  /** Apply sport settings to existing activities */
  async applyToActivities(settingsId: number | string, athleteId?: string): Promise<void> {
    const id = athleteId || this.defaultAthleteId;
    await this.httpClient.request<void>({ method: 'PUT', url: `/athlete/${id}/sport-settings/${settingsId}/apply` });
  }
}
