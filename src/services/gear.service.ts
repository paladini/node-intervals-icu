import type { IHttpClient } from '../core/http-client.interface.js';
import type { Gear, GearReminder } from '../types/index.js';

/**
 * Service for gear and equipment management
 */
export class GearService {
  constructor(
    private httpClient: IHttpClient,
    private defaultAthleteId: string
  ) {}

  /** Create a new gear item */
  async create(data: Partial<Gear>, athleteId?: string): Promise<Gear> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<Gear>({ method: 'POST', url: `/athlete/${id}/gear`, data });
  }

  /** Update a gear item */
  async update(gearId: string, data: Partial<Gear>, athleteId?: string): Promise<Gear> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<Gear>({ method: 'PUT', url: `/athlete/${id}/gear/${gearId}`, data });
  }

  /** Delete a gear item */
  async delete(gearId: string, athleteId?: string): Promise<void> {
    const id = athleteId || this.defaultAthleteId;
    await this.httpClient.request<void>({ method: 'DELETE', url: `/athlete/${id}/gear/${gearId}` });
  }

  /** Replace a gear item (transfer activities to a new gear item) */
  async replace(gearId: string, data: { new_gear_id: string }, athleteId?: string): Promise<void> {
    const id = athleteId || this.defaultAthleteId;
    await this.httpClient.request<void>({ method: 'POST', url: `/athlete/${id}/gear/${gearId}/replace`, data });
  }

  /** Create a gear reminder */
  async createReminder(gearId: string, data: Partial<GearReminder>, athleteId?: string): Promise<GearReminder> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<GearReminder>({ method: 'POST', url: `/athlete/${id}/gear/${gearId}/reminder`, data });
  }

  /** Update a gear reminder */
  async updateReminder(gearId: string, reminderId: number, data: Partial<GearReminder>, athleteId?: string): Promise<GearReminder> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<GearReminder>({ method: 'PUT', url: `/athlete/${id}/gear/${gearId}/reminder/${reminderId}`, data });
  }

  /** Delete a gear reminder */
  async deleteReminder(gearId: string, reminderId: number, athleteId?: string): Promise<void> {
    const id = athleteId || this.defaultAthleteId;
    await this.httpClient.request<void>({ method: 'DELETE', url: `/athlete/${id}/gear/${gearId}/reminder/${reminderId}` });
  }
}
