'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppUser } from '@/components/providers/UserProvider';
import { useI18n } from '@/components/providers/I18nProvider';
import { AppShell } from '@/components/layout/AppShell';
import { SignOutButton } from '@clerk/nextjs';
import type { NavigationConfig } from '@/components/layout/types';
import styles from './page.module.css';

function getDefaultNavigation(t: (key: string) => string): NavigationConfig {
  return {
    items: [
      { label: t('nav.dashboard'), href: '/dashboard' },
    ],
  };
}

export default function DashboardPage() {
  const { user, approvedRole, status, isLoaded, isSignedIn } = useAppUser();
  const { t } = useI18n();
  const router = useRouter();

  // Redirect new users (no profile) to onboarding
  useEffect(() => {
    if (isLoaded && isSignedIn && status === 'new') {
      router.replace('/onboarding');
    }
  }, [isLoaded, isSignedIn, status, router]);

  if (!isLoaded) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  // PENDING state
  if (status === 'pending') {
    return (
      <div className={styles.statusContainer}>
        <div className={styles.statusCard}>
          <div className={styles.statusIcon} style={{ backgroundColor: 'var(--color-warning-light)', color: 'var(--color-warning)' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <h1 className={styles.statusTitle}>{t('status.pendingTitle')}</h1>
          <p className={styles.statusMessage}>{t('status.pendingMessage')}</p>

          <div className={styles.statusDetails}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>{t('status.accountStatus')}</span>
              <span className={styles.badge} style={{ backgroundColor: 'var(--color-warning-light)', color: 'var(--color-warning)' }}>
                {t('status.pending')}
              </span>
            </div>
            {user?.facilityName && (
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>{t('status.facility')}</span>
                <span className={styles.detailValue}>{user.facilityName}</span>
              </div>
            )}
            {user?.requestedRole && (
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>{t('status.requestedRole')}</span>
                <span className={styles.detailValue}>{t(`roles.${user.requestedRole}`)}</span>
              </div>
            )}
          </div>

          <div className={styles.statusActions}>
            <SignOutButton>
              <button className={styles.signOutBtn}>{t('auth.signOut')}</button>
            </SignOutButton>
          </div>
        </div>
      </div>
    );
  }

  // REJECTED state
  if (status === 'rejected') {
    return (
      <div className={styles.statusContainer}>
        <div className={styles.statusCard}>
          <div className={styles.statusIcon} style={{ backgroundColor: 'var(--color-critical-light)', color: 'var(--color-critical)' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <h1 className={styles.statusTitle}>{t('status.rejectedTitle')}</h1>
          <p className={styles.statusMessage}>{t('status.rejectedMessage')}</p>

          <div className={styles.statusDetails}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>{t('status.accountStatus')}</span>
              <span className={styles.badge} style={{ backgroundColor: 'var(--color-critical-light)', color: 'var(--color-critical)' }}>
                {t('status.rejected')}
              </span>
            </div>
            {user?.facilityName && (
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>{t('status.facility')}</span>
                <span className={styles.detailValue}>{user.facilityName}</span>
              </div>
            )}
            {user?.requestedRole && (
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>{t('status.requestedRole')}</span>
                <span className={styles.detailValue}>{t(`roles.${user.requestedRole}`)}</span>
              </div>
            )}
          </div>

          <p className={styles.contactAdmin}>{t('status.contactAdmin')}</p>

          <div className={styles.statusActions}>
            <SignOutButton>
              <button className={styles.signOutBtn}>{t('auth.signOut')}</button>
            </SignOutButton>
          </div>
        </div>
      </div>
    );
  }

  // ACTIVE state — user has an approved role
  const navigation = getDefaultNavigation(t);
  if (approvedRole) {
    navigation.role = t(`roles.${approvedRole}`);
  }

  return (
    <AppShell
      navigation={navigation}
      userName={user?.fullName || user?.email || ''}
      userRole={approvedRole ? t(`roles.${approvedRole}`) : undefined}
    >
      <div className={styles.page}>
        <div className={styles.welcomeCard}>
          <h1 className={styles.welcomeTitle}>
            {t('auth.welcomeBack')}{user?.firstName ? `, ${user.firstName}` : ''}
          </h1>
          <p className={styles.welcomeText}>
            {approvedRole
              ? `You are signed in as ${t(`roles.${approvedRole}`)}.`
              : 'Your role has not been assigned yet.'}
          </p>
        </div>

        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <h3 className={styles.infoTitle}>Account</h3>
            <p className={styles.infoValue}>{user?.email}</p>
          </div>
          <div className={styles.infoCard}>
            <h3 className={styles.infoTitle}>{t('status.approvedRole')}</h3>
            <p className={styles.infoValue}>
              {approvedRole ? t(`roles.${approvedRole}`) : 'Not assigned'}
            </p>
          </div>
          {user?.facilityName && (
            <div className={styles.infoCard}>
              <h3 className={styles.infoTitle}>{t('status.facility')}</h3>
              <p className={styles.infoValue}>{user.facilityName}</p>
            </div>
          )}
          <div className={styles.infoCard}>
            <h3 className={styles.infoTitle}>{t('status.accountStatus')}</h3>
            <p className={styles.infoValue} style={{ color: 'var(--color-success)' }}>
              {t('status.active')}
            </p>
          </div>
        </div>

        <div className={styles.signOutWrap}>
          <SignOutButton>
            <button className={styles.signOutBtn}>
              {t('auth.signOut')}
            </button>
          </SignOutButton>
        </div>
      </div>
    </AppShell>
  );
}
