import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '../middleware/auth.js';
import { getCategoryPrompts } from '../ai/prompts/index.js';
import { getAIProvider } from '../ai/providers/index.js';
import { prisma } from '../config/database.js';
import { CATEGORIES } from '@tolovelist/shared';

export const debugController = {
  async getPrompts(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const categorySlug = req.params.categorySlug || '';
      const profileId = req.query.profileId as string | undefined;

      const category = CATEGORIES.find((c) => c.slug === categorySlug);
      if (!category) {
        res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Category not found' } });
        return;
      }

      let profiles: Array<{ name: string; answers: Array<{ questionText: string; value: number }> }> = [
        { name: 'Sample User', answers: [{ questionText: 'How much do you enjoy this?', value: 75 }] },
      ];

      if (profileId) {
        const questionService = await import('../services/question.service.js').then((m) => m.questionService);
        const answersByCategory = await questionService.getProfileAnswersByCategory(profileId);
        const catAnswers = answersByCategory[categorySlug];
        if (catAnswers?.answers.length) {
          const profile = await prisma.profile.findUnique({ where: { id: profileId } });
          profiles = [{
            name: profile?.name || 'User',
            answers: catAnswers.answers.map((a) => ({ questionText: a.questionText, value: a.value })),
          }];
        }
      }

      const { systemPrompt, userPrompt } = getCategoryPrompts(categorySlug, profiles);

      res.json({
        success: true,
        data: {
          category: category.name,
          systemPrompt,
          userPrompt,
          profiles,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  async runAiTest(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { systemPrompt, userPrompt } = req.body as { systemPrompt: string; userPrompt: string };

      if (!systemPrompt || !userPrompt) {
        res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'systemPrompt and userPrompt are required' } });
        return;
      }

      const provider = getAIProvider();
      const response = await provider.chat([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ], { temperature: 0.8, maxTokens: 4096 });

      res.json({ success: true, data: { response } });
    } catch (err) {
      next(err);
    }
  },
};
