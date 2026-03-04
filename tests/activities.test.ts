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
    // v2.0 URL patterns:
    //   list:   GET /athlete/{id}/activities
    //   single: GET /activity/{activityId}
    //   update: PUT /activity/{activityId}
    //   delete: DELETE /activity/{activityId}
    setupAxiosMock(mockedAxios, async (config: any) => {
      // List activities (athlete-scoped)
      if (config.url.includes('/athlete/') && config.url.endsWith('/activities') && config.method === 'GET') {
        return mockActivities;
      }
      // Single activity operations (no athlete prefix)
      if (config.url.match(/\/activity\//) && config.method === 'GET') {
        return mockActivity;
      }
      if (config.url.match(/\/activity\//) && config.method === 'PUT') {
        return { ...mockActivity, ...config.data, updated: '2024-01-20T12:00:00Z' };
      }
      if (config.url.match(/\/activity\//) && config.method === 'DELETE') {
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
    const activities = await client.activities.listActivities({
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
    const activity = await client.activities.getActivity('i2001');

    expect(activity).toBeDefined();
    expect(activity.id).toBe('i2001');
    expect(activity.name).toBe('Morning Run');
    expect(activity.type).toBe('Run');
  });

  it('should update an existing activity', async () => {
    const updated = await client.activities.updateActivity('i2001', {
      name: 'Updated Morning Run',
      description: 'Easy recovery run - felt great',
      feel: 9,
    });

    expect(updated).toBeDefined();
    expect(updated.name).toBe('Updated Morning Run');
    expect(updated.updated).toBeDefined();
  });

  it('should delete an activity', async () => {
    await expect(client.activities.deleteActivity('i2001')).resolves.toBeUndefined();
  });

  it('should filter activities by type', async () => {
    const activities = await client.activities.listActivities({
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
    const activity = await client.activities.getActivity('i2001');
    
    // Check core fields
    expect(activity).toHaveProperty('id');
    expect(activity).toHaveProperty('start_date_local');
    expect(activity).toHaveProperty('type');
    expect(activity).toHaveProperty('name');
    
    // Check activity-specific fields
    expect(activity).toHaveProperty('distance');
    expect(activity).toHaveProperty('moving_time');
    expect(activity).toHaveProperty('elapsed_time');
    expect(activity).toHaveProperty('icu_training_load');
  });

  it('should handle activities with detailed metrics', async () => {
    const activity = await client.activities.getActivity('i2001');
    
    // Check advanced metrics (v2.0 field names)
    expect(activity).toHaveProperty('icu_training_load');
    expect(activity).toHaveProperty('icu_feel');
    
    // Optional fields
    if (activity.icu_training_load !== undefined) {
      expect(typeof activity.icu_training_load).toBe('number');
    }
    if (activity.trimp !== undefined) {
      expect(typeof activity.trimp).toBe('number');
    }
    if (activity.perceived_exertion !== undefined) {
      expect(typeof activity.perceived_exertion).toBe('number');
    }
  });
});
