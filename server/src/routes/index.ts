import { Router } from 'express';
import authRoutes from './auth.js';
import profileRoutes from './profiles.js';
import groupRoutes from './groups.js';
import categoryRoutes from './categories.js';
import questionRoutes from './questions.js';
import recommendationRoutes from './recommendations.js';
import debugRoutes from './debug.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/profiles', profileRoutes);
router.use('/groups', groupRoutes);
router.use('/categories', categoryRoutes);
router.use('/questions', questionRoutes);
router.use('/recommendations', recommendationRoutes);
router.use('/debug', debugRoutes);

export default router;
