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
    let mockInstance: any;
    let errorHandler: any;

    beforeEach(() => {
      mockInstance = {
        request: vi.fn(),
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
        interceptors: {
          request: { use: vi.fn(), eject: vi.fn() },
          response: { 
            use: vi.fn((successHandler, _errorHandler) => {
              mockInstance._successHandler = successHandler;
              errorHandler = _errorHandler;
            }),
            eject: vi.fn(),
          },
        },
        _successHandler: null as any,
      };

      // Make request method call error handler when rejected
      mockInstance.request.mockImplementation(async () => {
        throw new Error('This should be overridden in each test');
      });
      
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

      mockInstance.request.mockImplementation(async () => {
        throw await errorHandler(error);
      });

      await expect(client.getAthlete()).rejects.toThrow(IntervalsAPIError);
      await expect(client.getAthlete()).rejects.toThrow('authentication failed');
    });

    it('should throw IntervalsAPIError on 404 Not Found', async () => {
      const error = new Error('Not Found') as AxiosError;
      error.response = {
        status: 404,
        data: {},
        statusText: 'Not Found',
        headers: {},
        config: {} as any,
      };

      mockInstance.request.mockImplementation(async () => {
        throw await errorHandler(error);
      });

      await expect(client.getEvent(99999)).rejects.toThrow(IntervalsAPIError);
      await expect(client.getEvent(99999)).rejects.toThrow('not found');
    });

    it('should throw IntervalsAPIError on 429 Rate Limit', async () => {
      const error = new Error('Too Many Requests') as AxiosError;
      error.response = {
        status: 429,
        data: {},
        statusText: 'Too Many Requests',
        headers: {},
        config: {} as any,
      };

      mockInstance.request.mockImplementation(async () => {
        throw await errorHandler(error);
      });

      await expect(client.getAthlete()).rejects.toThrow(IntervalsAPIError);
      await expect(client.getAthlete()).rejects.toThrow('Rate limit exceeded');
    });

    it('should throw IntervalsAPIError on 500 Server Error', async () => {
      const error = new Error('Server Error') as AxiosError;
      error.response = {
        status: 500,
        data: {},
        statusText: 'Internal Server Error',
        headers: {},
        config: {} as any,
      };

      mockInstance.request.mockImplementation(async () => {
        throw await errorHandler(error);
      });

      await expect(client.getAthlete()).rejects.toThrow(IntervalsAPIError);
    });

    it('should handle network errors', async () => {
      const error = new Error('Network Error');

      mockInstance.request.mockImplementation(async () => {
        throw await errorHandler(error);
      });

      await expect(client.getAthlete()).rejects.toThrow(IntervalsAPIError);
    });
  });

  describe('Rate Limiting', () => {
    let client: IntervalsClient;
    let mockInstance: any;
    let successHandler: any;

    beforeEach(() => {
      mockInstance = {
        request: vi.fn(),
        get: vi.fn(),
        interceptors: {
          request: { use: vi.fn(), eject: vi.fn() },
          response: { 
            use: vi.fn((_successHandler) => {
              successHandler = _successHandler;
              return 0;
            }),
            eject: vi.fn(),
          },
        },
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

      mockInstance.request.mockImplementation(async () => {
        // Call success handler to trigger rate limit tracking
        successHandler(mockResponse);
        return mockResponse;
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
      let errorHandler: any;
      const mockInstance = {
        request: vi.fn(),
        interceptors: {
          request: { use: vi.fn(), eject: vi.fn() },
          response: { 
            use: vi.fn((successHandler, _errorHandler) => {
              errorHandler = _errorHandler;
            }),
            eject: vi.fn(),
          },
        },
      };
      
      mockedAxios.create = vi.fn(() => mockInstance);
      
      const testClient = new IntervalsClient({
        apiKey: 'test-api-key',
      });

      const axiosError = new Error('Test error') as AxiosError;
      axiosError.response = {
        status: 400,
        data: { message: 'Test error' },
        statusText: 'Bad Request',
        headers: {},
        config: {} as any,
      };

      mockInstance.request.mockImplementation(async () => {
        throw await errorHandler(axiosError);
      });

      try {
        await testClient.getAthlete();
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error).toBeInstanceOf(IntervalsAPIError);
        if (error instanceof IntervalsAPIError) {
          expect(error.status).toBe(400);
        }
      }
    });
  });
});
