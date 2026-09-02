'use client';

import React, { createContext, useContext } from 'react';
import { useUser } from '@clerk/nextjs';

/** Supported user roles in the platform */
export type UserRole =
  | 'admin'
  | 'doctor'
  | 'nurse'
  | 'receptionist'
  | 'pharmacist'
  | 'labStaff';

export interface AppUser {
  id: string;
  clerkId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  imageUrl: string;
  role: UserRole | null;
}

interface UserContextValue {
  user: AppUser | null;
  isLoaded: boolean;
  isSignedIn: boolean;
  role: UserRole | null;
}

const UserContext = createContext<UserContextValue>({
  user: null,
  isLoaded: false,
  isSignedIn: false,
  role: null,
});

export function useAppUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded, isSignedIn } = useUser();

  // Extract role from Clerk's public metadata
  // Roles will be set via Clerk Dashboard or API
  const role = (user?.publicMetadata?.role as UserRole) || null;

  const appUser: AppUser | null = user
    ? {
        id: user.id,
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress || '',
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        imageUrl: user.imageUrl,
        role,
      }
    : null;

  return (
    <UserContext.Provider value={{ user: appUser, isLoaded, isSignedIn: !!isSignedIn, role }}>
      {children}
    </UserContext.Provider>
  );
}
