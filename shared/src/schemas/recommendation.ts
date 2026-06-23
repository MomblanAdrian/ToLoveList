import { z } from 'zod';

export const generateRecommendationSchema = z.object({
  categorySlug: z.enum(['food', 'leisure', 'travel', 'tv-shows', 'video-games', 'books']),
  profileIds: z.array(z.string().uuid()).min(1, 'At least one profile is required').max(5),
  groupId: z.string().uuid().optional(),
  location: z
    .object({
      lat: z.number().min(-90).max(90).optional(),
      lng: z.number().min(-180).max(180).optional(),
      city: z.string().optional(),
    })
    .optional(),
});

export const updateRecommendationStatusSchema = z.object({
  status: z.enum(['completed', 'dismissed']),
});
