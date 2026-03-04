import type { IHttpClient } from '../core/http-client.interface.js';
import type { SharedEvent } from '../types/index.js';

/**
 * Service for shared events (races, group events, etc.)
 */
export class SharedEventService {
  constructor(
    private httpClient: IHttpClient,
  ) {}

  /** Get a shared event by ID */
  async get(eventId: number): Promise<SharedEvent> {
    return this.httpClient.request<SharedEvent>({ method: 'GET', url: `/shared-event/${eventId}` });
  }

  /** Create a shared event */
  async create(data: Partial<SharedEvent>): Promise<SharedEvent> {
    return this.httpClient.request<SharedEvent>({ method: 'POST', url: `/shared-event`, data });
  }

  /** Update a shared event */
  async update(eventId: number, data: Partial<SharedEvent>): Promise<SharedEvent> {
    return this.httpClient.request<SharedEvent>({ method: 'PUT', url: `/shared-event/${eventId}`, data });
  }

  /** Delete a shared event */
  async delete(eventId: number): Promise<void> {
    await this.httpClient.request<void>({ method: 'DELETE', url: `/shared-event/${eventId}` });
  }
}
