import { Router } from 'express';
import { profileController } from '../controllers/profile.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createProfileSchema, updateProfileSchema } from '@tolovelist/shared';

const router = Router();

router.use(authenticate);

router.get('/', profileController.list);
router.get('/:id', profileController.getById);
router.post('/', validate(createProfileSchema), profileController.create);
router.patch('/:id', validate(updateProfileSchema), profileController.update);
router.delete('/:id', profileController.remove);

export default router;
