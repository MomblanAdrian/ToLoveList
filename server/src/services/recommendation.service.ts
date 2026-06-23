import { prisma } from '../config/database.js';
import type { Prisma } from '@prisma/client';
import { recommendationRepository } from '../repositories/recommendation.repository.js';
import { recommendationEngine } from '../ai/recommendation-engine.js';
import { ApiError } from '../utils/api-error.js';
import type { GenerateRecommendationRequest, RecommendationStatus } from '@tolovelist/shared';
import { questionService } from './question.service.js';

type RecWithCategory = Prisma.RecommendationGetPayload<{ include: { category: true } }>;

function flattenCategory(rec: RecWithCategory) {
  const { category, ...rest } = rec;
  return { ...rest, categorySlug: category.slug };
}

export const recommendationService = {
  async getRecommendations(profileId: string, categorySlug?: string) {
    const recs = await recommendationRepository.findByProfileId(profileId, categorySlug);
    return recs.map(flattenCategory);
  },

  async getGroupRecommendations(groupId: string, categorySlug?: string) {
    const recs = await recommendationRepository.findByGroupId(groupId, categorySlug);
    return recs.map(flattenCategory);
  },

  async updateStatus(id: string, userId: string, status: RecommendationStatus) {
    const rec = await prisma.recommendation.findUnique({ where: { id }, include: { profile: true } });
    if (!rec) {
      throw ApiError.notFound('Recommendation not found');
    }
    if (rec.profile.userId !== userId) {
      throw ApiError.forbidden('Not your recommendation');
    }
    return recommendationRepository.updateStatus(id, status);
  },

  async generateRecommendations(data: GenerateRecommendationRequest, userId: string) {
    const category = await prisma.category.findUnique({ where: { slug: data.categorySlug } });
    if (!category) {
      throw ApiError.notFound('Category not found');
    }

    const profileIds = data.profileIds;

    const profilesData: Array<{
      id: string;
      name: string;
      answers: Record<string, Array<{ questionId: string; value: number; questionText: string }>>;
    }> = [];

    for (const pid of profileIds) {
      const profile = await prisma.profile.findUnique({ where: { id: pid } });
      if (!profile) {
        throw ApiError.notFound(`Profile ${pid} not found`);
      }

      const answersByCategory = await questionService.getProfileAnswersByCategory(pid);

      const answers: Record<string, Array<{ questionId: string; value: number; questionText: string }>> = {};
      for (const [slug, d] of Object.entries(answersByCategory)) {
        answers[slug] = d.answers;
      }

      profilesData.push({
        id: profile.id,
        name: profile.name,
        answers,
      });
    }

    const completedRecs = await recommendationRepository.findByProfileIdWithStatus(
      profileIds[0]!, data.categorySlug, 'completed',
    );
    const dismissedRecs = await recommendationRepository.findByProfileIdWithStatus(
      profileIds[0]!, data.categorySlug, 'dismissed',
    );

    const recommendations = await recommendationEngine.generate({
      profiles: profilesData,
      categorySlug: data.categorySlug,
      categoryName: category.name,
      categoryDescription: category.description,
      location: data.location,
      groupSize: profileIds.length,
      completedTitles: completedRecs.map((r) => r.title),
      dismissedTitles: dismissedRecs.map((r) => r.title),
    });

    await recommendationRepository.deleteByProfileAndCategory(profileIds[0]!, category.id);

    const saved = await Promise.all(
      recommendations.map((rec) =>
        recommendationRepository.create({
          categoryId: category.id,
          profileId: profileIds[0]!,
          groupId: data.groupId,
          title: rec.title,
          description: rec.description,
          whyMatch: rec.whyMatch,
          compatibilityScore: rec.compatibilityScore,
          metadata: rec.metadata as Prisma.JsonValue,
          source: 'ai',
        }),
      ),
    );

    await prisma.recommendationHistory.create({
      data: {
        userId,
        action: 'generate',
        metadata: {
          categorySlug: data.categorySlug,
          profileCount: profileIds.length,
          recommendationCount: recommendations.length,
        },
      },
    });

    return saved.map(flattenCategory);
  },
};
