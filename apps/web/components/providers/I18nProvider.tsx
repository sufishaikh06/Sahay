'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// Import locale files
import enCommon from '@/locales/en/common.json';
import hiCommon from '@/locales/hi/common.json';
import mrCommon from '@/locales/mr/common.json';

export type Locale = 'en' | 'hi' | 'mr';

const messages: Record<Locale, Record<string, any>> = {
  en: enCommon,
  hi: hiCommon,
  mr: mrCommon,
};

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string>) => string;
  locales: { code: Locale; label: string }[];
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

function getNestedValue(obj: any, path: string): string | undefined {
  return path.split('.').reduce((acc, part) => acc?.[part], obj);
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    const stored = localStorage.getItem('healthbridge-locale') as Locale | null;
    if (stored && messages[stored]) {
      setLocaleState(stored);
      document.documentElement.lang = stored;
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('healthbridge-locale', newLocale);
    document.documentElement.lang = newLocale;
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string>): string => {
      let value = getNestedValue(messages[locale], key);
      if (!value) {
        // Fallback to English
        value = getNestedValue(messages['en'], key);
      }
      if (!value) return key;

      // Replace template params: {mode} -> value
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          value = value!.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
        });
      }

      return value;
    },
    [locale]
  );

  const locales: { code: Locale; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'mr', label: 'मराठी' },
  ];

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, locales }}>
      {children}
    </I18nContext.Provider>
  );
}
