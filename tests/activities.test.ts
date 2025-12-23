import { describe, it, expect, beforeEach, vi } from 'vitest';
import { IntervalsClient } from '../src/client.js';
import { mockActivity, mockActivities } from './fixtures/activities.js';
import { setupAxiosMock } from './helpers/mock-axios.js';

// Mock axios
vi.mock('axios');
import axios from 'axios';
const mockedAxios = axios as any;

describe('IntervalsClient - Activities', () => {
  let client: IntervalsClient;

  beforeEach(() => {
    // Setup axios mock with request handler
    setupAxiosMock(mockedAxios, async (config: any) => {
      if (config.url.includes('/activities') && config.method === 'GET') {
        if (config.url.match(/\/activities\/\d+$/)) {
          return mockActivity;
        }
        return mockActivities;
      }
      if (config.url.includes('/activities') && config.method === 'PUT') {
        return { ...mockActivity, ...config.data, updated: '2024-01-20T12:00:00Z' };
      }
      if (config.url.includes('/activities') && config.method === 'DELETE') {
        return;
      }
      return [];
    });

    client = new IntervalsClient({
      apiKey: 'test-api-key',
      athleteId: 'test-athlete-id',
    });
  });

  it('should get recorded activities', async () => {
    const activities = await client.getActivities({
      oldest: '2024-01-01',
      newest: '2024-01-31',
    });

    expect(activities).toBeDefined();
    expect(activities.length).toBeGreaterThan(0);
    expect(activities[0]).toHaveProperty('name');
    expect(activities[0]).toHaveProperty('type');
    expect(activities[0]).toHaveProperty('distance');
  });

  it('should get a specific activity by ID', async () => {
    const activity = await client.getActivity(2001);

    expect(activity).toBeDefined();
    expect(activity.id).toBe(2001);
    expect(activity.name).toBe('Morning Run');
    expect(activity.type).toBe('Run');
  });

  it('should update an existing activity', async () => {
    const updated = await client.updateActivity(2001, {
      name: 'Updated Morning Run',
      description: 'Easy recovery run - felt great',
      feel: 9,
    });

    expect(updated).toBeDefined();
    expect(updated.name).toBe('Updated Morning Run');
    expect(updated.updated).toBeDefined();
  });

  it('should delete an activity', async () => {
    await expect(client.deleteActivity(2001)).resolves.toBeUndefined();
  });

  it('should filter activities by type', async () => {
    const activities = await client.getActivities({
      oldest: '2024-01-01',
      newest: '2024-01-31',
    });

    const runActivities = activities.filter(a => a.type === 'Run');
    const rideActivities = activities.filter(a => a.type === 'Ride');
    const swimActivities = activities.filter(a => a.type === 'Swim');

    expect(runActivities.length).toBeGreaterThan(0);
    expect(rideActivities.length).toBeGreaterThan(0);
    expect(swimActivities.length).toBeGreaterThan(0);
    
    runActivities.forEach(activity => {
      expect(activity.type).toBe('Run');
    });
  });

  it('should validate activity data structure', async () => {
    const activity = await client.getActivity(2001);
    
    // Check required fields
    expect(activity).toHaveProperty('id');
    expect(activity).toHaveProperty('start_date_local');
    expect(activity).toHaveProperty('type');
    expect(activity).toHaveProperty('name');
    
    // Check activity-specific fields
    expect(activity).toHaveProperty('distance');
    expect(activity).toHaveProperty('moving_time');
    expect(activity).toHaveProperty('elapsed_time');
    expect(activity).toHaveProperty('tss');
  });

  it('should handle activities with detailed metrics', async () => {
    const activity = await client.getActivity(2001);
    
    // Check advanced metrics
    expect(activity).toHaveProperty('tss');
    expect(activity).toHaveProperty('feel');
    
    // Optional fields
    if (activity.tss !== undefined) {
      expect(typeof activity.tss).toBe('number');
    }
    if (activity.trimp !== undefined) {
      expect(typeof activity.trimp).toBe('number');
    }
    if (activity.perceived_exertion !== undefined) {
      expect(typeof activity.perceived_exertion).toBe('number');
    }
  });
});
