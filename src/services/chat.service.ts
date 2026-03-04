import type { IHttpClient } from '../core/http-client.interface.js';
import type { Chat, Message, NewMessage, SendResponse } from '../types/index.js';

/**
 * Service for chats and messages
 */
export class ChatService {
  constructor(
    private httpClient: IHttpClient,
  ) {}

  /** List all chats for the authenticated user */
  async listChats(): Promise<Chat[]> {
    return this.httpClient.request<Chat[]>({ method: 'GET', url: `/chats` });
  }

  /** List messages in a chat */
  async listMessages(chatId: number, options?: { sinceId?: number; limit?: number }): Promise<Message[]> {
    return this.httpClient.request<Message[]>({ method: 'GET', url: `/chats/${chatId}/messages`, params: options as Record<string, unknown> });
  }

  /** Send a message */
  async sendMessage(data: NewMessage): Promise<SendResponse> {
    return this.httpClient.request<SendResponse>({ method: 'POST', url: `/chats/send-message`, data });
  }

  /** Mark a message as seen (update last seen message ID) */
  async markSeen(chatId: number, messageId: number): Promise<void> {
    await this.httpClient.request<void>({ method: 'PUT', url: `/chats/${chatId}/messages/${messageId}/seen` });
  }
}
