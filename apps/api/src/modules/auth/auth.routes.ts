import { Router, Request, Response } from 'express';
import { sendSuccess, asyncHandler } from '../../utils/response';
import { requireAuth } from '../../middleware/auth';
import { UserModel, FacilityModel, IUser } from '../../models';

const router = Router();

// GET /api/auth/me — get full user profile from database
router.get(
  '/me',
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const clerkId = req.auth!.userId;

    const user = await UserModel.findOne({ clerkId }).lean() as unknown as IUser;

    if (!user) {
      // User has Clerk account but hasn't completed onboarding
      sendSuccess(res, {
        clerkId,
        status: 'new',
        onboardingRequired: true,
      });
      return;
    }

    // Fetch facility name if associated
    let facilityName: string | null = null;
    if (user.facilityId) {
      const facility = await FacilityModel.findById(user.facilityId).select('name').lean() as any;
      facilityName = facility?.name || null;
    }

    sendSuccess(res, {
      id: user._id,
      clerkId: user.clerkId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      facilityId: user.facilityId,
      facilityName,
      requestedRole: user.requestedRole,
      approvedRole: user.approvedRole,
      status: user.status,
    });
  })
);

export default router;
