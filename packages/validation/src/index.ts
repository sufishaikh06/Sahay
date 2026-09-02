import { z } from 'zod';

// Common validation primitives
export const emailSchema = z.string().email('Invalid email address');
export const phoneSchema = z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian 10-digit mobile number');
export const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format');

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const userRoleSchema = z.enum([
  'admin',
  'doctor',
  'nurse',
  'receptionist',
  'pharmacist',
  'labStaff',
]);

export type PaginationQuery = z.infer<typeof paginationSchema>;
export type UserRoleType = z.infer<typeof userRoleSchema>;
