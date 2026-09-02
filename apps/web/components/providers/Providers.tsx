'use client';

import { ThemeProvider } from './ThemeProvider';
import { I18nProvider } from './I18nProvider';
import { UserProvider } from './UserProvider';
import { ClerkProvider } from '@clerk/nextjs';

// Base64-valid dummy publishable key for build-time static page rendering
const DUMMY_CLERK_KEY = 'pk_test_ZXhhbXBsZS5jbGVyay5hY2NvdW50cy5kZXYk';

export function Providers({ children }: { children: React.ReactNode }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || DUMMY_CLERK_KEY;

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <ThemeProvider>
        <I18nProvider>
          <UserProvider>
            {children}
          </UserProvider>
        </I18nProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}
