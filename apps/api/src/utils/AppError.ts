/**
 * Application error class for consistent API error handling.
 * Do not expose stack traces to production clients.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR',
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);
  }

  static badRequest(message: string = 'Bad request', code: string = 'BAD_REQUEST') {
    return new AppError(message, 400, code);
  }

  static unauthorized(message: string = 'Unauthorized', code: string = 'UNAUTHORIZED') {
    return new AppError(message, 401, code);
  }

  static forbidden(message: string = 'Forbidden', code: string = 'FORBIDDEN') {
    return new AppError(message, 403, code);
  }

  static notFound(message: string = 'Not found', code: string = 'NOT_FOUND') {
    return new AppError(message, 404, code);
  }

  static validation(message: string = 'Validation error', code: string = 'VALIDATION_ERROR') {
    return new AppError(message, 422, code);
  }

  static conflict(message: string = 'Conflict', code: string = 'CONFLICT') {
    return new AppError(message, 409, code);
  }
}
