import OpenAI from 'openai';
import type { AIProvider, AIProviderConfig, ChatMessage } from './interface.js';
import { env } from '../../config/env.js';

export class OpenAIProvider implements AIProvider {
  readonly name = 'openai';
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
    });
  }

  async chat(messages: ChatMessage[], config?: AIProviderConfig): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: config?.model || 'gpt-4o-mini',
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      max_tokens: config?.maxTokens || 2048,
      temperature: config?.temperature ?? 0.7,
    });

    return response.choices[0]?.message?.content || '';
  }

  async chatWithTools(
    messages: ChatMessage[],
    tools: unknown[],
    config?: AIProviderConfig,
  ): Promise<{ content: string; toolCalls?: Array<{ name: string; arguments: Record<string, unknown> }> }> {
    const response = await this.client.chat.completions.create({
      model: config?.model || 'gpt-4o-mini',
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      tools: tools as OpenAI.ChatCompletionTool[],
      max_tokens: config?.maxTokens || 4096,
      temperature: config?.temperature ?? 0.7,
    });

    const message = response.choices[0]?.message;

    if (message?.tool_calls && message.tool_calls.length > 0) {
      return {
        content: message.content || '',
        toolCalls: message.tool_calls.map((tc) => ({
          name: tc.function.name,
          arguments: JSON.parse(tc.function.arguments) as Record<string, unknown>,
        })),
      };
    }

    return { content: message?.content || '' };
  }
}
