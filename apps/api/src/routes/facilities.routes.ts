import { Router } from 'express';
import { FacilityModel } from '../models';
import { sendSuccess } from '../utils/response';
import { asyncHandler } from '../utils/response';

const router = Router();

// GET /api/facilities — list active facilities (public for onboarding)
router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const facilities = await FacilityModel.find({ isActive: true })
      .select('name type code district state')
      .sort({ name: 1 })
      .lean();

    sendSuccess(res, facilities);
  })
);

export default router;
