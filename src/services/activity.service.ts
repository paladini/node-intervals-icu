import type { IHttpClient } from '../core/http-client.interface.js';
import type { Activity, ActivityInput, PaginationOptions } from '../types.js';

/**
 * Service for activity-related operations
 * Follows Single Responsibility Principle and Interface Segregation Principle
 */
export class ActivityService {
  constructor(
    private httpClient: IHttpClient,
    private defaultAthleteId: string
  ) {}

  /**
   * Gets activities for an athlete
   */
  async getActivities(options?: PaginationOptions, athleteId?: string): Promise<Activity[]> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<Activity[]>({
      method: 'GET',
      url: `/athlete/${id}/activities`,
      params: options as Record<string, unknown>,
    });
  }

  /**
   * Gets a specific activity by ID
   */
  async getActivity(activityId: number, athleteId?: string): Promise<Activity> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<Activity>({
      method: 'GET',
      url: `/athlete/${id}/activities/${activityId}`,
    });
  }

  /**
   * Updates an existing activity
   */
  async updateActivity(activityId: number, data: ActivityInput, athleteId?: string): Promise<Activity> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<Activity>({
      method: 'PUT',
      url: `/athlete/${id}/activities/${activityId}`,
      data,
    });
  }

  /**
   * Deletes an activity
   */
  async deleteActivity(activityId: number, athleteId?: string): Promise<void> {
    const id = athleteId || this.defaultAthleteId;
    await this.httpClient.request<void>({
      method: 'DELETE',
      url: `/athlete/${id}/activities/${activityId}`,
    });
  }
}
