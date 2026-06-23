import { runRecommendationWorkflow } from './workflows/recommendation.js';

interface ProfileInput {
  id: string;
  name: string;
  answers: Record<string, Array<{ questionId: string; value: number; questionText: string }>>;
}

interface RecommendationInput {
  profiles: ProfileInput[];
  categorySlug: string;
  categoryName: string;
  categoryDescription: string;
  location?: { lat?: number; lng?: number; city?: string };
  groupSize: number;
  completedTitles?: string[];
  dismissedTitles?: string[];
}

interface RecommendationOutput {
  title: string;
  description: string;
  whyMatch: string;
  compatibilityScore: number;
  metadata: Record<string, unknown>;
}

export const recommendationEngine = {
  async generate(input: RecommendationInput): Promise<RecommendationOutput[]> {
    return runRecommendationWorkflow(input);
  },
};
