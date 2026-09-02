import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', padding = 'md', children, style, ...props }, ref) => {
    const paddingMap = {
      none: '0',
      sm: 'var(--spacing-sm)',
      md: 'var(--spacing-md)',
      lg: 'var(--spacing-lg)',
    };

    const variantStyles: Record<string, React.CSSProperties> = {
      default: {
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)',
      },
      outlined: {
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
      },
      elevated: {
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-md)',
      },
    };

    return (
      <div
        ref={ref}
        style={{
          borderRadius: 'var(--radius-lg)',
          padding: paddingMap[padding],
          ...variantStyles[variant],
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, style, ...props }) => (
  <div
    style={{
      padding: 'var(--spacing-md) var(--spacing-md) var(--spacing-sm)',
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
);

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export const CardTitle: React.FC<CardTitleProps> = ({ children, style, ...props }) => (
  <h3
    style={{
      fontSize: 'var(--font-size-lg)',
      fontWeight: 'var(--font-weight-semibold)' as any,
      color: 'var(--color-text)',
      margin: 0,
      ...style,
    }}
    {...props}
  >
    {children}
  </h3>
);

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardContent: React.FC<CardContentProps> = ({ children, style, ...props }) => (
  <div
    style={{
      padding: 'var(--spacing-sm) var(--spacing-md) var(--spacing-md)',
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
);
