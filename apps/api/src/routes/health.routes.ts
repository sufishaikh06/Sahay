import { Router } from 'express';
import { sendSuccess } from '../utils/response';

const router = Router();

/**
 * GET /api/health
 * Public health check endpoint.
 */
router.get('/health', (_req, res) => {
  sendSuccess(res, {
    service: 'sih-26133-api',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

export default router;
