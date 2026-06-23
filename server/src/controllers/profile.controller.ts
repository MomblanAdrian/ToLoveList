import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '../middleware/auth.js';
import { profileService } from '../services/profile.service.js';

export const profileController = {
  async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const profiles = await profileService.getUserProfiles(req.userId!);
      res.json({ success: true, data: profiles });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const profile = await profileService.getProfile(req.params.id!, req.userId!);
      res.json({ success: true, data: profile });
    } catch (err) {
      next(err);
    }
  },

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const profile = await profileService.createProfile(req.userId!, req.body);
      res.status(201).json({ success: true, data: profile });
    } catch (err) {
      next(err);
    }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const profile = await profileService.updateProfile(req.params.id!, req.userId!, req.body);
      res.json({ success: true, data: profile });
    } catch (err) {
      next(err);
    }
  },

  async remove(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await profileService.deleteProfile(req.params.id!, req.userId!);
      res.json({ success: true, data: { message: 'Profile deleted' } });
    } catch (err) {
      next(err);
    }
  },
};
