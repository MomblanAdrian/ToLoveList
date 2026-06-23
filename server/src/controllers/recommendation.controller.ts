import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '../middleware/auth.js';
import { recommendationService } from '../services/recommendation.service.js';
import type { RecommendationStatus } from '@tolovelist/shared';

export const recommendationController = {
  async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { profileId, categorySlug } = req.params;
      const recommendations = await recommendationService.getRecommendations(profileId!, categorySlug);
      res.json({ success: true, data: recommendations });
    } catch (err) {
      next(err);
    }
  },

  async listByGroup(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { groupId, categorySlug } = req.params;
      const recommendations = await recommendationService.getGroupRecommendations(groupId!, categorySlug);
      res.json({ success: true, data: recommendations });
    } catch (err) {
      next(err);
    }
  },

  async generate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const recommendations = await recommendationService.generateRecommendations(req.body, req.userId!);
      res.json({ success: true, data: recommendations });
    } catch (err) {
      next(err);
    }
  },

  async updateStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body as { status: RecommendationStatus };
      await recommendationService.updateStatus(id!, req.userId!, status);
      res.json({ success: true, data: { id, status } });
    } catch (err) {
      next(err);
    }
  },
};
