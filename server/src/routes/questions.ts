import { Router } from 'express';
import { questionController } from '../controllers/question.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { submitAnswerSchema } from '@tolovelist/shared';

const router = Router();

router.use(authenticate);

router.get('/categories/:categorySlug', questionController.getQuestions);
router.get('/progress/:profileId', questionController.getAllCategoriesProgress);
router.get('/progress/:profileId/:categorySlug', questionController.getCategoryProgress);
router.get('/answers/:profileId', questionController.getProfileAnswers);
router.post('/answers/:profileId', validate(submitAnswerSchema), questionController.submitAnswer);

export default router;
