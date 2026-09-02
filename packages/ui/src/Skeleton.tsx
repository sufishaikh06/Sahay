import React from 'react';

export interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  borderRadius = 'var(--radius-md)',
  className,
}) => (
  <div
    className={className}
    style={{
      width,
      height,
      borderRadius,
      backgroundColor: 'var(--color-surface-secondary)',
      animation: 'pulse 1.5s ease-in-out infinite',
    }}
    aria-hidden="true"
  />
);

Skeleton.displayName = 'Skeleton';
