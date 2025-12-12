import { describe, it, expect, beforeEach, vi } from 'vitest';
import { IntervalsClient } from '../src/client.js';
import type { Event } from '../src/types.js';

// Mock axios
vi.mock('axios');
import axios from 'axios';
const mockedAxios = axios as any;

describe('IntervalsClient - getEvents', () => {
  let client: IntervalsClient;

  beforeEach(() => {
    // Create axios instance mock
    const mockInstance = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      interceptors: {
        request: { use: vi.fn(), eject: vi.fn() },
        response: { use: vi.fn(), eject: vi.fn() },
      },
    };
    
    mockedAxios.create = vi.fn(() => mockInstance);

    client = new IntervalsClient({
      apiKey: 'test-api-key',
      athleteId: 'test-athlete-id',
    });

    // Setup default mock for the request method
    vi.spyOn(client as any, 'request').mockImplementation(async (config: any) => {
      if (config.url.includes('/events')) {
        return mockEvents;
      }
      return [];
    });
  });

  const mockEvents: Event[] = [
    {
      id: 1,
      athlete_id: 'test-athlete-id',
      start_date_local: '2024-01-15',
      category: 'WORKOUT',
      type: 'Run',
      name: 'Morning Run',
      description: 'Easy 10k run',
      color: '#ff0000',
      created: '2024-01-14T10:00:00Z',
      updated: '2024-01-14T10:00:00Z',
    },
    {
      id: 2,
      athlete_id: 'test-athlete-id',
      start_date_local: '2024-01-16',
      category: 'WORKOUT',
      type: 'Ride',
      name: 'Afternoon Ride',
      description: 'Tempo intervals',
      color: '#00ff00',
      created: '2024-01-15T14:00:00Z',
      updated: '2024-01-15T14:00:00Z',
    },
    {
      id: 3,
      athlete_id: 'test-athlete-id',
      start_date_local: '2024-01-17',
      category: 'WORKOUT',
      type: 'Swim',
      name: 'Pool Session',
      description: 'Technique work',
      color: '#0000ff',
      created: '2024-01-16T08:00:00Z',
      updated: '2024-01-16T08:00:00Z',
    },
    {
      id: 4,
      athlete_id: 'test-athlete-id',
      start_date_local: '2024-01-18',
      category: 'WORKOUT',
      type: 'Strength',
      name: 'Gym Session',
      description: 'Upper body strength',
      color: '#ffff00',
      created: '2024-01-17T17:00:00Z',
      updated: '2024-01-17T17:00:00Z',
    },
  ];

  it('should return events with type field', async () => {
    const events = await client.getEvents({
      oldest: '2024-01-01',
      newest: '2024-01-31',
    });

    expect(events).toBeDefined();
    expect(events.length).toBeGreaterThan(0);
    
    // Validate that all events have the type field
    events.forEach((event) => {
      expect(event).toHaveProperty('type');
      expect(typeof event.type).toBe('string');
    });
  });

  it('should return events with correct type values', async () => {
    const events = await client.getEvents({
      oldest: '2024-01-01',
      newest: '2024-01-31',
    });

    const runEvent = events.find((e) => e.type === 'Run');
    const rideEvent = events.find((e) => e.type === 'Ride');
    const swimEvent = events.find((e) => e.type === 'Swim');
    const strengthEvent = events.find((e) => e.type === 'Strength');

    expect(runEvent).toBeDefined();
    expect(runEvent?.type).toBe('Run');
    expect(runEvent?.name).toBe('Morning Run');

    expect(rideEvent).toBeDefined();
    expect(rideEvent?.type).toBe('Ride');
    expect(rideEvent?.name).toBe('Afternoon Ride');

    expect(swimEvent).toBeDefined();
    expect(swimEvent?.type).toBe('Swim');

    expect(strengthEvent).toBeDefined();
    expect(strengthEvent?.type).toBe('Strength');
  });

  it('should filter events by type', async () => {
    const events = await client.getEvents({
      oldest: '2024-01-01',
      newest: '2024-01-31',
    });

    const runEvents = events.filter((e) => e.type === 'Run');
    const rideEvents = events.filter((e) => e.type === 'Ride');
    const swimEvents = events.filter((e) => e.type === 'Swim');
    const strengthEvents = events.filter((e) => e.type === 'Strength');

    expect(runEvents.length).toBeGreaterThan(0);
    expect(rideEvents.length).toBeGreaterThan(0);
    expect(swimEvents.length).toBeGreaterThan(0);
    expect(strengthEvents.length).toBeGreaterThan(0);

    // Ensure total count matches
    const totalFiltered = runEvents.length + rideEvents.length + 
                         swimEvents.length + strengthEvents.length;
    expect(totalFiltered).toBeLessThanOrEqual(events.length);
  });

  it('should allow filtering workouts by type and category', async () => {
    const events = await client.getEvents({
      oldest: '2024-01-01',
      newest: '2024-01-31',
    });

    // Filter for running workouts specifically
    const runWorkouts = events.filter(
      (e) => e.category === 'WORKOUT' && e.type === 'Run'
    );

    expect(runWorkouts.length).toBeGreaterThan(0);
    runWorkouts.forEach((workout) => {
      expect(workout.category).toBe('WORKOUT');
      expect(workout.type).toBe('Run');
    });
  });

  it('should handle events without type field gracefully', async () => {
    // Mock a scenario where some events don't have type
    const eventsWithoutType: Event[] = [
      {
        id: 5,
        athlete_id: 'test-athlete-id',
        start_date_local: '2024-01-19',
        category: 'NOTE',
        name: 'Rest Day',
        description: 'Complete rest',
      },
    ];

    vi.spyOn(client as any, 'request').mockImplementation(async () => eventsWithoutType);

    const events = await client.getEvents({
      oldest: '2024-01-01',
      newest: '2024-01-31',
    });

    expect(events).toBeDefined();
    expect(events.length).toBe(1);
    expect(events[0].type).toBeUndefined();
  });
});
