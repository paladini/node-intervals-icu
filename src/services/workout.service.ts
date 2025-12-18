import type { IHttpClient } from '../core/http-client.interface.js';
import type { Workout, WorkoutInput, PaginationOptions } from '../types.js';

/**
 * Service for workout-related operations
 * Follows Single Responsibility Principle and Interface Segregation Principle
 */
export class WorkoutService {
  constructor(
    private httpClient: IHttpClient,
    private defaultAthleteId: string
  ) {}

  /**
   * Gets workouts for an athlete
   */
  async getWorkouts(options?: PaginationOptions, athleteId?: string): Promise<Workout[]> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<Workout[]>({
      method: 'GET',
      url: `/athlete/${id}/workouts`,
      params: options as Record<string, unknown>,
    });
  }

  /**
   * Gets a specific workout by ID
   */
  async getWorkout(workoutId: number, athleteId?: string): Promise<Workout> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<Workout>({
      method: 'GET',
      url: `/athlete/${id}/workouts/${workoutId}`,
    });
  }

  /**
   * Creates a new workout
   */
  async createWorkout(data: WorkoutInput, athleteId?: string): Promise<Workout> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<Workout>({
      method: 'POST',
      url: `/athlete/${id}/workouts`,
      data,
    });
  }

  /**
   * Updates an existing workout
   */
  async updateWorkout(workoutId: number, data: Partial<WorkoutInput>, athleteId?: string): Promise<Workout> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<Workout>({
      method: 'PUT',
      url: `/athlete/${id}/workouts/${workoutId}`,
      data,
    });
  }

  /**
   * Deletes a workout
   */
  async deleteWorkout(workoutId: number, athleteId?: string): Promise<void> {
    const id = athleteId || this.defaultAthleteId;
    await this.httpClient.request<void>({
      method: 'DELETE',
      url: `/athlete/${id}/workouts/${workoutId}`,
    });
  }
}
