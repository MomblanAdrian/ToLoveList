import { z } from 'zod';

export const createGroupSchema = z.object({
  name: z.string().min(1, 'Group name is required').max(100),
  profileIds: z.array(z.string().uuid()).min(2, 'At least 2 profiles required').max(5, 'Maximum 5 profiles'),
});

export const inviteToGroupSchema = z.object({
  profileId: z.string().uuid('Invalid profile ID'),
});
