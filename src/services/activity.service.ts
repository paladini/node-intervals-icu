import type { IHttpClient } from '../core/http-client.interface.js';
import type {
  Activity, ActivityInput, ListActivitiesOptions, UploadActivityOptions,
  UploadResponse, ActivityId, IntervalsDTO, Interval, ActivityStream,
  UpdateStreamsResult, MapData, ActivityWeather, ActivityWeatherSummary,
  BestEfforts, PowerVsHRPlot, HRLoadModel, IcuSegment,
  Message, NewActivityMsg, NewMsg,
} from '../types/index.js';

/**
 * Service for activity-related operations.
 *
 * IMPORTANT: Single-activity endpoints use `/activity/{activityId}` (no athlete prefix).
 * List/upload endpoints use `/athlete/{athleteId}/activities`.
 */
export class ActivityService {
  constructor(
    private httpClient: IHttpClient,
    private defaultAthleteId: string
  ) {}

  // ── List & Upload (athlete-scoped) ──

  /** List activities for a date range (descending order) */
  async listActivities(options?: ListActivitiesOptions, athleteId?: string): Promise<Activity[]> {
    const id = athleteId || this.defaultAthleteId;
    const params: Record<string, unknown> = { ...options };
    if (options?.fields) {
      params['fields'] = options.fields.join(',');
    }
    return this.httpClient.request<Activity[]>({ method: 'GET', url: `/athlete/${id}/activities`, params });
  }

  /** Upload a new activity from file (fit, tcx, gpx, or zip/gz) */
  async uploadActivity(
    file: Buffer | Blob | Uint8Array,
    fileName: string,
    options?: UploadActivityOptions,
    athleteId?: string
  ): Promise<UploadResponse> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.upload<UploadResponse>({
      url: `/athlete/${id}/activities`,
      file,
      fileName,
      params: options as Record<string, unknown>,
    });
  }

  /** Create a manual activity */
  async createManualActivity(data: Partial<Activity>, athleteId?: string): Promise<Activity> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<Activity>({ method: 'POST', url: `/athlete/${id}/activities/manual`, data });
  }

  /** Create multiple manual activities (upsert on external_id) */
  async createManualActivitiesBulk(data: Partial<Activity>[], athleteId?: string): Promise<Activity[]> {
    const id = athleteId || this.defaultAthleteId;
    return this.httpClient.request<Activity[]>({ method: 'POST', url: `/athlete/${id}/activities/manual/bulk`, data });
  }

  /** Download zip of Intervals.icu generated activity fit files */
  async downloadFitFiles(activityIds: string[], options?: { power?: boolean; hr?: boolean }, athleteId?: string): Promise<Buffer> {
    const id = athleteId || this.defaultAthleteId;
    const params: Record<string, unknown> = { ids: activityIds.join(','), ...options };
    return this.httpClient.download(`/athlete/${id}/download-fit-files`, params);
  }

  // ── Single activity (NOT athlete-scoped: /activity/{id}) ──

  /** Get an activity */
  async getActivity(activityId: string, options?: { intervals?: boolean }): Promise<Activity> {
    return this.httpClient.request<Activity>({ method: 'GET', url: `/activity/${activityId}`, params: options as Record<string, unknown> });
  }

  /** Update an activity (Strava activities cannot be updated) */
  async updateActivity(activityId: string, data: ActivityInput): Promise<Activity> {
    return this.httpClient.request<Activity>({ method: 'PUT', url: `/activity/${activityId}`, data });
  }

  /** Delete an activity */
  async deleteActivity(activityId: string): Promise<ActivityId> {
    return this.httpClient.request<ActivityId>({ method: 'DELETE', url: `/activity/${activityId}` });
  }

  // ── Streams ──

  /** Get activity streams (JSON) */
  async getStreams(activityId: string, types?: string[]): Promise<ActivityStream[]> {
    const params: Record<string, unknown> = types ? { types: types.join(',') } : {};
    return this.httpClient.request<ActivityStream[]>({ method: 'GET', url: `/activity/${activityId}/streams`, params });
  }

  /** Update activity streams (JSON) */
  async updateStreams(activityId: string, data: ActivityStream[]): Promise<UpdateStreamsResult> {
    return this.httpClient.request<UpdateStreamsResult>({ method: 'PUT', url: `/activity/${activityId}/streams`, data });
  }

  /** Download activity streams as CSV */
  async getStreamsCSV(activityId: string): Promise<Buffer> {
    return this.httpClient.download(`/activity/${activityId}/streams.csv`);
  }

  /** Upload activity streams CSV */
  async updateStreamsCSV(activityId: string, file: Buffer | Blob | Uint8Array, fileName: string): Promise<UpdateStreamsResult> {
    return this.httpClient.upload<UpdateStreamsResult>({ url: `/activity/${activityId}/streams.csv`, file, fileName });
  }

  // ── Intervals ──

  /** Get activity intervals */
  async getIntervals(activityId: string): Promise<IntervalsDTO> {
    return this.httpClient.request<IntervalsDTO>({ method: 'GET', url: `/activity/${activityId}/intervals` });
  }

  /** Update intervals (replace all or merge) */
  async updateIntervals(activityId: string, data: Interval[], options?: { all?: boolean }): Promise<IntervalsDTO> {
    return this.httpClient.request<IntervalsDTO>({ method: 'PUT', url: `/activity/${activityId}/intervals`, data, params: options as Record<string, unknown> });
  }

  /** Update/create a single interval */
  async updateInterval(activityId: string, intervalId: number, data: Interval): Promise<IntervalsDTO> {
    return this.httpClient.request<IntervalsDTO>({ method: 'PUT', url: `/activity/${activityId}/intervals/${intervalId}`, data });
  }

  /** Delete intervals */
  async deleteIntervals(activityId: string, data: Interval[]): Promise<IntervalsDTO> {
    return this.httpClient.request<IntervalsDTO>({ method: 'PUT', url: `/activity/${activityId}/delete-intervals`, data });
  }

  /** Split an interval at an index */
  async splitInterval(activityId: string, splitAt: number): Promise<IntervalsDTO> {
    return this.httpClient.request<IntervalsDTO>({ method: 'PUT', url: `/activity/${activityId}/split-interval`, params: { splitAt } });
  }

  // ── Files ──

  /** Download the original activity file (gzip compressed) */
  async downloadFile(activityId: string): Promise<Buffer> {
    return this.httpClient.download(`/activity/${activityId}/file`);
  }

  /** Download the Intervals.icu generated fit file */
  async downloadFitFile(activityId: string): Promise<Buffer> {
    return this.httpClient.download(`/activity/${activityId}/fit-file`);
  }

  // ── Map & Weather ──

  /** Get map data (bounds, latlngs, route, weather) */
  async getMap(activityId: string): Promise<MapData> {
    return this.httpClient.request<MapData>({ method: 'GET', url: `/activity/${activityId}/map` });
  }

  /** Get activity weather */
  async getWeather(activityId: string): Promise<ActivityWeather> {
    return this.httpClient.request<ActivityWeather>({ method: 'GET', url: `/activity/${activityId}/weather` });
  }

  /** Get activity weather summary */
  async getWeatherSummary(activityId: string): Promise<ActivityWeatherSummary> {
    return this.httpClient.request<ActivityWeatherSummary>({ method: 'GET', url: `/activity/${activityId}/weather-summary` });
  }

  // ── Performance ──

  /** Get power curve for an activity */
  async getPowerCurve(activityId: string): Promise<unknown> {
    return this.httpClient.request({ method: 'GET', url: `/activity/${activityId}/power-curve` });
  }

  /** Get pace curve for an activity */
  async getPaceCurve(activityId: string): Promise<unknown> {
    return this.httpClient.request({ method: 'GET', url: `/activity/${activityId}/pace-curve` });
  }

  /** Get HR curve for an activity */
  async getHRCurve(activityId: string): Promise<unknown> {
    return this.httpClient.request({ method: 'GET', url: `/activity/${activityId}/hr-curve` });
  }

  /** Get best efforts for an activity */
  async getBestEfforts(activityId: string): Promise<BestEfforts> {
    return this.httpClient.request<BestEfforts>({ method: 'GET', url: `/activity/${activityId}/best-efforts` });
  }

  /** Get power vs HR analysis */
  async getPowerVsHR(activityId: string): Promise<PowerVsHRPlot> {
    return this.httpClient.request<PowerVsHRPlot>({ method: 'GET', url: `/activity/${activityId}/power-vs-hr` });
  }

  /** Get HR load model for an activity */
  async getHRLoadModel(activityId: string): Promise<HRLoadModel> {
    return this.httpClient.request<HRLoadModel>({ method: 'GET', url: `/activity/${activityId}/hr-load-model` });
  }

  /** Get segments matched in an activity */
  async getSegments(activityId: string): Promise<IcuSegment[]> {
    return this.httpClient.request<IcuSegment[]>({ method: 'GET', url: `/activity/${activityId}/segments` });
  }

  // ── Activity messages (comments) ──

  /** List all messages (comments) for an activity */
  async listMessages(activityId: string, options?: { sinceId?: number; limit?: number }): Promise<Message[]> {
    return this.httpClient.request<Message[]>({ method: 'GET', url: `/activity/${activityId}/messages`, params: options as Record<string, unknown> });
  }

  /** Add a message (comment) to an activity */
  async sendMessage(activityId: string, data: NewActivityMsg): Promise<NewMsg> {
    return this.httpClient.request<NewMsg>({ method: 'POST', url: `/activity/${activityId}/messages`, data });
  }
}
