import React from 'react';

export interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
}) => {
  return (
    <span
      style={{ position: 'relative', display: 'inline-flex' }}
      title={content}
      aria-label={content}
    >
      {children}
    </span>
  );
};

Tooltip.displayName = 'Tooltip';
