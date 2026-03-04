import type { IHttpClient } from '../core/http-client.interface.js';
import type { Workout, WorkoutInput, DuplicateWorkoutsDTO, PaginationOptions } from '../types/index.js';

/**
 * Service for library workout operations (workout templates in folders/plans)
 */
export class WorkoutService {
  constructor(
    private httpClient: IHttpClient,
    private defaultAthleteId: string
  ) {}

  /** List workouts in the athlete's library */
  async listWorkouts(options?: PaginationOptions, athleteId?: string): Promise<Workout[]> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<Workout[]>({ method: 'GET', url: `/athlete/${id}/workouts`, params: options as Record<string, unknown> });
  }

  /** Get a specific workout by ID */
  async getWorkout(workoutId: number, athleteId?: string): Promise<Workout> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<Workout>({ method: 'GET', url: `/athlete/${id}/workouts/${workoutId}` });
  }

  /** Create a new workout */
  async createWorkout(data: WorkoutInput, athleteId?: string): Promise<Workout> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<Workout>({ method: 'POST', url: `/athlete/${id}/workouts`, data });
  }

  /** Create multiple workouts at once */
  async createWorkoutsBulk(data: WorkoutInput[], athleteId?: string): Promise<Workout[]> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<Workout[]>({ method: 'POST', url: `/athlete/${id}/workouts/bulk`, data });
  }

  /** Update an existing workout */
  async updateWorkout(workoutId: number, data: Partial<WorkoutInput>, athleteId?: string): Promise<Workout> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<Workout>({ method: 'PUT', url: `/athlete/${id}/workouts/${workoutId}`, data });
  }

  /** Delete a workout */
  async deleteWorkout(workoutId: number, athleteId?: string): Promise<void> {
    const id = athleteId || this.defaultAthleteId;
    await this.httpClient.request<void>({ method: 'DELETE', url: `/athlete/${id}/workouts/${workoutId}` });
  }

  /** Duplicate workouts */
  async duplicateWorkouts(data: DuplicateWorkoutsDTO, athleteId?: string): Promise<Workout[]> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<Workout[]>({ method: 'POST', url: `/athlete/${id}/duplicate-workouts`, data });
  }

  /**
   * Download a workout converted to a specific format (.zwo, .mrc, .erg, .fit).
   * Uses the global endpoint (no athlete prefix).
   */
  async downloadWorkout(workoutId: number, format: '.zwo' | '.mrc' | '.erg' | '.fit'): Promise<Buffer> {
    return this.httpClient.download(`/download-workout${format}`, { id: workoutId });
  }

  /**
   * Download a workout converted to a specific format, resolving athlete-specific settings.
   */
  async downloadWorkoutForAthlete(workoutId: number, format: '.zwo' | '.mrc' | '.erg' | '.fit', athleteId?: string): Promise<Buffer> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.download(`/athlete/${id}/download-workout${format}`, { id: workoutId });
  }
}
