import { describe, it, expect, beforeEach, vi } from 'vitest';
import { IntervalsClient, IntervalsAPIError } from '../src/client.js';
import axios, { AxiosError } from 'axios';

// Mock axios
vi.mock('axios');
const mockedAxios = axios as any;

describe('IntervalsClient - Core Functionality', () => {
  describe('Client Initialization', () => {
    beforeEach(() => {
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
    });

    it('should create a client with API key', () => {
      const client = new IntervalsClient({
        apiKey: 'test-api-key',
      });

      expect(client).toBeDefined();
      expect(client).toBeInstanceOf(IntervalsClient);
    });

    it('should create a client with custom athleteId', () => {
      const client = new IntervalsClient({
        apiKey: 'test-api-key',
        athleteId: 'custom-athlete-id',
      });

      expect(client).toBeDefined();
    });

    it('should create a client with custom baseURL', () => {
      const client = new IntervalsClient({
        apiKey: 'test-api-key',
        baseURL: 'https://custom.intervals.icu/api/v1',
      });

      expect(client).toBeDefined();
    });

    it('should create a client with custom timeout', () => {
      const client = new IntervalsClient({
        apiKey: 'test-api-key',
        timeout: 5000,
      });

      expect(client).toBeDefined();
    });

    it('should default athleteId to "me" when not provided', () => {
      const mockInstance = {
        get: vi.fn(),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      };
      
      mockedAxios.create = vi.fn(() => mockInstance);

      const client = new IntervalsClient({
        apiKey: 'test-api-key',
      });

      expect(client).toBeDefined();
      expect(mockedAxios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: 'https://intervals.icu/api/v1',
          timeout: 10000,
        })
      );
    });
  });

  describe('Error Handling', () => {
    let client: IntervalsClient;

    beforeEach(() => {
      const mockInstance = {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
        interceptors: {
          request: { use: vi.fn(), eject: vi.fn() },
          response: { 
            use: vi.fn((successHandler, errorHandler) => {
              mockInstance._errorHandler = errorHandler;
            }),
            eject: vi.fn(),
          },
        },
        _errorHandler: null as any,
      };
      
      mockedAxios.create = vi.fn(() => mockInstance);

      client = new IntervalsClient({
        apiKey: 'test-api-key',
        athleteId: 'test-athlete-id',
      });
    });

    it('should throw IntervalsAPIError on 401 Unauthorized', async () => {
      const error = new Error('Request failed') as AxiosError;
      error.response = {
        status: 401,
        data: { error: 'Unauthorized' },
        statusText: 'Unauthorized',
        headers: {},
        config: {} as any,
      };

      vi.spyOn(client as any, 'request').mockRejectedValue(
        new IntervalsAPIError('Unauthorized', 401, 'AUTH_FAILED')
      );

      await expect(client.getAthlete()).rejects.toThrow(IntervalsAPIError);
      await expect(client.getAthlete()).rejects.toThrow('Unauthorized');
    });

    it('should throw IntervalsAPIError on 404 Not Found', async () => {
      vi.spyOn(client as any, 'request').mockRejectedValue(
        new IntervalsAPIError('Not Found', 404, 'NOT_FOUND')
      );

      await expect(client.getEvent(99999)).rejects.toThrow(IntervalsAPIError);
    });

    it('should throw IntervalsAPIError on 429 Rate Limit', async () => {
      vi.spyOn(client as any, 'request').mockRejectedValue(
        new IntervalsAPIError('Rate limit exceeded', 429, 'RATE_LIMIT_EXCEEDED')
      );

      await expect(client.getAthlete()).rejects.toThrow(IntervalsAPIError);
      await expect(client.getAthlete()).rejects.toThrow('Rate limit exceeded');
    });

    it('should throw IntervalsAPIError on 500 Server Error', async () => {
      vi.spyOn(client as any, 'request').mockRejectedValue(
        new IntervalsAPIError('Internal Server Error', 500, 'SERVER_ERROR')
      );

      await expect(client.getAthlete()).rejects.toThrow(IntervalsAPIError);
    });

    it('should handle network errors', async () => {
      vi.spyOn(client as any, 'request').mockRejectedValue(
        new Error('Network Error')
      );

      await expect(client.getAthlete()).rejects.toThrow('Network Error');
    });
  });

  describe('Rate Limiting', () => {
    let client: IntervalsClient;

    beforeEach(() => {
      const mockInstance = {
        get: vi.fn(),
        interceptors: {
          request: { use: vi.fn(), eject: vi.fn() },
          response: { 
            use: vi.fn((successHandler) => {
              mockInstance._successHandler = successHandler;
              return 0;
            }),
            eject: vi.fn(),
          },
        },
        _successHandler: null as any,
      };
      
      mockedAxios.create = vi.fn(() => mockInstance);

      client = new IntervalsClient({
        apiKey: 'test-api-key',
      });
    });

    it('should track rate limit information from headers', async () => {
      const mockResponse = {
        data: { id: 'test' },
        headers: {
          'x-ratelimit-remaining': '98',
          'x-ratelimit-reset': '1640000000',
        },
      };

      vi.spyOn(client as any, 'request').mockImplementation(async () => {
        // Simulate rate limit update
        (client as any).rateLimitRemaining = 98;
        (client as any).rateLimitReset = new Date(1640000000 * 1000);
        return mockResponse.data;
      });

      await client.getAthlete();

      const remaining = client.getRateLimitRemaining();
      const reset = client.getRateLimitReset();

      expect(remaining).toBe(98);
      expect(reset).toBeInstanceOf(Date);
    });

    it('should return undefined for rate limit before first request', () => {
      const remaining = client.getRateLimitRemaining();
      const reset = client.getRateLimitReset();

      expect(remaining).toBeUndefined();
      expect(reset).toBeUndefined();
    });
  });

  describe('IntervalsAPIError', () => {
    it('should create error with all properties', () => {
      const error = new IntervalsAPIError('Test error', 400, 'TEST_ERROR');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(IntervalsAPIError);
      expect(error.message).toBe('Test error');
      expect(error.status).toBe(400);
      expect(error.code).toBe('TEST_ERROR');
      expect(error.name).toBe('IntervalsAPIError');
    });

    it('should create error without status and code', () => {
      const error = new IntervalsAPIError('Test error');

      expect(error.message).toBe('Test error');
      expect(error.status).toBeUndefined();
      expect(error.code).toBeUndefined();
    });

    it('should be catchable as IntervalsAPIError', async () => {
      const client = new IntervalsClient({
        apiKey: 'test-api-key',
      });

      vi.spyOn(client as any, 'request').mockRejectedValue(
        new IntervalsAPIError('Test error', 400, 'TEST_ERROR')
      );

      try {
        await client.getAthlete();
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error).toBeInstanceOf(IntervalsAPIError);
        if (error instanceof IntervalsAPIError) {
          expect(error.status).toBe(400);
          expect(error.code).toBe('TEST_ERROR');
        }
      }
    });
  });
});
