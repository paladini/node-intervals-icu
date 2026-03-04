---
description: Core project rules for node-intervals-icu library
---

# node-intervals-icu — TypeScript Client Library

## Stack
- **Language**: TypeScript 5.3+
- **Bundler**: tsup (dual CJS/ESM output with .d.ts)
- **Testing**: vitest
- **HTTP**: axios
- **Target**: Node.js >= 16, published to npm as `intervals-icu`

## Architecture (SOLID)
- `src/client.ts` — Main `IntervalsClient` entry point, composes services
- `src/services/` — One service per API resource (activity, athlete, event, wellness, workout)
- `src/core/` — Infrastructure: HTTP client abstraction (`IHttpClient`), error handler, retry logic
- `src/types.ts` — All public type definitions
- `src/index.ts` — Public API barrel export

## Conventions
- Every public method and type must be exported from `src/index.ts`
- Services depend on `IHttpClient` abstraction, not directly on axios
- Error responses wrapped in `IntervalsAPIError` with status code and message
- Keep zero runtime dependencies beyond axios
- Semantic versioning; breaking changes require major bump
- All new features need corresponding unit tests in `tests/`

## TypeScript
- Strict mode; no `any` in public API surface
- Use `interface` for extensible types (service contracts); `type` for unions/inputs
- All API response shapes typed in `types.ts`

## Testing
- Unit tests mock axios via `tests/helpers/mock-axios.ts`
- Fixtures in `tests/fixtures/`
- Run: `npm test` (vitest)

## Publishing
- `npm run build` → tsup produces `dist/` (CJS + ESM + .d.ts)
- `prepublishOnly` triggers build automatically
- See `docs/PUBLISHING.md` for release checklist

## Do NOT
- Add runtime dependencies without strong justification — this is a lightweight client
- Export internal implementation details (axios instance, raw HTTP client)
- Break backward compatibility without a major version bump
