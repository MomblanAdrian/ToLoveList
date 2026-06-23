import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '../middleware/auth.js';
import { recommendationService } from '../services/recommendation.service.js';

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
      const recommendations = await recommendationService.generateRecommendations(req.body);
      res.json({ success: true, data: recommendations });
    } catch (err) {
      next(err);
    }
  },
};
