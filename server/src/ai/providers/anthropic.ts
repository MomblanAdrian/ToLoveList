import Anthropic from '@anthropic-ai/sdk';
import type { AIProvider, AIProviderConfig, ChatMessage } from './interface.js';
import { env } from '../../config/env.js';

export class AnthropicProvider implements AIProvider {
  readonly name = 'anthropic';
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({
      apiKey: env.ANTHROPIC_API_KEY,
    });
  }

  async chat(messages: ChatMessage[], config?: AIProviderConfig): Promise<string> {
    const systemMessage = messages.find((m) => m.role === 'system');
    const userMessages = messages.filter((m) => m.role !== 'system');

    const response = await this.client.messages.create({
      model: config?.model || 'claude-3-haiku-20240307',
      system: systemMessage?.content,
      messages: userMessages.map((m) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      })),
      max_tokens: config?.maxTokens || 2048,
      temperature: config?.temperature ?? 0.7,
    });

    return response.content
      .filter((block) => block.type === 'text')
      .map((block) => (block as Anthropic.TextBlock).text)
      .join('\n');
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
