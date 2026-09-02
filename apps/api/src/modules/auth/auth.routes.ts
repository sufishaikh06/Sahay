import { Router } from 'express';
import { sendSuccess } from '../../utils/response';
import { requireAuth } from '../../middleware/auth';

const router = Router();

// GET /api/auth/me — verify auth & return user role
router.get('/me', requireAuth, (req, res) => {
  sendSuccess(res, {
    userId: req.auth?.userId,
    role: req.auth?.role || null,
  });
});

export default router;
