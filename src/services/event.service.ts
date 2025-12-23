import type { IHttpClient } from '../core/http-client.interface.js';
import type { Event, EventInput, PaginationOptions } from '../types.js';

/**
 * Service for event-related operations
 * Follows Single Responsibility Principle and Interface Segregation Principle
 */
export class EventService {
  constructor(
    private httpClient: IHttpClient,
    private defaultAthleteId: string
  ) {}

  /**
   * Gets events for an athlete
   */
  async getEvents(options?: PaginationOptions, athleteId?: string): Promise<Event[]> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<Event[]>({
      method: 'GET',
      url: `/athlete/${id}/events`,
      params: options as Record<string, unknown>,
    });
  }

  /**
   * Gets a specific event by ID
   */
  async getEvent(eventId: number, athleteId?: string): Promise<Event> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<Event>({
      method: 'GET',
      url: `/athlete/${id}/events/${eventId}`,
    });
  }

  /**
   * Creates a new event
   */
  async createEvent(data: EventInput, athleteId?: string): Promise<Event> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<Event>({
      method: 'POST',
      url: `/athlete/${id}/events`,
      data,
    });
  }

  /**
   * Updates an existing event
   */
  async updateEvent(eventId: number, data: Partial<EventInput>, athleteId?: string): Promise<Event> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<Event>({
      method: 'PUT',
      url: `/athlete/${id}/events/${eventId}`,
      data,
    });
  }

  /**
   * Deletes an event
   */
  async deleteEvent(eventId: number, athleteId?: string): Promise<void> {
    const id = athleteId || this.defaultAthleteId;
    await this.httpClient.request<void>({
      method: 'DELETE',
      url: `/athlete/${id}/events/${eventId}`,
    });
  }
}
