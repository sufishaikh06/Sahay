import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: 'var(--spacing-xl)',
        backgroundColor: 'var(--color-background)',
      }}
    >
      <SignUp
        appearance={{
          elements: {
            card: {
              boxShadow: 'none',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
            },
          },
        }}
      />
    </div>
  );
}
