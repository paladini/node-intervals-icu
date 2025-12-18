import type { IHttpClient } from '../core/http-client.interface.js';
import type { Wellness, WellnessInput, PaginationOptions } from '../types.js';

/**
 * Service for wellness-related operations
 * Follows Single Responsibility Principle and Interface Segregation Principle
 */
export class WellnessService {
  constructor(
    private httpClient: IHttpClient,
    private defaultAthleteId: string
  ) {}

  /**
   * Gets wellness data for an athlete
   */
  async getWellness(options?: PaginationOptions, athleteId?: string): Promise<Wellness[]> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<Wellness[]>({
      method: 'GET',
      url: `/athlete/${id}/wellness`,
      params: options as Record<string, unknown>,
    });
  }

  /**
   * Creates a new wellness entry
   */
  async createWellness(data: WellnessInput, athleteId?: string): Promise<Wellness> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<Wellness>({
      method: 'POST',
      url: `/athlete/${id}/wellness`,
      data,
    });
  }

  /**
   * Updates an existing wellness entry
   */
  async updateWellness(date: string, data: Partial<WellnessInput>, athleteId?: string): Promise<Wellness> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<Wellness>({
      method: 'PUT',
      url: `/athlete/${id}/wellness/${date}`,
      data,
    });
  }

  /**
   * Deletes a wellness entry
   */
  async deleteWellness(date: string, athleteId?: string): Promise<void> {
    const id = athleteId || this.defaultAthleteId;
    await this.httpClient.request<void>({
      method: 'DELETE',
      url: `/athlete/${id}/wellness/${date}`,
    });
  }
}
