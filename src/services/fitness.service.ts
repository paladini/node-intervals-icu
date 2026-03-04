import type { IHttpClient } from '../core/http-client.interface.js';
import type { SummaryWithCats } from '../types/index.js';

/**
 * Service for fitness data and activity summaries
 */
export class FitnessService {
  constructor(
    private httpClient: IHttpClient,
    private defaultAthleteId: string
  ) {}

  /** Get fitness data (CTL, ATL, TSB) for a date range */
  async getFitness(options?: { oldest?: string; newest?: string }, athleteId?: string): Promise<SummaryWithCats[]> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<SummaryWithCats[]>({ method: 'GET', url: `/athlete/${id}/fitness`, params: options as Record<string, unknown> });
  }

  /** Get activity summaries grouped by day/week/month */
  async getSummaries(options?: {
    oldest?: string;
    newest?: string;
    group?: 'day' | 'week' | 'month';
  }, athleteId?: string): Promise<SummaryWithCats[]> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<SummaryWithCats[]>({ method: 'GET', url: `/athlete/${id}/activity-summary`, params: options as Record<string, unknown> });
  }
}
