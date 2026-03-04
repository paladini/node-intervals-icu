# intervals-icu

Comprehensive TypeScript client for the [Intervals.icu](https://intervals.icu) API. Covers **100+ endpoints** across 16 resource groups with full type safety, OAuth support, file uploads, and automatic retry.

## Features

- **16 services, 100+ methods** — athletes, activities, events, wellness, workouts, sport settings, folders, gear, chats, weather, routes, custom items, shared events, fitness, performance curves, and search
- **Full TypeScript types** — ~40 interfaces generated from the OpenAPI spec with JSDoc
- **Two auth methods** — API key (personal use) and OAuth bearer tokens
- **File upload & download** — multipart activity uploads (.fit/.tcx/.gpx), binary downloads
- **Auto-retry with exponential backoff** — configurable retries for 429/5xx errors
- **Rate limit tracking** — built-in headers monitoring
- **Tree-shakeable** — ESM + CJS dual output
- **Zero config defaults** — works out of the box with just an API key

## Installation

```bash
npm install intervals-icu
```

## Quick Start

### API Key Authentication

```typescript
import { IntervalsClient } from 'intervals-icu';

const client = new IntervalsClient({
  apiKey: 'your-api-key',
  athleteId: 'i12345', // optional, defaults to '0' (authenticated athlete)
});

const athlete = await client.athletes.getAthlete();
console.log(`${athlete.name} — FTP: ${athlete.ftp}`);
```

### OAuth Bearer Token

```typescript
const client = new IntervalsClient({
  accessToken: 'oauth-access-token',
  athleteId: 'i12345',
});
```

## Usage Patterns

### Recommended: Service Accessors

Each resource group has a dedicated service with full method coverage:

```typescript
// Activities
const activities = await client.activities.listActivities({ oldest: '2024-01-01', newest: '2024-01-31' });
const activity = await client.activities.getActivity('i55610271');
const streams = await client.activities.getStreams('i55610271', ['watts', 'heartrate']);

// Events
const events = await client.events.listEvents({ oldest: '2024-01-01', newest: '2024-12-31', resolve: true });
await client.events.createEvent({ start_date_local: '2024-06-01', name: 'Race', category: 'RACE' });

// Wellness
const wellness = await client.wellness.listWellness({ oldest: '2024-01-01', newest: '2024-01-31' });
await client.wellness.updateWellnessBulk([{ id: '2024-01-15', weight: 70 }]);

// Sport Settings
const settings = await client.sportSettings.list();

// Chats
await client.chats.sendMessage({ to_athlete_id: 'i456', content: 'Great workout!', type: 'TEXT' });

// Fitness & Performance
const fitness = await client.fitness.getFitness({ oldest: '2024-01-01', newest: '2024-12-31' });
const curves = await client.performance.getPowerCurves({ oldest: '2024-01-01', newest: '2024-12-31' });

// Search
const results = await client.search.searchActivities('tempo run');

// Weather
const weather = await client.weather.getWeather();

// Upload an activity file
import { readFileSync } from 'fs';
const file = readFileSync('morning_run.fit');
await client.activities.uploadActivity(file, 'morning_run.fit');
```

## Configuration

```typescript
interface IntervalsConfig {
  apiKey?: string;       // API key (mutually exclusive with accessToken)
  accessToken?: string;  // OAuth bearer token
  athleteId?: string;    // Athlete ID (default: '0' = authenticated athlete)
  baseURL?: string;      // API base URL (default: 'https://intervals.icu/api/v1')
  timeout?: number;      // Request timeout ms (default: 30000)
  maxRetries?: number;   // Auto-retry count for 429/5xx (default: 3, set 0 to disable)
  retryDelayMs?: number; // Base retry delay ms, doubles each attempt (default: 1000)
}
```

## Services Reference

| Service | Accessor | Key Methods |
|---------|----------|-------------|
| **Athletes** | `client.athletes` | `getAthlete`, `updateAthlete`, `getTrainingPlan`, `updateTrainingPlan`, `getProfile` |
| **Activities** | `client.activities` | `listActivities`, `getActivity`, `updateActivity`, `deleteActivity`, `uploadActivity`, `getStreams`, `getIntervals`, `getWeather`, `getPowerCurve`, `getMessages` |
| **Events** | `client.events` | `listEvents`, `getEvent`, `createEvent`, `updateEvent`, `deleteEvent`, `createEventsBulk`, `markAsDone`, `duplicateEvents` |
| **Wellness** | `client.wellness` | `listWellness`, `getWellnessByDate`, `createWellness`, `updateWellness`, `deleteWellness`, `updateWellnessBulk` |
| **Workouts** | `client.workouts` | `listWorkouts`, `getWorkout`, `createWorkout`, `updateWorkout`, `deleteWorkout`, `createWorkoutsBulk`, `duplicateWorkouts` |
| **Sport Settings** | `client.sportSettings` | `list`, `get`, `create`, `update`, `delete`, `applyToActivities` |
| **Folders** | `client.folders` | `list`, `create`, `update`, `delete`, `getSharedWith`, `importWorkout`, `applyPlanChanges` |
| **Gear** | `client.gear` | `create`, `update`, `delete`, `replace`, `createReminder`, `deleteReminder` |
| **Chats** | `client.chats` | `listChats`, `listMessages`, `sendMessage`, `markSeen` |
| **Weather** | `client.weather` | `getWeather`, `getWeatherConfig`, `updateWeatherConfig` |
| **Routes** | `client.routes` | `list`, `get`, `update`, `getSimilarRoutes` |
| **Custom Items** | `client.customItems` | `list`, `get`, `create`, `update`, `delete`, `reorder`, `uploadImage` |
| **Shared Events** | `client.sharedEvents` | `get`, `create`, `update`, `delete` |
| **Fitness** | `client.fitness` | `getFitness`, `getSummaries` |
| **Performance** | `client.performance` | `getPowerCurves`, `getPaceCurves`, `getHRCurves`, `getPowerVsHR`, `getActivityPowerCurves` |
| **Search** | `client.search` | `searchActivities`, `searchAthletes` |

## Error Handling

```typescript
import { IntervalsClient, IntervalsAPIError } from 'intervals-icu';

try {
  await client.athletes.getAthlete();
} catch (error) {
  if (error instanceof IntervalsAPIError) {
    console.error(`${error.code}: ${error.message} (HTTP ${error.status})`);

    if (error.code === 'RATE_LIMIT_EXCEEDED') {
      // Auto-retry handles this, but you can check manually too
      console.log(`Resets at: ${client.getRateLimitReset()}`);
    }
  }
}
```

## TypeScript Types

All types are exported from the package root:

```typescript
import type {
  Athlete, Activity, Event, Wellness, Workout,
  SportSettings, Folder, Gear, Chat, Message,
  WeatherConfig, Forecast, PowerCurveSet, PaceCurveSet,
  IntervalsConfig, PaginationOptions, ListActivitiesOptions,
} from 'intervals-icu';
```

## Authentication

### API Key

1. Log in to [Intervals.icu](https://intervals.icu)
2. Go to **Settings > Developer Settings**
3. Copy your API key

### OAuth

For apps that authenticate on behalf of other users, use the [Intervals.icu OAuth flow](https://forum.intervals.icu/t/api-access-and-oauth/781) to obtain an access token, then pass it as `accessToken`.

## Migrating from v1.x

See the full [Migration Guide](./docs/MIGRATION.md) for a complete list of removed methods and before/after examples.

Key changes:

1. **All facade methods removed** — use service accessors (e.g. `client.athletes.getAthlete()` instead of `client.getAthlete()`)
2. **Activity IDs are strings** — e.g. `'i55610271'`
3. **Activity URLs fixed** — single-activity endpoints now use `/activity/{id}`
4. **Default timeout** — increased from 10s to 30s
5. **Auth config** — `apiKey` is now optional; provide `apiKey` OR `accessToken`

## License

MIT License - Copyright (c) 2025 Fernando Paladini

See the [LICENSE](./LICENSE) file for details.

## Related Projects

The TypeScript/Node.js ecosystem has a few Intervals.icu API clients worth knowing about:

| Library | npm | Approach | Coverage | Error handling |
|---------|-----|----------|----------|---------------|
| **intervals-icu** *(this library)* | `intervals-icu` | axios, TypeScript types | 16 services, 100+ endpoints | throws `IntervalsAPIError` |
| **@kuranov/intervals-client** | `@kuranov/intervals-client` | ky + Valibot runtime validation | 6 resources (~64 endpoints) | `Result<T, E>` — never throws |

**When to use `intervals-icu` (this library):**
- You need the broadest API coverage (16 service groups including routes, gear, weather, custom items, fitness, performance, and search)
- You prefer familiar `try/catch` error handling
- You want a well-established npm package

**When to use `@kuranov/intervals-client`:**
- You want runtime validation of API responses via [Valibot](https://valibot.dev) (catches unexpected API changes at runtime)
- You prefer the `Result<T, E>` pattern (no exceptions thrown)
- You want lifecycle hooks for observability (`onRequest`, `onResponse`, `onRetry`)
- You target browsers or edge runtimes (uses `ky` which is runtime-agnostic)

Both libraries serve the same core purpose and share similar design goals (TypeScript-first, dual ESM+CJS output, auto-retry, OAuth + API key auth). They differ mainly in HTTP client choice, error-handling philosophy, validation strategy, and endpoint coverage.

## Acknowledgments

Special thanks to Filipe for the inspiration and the initial idea that led to the creation of this library. Your project was the spark that made this happen!

## Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) to learn how you can help make this project better.

## Links

- [Intervals.icu API Documentation](https://intervals.icu/api/v1/docs)
- [Intervals.icu Website](https://intervals.icu)
- [GitHub Repository](https://github.com/paladini/intervals-icu)