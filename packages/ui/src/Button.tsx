import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      disabled,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const baseStyles: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      borderRadius: 'var(--radius-md)',
      fontWeight: 'var(--font-weight-medium)' as any,
      fontFamily: 'inherit',
      border: '1px solid transparent',
      cursor: disabled || loading ? 'not-allowed' : 'pointer',
      opacity: disabled || loading ? 0.6 : 1,
      transition: 'all var(--transition-fast)',
      width: fullWidth ? '100%' : undefined,
      ...style,
    };

    const sizeStyles: Record<string, React.CSSProperties> = {
      sm: { padding: '0.375rem 0.75rem', fontSize: 'var(--font-size-sm)' },
      md: { padding: '0.5rem 1rem', fontSize: 'var(--font-size-sm)' },
      lg: { padding: '0.625rem 1.5rem', fontSize: 'var(--font-size-base)' },
    };

    const variantStyles: Record<string, React.CSSProperties> = {
      primary: {
        backgroundColor: 'var(--color-primary)',
        color: '#ffffff',
        borderColor: 'var(--color-primary)',
      },
      secondary: {
        backgroundColor: 'var(--color-surface-secondary)',
        color: 'var(--color-text)',
        borderColor: 'var(--color-border)',
      },
      outline: {
        backgroundColor: 'transparent',
        color: 'var(--color-primary)',
        borderColor: 'var(--color-primary)',
      },
      ghost: {
        backgroundColor: 'transparent',
        color: 'var(--color-text-secondary)',
        borderColor: 'transparent',
      },
      danger: {
        backgroundColor: 'var(--color-critical)',
        color: '#ffffff',
        borderColor: 'var(--color-critical)',
      },
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        style={{ ...baseStyles, ...sizeStyles[size], ...variantStyles[variant] }}
        {...props}
      >
        {loading && (
          <span
            style={{
              width: '1em',
              height: '1em',
              border: '2px solid currentColor',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 0.6s linear infinite',
              display: 'inline-block',
            }}
          />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
