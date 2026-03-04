import { describe, it, expect, beforeEach, vi } from 'vitest';
import { IntervalsClient } from '../src/client.js';
import { setupAxiosMock } from './helpers/mock-axios.js';

vi.mock('axios');
import axios from 'axios';
const mockedAxios = axios as any;

const mockChat = {
  id: 100,
  name: 'Coach Chat',
  type: 'DIRECT',
  members: [{ athlete_id: 'i123', role: 'OWNER' }],
};

const mockMessage = {
  id: 500,
  chat_id: 100,
  from_athlete_id: 'i123',
  content: 'Great workout!',
  type: 'TEXT',
  created: '2024-01-15T10:00:00Z',
};

describe('IntervalsClient - Chats', () => {
  let client: IntervalsClient;

  beforeEach(() => {
    setupAxiosMock(mockedAxios, async (config: any) => {
      if (config.url === '/chats' && config.method === 'GET') {
        return [mockChat];
      }
      if (config.url.match(/\/chats\/\d+\/messages$/) && config.method === 'GET') {
        return [mockMessage];
      }
      if (config.url === '/chats/send-message' && config.method === 'POST') {
        return { id: 501, chat_id: 100, ...config.data, created: '2024-01-15T11:00:00Z' };
      }
      if (config.url.match(/\/messages\/\d+\/seen$/) && config.method === 'PUT') {
        return;
      }
      return null;
    });

    client = new IntervalsClient({
      apiKey: 'test-api-key',
      athleteId: 'test-athlete-id',
    });
  });

  it('should list chats', async () => {
    const chats = await client.chats.listChats();
    expect(chats).toBeDefined();
    expect(chats.length).toBe(1);
    expect(chats[0].id).toBe(100);
    expect(chats[0].name).toBe('Coach Chat');
  });

  it('should list messages in a chat', async () => {
    const messages = await client.chats.listMessages(100);
    expect(messages).toBeDefined();
    expect(messages.length).toBe(1);
    expect(messages[0].content).toBe('Great workout!');
  });

  it('should send a message', async () => {
    const response = await client.chats.sendMessage({
      to_athlete_id: 'i456',
      content: 'Hello!',
      type: 'TEXT',
    });
    expect(response).toBeDefined();
    expect(response.id).toBeDefined();
  });

  it('should mark a message as seen', async () => {
    await expect(client.chats.markSeen(100, 500)).resolves.toBeUndefined();
  });
});
