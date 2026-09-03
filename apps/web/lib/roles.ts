import type { UserRole } from '@/components/providers/UserProvider';

/**
 * Role-based access configuration.
 * Future role developers will use this to define permissions.
 *
 * IMPORTANT: Authorization must ALWAYS use approvedRole, NEVER requestedRole.
 */
export interface RoleConfig {
  role: UserRole;
  label: string;
  defaultRoute: string;
  permissions: string[];
}

/** Role configurations — to be extended by role developers */
export const roleConfigs: Record<UserRole, RoleConfig> = {
  admin: {
    role: 'admin',
    label: 'Hospital Admin',
    defaultRoute: '/dashboard',
    permissions: ['manage:facility', 'manage:users', 'view:analytics', 'manage:approvals'],
  },
  doctor: {
    role: 'doctor',
    label: 'Doctor',
    defaultRoute: '/dashboard',
    permissions: ['view:patients', 'manage:consultations', 'manage:prescriptions'],
  },
  nurse: {
    role: 'nurse',
    label: 'Nurse',
    defaultRoute: '/dashboard',
    permissions: ['view:patients', 'manage:triage', 'manage:vitals'],
  },
  receptionist: {
    role: 'receptionist',
    label: 'Receptionist',
    defaultRoute: '/dashboard',
    permissions: ['manage:registrations', 'manage:appointments', 'manage:queue'],
  },
  pharmacist: {
    role: 'pharmacist',
    label: 'Pharmacist',
    defaultRoute: '/dashboard',
    permissions: ['view:prescriptions', 'manage:pharmacy'],
  },
  labStaff: {
    role: 'labStaff',
    label: 'Lab Staff',
    defaultRoute: '/dashboard',
    permissions: ['view:diagnosticOrders', 'manage:diagnosticReports'],
  },
};

/**
 * Check if the user's APPROVED role has a specific permission.
 * Never pass requestedRole here.
 */
export function hasPermission(approvedRole: UserRole | null, permission: string): boolean {
  if (!approvedRole) return false;
  return roleConfigs[approvedRole]?.permissions.includes(permission) ?? false;
}

/**
 * Get the default route for the user's APPROVED role.
 */
export function getDefaultRoute(approvedRole: UserRole | null): string {
  if (!approvedRole) return '/dashboard';
  return roleConfigs[approvedRole]?.defaultRoute ?? '/dashboard';
}

/** Roles that can be self-requested by normal users (excludes admin) */
export const REQUESTABLE_ROLES: Exclude<UserRole, 'admin'>[] = [
  'doctor',
  'nurse',
  'receptionist',
  'pharmacist',
  'labStaff',
];
