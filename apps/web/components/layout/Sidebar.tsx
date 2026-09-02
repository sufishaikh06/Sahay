'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NavigationConfig } from './types';
import styles from './Sidebar.module.css';

interface SidebarProps {
  navigation?: NavigationConfig;
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ navigation, open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={`${styles.sidebar} ${open ? styles.open : ''}`}>
      {/* Brand */}
      <div className={styles.brand}>
        <div className={styles.logo}>
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <rect width="28" height="28" rx="8" fill="var(--color-primary)" />
            <path
              d="M8 14h12M14 8v12"
              stroke="#fff"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
          <span className={styles.brandName}>HealthBridge</span>
        </div>
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close navigation"
        >
          ×
        </button>
      </div>

      {/* Navigation */}
      <nav className={styles.nav} aria-label="Main navigation">
        {navigation?.items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
              onClick={onClose}
            >
              {item.icon && <span className={styles.navIcon}>{item.icon}</span>}
              <span className={styles.navLabel}>{item.label}</span>
              {item.badge && <span className={styles.navBadge}>{item.badge}</span>}
            </Link>
          );
        })}

        {!navigation?.items.length && (
          <div className={styles.emptyNav}>
            <p>No navigation configured</p>
          </div>
        )}
      </nav>

      {/* Role indicator */}
      {navigation?.role && (
        <div className={styles.roleIndicator}>
          <span className={styles.roleLabel}>{navigation.role}</span>
        </div>
      )}
    </aside>
  );
}
