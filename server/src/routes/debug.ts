import { Router } from 'express';
import { debugController } from '../controllers/debug.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/prompt/:categorySlug', debugController.getPrompts);
router.post('/ai-test', debugController.runAiTest);

export default router;
