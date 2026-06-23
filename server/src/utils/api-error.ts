import { ERROR_CODES, ERROR_MESSAGES } from '@tolovelist/shared';

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: Record<string, string[]>;

  constructor(statusCode: number, code: string, message?: string, details?: Record<string, string[]>) {
    super(message || ERROR_MESSAGES[code] || 'Unknown error');
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static badRequest(code: string, message?: string, details?: Record<string, string[]>): ApiError {
    return new ApiError(400, code, message, details);
  }

  static unauthorized(message?: string): ApiError {
    return new ApiError(401, ERROR_CODES.UNAUTHORIZED, message);
  }

  static forbidden(message?: string): ApiError {
    return new ApiError(403, ERROR_CODES.FORBIDDEN, message);
  }

  static notFound(message?: string): ApiError {
    return new ApiError(404, ERROR_CODES.NOT_FOUND, message);
  }

  static conflict(code: string, message?: string): ApiError {
    return new ApiError(409, code, message);
  }

  static internal(message?: string): ApiError {
    return new ApiError(500, ERROR_CODES.INTERNAL_ERROR, message);
  }
}
