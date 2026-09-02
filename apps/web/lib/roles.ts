import type { UserRole } from '@/components/providers/UserProvider';

/**
 * Role-based access configuration.
 * Future role developers will use this to define permissions.
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
    permissions: ['manage:facility', 'manage:users', 'view:analytics'],
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
 * Check if a user role has a specific permission.
 */
export function hasPermission(role: UserRole | null, permission: string): boolean {
  if (!role) return false;
  return roleConfigs[role]?.permissions.includes(permission) ?? false;
}

/**
 * Get the default route for a user role.
 */
export function getDefaultRoute(role: UserRole | null): string {
  if (!role) return '/dashboard';
  return roleConfigs[role]?.defaultRoute ?? '/dashboard';
}
