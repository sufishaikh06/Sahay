'use client';

import React from 'react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import styles from './Header.module.css';

interface HeaderProps {
  userName?: string;
  userRole?: string;
  onMenuToggle: () => void;
}

export function Header({ userName, userRole, onMenuToggle }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button
          className={styles.menuBtn}
          onClick={onMenuToggle}
          aria-label="Toggle navigation"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M3 5h14M3 10h14M3 15h14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <div className={styles.right}>
        {/* Language switcher */}
        <LanguageSwitcher />

        {/* Theme toggle */}
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

        {/* User info */}
        {userName && (
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className={styles.userText}>
              <span className={styles.userName}>{userName}</span>
              {userRole && <span className={styles.userRole}>{userRole}</span>}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
