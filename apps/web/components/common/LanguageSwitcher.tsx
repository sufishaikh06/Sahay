'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useI18n, Locale } from '@/components/providers/I18nProvider';
import styles from './LanguageSwitcher.module.css';

export function LanguageSwitcher() {
  const { locale, setLocale, locales } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentLocale = locales.find((l) => l.code === locale);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={styles.container}>
      <button
        className={styles.trigger}
        onClick={() => setOpen(!open)}
        aria-label="Select language"
        aria-expanded={open}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span>{currentLocale?.label}</span>
      </button>
      {open && (
        <div className={styles.dropdown} role="menu">
          {locales.map((l) => (
            <button
              key={l.code}
              className={`${styles.option} ${l.code === locale ? styles.active : ''}`}
              onClick={() => {
                setLocale(l.code as Locale);
                setOpen(false);
              }}
              role="menuitem"
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
