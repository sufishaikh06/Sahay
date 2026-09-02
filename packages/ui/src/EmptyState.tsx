import React from 'react';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
}) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--spacing-2xl)',
      textAlign: 'center',
      gap: 'var(--spacing-md)',
    }}
  >
    {icon && (
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-surface-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-text-muted)',
          fontSize: 'var(--font-size-2xl)',
        }}
      >
        {icon}
      </div>
    )}
    <h3
      style={{
        fontSize: 'var(--font-size-lg)',
        fontWeight: 'var(--font-weight-semibold)' as any,
        color: 'var(--color-text)',
        margin: 0,
      }}
    >
      {title}
    </h3>
    {description && (
      <p
        style={{
          fontSize: 'var(--font-size-sm)',
          color: 'var(--color-text-muted)',
          maxWidth: '360px',
          margin: 0,
        }}
      >
        {description}
      </p>
    )}
    {action && <div>{action}</div>}
  </div>
);

EmptyState.displayName = 'EmptyState';
