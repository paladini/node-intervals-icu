---
description: Core project rules for the intervals-icu npm library (TypeScript client for the Intervals.icu API)
---

# node-intervals-icu — TypeScript Client Library for Intervals.icu

Open-source npm package (`intervals-icu`) providing a comprehensive, fully-typed TypeScript client for the [Intervals.icu](https://intervals.icu) API. Currently at **v2.0** with 16 services, 100+ methods, and ~100 exported types.

## Stack
- **Language**: TypeScript 5.3+ (strict mode)
- **Runtime**: Node.js >= 18
- **Bundler**: tsup → dual CJS (`dist/index.cjs`) + ESM (`dist/index.js`) + declarations
- **Testing**: vitest (unit tests with mocked axios)
- **Linting**: eslint + @typescript-eslint
- **HTTP**: axios (the only runtime dependency; file uploads use native FormData)
- **Package**: published to npm as `intervals-icu`, `"type": "module"`

## Architecture
Follows SOLID principles — especially Dependency Inversion (services depend on `IHttpClient`, never on axios directly).

```
src/
├── client.ts              # IntervalsClient — composes all 16 services
├── index.ts               # Public barrel export (all services, types, errors)
├── core/
│   ├── http-client.interface.ts  # IHttpClient, HttpRequestConfig, UploadConfig
│   ├── axios-http-client.ts      # Concrete axios implementation + retry logic
│   ├── error-handler.ts          # IntervalsAPIError + ErrorHandler
│   └── rate-limit-tracker.ts     # Rate-limit header tracking
├── services/              # 16 service classes (one per API resource)
│   ├── activity.service.ts
│   ├── athlete.service.ts
│   ├── event.service.ts
│   ├── wellness.service.ts
│   ├── workout.service.ts
│   ├── sport-settings.service.ts
│   ├── folder.service.ts
│   ├── gear.service.ts
│   ├── chat.service.ts
│   ├── weather.service.ts
│   ├── route.service.ts
│   ├── custom-item.service.ts
│   ├── shared-event.service.ts
│   ├── fitness.service.ts
│   ├── performance.service.ts
│   └── search.service.ts
└── types/                 # Modular type definitions with barrel index.ts
    ├── index.ts           # Re-exports all types
    ├── config.ts          # IntervalsConfig, PaginationOptions, etc.
    ├── enums.ts           # String literal union types
    ├── activity.ts, athlete.ts, event.ts, wellness.ts, ...
```

### Key design decisions
- **Service accessor pattern**: `client.activities.getActivity(id)` (recommended v2 API)
- **Dual auth**: API key (`apiKey`) or OAuth bearer token (`accessToken`)
- **File upload/download**: multipart via native FormData (Node 18+), binary download as Buffer
- **Auto-retry**: exponential backoff for 429 / 5xx (configurable `maxRetries`, `retryDelayMs`)
- **Rate-limit tracking**: `getRateLimitRemaining()` / `getRateLimitReset()`

## Conventions
- Every public method, type, and service must be exported from `src/index.ts`
- Services receive `IHttpClient` + `athleteId` via constructor — never import axios in services
- Errors throw `IntervalsAPIError` with `status`, `code`, and `message`
- Keep runtime dependencies minimal (currently: axios only)
- Semantic versioning; breaking changes require major bump
- All new features need corresponding unit tests in `tests/`
- JSDoc on all public methods and types
- 2-space indentation, no semicolons in types, async/await everywhere

## TypeScript
- Strict mode with `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`
- No `any` in public API surface (eslint warns on `@typescript-eslint/no-explicit-any`)
- Use `interface` for API response shapes and service contracts
- Use `type` for string literal unions, DTOs, and utility types
- Types organized per resource in `src/types/`, re-exported through barrel `src/types/index.ts`

## Testing
- Unit tests in `tests/*.test.ts`, mock axios via `tests/helpers/mock-axios.ts`
- Fixtures in `tests/fixtures/`
- `npm test` runs vitest (non-watch), `npm run test:watch` for dev
- Currently 75+ tests across 11 test files

## Scripts
- `npm run build` → tsup produces `dist/` (CJS + ESM + .d.ts + .d.cts)
- `npm run typecheck` → `tsc --noEmit`
- `npm run lint` → eslint
- `npm test` → vitest run
- `./release.sh [patch|minor|major|current]` → full release pipeline (typecheck, build, version bump, npm publish, GitHub release via `gh`)

## Do NOT
- Add runtime dependencies without strong justification — this is a lightweight client library
- Import axios directly in services — always go through `IHttpClient`
- Export internal implementation details (axios instance, raw HTTP client, ErrorHandler, RateLimitTracker)
- Break backward compatibility without a major version bump
- Use `any` in public-facing types or method signatures
- Inline magic strings — use the enum types from `src/types/enums.ts`
