import React from 'react';

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  size = 'md',
}) => {
  const sizeMap = { sm: '32px', md: '40px', lg: '56px' };
  const fontSizeMap = { sm: '0.75rem', md: '0.875rem', lg: '1.125rem' };
  const dimension = sizeMap[size];

  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  if (src) {
    return (
      <img
        src={src}
        alt={alt || name || 'Avatar'}
        style={{
          width: dimension,
          height: dimension,
          borderRadius: '50%',
          objectFit: 'cover',
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: dimension,
        height: dimension,
        borderRadius: '50%',
        backgroundColor: 'var(--color-primary-light)',
        color: 'var(--color-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: fontSizeMap[size],
        fontWeight: 'var(--font-weight-semibold)' as any,
      }}
      aria-label={name || 'Avatar'}
    >
      {initials}
    </div>
  );
};

Avatar.displayName = 'Avatar';
