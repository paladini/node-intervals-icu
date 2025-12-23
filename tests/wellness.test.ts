import { describe, it, expect, beforeEach, vi } from 'vitest';
import { IntervalsClient } from '../src/client.js';
import { mockWellness, mockWellnessArray } from './fixtures/wellness.js';
import { setupAxiosMock } from './helpers/mock-axios.js';

// Mock axios
vi.mock('axios');
import axios from 'axios';
const mockedAxios = axios as any;

describe('IntervalsClient - Wellness', () => {
  let client: IntervalsClient;

  beforeEach(() => {
    // Setup axios mock with request handler
    setupAxiosMock(mockedAxios, async (config: any) => {
      if (config.url.includes('/wellness') && config.method === 'GET') {
        return mockWellnessArray;
      }
      if (config.url.includes('/wellness') && config.method === 'POST') {
        return { ...config.data, id: 'w100', created: '2024-01-20T07:00:00Z', updated: '2024-01-20T07:00:00Z' };
      }
      if (config.url.includes('/wellness') && config.method === 'PUT') {
        return { ...mockWellness, ...config.data, updated: '2024-01-20T08:00:00Z' };
      }
      if (config.url.includes('/wellness') && config.method === 'DELETE') {
        return;
      }
      return [];
    });

    client = new IntervalsClient({
      apiKey: 'test-api-key',
      athleteId: 'test-athlete-id',
    });
  });

  it('should get wellness entries', async () => {
    const wellness = await client.getWellness({
      oldest: '2024-01-01',
      newest: '2024-01-31',
    });

    expect(wellness).toBeDefined();
    expect(wellness.length).toBeGreaterThan(0);
    expect(wellness[0]).toHaveProperty('date');
    expect(wellness[0]).toHaveProperty('restingHR');
  });

  it('should create a new wellness entry', async () => {
    const newWellness = await client.createWellness({
      date: '2024-01-20',
      weight: 70.5,
      restingHR: 49,
      hrv: 67,
      sleepSecs: 29000,
      sleepQuality: 8,
    });

    expect(newWellness).toBeDefined();
    expect(newWellness.id).toBeDefined();
    expect(newWellness.date).toBe('2024-01-20');
    expect(newWellness.weight).toBe(70.5);
  });

  it('should update a wellness entry', async () => {
    const updated = await client.updateWellness('2024-01-15', {
      weight: 69.8,
      mood: 9,
    });

    expect(updated).toBeDefined();
    expect(updated.updated).toBeDefined();
  });

  it('should delete a wellness entry', async () => {
    await expect(client.deleteWellness('2024-01-15')).resolves.toBeUndefined();
  });

  it('should validate wellness data structure', async () => {
    const wellness = await client.getWellness({
      oldest: '2024-01-01',
      newest: '2024-01-31',
    });

    const entry = wellness[0];
    
    // Check required fields
    expect(entry).toHaveProperty('date');
    
    // Check common wellness fields
    expect(entry).toHaveProperty('restingHR');
    expect(entry).toHaveProperty('weight');
    expect(entry).toHaveProperty('sleepSecs');
    expect(entry).toHaveProperty('mood');
  });

  it('should handle wellness entries with all fields', async () => {
    // Re-setup axios mock for this specific test
    setupAxiosMock(mockedAxios, async () => [mockWellness]);

    const testClient = new IntervalsClient({
      apiKey: 'test-api-key',
      athleteId: 'test-athlete-id',
    });

    const wellness = await testClient.getWellness({
      oldest: '2024-01-01',
      newest: '2024-01-31',
    });

    const entry = wellness[0];
    
    expect(entry).toHaveProperty('hrv');
    expect(entry).toHaveProperty('fatigue');
    expect(entry).toHaveProperty('soreness');
    expect(entry).toHaveProperty('stress');
    expect(entry).toHaveProperty('motivation');
    expect(entry).toHaveProperty('spO2');
    expect(entry).toHaveProperty('hydration');
    expect(entry).toHaveProperty('kcalConsumed');
    expect(entry).toHaveProperty('comments');
  });
});
