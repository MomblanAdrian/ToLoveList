import { z } from 'zod';

export const submitAnswerSchema = z.object({
  questionId: z.string().uuid(),
  value: z.number().int().min(0).max(100),
});

export const submitAnswersBatchSchema = z.object({
  answers: z.array(submitAnswerSchema).min(1).max(50),
});
