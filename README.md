# intervals-icu

A lightweight TypeScript client library for the [Intervals.icu](https://intervals.icu) API. Supports all major endpoints including athletes, events, wellness, workouts, and activities.

## Features

- 🚀 **Lightweight** - Zero dependencies beyond axios
- 📘 **Fully Typed** - Written in TypeScript with comprehensive type definitions
- 🌳 **Tree-shakeable** - ESM exports for optimal bundle size
- 🔐 **Authentication** - Built-in support for API key authentication
- ⚡ **Rate Limiting Awareness** - Tracks and exposes rate limit information
- 🛡️ **Error Handling** - Robust error handling with custom error types
- 📖 **Well Documented** - JSDoc comments on all public methods

## Installation

```bash
npm install intervals-icu
```

## Quick Start

```typescript
import { IntervalsClient } from 'intervals-icu';

// Initialize the client
const client = new IntervalsClient({
  apiKey: 'your-api-key-here',
  athleteId: 'i12345' // optional, defaults to 'me'
});

// Get athlete information
const athlete = await client.getAthlete();
console.log(`Athlete: ${athlete.name}, FTP: ${athlete.ftp}`);

// Get events
const events = await client.getEvents({
  oldest: '2024-01-01',
  newest: '2024-12-31'
});

// Create a wellness entry
await client.createWellness({
  date: '2024-01-15',
  weight: 70,
  restingHR: 50,
  sleepSecs: 28800
});
```

## API Reference

### Client Configuration

```typescript
interface IntervalsConfig {
  apiKey: string;        // Required: Your Intervals.icu API key
  athleteId?: string;    // Optional: Athlete ID (defaults to 'me')
  baseURL?: string;      // Optional: API base URL
  timeout?: number;      // Optional: Request timeout in ms (default: 10000)
}
```

### Athlete Methods

#### `getAthlete(athleteId?: string): Promise<Athlete>`

Get athlete information.

```typescript
const athlete = await client.getAthlete();
console.log(athlete.name, athlete.ftp, athlete.weight);
```

#### `updateAthlete(data: Partial<Athlete>, athleteId?: string): Promise<Athlete>`

Update athlete information.

```typescript
const updated = await client.updateAthlete({
  ftp: 250,
  weight: 70
});
```

### Event Methods

#### `getEvents(options?: PaginationOptions, athleteId?: string): Promise<Event[]>`

Get calendar events.

```typescript
const events = await client.getEvents({
  oldest: '2024-01-01',
  newest: '2024-12-31'
});
```

#### `getEvent(eventId: number, athleteId?: string): Promise<Event>`

Get a specific event by ID.

```typescript
const event = await client.getEvent(12345);
```

#### `createEvent(data: EventInput, athleteId?: string): Promise<Event>`

Create a new calendar event.

```typescript
const event = await client.createEvent({
  start_date_local: '2024-01-15',
  name: 'Race Day',
  category: 'RACE',
  description: 'Important race'
});
```

#### `updateEvent(eventId: number, data: Partial<EventInput>, athleteId?: string): Promise<Event>`

Update an existing event.

```typescript
await client.updateEvent(12345, {
  name: 'Updated Race Day'
});
```

#### `deleteEvent(eventId: number, athleteId?: string): Promise<void>`

Delete an event.

```typescript
await client.deleteEvent(12345);
```

### Wellness Methods

#### `getWellness(options?: PaginationOptions, athleteId?: string): Promise<Wellness[]>`

Get wellness data.

```typescript
const wellness = await client.getWellness({
  oldest: '2024-01-01',
  newest: '2024-01-31'
});
```

#### `createWellness(data: WellnessInput, athleteId?: string): Promise<Wellness>`

Create a new wellness entry.

```typescript
const wellness = await client.createWellness({
  date: '2024-01-15',
  weight: 70,
  restingHR: 50,
  hrv: 65,
  sleepSecs: 28800,
  sleepQuality: 8
});
```

#### `updateWellness(date: string, data: Partial<WellnessInput>, athleteId?: string): Promise<Wellness>`

Update a wellness entry for a specific date.

```typescript
await client.updateWellness('2024-01-15', {
  weight: 69.5,
  mood: 8
});
```

#### `deleteWellness(date: string, athleteId?: string): Promise<void>`

Delete a wellness entry.

```typescript
await client.deleteWellness('2024-01-15');
```

### Workout Methods

#### `getWorkouts(options?: PaginationOptions, athleteId?: string): Promise<Workout[]>`

Get planned workouts.

```typescript
const workouts = await client.getWorkouts({
  oldest: '2024-01-01',
  newest: '2024-01-31'
});
```

#### `getWorkout(workoutId: number, athleteId?: string): Promise<Workout>`

Get a specific workout by ID.

```typescript
const workout = await client.getWorkout(12345);
```

#### `createWorkout(data: WorkoutInput, athleteId?: string): Promise<Workout>`

Create a new workout.

```typescript
const workout = await client.createWorkout({
  start_date_local: '2024-01-15',
  name: 'Tempo Run',
  description: '45 min tempo at threshold',
  duration_secs: 2700,
  tss: 65
});
```

#### `updateWorkout(workoutId: number, data: Partial<WorkoutInput>, athleteId?: string): Promise<Workout>`

Update an existing workout.

```typescript
await client.updateWorkout(12345, {
  name: 'Updated Tempo Run',
  tss: 70
});
```

#### `deleteWorkout(workoutId: number, athleteId?: string): Promise<void>`

Delete a workout.

```typescript
await client.deleteWorkout(12345);
```

### Activity Methods

#### `getActivities(options?: PaginationOptions, athleteId?: string): Promise<Activity[]>`

Get recorded activities.

```typescript
const activities = await client.getActivities({
  oldest: '2024-01-01',
  newest: '2024-01-31'
});
```

#### `getActivity(activityId: number, athleteId?: string): Promise<Activity>`

Get a specific activity by ID.

```typescript
const activity = await client.getActivity(12345);
```

#### `updateActivity(activityId: number, data: ActivityInput, athleteId?: string): Promise<Activity>`

Update an existing activity.

```typescript
await client.updateActivity(12345, {
  name: 'Morning Run',
  description: 'Easy recovery run',
  feel: 8
});
```

#### `deleteActivity(activityId: number, athleteId?: string): Promise<void>`

Delete an activity.

```typescript
await client.deleteActivity(12345);
```

## Rate Limiting

The client automatically tracks rate limit information from the API responses:

```typescript
// Make some API calls
await client.getAthlete();

// Check rate limit status
const remaining = client.getRateLimitRemaining();
const resetTime = client.getRateLimitReset();

console.log(`Remaining: ${remaining}, Resets at: ${resetTime}`);
```

## Error Handling

The client throws `IntervalsAPIError` for all API-related errors:

```typescript
import { IntervalsClient, IntervalsAPIError } from 'intervals-icu';

try {
  const athlete = await client.getAthlete();
} catch (error) {
  if (error instanceof IntervalsAPIError) {
    console.error(`API Error: ${error.message}`);
    console.error(`Status: ${error.status}`);
    console.error(`Code: ${error.code}`);
    
    // Handle specific error types
    if (error.code === 'RATE_LIMIT_EXCEEDED') {
      console.error('Rate limit exceeded, try again later');
    } else if (error.code === 'AUTH_FAILED') {
      console.error('Invalid API key');
    }
  }
}
```

## TypeScript Support

All methods and responses are fully typed. Import types as needed:

```typescript
import type {
  Athlete,
  Event,
  Wellness,
  Workout,
  Activity,
  PaginationOptions,
  IntervalsConfig
} from 'node-intervals-icu';
```

## Authentication

To get your API key:

1. Log in to [Intervals.icu](https://intervals.icu)
2. Go to Settings → API Key
3. Copy your API key

Your athlete ID can be found in the URL when viewing your profile (e.g., `i12345`), or you can use `'me'` to refer to the authenticated athlete.

## License

MIT License - Copyright (c) 2025 Fernando Paladini

See the [LICENSE](./LICENSE) file for details.

## Acknowledgments

Special thanks to *Filipe Ronzani* for the inspiration and the initial idea that led to the creation of this library. Your project was the spark that made this happen! 🙏

## Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) to learn how you can help make this project better.

## Publishing

For maintainers: See the [Publishing Guide](./docs/PUBLISHING.md) for detailed instructions on publishing this library to NPM.

## Links

- [Intervals.icu API Documentation](https://intervals.icu/api/v1/docs)
- [Intervals.icu Website](https://intervals.icu)
- [GitHub Repository](https://github.com/paladini/intervals-icu)