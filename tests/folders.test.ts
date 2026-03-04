import { describe, it, expect, beforeEach, vi } from 'vitest';
import { IntervalsClient } from '../src/client.js';
import { setupAxiosMock } from './helpers/mock-axios.js';

vi.mock('axios');
import axios from 'axios';
const mockedAxios = axios as any;

const mockFolder = {
  id: 10,
  athlete_id: 'test-athlete-id',
  name: 'Base Building',
  type: 'PLAN',
  start_date_local: '2024-01-01',
};

const mockFolders = [
  mockFolder,
  { id: 11, athlete_id: 'test-athlete-id', name: 'Speed Work', type: 'FOLDER' },
];

describe('IntervalsClient - Folders', () => {
  let client: IntervalsClient;

  beforeEach(() => {
    setupAxiosMock(mockedAxios, async (config: any) => {
      if (config.url.endsWith('/folders') && config.method === 'GET') {
        return mockFolders;
      }
      if (config.url.endsWith('/folders') && config.method === 'POST') {
        return { ...config.data, id: 12 };
      }
      if (config.url.match(/\/folders\/\d+$/) && config.method === 'PUT') {
        return { ...mockFolder, ...config.data };
      }
      if (config.url.match(/\/folders\/\d+$/) && config.method === 'DELETE') {
        return;
      }
      if (config.url.includes('/shared-with') && config.method === 'GET') {
        return [{ athlete_id: 'i456', permission: 'READ' }];
      }
      return null;
    });

    client = new IntervalsClient({
      apiKey: 'test-api-key',
      athleteId: 'test-athlete-id',
    });
  });

  it('should list folders', async () => {
    const folders = await client.folders.list();
    expect(folders).toBeDefined();
    expect(folders.length).toBe(2);
    expect(folders[0].name).toBe('Base Building');
  });

  it('should create a folder', async () => {
    const folder = await client.folders.create({ name: 'New Plan', type: 'PLAN' });
    expect(folder).toBeDefined();
    expect(folder.id).toBe(12);
  });

  it('should update a folder', async () => {
    const updated = await client.folders.update(10, { name: 'Updated Plan' });
    expect(updated).toBeDefined();
    expect(updated.name).toBe('Updated Plan');
  });

  it('should delete a folder', async () => {
    await expect(client.folders.delete(10)).resolves.toBeUndefined();
  });

  it('should get shared-with info', async () => {
    const shared = await client.folders.getSharedWith(10);
    expect(shared).toBeDefined();
    expect(shared.length).toBe(1);
    expect(shared[0].athlete_id).toBe('i456');
  });
});
