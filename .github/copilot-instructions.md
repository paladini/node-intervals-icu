# Copilot Instructions — node-intervals-icu

## Context
Lightweight TypeScript client library for the Intervals.icu API, published to npm as `intervals-icu`. Follows SOLID principles with dependency inversion on the HTTP layer.

## Code Style
- TypeScript strict mode; no `any` in public API
- 2-space indentation
- One service per API resource in `src/services/`
- All public types in `src/types.ts`; re-exported from `src/index.ts`

## Key Patterns
- Services receive an `IHttpClient` (abstraction over axios) — never import axios directly in services
- Errors throw `IntervalsAPIError` with HTTP status and message
- Pagination via `PaginationOptions` type
- Keep the library zero-dependency beyond axios

## When generating code
- Type all parameters and return values explicitly
- Add corresponding test in `tests/` using the mock-axios helper
- Export new public types from `src/index.ts`
- Maintain backward compatibility; document breaking changes
