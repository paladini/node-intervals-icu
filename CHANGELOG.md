# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.2.1] - 2025-03-04

### Changed
- **Dropped `form-data` dependency** — file uploads now use the native `FormData` API (Node 18+), removing 1 direct dependency and its transitives
- Upload method signatures changed from `Buffer | Blob | NodeJS.ReadableStream` to `Buffer | Blob | Uint8Array` (affects `uploadActivity`, `updateStreamsCSV`, `uploadWellnessCSV`, `importWorkout`, `uploadImage`)

## [2.2.0] - 2025-03-04

### Added
- **Retry-After header support** — 429 responses now respect the `Retry-After` header (seconds or HTTP-date) to determine retry delay
- **`retryAfter` field** on `IntervalsAPIError` and `APIError` interface — exposes the server-requested wait time in seconds
- **Jitter in exponential backoff** — retry delays now include random jitter (`0.5–1.0×`) to avoid thundering-herd effects
- **Related Projects** section in README comparing `intervals-icu` with `@kuranov/intervals-client`

## [2.1.0] - 2025-03-03

### Removed
- **All 20 backward-compatible facade methods** from `IntervalsClient` (e.g. `client.getAthlete()`, `client.getEvents()`, `client.getActivity()`) — use service accessors instead (e.g. `client.athletes.getAthlete()`, `client.events.listEvents()`, `client.activities.getActivity()`)
- **5 deprecated service aliases**: `getActivities()`, `getEvents()`, `getWellness()`, `getWorkouts()`, `getSportSettings()` — use `listActivities()`, `listEvents()`, `listWellness()`, `listWorkouts()`, `sportSettings.list()` respectively
- Numeric activity ID backward-compat shim (`client.getActivity(12345)`) — activity IDs are strictly `string` now

### Added
- [Migration Guide](./docs/MIGRATION.md) with full table of removed methods and before/after examples

## [2.0.0] - 2025-03-03

### Added
- **16 service classes** covering 100+ Intervals.icu API endpoints: Athletes, Activities, Events, Wellness, Workouts, Sport Settings, Folders, Gear, Chats, Weather, Routes, Custom Items, Shared Events, Fitness, Performance, Search
- **OAuth bearer token** authentication (`accessToken` config option)
- **File upload** support via multipart form-data (activity files: .fit, .tcx, .gpx, .zip)
- **Binary download** support for activity file exports
- **Auto-retry with exponential backoff** for 429 and 5xx errors (`maxRetries`, `retryDelayMs`)
- **~40 TypeScript interfaces** generated from the Intervals.icu OpenAPI spec
- **Service accessor pattern** — `client.activities`, `client.events`, `client.chats`, etc.
- Comprehensive test suite (75 tests across 11 test files)

### Changed
- **BREAKING:** Activity IDs are now `string` (e.g. `'i55610271'`). Facade methods still accept `number` for backward compatibility.
- **BREAKING:** Single-activity endpoints now correctly use `/activity/{id}` instead of `/athlete/{id}/activities/{id}`
- **BREAKING:** Default timeout increased from 10s to 30s
- **BREAKING:** `apiKey` is now optional — provide `apiKey` OR `accessToken`
- Default `athleteId` changed from `'me'` to `'0'` (authenticated athlete)
- Types moved from monolithic `src/types.ts` to modular `src/types/*.ts` barrel

### Removed
- Monolithic `src/types.ts` (replaced by `src/types/index.ts` barrel)

## [1.1.1] - 2025-12-12

### Fixed
- Corrected repository URLs in package.json to point to the correct GitHub repository (`paladini/node-intervals-icu`)

## [1.1.0] - 2025-12-12

### Added
- Added `type` field to `Event` interface to allow reliable differentiation between event types (Run, Ride, Swim, Strength, etc.)
- Added comprehensive test suite for event type filtering
- Added documentation for filtering events by type in README

### Changed
- Improved event filtering examples in documentation to use the new `type` field instead of name-based pattern matching

## [1.0.1] - Previous Release

Initial release with core functionality.

[1.1.0]: https://github.com/paladini/intervals-icu/compare/v1.0.1...v1.1.0
