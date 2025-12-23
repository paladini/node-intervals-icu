import { vi } from 'vitest';

/**
 * Creates a mock axios instance with proper request method
 */
export function createMockAxiosInstance(requestMock?: any) {
  const mockInstance: any = {
    request: vi.fn(requestMock || (async () => ({ data: {} }))),
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn(), eject: vi.fn() },
      response: { use: vi.fn(), eject: vi.fn() },
    },
  };
  
  return mockInstance;
}

/**
 * Sets up axios mock with a custom request handler
 */
export function setupAxiosMock(mockedAxios: any, requestHandler: (config: any) => Promise<any>) {
  const mockInstance = createMockAxiosInstance(async (config: any) => {
    const data = await requestHandler(config);
    return { data, headers: {} };
  });
  
  mockedAxios.create = vi.fn(() => mockInstance);
  
  return mockInstance;
}
