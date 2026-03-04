import type { IHttpClient } from '../core/http-client.interface.js';
import type { AthleteRoute, RouteSimilarity } from '../types/index.js';

/**
 * Service for activity routes
 */
export class RouteService {
  constructor(
    private httpClient: IHttpClient,
    private defaultAthleteId: string
  ) {}

  /** List all routes for an athlete */
  async list(athleteId?: string): Promise<AthleteRoute[]> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<AthleteRoute[]>({ method: 'GET', url: `/athlete/${id}/routes` });
  }

  /** Get a specific route */
  async get(routeId: number, athleteId?: string): Promise<AthleteRoute> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<AthleteRoute>({ method: 'GET', url: `/athlete/${id}/routes/${routeId}` });
  }

  /** Update a route */
  async update(routeId: number, data: Partial<AthleteRoute>, athleteId?: string): Promise<AthleteRoute> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<AthleteRoute>({ method: 'PUT', url: `/athlete/${id}/routes/${routeId}`, data });
  }

  /** Get similar routes */
  async getSimilarities(routeId: number, athleteId?: string): Promise<RouteSimilarity[]> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<RouteSimilarity[]>({ method: 'GET', url: `/athlete/${id}/routes/${routeId}/similarities` });
  }
}
