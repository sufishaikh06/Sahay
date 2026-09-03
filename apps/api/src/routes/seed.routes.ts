import { Router } from 'express';
import { FacilityModel } from '../models';
import { sendSuccess, asyncHandler } from '../utils/response';

const router = Router();

const SEED_FACILITIES = [
  { name: 'District Hospital Pune', type: 'district_hospital', code: 'DHP-01', district: 'Pune', state: 'Maharashtra' },
  { name: 'CHC Baramati', type: 'community_health_center', code: 'CHC-BAR-01', district: 'Pune', state: 'Maharashtra' },
  { name: 'PHC Khed', type: 'primary_health_center', code: 'PHC-KHD-01', district: 'Pune', state: 'Maharashtra' },
  { name: 'Sub Center Ambegaon', type: 'sub_center', code: 'SC-AMB-01', district: 'Pune', state: 'Maharashtra' },
  { name: 'District Hospital Nagpur', type: 'district_hospital', code: 'DHN-01', district: 'Nagpur', state: 'Maharashtra' },
];

// POST /api/seed/facilities — seed demo facilities (dev only)
router.post(
  '/facilities',
  asyncHandler(async (_req, res) => {
    const existing = await FacilityModel.countDocuments();
    if (existing > 0) {
      sendSuccess(res, { message: 'Facilities already seeded', count: existing });
      return;
    }

    const created = await FacilityModel.insertMany(SEED_FACILITIES);
    sendSuccess(res, { message: 'Facilities seeded', count: created.length }, 201);
  })
);

export default router;
