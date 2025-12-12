import { describe, it, expect, beforeEach, vi } from 'vitest';
import { IntervalsClient } from '../src/client.js';
import { mockWorkout, mockWorkouts } from './fixtures/workouts.js';

// Mock axios
vi.mock('axios');
import axios from 'axios';
const mockedAxios = axios as any;

describe('IntervalsClient - Workouts', () => {
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
      if (config.url.includes('/workouts') && config.method === 'GET') {
        if (config.url.match(/\/workouts\/\d+$/)) {
          return mockWorkout;
        }
        return mockWorkouts;
      }
      if (config.url.includes('/workouts') && config.method === 'POST') {
        return { ...config.data, id: 2000, created: '2024-01-20T10:00:00Z', updated: '2024-01-20T10:00:00Z' };
      }
      if (config.url.includes('/workouts') && config.method === 'PUT') {
        return { ...mockWorkout, ...config.data, updated: '2024-01-20T12:00:00Z' };
      }
      if (config.url.includes('/workouts') && config.method === 'DELETE') {
        return;
      }
      return [];
    });
  });

  it('should get planned workouts', async () => {
    const workouts = await client.getWorkouts({
      oldest: '2024-01-01',
      newest: '2024-01-31',
    });

    expect(workouts).toBeDefined();
    expect(workouts.length).toBeGreaterThan(0);
    expect(workouts[0]).toHaveProperty('name');
    expect(workouts[0]).toHaveProperty('start_date_local');
  });

  it('should get a specific workout by ID', async () => {
    const workout = await client.getWorkout(1001);

    expect(workout).toBeDefined();
    expect(workout.id).toBe(1001);
    expect(workout.name).toBe('Tempo Run');
    expect(workout.workout_type).toBe('Run');
  });

  it('should create a new workout', async () => {
    const newWorkout = await client.createWorkout({
      start_date_local: '2024-01-20',
      name: 'New Interval Session',
      description: '5x5min @ VO2max',
      workout_type: 'Run',
      tss: 80,
      duration_secs: 4200,
    });

    expect(newWorkout).toBeDefined();
    expect(newWorkout.id).toBeDefined();
    expect(newWorkout.name).toBe('New Interval Session');
  });

  it('should update an existing workout', async () => {
    const updated = await client.updateWorkout(1001, {
      name: 'Updated Tempo Run',
      tss: 70,
    });

    expect(updated).toBeDefined();
    expect(updated.name).toBe('Updated Tempo Run');
    expect(updated.updated).toBeDefined();
  });

  it('should delete a workout', async () => {
    await expect(client.deleteWorkout(1001)).resolves.toBeUndefined();
  });

  it('should filter workouts by type', async () => {
    const workouts = await client.getWorkouts({
      oldest: '2024-01-01',
      newest: '2024-01-31',
    });

    const runWorkouts = workouts.filter(w => w.workout_type === 'Run');
    const rideWorkouts = workouts.filter(w => w.workout_type === 'Ride');

    expect(runWorkouts.length).toBeGreaterThan(0);
    expect(rideWorkouts.length).toBeGreaterThan(0);
    
    runWorkouts.forEach(workout => {
      expect(workout.workout_type).toBe('Run');
    });
  });

  it('should validate workout data structure', async () => {
    const workout = await client.getWorkout(1001);
    
    // Check required fields
    expect(workout).toHaveProperty('id');
    expect(workout).toHaveProperty('start_date_local');
    expect(workout).toHaveProperty('name');
    
    // Check workout-specific fields
    expect(workout).toHaveProperty('workout_type');
    expect(workout).toHaveProperty('tss');
    expect(workout).toHaveProperty('duration_secs');
    expect(workout).toHaveProperty('description');
  });
});
