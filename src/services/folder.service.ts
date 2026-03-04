import type { IHttpClient } from '../core/http-client.interface.js';
import type { Folder, CreateFolderDTO, SharedWith, Workout } from '../types/index.js';

/**
 * Service for workout folders and training plans
 */
export class FolderService {
  constructor(
    private httpClient: IHttpClient,
    private defaultAthleteId: string
  ) {}

  /** List all folders/plans for an athlete */
  async list(athleteId?: string): Promise<Folder[]> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<Folder[]>({ method: 'GET', url: `/athlete/${id}/folders` });
  }

  /** Create a new folder or plan */
  async create(data: CreateFolderDTO, athleteId?: string): Promise<Folder> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<Folder>({ method: 'POST', url: `/athlete/${id}/folders`, data });
  }

  /** Update a folder/plan */
  async update(folderId: number, data: Partial<Folder>, athleteId?: string): Promise<Folder> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<Folder>({ method: 'PUT', url: `/athlete/${id}/folders/${folderId}`, data });
  }

  /** Delete a folder/plan */
  async delete(folderId: number, athleteId?: string): Promise<void> {
    const id = athleteId || this.defaultAthleteId;
    await this.httpClient.request<void>({ method: 'DELETE', url: `/athlete/${id}/folders/${folderId}` });
  }

  /** Update workouts in a plan folder (reorder, add, remove) */
  async updatePlanWorkouts(folderId: number, data: Partial<Workout>[], athleteId?: string): Promise<Workout[]> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<Workout[]>({ method: 'PUT', url: `/athlete/${id}/folders/${folderId}/workouts`, data });
  }

  /** Get athletes a folder is shared with */
  async getSharedWith(folderId: number, athleteId?: string): Promise<SharedWith[]> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<SharedWith[]>({ method: 'GET', url: `/athlete/${id}/folders/${folderId}/shared-with` });
  }

  /** Update sharing settings for a folder */
  async updateSharedWith(folderId: number, data: SharedWith[], athleteId?: string): Promise<SharedWith[]> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<SharedWith[]>({ method: 'PUT', url: `/athlete/${id}/folders/${folderId}/shared-with`, data });
  }

  /** Import a workout file (.zwo, .mrc, .erg, .fit) into a folder */
  async importWorkout(folderId: number, file: Buffer | Blob | Uint8Array, fileName: string, athleteId?: string): Promise<Workout> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.upload<Workout>({ url: `/athlete/${id}/folders/${folderId}/import-workout`, file, fileName });
  }

  /** Apply plan changes to the calendar */
  async applyPlanChanges(data: Record<string, unknown>, athleteId?: string): Promise<Record<string, unknown>> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<Record<string, unknown>>({ method: 'PUT', url: `/athlete/${id}/apply-plan-changes`, data });
  }
}
