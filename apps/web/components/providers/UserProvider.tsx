'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';

/** Supported user roles */
export type UserRole =
  | 'admin'
  | 'doctor'
  | 'nurse'
  | 'receptionist'
  | 'pharmacist'
  | 'labStaff';

export type AccountStatus = 'new' | 'pending' | 'active' | 'rejected';

export interface AppUser {
  id: string;
  clerkId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  imageUrl: string;
  facilityId: string | null;
  facilityName: string | null;
  requestedRole: string | null;
  approvedRole: UserRole | null;
  status: AccountStatus;
}

interface UserContextValue {
  user: AppUser | null;
  isLoaded: boolean;
  isSignedIn: boolean;
  approvedRole: UserRole | null;
  status: AccountStatus;
  refreshProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextValue>({
  user: null,
  isLoaded: false,
  isSignedIn: false,
  approvedRole: null,
  status: 'new',
  refreshProfile: async () => {},
});

export function useAppUser() {
  return useContext(UserContext);
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { user: clerkUser, isLoaded: clerkLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [status, setStatus] = useState<AccountStatus>('new');

  const fetchProfile = useCallback(async () => {
    if (!isSignedIn || !clerkUser) {
      setAppUser(null);
      setStatus('new');
      setProfileLoaded(true);
      return;
    }

    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        // API not available — treat as new user needing onboarding
        setStatus('new');
        setAppUser({
          id: clerkUser.id,
          clerkId: clerkUser.id,
          email: clerkUser.primaryEmailAddress?.emailAddress || '',
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
          fullName: clerkUser.fullName,
          imageUrl: clerkUser.imageUrl,
          facilityId: null,
          facilityName: null,
          requestedRole: null,
          approvedRole: null,
          status: 'new',
        });
        setProfileLoaded(true);
        return;
      }

      const json = await res.json();
      const data = json.data;

      if (data.onboardingRequired) {
        setStatus('new');
        setAppUser({
          id: clerkUser.id,
          clerkId: clerkUser.id,
          email: clerkUser.primaryEmailAddress?.emailAddress || '',
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
          fullName: clerkUser.fullName,
          imageUrl: clerkUser.imageUrl,
          facilityId: null,
          facilityName: null,
          requestedRole: null,
          approvedRole: null,
          status: 'new',
        });
      } else {
        const accountStatus = data.status as AccountStatus;
        setStatus(accountStatus);
        setAppUser({
          id: data.id,
          clerkId: data.clerkId,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          fullName: [data.firstName, data.lastName].filter(Boolean).join(' ') || null,
          imageUrl: clerkUser.imageUrl,
          facilityId: data.facilityId,
          facilityName: data.facilityName,
          requestedRole: data.requestedRole,
          approvedRole: data.approvedRole,
          status: accountStatus,
        });
      }
    } catch {
      // Network error — gracefully degrade
      setStatus('new');
      setAppUser({
        id: clerkUser.id,
        clerkId: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress || '',
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        fullName: clerkUser.fullName,
        imageUrl: clerkUser.imageUrl,
        facilityId: null,
        facilityName: null,
        requestedRole: null,
        approvedRole: null,
        status: 'new',
      });
    } finally {
      setProfileLoaded(true);
    }
  }, [isSignedIn, clerkUser, getToken]);

  useEffect(() => {
    if (clerkLoaded) {
      fetchProfile();
    }
  }, [clerkLoaded, isSignedIn, fetchProfile]);

  const isLoaded = clerkLoaded && profileLoaded;

  return (
    <UserContext.Provider
      value={{
        user: appUser,
        isLoaded,
        isSignedIn: !!isSignedIn,
        approvedRole: appUser?.approvedRole || null,
        status,
        refreshProfile: fetchProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
