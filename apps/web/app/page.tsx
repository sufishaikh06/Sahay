export default function HomePage() {
  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: 'var(--spacing-xl)',
        textAlign: 'center',
      }}
    >
      <h1
        style={{
          fontSize: 'var(--font-size-4xl)',
          fontWeight: 'var(--font-weight-bold)',
          color: 'var(--color-primary)',
          marginBottom: 'var(--spacing-md)',
        }}
      >
        HealthBridge
      </h1>
      <p
        style={{
          fontSize: 'var(--font-size-lg)',
          color: 'var(--color-text-secondary)',
          maxWidth: '600px',
        }}
      >
        Healthcare Access &amp; Coordination Platform
      </p>
    </main>
  );
}
