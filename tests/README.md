# Test Suite Documentation

This directory contains comprehensive unit tests for the `intervals-icu` library.

## Structure

```
tests/
├── fixtures/           # Test data fixtures
│   ├── activities.ts   # Mock activity data
│   ├── athlete.ts      # Mock athlete data
│   ├── events.ts       # Mock event data
│   ├── wellness.ts     # Mock wellness data
│   └── workouts.ts     # Mock workout data
├── activities.test.ts  # Activity endpoint tests
├── athlete.test.ts     # Athlete endpoint tests
├── client.test.ts      # Core client functionality tests
├── events.test.ts      # Event endpoint tests
├── wellness.test.ts    # Wellness endpoint tests
└── workouts.test.ts    # Workout endpoint tests
```

## Fixtures

All test fixtures are located in the `fixtures/` directory. These provide reusable mock data that closely matches the actual API responses.

### Benefits of Using Fixtures:

1. **Maintainability**: Centralized test data makes it easy to update mock responses
2. **Consistency**: Same data structures used across multiple tests
3. **Readability**: Test files remain clean and focused on test logic
4. **Type Safety**: Fixtures are fully typed with TypeScript interfaces

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run type checking
npm run typecheck

# Run linter
npm run lint
```

## Test Coverage

The test suite covers:

- ✅ Athlete endpoints (get, update)
- ✅ Event endpoints (get, create, update, delete, filtering by type)
- ✅ Wellness endpoints (get, create, update, delete)
- ✅ Workout endpoints (get, create, update, delete, filtering by type)
- ✅ Activity endpoints (get, update, delete, filtering by type)
- ✅ Error handling (401, 404, 429, 500 errors)
- ✅ Rate limiting tracking
- ✅ Client initialization with various configurations

## Key Features Tested

### Event Type Filtering
Tests specifically validate the new `type` field in events, ensuring:
- Events with type field are returned correctly
- Filtering by type (Run, Ride, Swim, Strength) works as expected
- Events without type field are handled gracefully
- Type field can be used reliably for workout classification

### Error Handling
Tests verify proper error handling for:
- Authentication failures (401)
- Not found errors (404)
- Rate limit exceeded (429)
- Server errors (500)
- Network errors

### Rate Limiting
Tests ensure the client properly tracks:
- Remaining rate limit from API headers
- Rate limit reset time
- Returns undefined before first request

## Writing New Tests

When adding new tests:

1. Create fixtures in `tests/fixtures/` for any new data types
2. Follow the existing test structure and naming conventions
3. Mock axios responses using `vi.spyOn(client as any, 'request')`
4. Test both success and error scenarios
5. Validate response structure and data types
6. Run `npm test` to ensure all tests pass

## Example Test Pattern

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { IntervalsClient } from '../src/client.js';
import { mockData } from './fixtures/data.js';

describe('IntervalsClient - Feature', () => {
  let client: IntervalsClient;

  beforeEach(() => {
    // Setup mock axios instance
    const mockInstance = {
      // ... mock methods
    };
    
    client = new IntervalsClient({
      apiKey: 'test-api-key',
      athleteId: 'test-athlete-id',
    });

    // Mock the request method
    vi.spyOn(client as any, 'request').mockImplementation(async (config) => {
      // Return appropriate mock data based on config
      return mockData;
    });
  });

  it('should perform expected behavior', async () => {
    const result = await client.someMethod();
    expect(result).toBeDefined();
    // ... assertions
  });
});
```
