import { Router, Request, Response } from 'express';
import { UserModel, FacilityModel } from '../models';
import { sendSuccess, sendError, asyncHandler } from '../utils/response';
import { requireAuth } from '../middleware/auth';
import { AppError } from '../utils/AppError';

const router = Router();

const REQUESTABLE_ROLES = ['doctor', 'nurse', 'receptionist', 'pharmacist', 'labStaff'];

// POST /api/onboarding — submit role request after Clerk signup
router.post(
  '/',
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { facilityId, requestedRole } = req.body;
    const clerkId = req.auth!.userId;

    // Validate requestedRole
    if (!requestedRole || !REQUESTABLE_ROLES.includes(requestedRole)) {
      throw AppError.validation('Invalid requested role. Must be one of: ' + REQUESTABLE_ROLES.join(', '));
    }

    // Validate facilityId
    if (!facilityId) {
      throw AppError.validation('Facility is required');
    }

    const facility = await FacilityModel.findById(facilityId);
    if (!facility || !facility.isActive) {
      throw AppError.validation('Invalid or inactive facility');
    }

    // Check if user already has a profile
    const existing = await UserModel.findOne({ clerkId });
    if (existing) {
      throw AppError.conflict('Onboarding already completed. Contact your administrator for role changes.');
    }

    // Create user profile with PENDING status
    const user = await UserModel.create({
      clerkId,
      email: req.body.email || '',
      firstName: req.body.firstName || null,
      lastName: req.body.lastName || null,
      facilityId: facility._id,
      requestedRole,
      approvedRole: null, // NEVER set by the user
      status: 'pending',
    });

    sendSuccess(res, {
      id: user._id,
      status: user.status,
      requestedRole: user.requestedRole,
      facilityId: user.facilityId,
    }, 201);
  })
);

export default router;
