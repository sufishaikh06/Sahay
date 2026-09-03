// ============================================
// User & Role Types
// ============================================

export type UserRole =
  | 'admin'
  | 'doctor'
  | 'nurse'
  | 'receptionist'
  | 'pharmacist'
  | 'labStaff';

/** Roles that a normal user can self-request during onboarding */
export type RequestableRole = Exclude<UserRole, 'admin'>;

/** Account status in the role request/approval workflow */
export type AccountStatus = 'pending' | 'active' | 'rejected';

export interface User {
  id: string;
  clerkId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  facilityId: string | null;
  requestedRole: RequestableRole | null;
  approvedRole: UserRole | null;
  status: AccountStatus;
  approvedBy: string | null;
  approvedAt: string | null;
  rejectedBy: string | null;
  rejectedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Facility {
  id: string;
  name: string;
  type: 'primary_health_center' | 'community_health_center' | 'district_hospital' | 'sub_center';
  code: string;
  district: string;
  state: string;
  address?: string;
  contactNumber?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// API Response Types
// ============================================

export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    [key: string]: any;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

// ============================================
// Onboarding Types
// ============================================

export interface OnboardingPayload {
  facilityId: string;
  requestedRole: RequestableRole;
}

export interface UserProfile {
  id: string;
  clerkId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  facilityId: string | null;
  facilityName: string | null;
  requestedRole: RequestableRole | null;
  approvedRole: UserRole | null;
  status: AccountStatus;
}

// ============================================
// Future Domain Entity Placeholders (S1/S2/S3)
// ============================================

export interface PatientBase {
  id: string;
  uhid: string;
  fullName: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  age?: number;
  phone?: string;
}

export interface AppointmentBase {
  id: string;
  patientId: string;
  doctorId: string;
  facilityId: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  scheduledAt: string;
}

export interface QueueEntryBase {
  id: string;
  patientId: string;
  facilityId: string;
  tokenNumber: number;
  status: 'waiting' | 'called' | 'in_consultation' | 'completed' | 'skipped';
  priority: 'routine' | 'urgent' | 'emergency';
}
