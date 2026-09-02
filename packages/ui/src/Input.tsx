import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, fullWidth = true, id, style, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    const containerStyles: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.375rem',
      width: fullWidth ? '100%' : undefined,
    };

    const labelStyles: React.CSSProperties = {
      fontSize: 'var(--font-size-sm)',
      fontWeight: 'var(--font-weight-medium)' as any,
      color: 'var(--color-text)',
    };

    const inputStyles: React.CSSProperties = {
      padding: '0.5rem 0.75rem',
      fontSize: 'var(--font-size-sm)',
      fontFamily: 'inherit',
      borderRadius: 'var(--radius-md)',
      border: `1px solid ${error ? 'var(--color-critical)' : 'var(--color-border)'}`,
      backgroundColor: 'var(--color-surface)',
      color: 'var(--color-text)',
      outline: 'none',
      transition: 'border-color var(--transition-fast)',
      width: '100%',
      ...style,
    };

    const hintStyles: React.CSSProperties = {
      fontSize: 'var(--font-size-xs)',
      color: error ? 'var(--color-critical)' : 'var(--color-text-muted)',
    };

    return (
      <div style={containerStyles}>
        {label && (
          <label htmlFor={inputId} style={labelStyles}>
            {label}
          </label>
        )}
        <input ref={ref} id={inputId} style={inputStyles} aria-invalid={!!error} {...props} />
        {(error || hint) && <span style={hintStyles}>{error || hint}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
