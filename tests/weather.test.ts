import { describe, it, expect, beforeEach, vi } from 'vitest';
import { IntervalsClient } from '../src/client.js';
import { setupAxiosMock } from './helpers/mock-axios.js';

vi.mock('axios');
import axios from 'axios';
const mockedAxios = axios as any;

const mockWeather = {
  forecasts: [
    { dt: 1705320000, temp: 22, feels_like: 21, humidity: 65, wind_speed: 3.5 },
  ],
};

const mockWeatherConfig = {
  latitude: -23.5,
  longitude: -46.6,
  location_name: 'São Paulo',
};

describe('IntervalsClient - Weather', () => {
  let client: IntervalsClient;

  beforeEach(() => {
    setupAxiosMock(mockedAxios, async (config: any) => {
      if (config.url.endsWith('/weather') && config.method === 'GET') {
        return mockWeather;
      }
      if (config.url.endsWith('/weather-config') && config.method === 'GET') {
        return mockWeatherConfig;
      }
      if (config.url.endsWith('/weather-config') && config.method === 'PUT') {
        return { ...mockWeatherConfig, ...config.data };
      }
      return null;
    });

    client = new IntervalsClient({
      apiKey: 'test-api-key',
      athleteId: 'test-athlete-id',
    });
  });

  it('should get weather forecast', async () => {
    const weather = await client.weather.getWeather();
    expect(weather).toBeDefined();
    expect(weather.forecasts).toBeDefined();
    expect(weather.forecasts!.length).toBe(1);
  });

  it('should get weather config', async () => {
    const config = await client.weather.getWeatherConfig();
    expect(config).toBeDefined();
    expect(config.latitude).toBe(-23.5);
    expect(config.longitude).toBe(-46.6);
  });

  it('should update weather config', async () => {
    const updated = await client.weather.updateWeatherConfig({ latitude: -22.9, longitude: -43.2 });
    expect(updated).toBeDefined();
  });
});
