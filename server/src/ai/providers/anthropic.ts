import Anthropic from '@anthropic-ai/sdk';
import type { AIProvider, AIProviderConfig, ChatMessage } from './interface.js';
import { env } from '../../config/env.js';

function toAnthropicTools(
  tools: unknown[],
): Array<Anthropic.Tool> {
  return tools.map((t) => {
    const def = t as { type: string; function: { name: string; description?: string; parameters: Record<string, unknown> } };
    return {
      name: def.function.name,
      description: def.function.description,
      input_schema: def.function.parameters as Anthropic.Tool.InputSchema,
    };
  });
}

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
      model: config?.model || 'claude-sonnet-4-5-20250929',
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
    messages: ChatMessage[],
    tools: unknown[],
    config?: AIProviderConfig,
  ): Promise<{ content: string; toolCalls?: Array<{ name: string; arguments: Record<string, unknown> }> }> {
    const systemMessage = messages.find((m) => m.role === 'system');
    const userMessages = messages.filter((m) => m.role !== 'system');

    const response = await this.client.messages.create({
      model: config?.model || 'claude-sonnet-4-5-20250929',
      system: systemMessage?.content,
      messages: userMessages.map((m) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      })),
      tools: tools.length > 0 ? toAnthropicTools(tools) : undefined,
      max_tokens: config?.maxTokens || 4096,
      temperature: config?.temperature ?? 0.8,
    });

    const textParts: string[] = [];
    const toolCalls: Array<{ name: string; arguments: Record<string, unknown> }> = [];

    for (const block of response.content) {
      if (block.type === 'text') {
        textParts.push(block.text);
      } else if (block.type === 'tool_use') {
        toolCalls.push({
          name: block.name,
          arguments: block.input as Record<string, unknown>,
        });
      }
    }

    return {
      content: textParts.join('\n'),
      toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
    };
  }
}
