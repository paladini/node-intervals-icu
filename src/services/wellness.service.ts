import type { IHttpClient } from '../core/http-client.interface.js';
import type { Wellness, WellnessInput, PaginationOptions } from '../types/index.js';

/**
 * Service for wellness data (weight, HRV, sleep, etc.)
 */
export class WellnessService {
  constructor(
    private httpClient: IHttpClient,
    private defaultAthleteId: string
  ) {}

  /** List wellness records for a date range */
  async listWellness(options?: PaginationOptions, athleteId?: string): Promise<Wellness[]> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<Wellness[]>({ method: 'GET', url: `/athlete/${id}/wellness`, params: options as Record<string, unknown> });
  }

  /** @deprecated Use listWellness() instead */
  async getWellness(options?: PaginationOptions, athleteId?: string): Promise<Wellness[]> {
    return this.listWellness(options, athleteId);
  }

  /** Get a single wellness record by date (ISO-8601 local date) */
  async getWellnessByDate(date: string, athleteId?: string): Promise<Wellness> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<Wellness>({ method: 'GET', url: `/athlete/${id}/wellness/${date}` });
  }

  /** Create or update a wellness entry (PUT /athlete/{id}/wellness) */
  async createWellness(data: WellnessInput, athleteId?: string): Promise<Wellness> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<Wellness>({ method: 'PUT', url: `/athlete/${id}/wellness`, data });
  }

  /** Update an existing wellness entry by date */
  async updateWellness(date: string, data: Partial<WellnessInput>, athleteId?: string): Promise<Wellness> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<Wellness>({ method: 'PUT', url: `/athlete/${id}/wellness/${date}`, data });
  }

  /**
   * Bulk update wellness records. Each object must have an `id` field (ISO-8601 date).
   * All units are metric.
   */
  async updateWellnessBulk(data: WellnessInput[], athleteId?: string): Promise<Wellness[]> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<Wellness[]>({ method: 'PUT', url: `/athlete/${id}/wellness-bulk`, data });
  }

  /** Upload wellness data from CSV file */
  async uploadWellnessCSV(file: Buffer | Blob | NodeJS.ReadableStream, fileName: string, athleteId?: string): Promise<Wellness[]> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.upload<Wellness[]>({ url: `/athlete/${id}/wellness`, file, fileName });
  }

  /** Delete a wellness entry by date */
  async deleteWellness(date: string, athleteId?: string): Promise<void> {
    const id = athleteId || this.defaultAthleteId;
    await this.httpClient.request<void>({ method: 'DELETE', url: `/athlete/${id}/wellness/${date}` });
  }
}
