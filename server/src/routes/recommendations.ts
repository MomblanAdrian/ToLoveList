import { Router } from 'express';
import { recommendationController } from '../controllers/recommendation.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { generateRecommendationSchema, updateRecommendationStatusSchema } from '@tolovelist/shared';
import { recommendationLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.use(authenticate);

router.get('/profile/:profileId/:categorySlug?', recommendationController.list);
router.get('/group/:groupId/:categorySlug?', recommendationController.listByGroup);
router.post('/generate', recommendationLimiter, validate(generateRecommendationSchema), recommendationController.generate);
router.patch('/:id/status', validate(updateRecommendationStatusSchema), recommendationController.updateStatus);

export default router;
