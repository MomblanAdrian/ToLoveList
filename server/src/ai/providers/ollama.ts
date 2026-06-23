import OpenAI from 'openai';
import type { AIProvider, AIProviderConfig, ChatMessage } from './interface.js';
import { env } from '../../config/env.js';

export class OllamaProvider implements AIProvider {
  readonly name = 'ollama';
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      baseURL: `${env.OLLAMA_BASE_URL}/v1`,
      apiKey: 'ollama',
    });
  }

  async chat(messages: ChatMessage[], config?: AIProviderConfig): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: config?.model || 'qwen3.5:9b',
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      max_tokens: config?.maxTokens || 2048,
      temperature: config?.temperature ?? 0.7,
    });

    return response.choices[0]?.message?.content || '';
  }

  async chatWithTools(
    messages: ChatMessage[],
    _tools: unknown[],
    config?: AIProviderConfig,
  ): Promise<{ content: string; toolCalls?: Array<{ name: string; arguments: Record<string, unknown> }> }> {
    const content = await this.chat(messages, config);
    return { content };
  }
}
