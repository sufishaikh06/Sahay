'use client';

import Link from 'next/link';
import { useI18n } from '@/components/providers/I18nProvider';
import { useTheme } from '@/components/providers/ThemeProvider';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import styles from './page.module.css';

export default function HomePage() {
  const { t } = useI18n();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={styles.container}>
      {/* Top Navbar */}
      <header className={styles.header}>
        <div className={styles.brand}>
          <svg
            width="32"
            height="32"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <rect width="48" height="48" rx="12" fill="var(--color-primary)" />
            <path
              d="M14 24h20M24 14v20"
              stroke="#fff"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </svg>
          <span className={styles.appName}>{t('common.appName')}</span>
        </div>

        <div className={styles.actions}>
          <LanguageSwitcher />

          <button
            className={styles.iconBtn}
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            )}
          </button>

          <Link href="/sign-in" className={styles.outlineBtn}>
            {t('auth.signIn')}
          </Link>
          <Link href="/sign-up" className={styles.primaryBtn}>
            {t('auth.signUp')}
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className={styles.hero}>
        <div className={styles.heroBadge}>
          <span>SIH 2026 — Problem ID 26133</span>
        </div>
        <h1 className={styles.heroTitle}>{t('common.appName')}</h1>
        <p className={styles.heroSubtitle}>{t('common.tagline')}</p>
        <p className={styles.heroDescription}>
          Empowering rural and underserved healthcare communities by connecting patient registration, digital triage, appointments, consultations, diagnostics, pharmacy, and follow-up in one coordinated workflow.
        </p>

        <div className={styles.ctaGroup}>
          <Link href="/sign-up" className={styles.heroPrimaryBtn}>
            {t('auth.signUp')} &rarr;
          </Link>
          <Link href="/sign-in" className={styles.heroSecondaryBtn}>
            {t('auth.signIn')}
          </Link>
        </div>
      </main>
    </div>
  );
}
