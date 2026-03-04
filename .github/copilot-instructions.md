# Copilot Instructions — node-intervals-icu

## Context
`intervals-icu` is a comprehensive TypeScript client library for the [Intervals.icu](https://intervals.icu) API, published on npm. v2.0 ships 16 service classes, 100+ methods, and ~100 exported types with full type safety, dual auth (API key + OAuth), file upload/download, auto-retry, and rate-limit tracking.

**Runtime deps**: axios, form-data (keep it minimal).
**Dev stack**: TypeScript 5.3+ strict, tsup (CJS+ESM), vitest, eslint.
**Node**: >= 18.

## Architecture
- `src/client.ts` — `IntervalsClient` composes 16 services via constructor injection
- `src/services/*.service.ts` — one class per API resource, receives `IHttpClient` + `athleteId`
- `src/core/` — `IHttpClient` interface, `AxiosHttpClient` (concrete), `ErrorHandler`, `RateLimitTracker`
- `src/types/` — modular type files with barrel `src/types/index.ts`
- `src/index.ts` — public barrel export (all services, types, errors, core interfaces)

## Code style
- TypeScript strict mode; no `any` in public API surface
- 2-space indentation, async/await, no callbacks
- `interface` for API response shapes and service contracts
- `type` for string literal unions, DTOs, and utility types
- JSDoc on all public methods and exported types
- Enum-like types live in `src/types/enums.ts` as string literal unions (not TS `enum`)

## Key patterns
- **Dependency Inversion**: services depend on `IHttpClient`, never import axios
- **Error handling**: throw `IntervalsAPIError` with `status`, `code` (e.g. `RATE_LIMIT_EXCEEDED`, `AUTH_FAILED`, `NOT_FOUND`), and `message`
- **Pagination**: `PaginationOptions` type with `oldest` / `newest` date strings
- **File operations**: `upload<T>(UploadConfig)` for multipart, `download(url)` for binary Buffer
- **Auto-retry**: exponential backoff on 429 / 5xx, configurable via `maxRetries` / `retryDelayMs`
- **Service accessor**: `client.activities.getActivity(id)` — always use this pattern

## When generating code

### Adding a new service method
1. Add method to the appropriate `src/services/*.service.ts`
2. Type parameters and return value explicitly using types from `src/types/`
3. Add JSDoc with `@param` and `@returns` tags
4. Use `this.httpClient.request<T>(...)` — never call axios directly
5. If the method needs new types, add them in the correct `src/types/*.ts` file
6. Re-export new types from `src/types/index.ts` and `src/index.ts`
7. Add unit test in the matching `tests/*.test.ts` using mock-axios helper

### Adding a new service
1. Create `src/services/{name}.service.ts` following existing service pattern
2. Add the service as a `readonly` property in `src/client.ts`
3. Create type file `src/types/{name}.ts`, export from `src/types/index.ts`
4. Export service class from `src/index.ts`
5. Create `tests/{name}.test.ts` with fixture data in `tests/fixtures/`

### Adding new types
1. Add to the appropriate `src/types/*.ts` file (one file per resource)
2. Re-export from `src/types/index.ts` (grouped by resource in comments)
3. Re-export from `src/index.ts`
4. Use `interface` for API response shapes, `type` for unions/inputs

## Testing
- Mock axios via `tests/helpers/mock-axios.ts`
- Fixtures in `tests/fixtures/`
- Run: `npm test` (vitest)
- Each service should have a corresponding test file

## Do NOT
- Add runtime dependencies without strong justification
- Import axios directly in services
- Export internals (axios instance, ErrorHandler, RateLimitTracker)
- Use `any` in public types or method signatures
- Break backward compatibility without a major version bump
- Use TypeScript `enum` — prefer string literal union types
