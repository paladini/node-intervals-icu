/**
 * node-intervals-icu
 * 
 * A lightweight TypeScript client library for the Intervals.icu API.
 * 
 * Refactored following SOLID principles:
 * - Single Responsibility: Each service handles one resource type
 * - Open/Closed: Extensible through service composition
 * - Liskov Substitution: Services implement consistent interfaces
 * - Interface Segregation: Focused interfaces per resource type
 * - Dependency Inversion: Depends on abstractions (IHttpClient)
 * 
 * @packageDocumentation
 */

export { IntervalsClient } from './client.js';
export { IntervalsAPIError } from './core/error-handler.js';
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
} from './types.js';
