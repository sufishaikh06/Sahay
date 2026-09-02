import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { sendError } from '../utils/response';
import { config } from '../config';

/**
 * Global error handler middleware.
 * Returns consistent error shape. Never exposes stack traces in production.
 */
export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  // Log the error
  console.error(`[ERROR] ${err.message}`, config.isProduction ? '' : err.stack);

  if (err instanceof AppError) {
    return sendError(res, err.code, err.message, err.statusCode);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return sendError(res, 'VALIDATION_ERROR', err.message, 422);
  }

  // Mongoose cast error (invalid ObjectId, etc.)
  if (err.name === 'CastError') {
    return sendError(res, 'INVALID_ID', 'Invalid resource identifier', 400);
  }

  // Default: internal server error
  return sendError(
    res,
    'INTERNAL_ERROR',
    config.isProduction ? 'Internal server error' : err.message,
    500
  );
}

/**
 * 404 handler — must be registered after all routes.
 */
export function notFoundHandler(req: Request, res: Response) {
  sendError(res, 'NOT_FOUND', `Route ${req.method} ${req.originalUrl} not found`, 404);
}
