import { Router } from 'express';
import { groupController } from '../controllers/group.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createGroupSchema, inviteToGroupSchema } from '@tolovelist/shared';

const router = Router();

router.use(authenticate);

router.get('/', groupController.list);
router.get('/:id', groupController.getById);
router.post('/', validate(createGroupSchema), groupController.create);
router.post('/:id/members', validate(inviteToGroupSchema), groupController.addProfile);
router.delete('/:id/members/:profileId', groupController.removeProfile);

export default router;
