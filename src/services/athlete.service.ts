import type { IHttpClient } from '../core/http-client.interface.js';
import type {
  Athlete, AthleteUpdateDTO, AthleteTrainingPlan, AthleteTrainingPlanUpdate,
  AthleteProfile, SportSettings,
} from '../types/index.js';

/**
 * Service for athlete-related operations
 */
export class AthleteService {
  constructor(
    private httpClient: IHttpClient,
    private defaultAthleteId: string
  ) {}

  /** Get athlete information (includes sportSettings and custom_items) */
  async getAthlete(athleteId?: string): Promise<Athlete> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<Athlete>({ method: 'GET', url: `/athlete/${id}` });
  }

  /** Update athlete information */
  async updateAthlete(data: AthleteUpdateDTO, athleteId?: string): Promise<Athlete> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<Athlete>({ method: 'PUT', url: `/athlete/${id}`, data });
  }

  /** Get the athlete's training plan */
  async getTrainingPlan(athleteId?: string): Promise<AthleteTrainingPlan> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<AthleteTrainingPlan>({ method: 'GET', url: `/athlete/${id}/training-plan` });
  }

  /** Change the athlete's training plan */
  async updateTrainingPlan(data: AthleteTrainingPlanUpdate, athleteId?: string): Promise<AthleteTrainingPlan> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<AthleteTrainingPlan>({ method: 'PUT', url: `/athlete/${id}/training-plan`, data });
  }

  /** Change training plans for a list of athletes */
  async updateAthletePlans(data: AthleteTrainingPlanUpdate[]): Promise<Record<string, unknown>> {
    return this.httpClient.request<Record<string, unknown>>({ method: 'PUT', url: `/athlete-plans`, data });
  }

  /** Get athlete profile (public info, shared folders, custom items) */
  async getProfile(athleteId?: string): Promise<AthleteProfile> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<AthleteProfile>({ method: 'GET', url: `/athlete/${id}/profile` });
  }

  /**
   * Get sport settings (thresholds, zones) for an athlete.
   * @deprecated Use SportSettingsService.list() instead
   */
  async getSportSettings(athleteId?: string): Promise<SportSettings[]> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<SportSettings[]>({ method: 'GET', url: `/athlete/${id}/sport-settings` });
  }
}
