import { describe, it, expect, beforeEach, vi } from 'vitest';
import { IntervalsClient } from '../src/client.js';
import { mockAthlete, mockAthleteUpdate, mockUpdatedAthlete } from './fixtures/athlete.js';

// Mock axios
vi.mock('axios');
import axios from 'axios';
const mockedAxios = axios as any;

describe('IntervalsClient - Athlete', () => {
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
      if (config.url.includes('/athlete') && config.method === 'GET') {
        return mockAthlete;
      }
      if (config.url.includes('/athlete') && config.method === 'PUT') {
        return mockUpdatedAthlete;
      }
      return null;
    });
  });

  it('should get athlete information', async () => {
    const athlete = await client.getAthlete();

    expect(athlete).toBeDefined();
    expect(athlete.id).toBe('i12345');
    expect(athlete.name).toBe('Test Athlete');
    expect(athlete.email).toBe('test@example.com');
    expect(athlete.ftp).toBe(250);
    expect(athlete.weight).toBe(70);
  });

  it('should get athlete information with custom athleteId', async () => {
    const athlete = await client.getAthlete('custom-athlete-id');

    expect(athlete).toBeDefined();
    expect(athlete.name).toBe('Test Athlete');
  });

  it('should update athlete information', async () => {
    const updated = await client.updateAthlete(mockAthleteUpdate);

    expect(updated).toBeDefined();
    expect(updated.ftp).toBe(260);
    expect(updated.weight).toBe(69.5);
    expect(updated.restingHR).toBe(48);
    expect(updated.updated).toBeDefined();
  });

  it('should update athlete information with partial data', async () => {
    const updated = await client.updateAthlete({ ftp: 270 });

    expect(updated).toBeDefined();
    expect(updated.updated).toBeDefined();
  });

  it('should validate athlete data structure', async () => {
    const athlete = await client.getAthlete();

    // Check required fields
    expect(athlete).toHaveProperty('id');
    expect(athlete).toHaveProperty('name');
    
    // Check optional fitness fields
    expect(athlete).toHaveProperty('ftp');
    expect(athlete).toHaveProperty('weight');
    expect(athlete).toHaveProperty('maxHR');
    expect(athlete).toHaveProperty('restingHR');
    
    // Check power curve fields
    expect(athlete).toHaveProperty('w1');
    expect(athlete).toHaveProperty('w6');
    expect(athlete).toHaveProperty('pMax');
    
    // Check ICU calculated fields
    expect(athlete).toHaveProperty('icu_ftp');
    expect(athlete).toHaveProperty('icu_pm');
  });
});
