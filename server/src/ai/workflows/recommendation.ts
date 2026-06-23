import { getAIProvider, type ChatMessage } from '../providers/index.js';
import { getCategoryPrompts } from '../prompts/index.js';
import { AVAILABLE_TOOLS, TOOL_HANDLERS } from '../tools/index.js';
import { logger } from '../../utils/logger.js';

interface ProfileInput {
  id: string;
  name: string;
  answers: Record<string, Array<{ questionId: string; value: number; questionText: string }>>;
}

interface GenerateInput {
  profiles: ProfileInput[];
  categorySlug: string;
  categoryName: string;
  categoryDescription: string;
  location?: { lat?: number; lng?: number; city?: string };
  groupSize: number;
  completedTitles?: string[];
  dismissedTitles?: string[];
}

interface GeneratedRecommendation {
  title: string;
  description: string;
  whyMatch: string;
  compatibilityScore: number;
  metadata: Record<string, unknown>;
}

export async function runRecommendationWorkflow(input: GenerateInput): Promise<GeneratedRecommendation[]> {
  const provider = getAIProvider();

  const profilesWithAnswers = input.profiles.map((p) => {
    const categoryAnswers = p.answers[input.categorySlug] || [];

    let locationImportance = 50;
    const locationQuestion = categoryAnswers.find(
      (a) =>
        a.questionText.toLowerCase().includes('location') ||
        a.questionText.toLowerCase().includes('proximity'),
    );
    if (locationQuestion) {
      locationImportance = locationQuestion.value;
    }

    return {
      name: p.name,
      answers: categoryAnswers.map((a) => ({
        questionText: a.questionText,
        value: a.value,
      })),
      locationImportance,
    };
  });

  const locationRadius =
    profilesWithAnswers.length > 0
      ? Math.round(
          profilesWithAnswers.reduce((sum, p) => sum + p.locationImportance, 0) /
            profilesWithAnswers.length,
        )
      : 50;

  const { systemPrompt, userPrompt } = getCategoryPrompts(
    input.categorySlug,
    profilesWithAnswers,
    input.location ? { city: input.location.city, lat: input.location.lat, lng: input.location.lng } : undefined,
    locationRadius,
    input.completedTitles,
    input.dismissedTitles,
  );

  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];

  try {
    const response = await provider.chatWithTools(messages, AVAILABLE_TOOLS, {
      temperature: 0.8,
      maxTokens: 4096,
    });

    if (response.toolCalls && response.toolCalls.length > 0) {
      const toolMessages: ChatMessage[] = [
        ...messages,
        { role: 'assistant', content: response.content },
      ];

      for (const toolCall of response.toolCalls) {
        const handler = TOOL_HANDLERS[toolCall.name];
        if (handler) {
          try {
            const result = await handler(toolCall.arguments);
            toolMessages.push({
              role: 'user',
              content: `Tool ${toolCall.name} returned: ${result}\n\nPlease use this information to improve your recommendations.`,
            });
          } catch (error) {
            logger.error(`Tool ${toolCall.name} failed`, error);
          }
        }
      }

      const finalContent = await provider.chat(toolMessages, {
        temperature: 0.8,
        maxTokens: 4096,
      });
      return parseRecommendations(finalContent);
    }

    return parseRecommendations(response.content);
  } catch (error) {
    logger.error('AI recommendation generation failed', error);
    throw new Error('Failed to generate recommendations. Please try again.');
  }
}

function parseRecommendations(content: string): GeneratedRecommendation[] {
  try {
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No JSON array found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]) as GeneratedRecommendation[];

    return parsed.map((rec, index) => ({
      title: rec.title || `Recommendation ${index + 1}`,
      description: rec.description || '',
      whyMatch: rec.whyMatch || 'Personalized based on your preferences',
      compatibilityScore: Math.min(100, Math.max(0, rec.compatibilityScore || 75)),
      metadata: rec.metadata || {},
    }));
  } catch {
    logger.warn('Failed to parse AI response as JSON, using fallback parsing');

    const recommendations: GeneratedRecommendation[] = [];
    const sections = content.split(/\n(?=\d+\.|\* |# )/);

    for (const section of sections.slice(0, 8)) {
      const lines = section.trim().split('\n').filter(Boolean);
      if (lines.length < 2) continue;

      recommendations.push({
        title: lines[0]!.replace(/^\d+\.\s*|\*\*|#/g, '').trim(),
        description: lines.slice(1, 3).join(' ').replace(/\*\*/g, '').trim(),
        whyMatch: 'Personalized based on your preferences',
        compatibilityScore: 75,
        metadata: {},
      });
    }

    return recommendations;
  }
}
