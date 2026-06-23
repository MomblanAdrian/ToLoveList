export interface AIProviderConfig {
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIProvider {
  readonly name: string;
  chat(messages: ChatMessage[], config?: AIProviderConfig): Promise<string>;
  chatWithTools(messages: ChatMessage[], tools: unknown[], config?: AIProviderConfig): Promise<{
    content: string;
    toolCalls?: Array<{ name: string; arguments: Record<string, unknown> }>;
  }>;
}
