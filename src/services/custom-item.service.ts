import type { IHttpClient } from '../core/http-client.interface.js';
import type { CustomItem, NewCustomItem } from '../types/index.js';

/**
 * Service for custom items (charts, fields, histograms, etc.)
 */
export class CustomItemService {
  constructor(
    private httpClient: IHttpClient,
    private defaultAthleteId: string
  ) {}

  /** List all custom items for an athlete */
  async list(athleteId?: string): Promise<CustomItem[]> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<CustomItem[]>({ method: 'GET', url: `/athlete/${id}/custom-item` });
  }

  /** Get a specific custom item */
  async get(itemId: number, athleteId?: string): Promise<CustomItem> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<CustomItem>({ method: 'GET', url: `/athlete/${id}/custom-item/${itemId}` });
  }

  /** Create a new custom item */
  async create(data: Partial<CustomItem>, athleteId?: string): Promise<NewCustomItem> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<NewCustomItem>({ method: 'POST', url: `/athlete/${id}/custom-item`, data });
  }

  /** Update a custom item */
  async update(itemId: number, data: Partial<CustomItem>, athleteId?: string): Promise<CustomItem> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<CustomItem>({ method: 'PUT', url: `/athlete/${id}/custom-item/${itemId}`, data });
  }

  /** Delete a custom item */
  async delete(itemId: number, athleteId?: string): Promise<void> {
    const id = athleteId || this.defaultAthleteId;
    await this.httpClient.request<void>({ method: 'DELETE', url: `/athlete/${id}/custom-item/${itemId}` });
  }

  /** Reorder custom items (update sort indexes) */
  async reorder(data: Array<{ id: number; index: number }>, athleteId?: string): Promise<void> {
    const id = athleteId || this.defaultAthleteId;
    await this.httpClient.request<void>({ method: 'PUT', url: `/athlete/${id}/custom-item-indexes`, data });
  }

  /** Upload an image for a custom item */
  async uploadImage(itemId: number, file: Buffer | Blob | NodeJS.ReadableStream, fileName: string, athleteId?: string): Promise<CustomItem> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.upload<CustomItem>({ url: `/athlete/${id}/custom-item/${itemId}/image`, file, fileName });
  }
}
