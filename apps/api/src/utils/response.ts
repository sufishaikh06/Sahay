import { Request, Response, NextFunction } from 'express';

/**
 * Consistent API response format.
 */
export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  meta?: Record<string, any>;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Send a successful response.
 */
export function sendSuccess<T>(res: Response, data: T, statusCode: number = 200, meta?: Record<string, any>) {
  const response: ApiSuccessResponse<T> = { success: true, data };
  if (meta) response.meta = meta;
  return res.status(statusCode).json(response);
}

/**
 * Send an error response.
 */
export function sendError(res: Response, code: string, message: string, statusCode: number = 500) {
  const response: ApiErrorResponse = {
    success: false,
    error: { code, message },
  };
  return res.status(statusCode).json(response);
}

/**
 * Wrap an async route handler to catch errors.
 */
export function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
