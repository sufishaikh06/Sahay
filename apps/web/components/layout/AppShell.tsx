'use client';

import React, { useState, createContext, useContext } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import type { NavigationConfig } from './types';
import styles from './AppShell.module.css';

interface AppShellContextValue {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

const AppShellContext = createContext<AppShellContextValue | undefined>(undefined);

export function useAppShell() {
  const ctx = useContext(AppShellContext);
  if (!ctx) throw new Error('useAppShell must be used within AppShell');
  return ctx;
}

interface AppShellProps {
  children: React.ReactNode;
  navigation?: NavigationConfig;
  userName?: string;
  userRole?: string;
}

export function AppShell({ children, navigation, userName, userRole }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <AppShellContext.Provider value={{ sidebarOpen, setSidebarOpen, toggleSidebar }}>
      <div className={styles.shell}>
        <Sidebar
          navigation={navigation}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className={styles.main}>
          <Header
            userName={userName}
            userRole={userRole}
            onMenuToggle={toggleSidebar}
          />
          <main className={styles.content}>{children}</main>
        </div>
      </div>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className={styles.overlay}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </AppShellContext.Provider>
  );
}
