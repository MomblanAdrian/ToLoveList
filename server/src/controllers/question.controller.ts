import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '../middleware/auth.js';
import { questionService } from '../services/question.service.js';

export const questionController = {
  async getQuestions(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const questions = await questionService.getQuestions(req.params.categorySlug!);
      res.json({ success: true, data: questions });
    } catch (err) {
      next(err);
    }
  },

  async getCategoryProgress(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const progress = await questionService.getCategoryProgress(req.params.profileId!, req.params.categorySlug!);
      res.json({ success: true, data: progress });
    } catch (err) {
      next(err);
    }
  },

  async submitAnswer(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const answer = await questionService.submitAnswer(req.params.profileId!, req.body.questionId, req.body.value);
      res.json({ success: true, data: answer });
    } catch (err) {
      next(err);
    }
  },

  async getProfileAnswers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const answers = await questionService.getProfileAnswers(
        req.params.profileId!,
        req.query.categorySlug as string | undefined,
      );
      res.json({ success: true, data: answers });
    } catch (err) {
      next(err);
    }
  },
};
