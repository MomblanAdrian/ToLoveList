import type { AIProvider } from './interface.js';
import { OpenAIProvider } from './openai.js';
import { AnthropicProvider } from './anthropic.js';
import { GeminiProvider } from './gemini.js';
import { OpenRouterProvider } from './openrouter.js';
import { OllamaProvider } from './ollama.js';
import { env } from '../../config/env.js';

export type { AIProvider, AIProviderConfig, ChatMessage } from './interface.js';

const providers: Record<string, AIProvider> = {
  openai: new OpenAIProvider(),
  anthropic: new AnthropicProvider(),
  gemini: new GeminiProvider(),
  openrouter: new OpenRouterProvider(),
  ollama: new OllamaProvider(),
};

export function getAIProvider(name?: string): AIProvider {
  const providerName = name || env.AI_PROVIDER;
  const provider = providers[providerName];
  if (!provider) {
    throw new Error(`AI provider "${providerName}" not found. Available: ${Object.keys(providers).join(', ')}`);
  }
  return provider;
}

export function getAvailableProviders(): string[] {
  return Object.keys(providers);
}
