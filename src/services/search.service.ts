import type { IHttpClient } from '../core/http-client.interface.js';
import type { ActivitySearchResult, AthleteSearchResult } from '../types/index.js';

/**
 * Service for search operations
 */
export class SearchService {
  constructor(
    private httpClient: IHttpClient,
    private defaultAthleteId: string
  ) {}

  /** Search activities by query string */
  async searchActivities(
    query: string,
    options?: { oldest?: string; newest?: string; limit?: number },
    athleteId?: string
  ): Promise<ActivitySearchResult[]> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<ActivitySearchResult[]>({
      method: 'GET',
      url: `/athlete/${id}/activities/search`,
      params: { q: query, ...options } as Record<string, unknown>,
    });
  }

  /** Search athletes by name or email (coach accounts) */
  async searchAthletes(query: string): Promise<AthleteSearchResult[]> {
    return this.httpClient.request<AthleteSearchResult[]>({
      method: 'GET',
      url: `/search/athletes`,
      params: { q: query } as Record<string, unknown>,
    });
  }
}
