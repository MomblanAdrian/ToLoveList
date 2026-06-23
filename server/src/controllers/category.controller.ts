import type { Request, Response, NextFunction } from 'express';
import { CATEGORIES } from '@tolovelist/shared';
import { prisma } from '../config/database.js';

export const categoryController = {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      res.json({ success: true, data: CATEGORIES });
    } catch (err) {
      next(err);
    }
  },

  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const category = CATEGORIES.find((c) => c.slug === req.params.slug);
      if (!category) {
        res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Category not found' } });
        return;
      }

      const dbCategory = await prisma.category.findUnique({ where: { slug: category.slug } });
      res.json({
        success: true,
        data: { ...category, id: dbCategory?.id },
      });
    } catch (err) {
      next(err);
    }
  },
};
