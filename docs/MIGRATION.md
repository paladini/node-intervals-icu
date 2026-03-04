# Migrating to intervals-icu v2

This guide covers all breaking changes when upgrading from v1.x to v2.x.

## Removed Methods

All top-level facade methods on `IntervalsClient` have been removed. Use the service accessors instead:

| Removed method | Replacement |
|---|---|
| `client.getAthlete()` | `client.athletes.getAthlete()` |
| `client.updateAthlete(data)` | `client.athletes.updateAthlete(data)` |
| `client.getSportSettings()` | `client.sportSettings.list()` |
| `client.getEvents(opts)` | `client.events.listEvents(opts)` |
| `client.getEvent(id)` | `client.events.getEvent(id)` |
| `client.createEvent(data)` | `client.events.createEvent(data)` |
| `client.updateEvent(id, data)` | `client.events.updateEvent(id, data)` |
| `client.deleteEvent(id)` | `client.events.deleteEvent(id)` |
| `client.getWellness(opts)` | `client.wellness.listWellness(opts)` |
| `client.createWellness(data)` | `client.wellness.createWellness(data)` |
| `client.updateWellness(date, data)` | `client.wellness.updateWellness(date, data)` |
| `client.deleteWellness(date)` | `client.wellness.deleteWellness(date)` |
| `client.getWorkouts(opts)` | `client.workouts.listWorkouts(opts)` |
| `client.getWorkout(id)` | `client.workouts.getWorkout(id)` |
| `client.createWorkout(data)` | `client.workouts.createWorkout(data)` |
| `client.updateWorkout(id, data)` | `client.workouts.updateWorkout(id, data)` |
| `client.deleteWorkout(id)` | `client.workouts.deleteWorkout(id)` |
| `client.getActivities(opts)` | `client.activities.listActivities(opts)` |
| `client.getActivity(id)` | `client.activities.getActivity(id)` |
| `client.updateActivity(id, data)` | `client.activities.updateActivity(id, data)` |
| `client.deleteActivity(id)` | `client.activities.deleteActivity(id)` |

The following deprecated service-level aliases were also removed:

| Removed method | Replacement |
|---|---|
| `activityService.getActivities()` | `activityService.listActivities()` |
| `eventService.getEvents()` | `eventService.listEvents()` |
| `wellnessService.getWellness()` | `wellnessService.listWellness()` |
| `workoutService.getWorkouts()` | `workoutService.listWorkouts()` |
| `athleteService.getSportSettings()` | `sportSettingsService.list()` |

## Other Breaking Changes

### Activity IDs are strings

Activity IDs are now `string` (e.g. `'i55610271'`), matching the Intervals.icu API. The facade previously accepted `number | string` for backward compatibility — that shim is gone.

```typescript
// v1.x
const activity = await client.getActivity(12345);

// v2
const activity = await client.activities.getActivity('i12345');
```

### Default timeout increased

The default request timeout changed from **10 seconds** to **30 seconds**.

### Authentication

`apiKey` is now optional. You must provide either `apiKey` (for personal API key auth) or `accessToken` (for OAuth bearer token auth):

```typescript
// API key
const client = new IntervalsClient({ apiKey: 'your-key' });

// OAuth
const client = new IntervalsClient({ accessToken: 'oauth-token' });
```

### Default athleteId

The default `athleteId` changed from `'me'` to `'0'`. Both resolve to the authenticated athlete on the Intervals.icu API, so this is effectively a no-op.

### Activity endpoint URLs

Single-activity endpoints now correctly use `/activity/{id}` instead of the previous incorrect `/athlete/{athleteId}/activities/{id}`. This only matters if you were relying on URL interception or mocking.

## Quick Migration Example

```typescript
// ─── Before (v1.x) ───
import { IntervalsClient } from 'intervals-icu';

const client = new IntervalsClient({ apiKey: 'key', athleteId: 'me' });

const athlete = await client.getAthlete();
const events = await client.getEvents({ oldest: '2024-01-01', newest: '2024-12-31' });
const activity = await client.getActivity(12345);
await client.createWellness({ date: '2024-01-15', weight: 70 });
const settings = await client.getSportSettings();

// ─── After (v2) ───
import { IntervalsClient } from 'intervals-icu';

const client = new IntervalsClient({ apiKey: 'key' });

const athlete = await client.athletes.getAthlete();
const events = await client.events.listEvents({ oldest: '2024-01-01', newest: '2024-12-31' });
const activity = await client.activities.getActivity('i12345');
await client.wellness.createWellness({ date: '2024-01-15', weight: 70 });
const settings = await client.sportSettings.list();
```
