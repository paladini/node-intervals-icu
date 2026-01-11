/**
 * node-intervals-icu
 *
 * A lightweight TypeScript client library for the Intervals.icu API.
 *
 * @packageDocumentation
 */

export { IntervalsClient, IntervalsAPIError } from './client.js';
export type {
  IntervalsConfig,
  APIError,
  Athlete,
  Event,
  EventInput,
  Wellness,
  WellnessInput,
  Workout,
  WorkoutInput,
  Activity,
  ActivityInput,
  PaginationOptions,
  // Activity Streams
  ActivityStream,
  StreamType,
  StreamsOptions,
  UpdateStreamsResult,
  // Activity Intervals
  Interval,
  IntervalsDTO,
  UpdateIntervalsOptions,
  // Bulk Operations
  BulkEventInput,
  DoomedEvent,
  DeleteEventsResponse,
} from './types.js';
