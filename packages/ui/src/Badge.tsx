import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'critical' | 'info';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'sm',
  children,
  style,
  ...props
}) => {
  const variantStyles: Record<string, React.CSSProperties> = {
    default: {
      backgroundColor: 'var(--color-surface-secondary)',
      color: 'var(--color-text-secondary)',
    },
    success: {
      backgroundColor: 'var(--color-success-light)',
      color: 'var(--color-success)',
    },
    warning: {
      backgroundColor: 'var(--color-warning-light)',
      color: 'var(--color-warning)',
    },
    critical: {
      backgroundColor: 'var(--color-critical-light)',
      color: 'var(--color-critical)',
    },
    info: {
      backgroundColor: 'var(--color-info-light)',
      color: 'var(--color-info)',
    },
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: '0.125rem 0.5rem', fontSize: 'var(--font-size-xs)' },
    md: { padding: '0.25rem 0.625rem', fontSize: 'var(--font-size-sm)' },
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: 'var(--radius-full)',
        fontWeight: 'var(--font-weight-medium)' as any,
        whiteSpace: 'nowrap',
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...style,
      }}
      {...props}
    >
      {children}
    </span>
  );
};

Badge.displayName = 'Badge';
