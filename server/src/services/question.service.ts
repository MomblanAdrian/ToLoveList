import { prisma } from '../config/database.js';
import { questionRepository } from '../repositories/question.repository.js';
import { profileRepository } from '../repositories/profile.repository.js';
import { ApiError } from '../utils/api-error.js';
import { CATEGORIES } from '@tolovelist/shared';

export const questionService = {
  async getCategoriesWithProgress(profileId: string) {
    const profile = await profileRepository.findById(profileId);
    if (!profile) {
      throw ApiError.notFound('Profile not found');
    }

    const results = await Promise.all(
      CATEGORIES.map(async (cat) => {
        const dbCategory = await prisma.category.findUnique({ where: { slug: cat.slug } });
        if (!dbCategory) return null;
        const progress = await questionRepository.getProgress(profileId, dbCategory.id);
        return {
          ...cat,
          id: dbCategory.id,
          questionCount: progress.totalQuestions,
          answeredCount: progress.answeredQuestions,
        };
      }),
    );

    return results.filter(Boolean);
  },

  async getQuestions(categorySlug: string) {
    const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
    if (!category) {
      throw ApiError.notFound('Category not found');
    }
    return questionRepository.findByCategory(category.id);
  },

  async submitAnswer(profileId: string, questionId: string, value: number) {
    const profile = await profileRepository.findById(profileId);
    if (!profile) {
      throw ApiError.notFound('Profile not found');
    }

    const question = await questionRepository.findById(questionId);
    if (!question) {
      throw ApiError.notFound('Question not found');
    }

    return questionRepository.upsertAnswer(profileId, questionId, value);
  },

  async getCategoryProgress(profileId: string, categorySlug: string) {
    const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
    if (!category) {
      throw ApiError.notFound('Category not found');
    }
    return questionRepository.getProgress(profileId, category.id);
  },

  async getProfileAnswers(profileId: string, categorySlug?: string) {
    if (categorySlug) {
      const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
      if (!category) {
        throw ApiError.notFound('Category not found');
      }
      return questionRepository.getAnswersByProfileAndCategory(profileId, category.id);
    }
    return questionRepository.getAnswersByProfile(profileId);
  },

  async getProfileAnswersByCategory(profileId: string) {
    const results: Record<string, { answers: Array<{ questionId: string; value: number; questionText: string }>; progress: { totalQuestions: number; answeredQuestions: number; isComplete: boolean } }> = {};

    for (const cat of CATEGORIES) {
      const dbCategory = await prisma.category.findUnique({ where: { slug: cat.slug } });
      if (!dbCategory) continue;

      const answers = await questionRepository.getAnswersByProfileAndCategory(profileId, dbCategory.id);
      const progress = await questionRepository.getProgress(profileId, dbCategory.id);

      results[cat.slug] = {
        answers: answers.map((a) => ({
          questionId: a.questionId,
          value: a.value,
          questionText: a.question.text,
        })),
        progress,
      };
    }

    return results;
  },
};
