import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AIProvider, AIProviderConfig, ChatMessage } from './interface.js';
import { env } from '../../config/env.js';

export class GeminiProvider implements AIProvider {
  readonly name = 'gemini';
  private client: GoogleGenerativeAI;

  constructor() {
    this.client = new GoogleGenerativeAI(env.GEMINI_API_KEY || '');
  }

  async chat(messages: ChatMessage[], config?: AIProviderConfig): Promise<string> {
    const model = this.client.getGenerativeModel({
      model: config?.model || 'gemini-1.5-flash',
    });

    const systemMessage = messages.find((m) => m.role === 'system');
    const userMessages = messages.filter((m) => m.role !== 'system');

    const history = userMessages.slice(0, -1).map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const lastMessage = userMessages[userMessages.length - 1];

    const chat = model.startChat({
      history,
      systemInstruction: systemMessage ? { role: 'user', parts: [{ text: systemMessage.content }] } : undefined,
    });

    const result = await chat.sendMessage(lastMessage?.content || '');
    return result.response.text();
  }

  async chatWithTools(
    _messages: ChatMessage[],
    _tools: unknown[],
    _config?: AIProviderConfig,
  ): Promise<{ content: string; toolCalls?: Array<{ name: string; arguments: Record<string, unknown> }> }> {
    const content = await this.chat(_messages, _config);
    return { content };
  }
}
