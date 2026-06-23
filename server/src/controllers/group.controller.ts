import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '../middleware/auth.js';
import { groupService } from '../services/group.service.js';

export const groupController = {
  async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const groups = await groupService.getUserGroups(req.userId!);
      res.json({ success: true, data: groups });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const group = await groupService.getGroup(req.params.id!, req.userId!);
      res.json({ success: true, data: group });
    } catch (err) {
      next(err);
    }
  },

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const group = await groupService.createGroup(req.userId!, req.body);
      res.status(201).json({ success: true, data: group });
    } catch (err) {
      next(err);
    }
  },

  async addProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await groupService.addProfileToGroup(req.params.id!, req.userId!, req.body.profileId);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  async removeProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await groupService.removeProfileFromGroup(req.params.id!, req.userId!, req.params.profileId!);
      res.json({ success: true, data: { message: 'Profile removed from group' } });
    } catch (err) {
      next(err);
    }
  },
};
