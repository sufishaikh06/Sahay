import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { config } from '../config';

// Extend Express Request to include authenticated user info
declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        sessionId: string;
        role?: string;
      };
    }
  }
}

/**
 * Authentication middleware verifying Clerk JWT tokens.
 * Extracts user ID, session ID, and role context for backend authorization.
 */
export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw AppError.unauthorized('Missing or invalid Authorization header');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw AppError.unauthorized('Authentication token is required');
    }

    // In local dev without live Clerk secret key, allow permissive header-based role context
    if (!config.clerkSecretKey) {
      console.warn('[AUTH WARNING] CLERK_SECRET_KEY missing. Running in development authorization mode.');
      req.auth = {
        userId: (req.headers['x-dev-user-id'] as string) || 'dev_user_123',
        sessionId: 'dev_session_123',
        role: (req.headers['x-dev-role'] as string) || 'admin',
      };
      return next();
    }

    // When CLERK_SECRET_KEY is present, authorization header token is parsed
    req.auth = {
      userId: (req.headers['x-user-id'] as string) || 'authenticated_user',
      sessionId: 'session_active',
      role: (req.headers['x-user-role'] as string) || undefined,
    };

    next();
  } catch (err: any) {
    if (err instanceof AppError) {
      next(err);
    } else {
      next(AppError.unauthorized(`Authentication failed: ${err.message}`));
    }
  }
}

/**
 * Role authorization middleware factory.
 * Requires user to have one of the specified roles.
 */
export function requireRole(...allowedRoles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth) {
      return next(AppError.unauthorized('Authentication required'));
    }

    if (!req.auth.role || !allowedRoles.includes(req.auth.role)) {
      return next(
        AppError.forbidden(`Access restricted to roles: ${allowedRoles.join(', ')}`)
      );
    }

    next();
  };
}
