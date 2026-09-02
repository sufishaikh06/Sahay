'use client';

import { useAppUser } from '@/components/providers/UserProvider';
import { useI18n } from '@/components/providers/I18nProvider';
import { AppShell } from '@/components/layout/AppShell';
import { SignOutButton } from '@clerk/nextjs';
import type { NavigationConfig } from '@/components/layout/types';
import styles from './page.module.css';

/** Default navigation items — role developers will extend this */
function getDefaultNavigation(t: (key: string) => string): NavigationConfig {
  return {
    items: [
      { label: t('nav.dashboard'), href: '/dashboard' },
    ],
  };
}

export default function DashboardPage() {
  const { user, role, isLoaded } = useAppUser();
  const { t } = useI18n();

  if (!isLoaded) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  const navigation = getDefaultNavigation(t);
  if (role) {
    navigation.role = t(`roles.${role}`);
  }

  return (
    <AppShell
      navigation={navigation}
      userName={user?.fullName || user?.email || ''}
      userRole={role ? t(`roles.${role}`) : undefined}
    >
      <div className={styles.page}>
        <div className={styles.welcomeCard}>
          <h1 className={styles.welcomeTitle}>
            {t('auth.welcomeBack')}{user?.firstName ? `, ${user.firstName}` : ''}
          </h1>
          <p className={styles.welcomeText}>
            {role
              ? `You are signed in as ${t(`roles.${role}`)}.`
              : 'Your role has not been assigned yet. Please contact your administrator.'}
          </p>
        </div>

        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <h3 className={styles.infoTitle}>Account</h3>
            <p className={styles.infoValue}>{user?.email}</p>
          </div>
          <div className={styles.infoCard}>
            <h3 className={styles.infoTitle}>Role</h3>
            <p className={styles.infoValue}>
              {role ? t(`roles.${role}`) : 'Not assigned'}
            </p>
          </div>
          <div className={styles.infoCard}>
            <h3 className={styles.infoTitle}>Status</h3>
            <p className={styles.infoValue} style={{ color: 'var(--color-success)' }}>
              Active
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
