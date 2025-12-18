import type { IHttpClient } from '../core/http-client.interface.js';
import type { Athlete } from '../types.js';

/**
 * Service for athlete-related operations
 * Follows Single Responsibility Principle and Interface Segregation Principle
 */
export class AthleteService {
  constructor(
    private httpClient: IHttpClient,
    private defaultAthleteId: string
  ) {}

  /**
   * Gets athlete information
   * 
   * @param athleteId - Athlete ID (defaults to the configured athlete or 'me')
   * @returns Athlete information
   */
  async getAthlete(athleteId?: string): Promise<Athlete> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<Athlete>({
      method: 'GET',
      url: `/athlete/${id}`,
    });
  }

  /**
   * Updates athlete information
   * 
   * @param data - Partial athlete data to update
   * @param athleteId - Athlete ID (defaults to the configured athlete or 'me')
   * @returns Updated athlete information
   */
  async updateAthlete(data: Partial<Athlete>, athleteId?: string): Promise<Athlete> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<Athlete>({
      method: 'PUT',
      url: `/athlete/${id}`,
      data,
    });
  }
}
