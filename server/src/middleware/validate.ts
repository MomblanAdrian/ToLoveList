import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';
import { ApiError } from '../utils/api-error.js';
import { ERROR_CODES } from '@tolovelist/shared';

export function validate(schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const details: Record<string, string[]> = {};
      for (const [key, messages] of Object.entries(fieldErrors)) {
        if (messages) details[key] = messages;
      }
      throw ApiError.badRequest(ERROR_CODES.VALIDATION_ERROR, 'Validation failed', details);
    }
    req[source] = result.data;
    next();
  };
}
