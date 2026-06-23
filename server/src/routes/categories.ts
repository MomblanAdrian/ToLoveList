import { Router } from 'express';
import { categoryController } from '../controllers/category.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', categoryController.list);
router.get('/:slug', categoryController.getBySlug);

export default router;
