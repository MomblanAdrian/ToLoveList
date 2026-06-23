import { z } from 'zod';

export const createProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  relationshipType: z.enum(['single', 'couple', 'group']),
  avatarUrl: z.string().url().optional(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  avatarUrl: z.string().url().optional(),
});
