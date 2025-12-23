import { describe, it, expect, beforeEach, vi } from 'vitest';
import { IntervalsClient } from '../src/client.js';
import { mockEvents, mockEvent, mockEventWithoutType } from './fixtures/events.js';
import { setupAxiosMock } from './helpers/mock-axios.js';

// Mock axios
vi.mock('axios');
import axios from 'axios';
const mockedAxios = axios as any;

describe('IntervalsClient - Events', () => {
  let client: IntervalsClient;

  beforeEach(() => {
    // Setup axios mock with request handler
    setupAxiosMock(mockedAxios, async (config: any) => {
      if (config.url.includes('/events') && config.method === 'GET') {
        if (config.url.match(/\/events\/\d+$/)) {
          return mockEvent;
        }
        return mockEvents;
      }
      if (config.url.includes('/events') && config.method === 'POST') {
        return { ...config.data, id: 100, created: '2024-01-20T10:00:00Z', updated: '2024-01-20T10:00:00Z' };
      }
      if (config.url.includes('/events') && config.method === 'PUT') {
        return { ...mockEvent, ...config.data, updated: '2024-01-20T12:00:00Z' };
      }
      if (config.url.includes('/events') && config.method === 'DELETE') {
        return;
      }
      return [];
    });

    client = new IntervalsClient({
      apiKey: 'test-api-key',
      athleteId: 'test-athlete-id',
    });
  });

  it('should return events with type field', async () => {
    const events = await client.getEvents({
      oldest: '2024-01-01',
      newest: '2024-01-31',
    });

    expect(events).toBeDefined();
    expect(events.length).toBeGreaterThan(0);
    
    // Validate that workout events have the type field
    const workoutEvents = events.filter(e => e.category === 'WORKOUT');
    workoutEvents.forEach((event) => {
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
    // Re-setup axios mock for this specific test
    setupAxiosMock(mockedAxios, async () => [mockEventWithoutType]);

    const testClient = new IntervalsClient({
      apiKey: 'test-api-key',
      athleteId: 'test-athlete-id',
    });

    const events = await testClient.getEvents({
      oldest: '2024-01-01',
      newest: '2024-01-31',
    });

    expect(events).toBeDefined();
    expect(events.length).toBe(1);
    expect(events[0].type).toBeUndefined();
  });

  it('should get a specific event by ID', async () => {
    const event = await client.getEvent(1);

    expect(event).toBeDefined();
    expect(event.id).toBe(1);
    expect(event.name).toBe('Morning Run');
    expect(event.type).toBe('Run');
  });

  it('should create a new event', async () => {
    const newEvent = await client.createEvent({
      start_date_local: '2024-01-20',
      name: 'New Event',
      category: 'WORKOUT',
      type: 'Run',
      description: 'Test event',
    });

    expect(newEvent).toBeDefined();
    expect(newEvent.id).toBeDefined();
    expect(newEvent.name).toBe('New Event');
  });

  it('should update an existing event', async () => {
    const updated = await client.updateEvent(1, {
      name: 'Updated Morning Run',
    });

    expect(updated).toBeDefined();
    expect(updated.name).toBe('Updated Morning Run');
    expect(updated.updated).toBeDefined();
  });

  it('should delete an event', async () => {
    await expect(client.deleteEvent(1)).resolves.toBeUndefined();
  });
});
