'use client';

import { ThemeProvider } from './ThemeProvider';
import { I18nProvider } from './I18nProvider';
import { UserProvider } from './UserProvider';
import { ClerkProvider } from '@clerk/nextjs';

const DUMMY_CLERK_KEY = 'pk_test_ZXhhbXBsZS5jbGVyay5hY2NvdW50cy5kZXYk';

export function Providers({ children }: { children: React.ReactNode }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const isKeyMissing = !publishableKey || publishableKey === DUMMY_CLERK_KEY;

  if (isKeyMissing) {
    return (
      <ThemeProvider>
        <I18nProvider>
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--color-warning-light, #fef3c7)',
              color: 'var(--color-warning, #d97706)',
              borderBottom: '1px solid var(--color-border, #e2e8f0)',
              textAlign: 'center',
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            <strong>Clerk Setup Required:</strong> Please set{' '}
            <code>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> in <code>.env.local</code> to enable authentication.
          </div>
          {children}
        </I18nProvider>
      </ThemeProvider>
    );
  }

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
