import React from 'react';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'var(--color-primary)',
}) => {
  const sizeMap = { sm: '16px', md: '24px', lg: '40px' };
  const borderWidth = size === 'sm' ? '2px' : '3px';

  return (
    <span
      role="status"
      aria-label="Loading"
      style={{
        display: 'inline-block',
        width: sizeMap[size],
        height: sizeMap[size],
        border: `${borderWidth} solid var(--color-border)`,
        borderTopColor: color,
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }}
    />
  );
};

Spinner.displayName = 'Spinner';
