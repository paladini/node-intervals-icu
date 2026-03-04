import { describe, it, expect, beforeEach, vi } from 'vitest';
import { IntervalsClient } from '../src/client.js';
import { setupAxiosMock } from './helpers/mock-axios.js';

vi.mock('axios');
import axios from 'axios';
const mockedAxios = axios as any;

const mockSettings = {
  id: 1,
  types: ['Run', 'VirtualRun'],
  threshold_pace: 4.5,
  threshold_power: null,
  threshold_hr: 165,
  max_hr: 190,
  resting_hr: 50,
};

const mockSettingsList = [
  mockSettings,
  {
    id: 2,
    types: ['Ride', 'VirtualRide'],
    threshold_pace: null,
    threshold_power: 250,
    threshold_hr: 170,
    max_hr: 190,
    resting_hr: 50,
  },
];

describe('IntervalsClient - Sport Settings', () => {
  let client: IntervalsClient;

  beforeEach(() => {
    setupAxiosMock(mockedAxios, async (config: any) => {
      if (config.url.includes('/sport-settings') && config.method === 'GET') {
        if (config.url.match(/\/sport-settings\/\d+$/)) {
          return mockSettings;
        }
        return mockSettingsList;
      }
      if (config.url.includes('/sport-settings') && config.method === 'POST') {
        return { ...config.data, id: 3 };
      }
      if (config.url.includes('/sport-settings') && config.method === 'PUT') {
        if (config.url.endsWith('/apply')) return;
        return { ...mockSettings, ...config.data };
      }
      if (config.url.includes('/sport-settings') && config.method === 'DELETE') {
        return;
      }
      return null;
    });

    client = new IntervalsClient({
      apiKey: 'test-api-key',
      athleteId: 'test-athlete-id',
    });
  });

  it('should list all sport settings', async () => {
    const settings = await client.sportSettings.list();
    expect(settings).toBeDefined();
    expect(settings.length).toBe(2);
    expect(settings[0].types).toContain('Run');
    expect(settings[1].types).toContain('Ride');
  });

  it('should get a single sport settings entry', async () => {
    const settings = await client.sportSettings.get(1);
    expect(settings).toBeDefined();
    expect(settings.threshold_pace).toBe(4.5);
    expect(settings.threshold_hr).toBe(165);
  });

  it('should create a new sport settings entry', async () => {
    const created = await client.sportSettings.create({
      types: ['Swim'],
      threshold_pace: 1.5,
    });
    expect(created).toBeDefined();
    expect(created.id).toBe(3);
  });

  it('should update a sport settings entry', async () => {
    const updated = await client.sportSettings.update(1, { threshold_pace: 4.8 });
    expect(updated).toBeDefined();
  });

  it('should delete a sport settings entry', async () => {
    await expect(client.sportSettings.delete(1)).resolves.toBeUndefined();
  });

  it('should apply settings to activities', async () => {
    await expect(client.sportSettings.applyToActivities(1)).resolves.toBeUndefined();
  });

  it('should be accessible via deprecated getSportSettings facade', async () => {
    const settings = await client.getSportSettings();
    expect(settings).toBeDefined();
    expect(settings.length).toBe(2);
  });
});
