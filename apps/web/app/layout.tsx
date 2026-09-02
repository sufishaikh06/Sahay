import type { Metadata } from 'next';
import '@/styles/globals.css';
import { Providers } from '@/components/providers/Providers';

export const metadata: Metadata = {
  title: 'HealthBridge — Healthcare Coordination Platform',
  description:
    'A connected healthcare coordination platform improving accessibility and continuity for rural and underserved communities.',
  keywords: ['healthcare', 'telemedicine', 'rural health', 'SIH 2026', 'coordination'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
