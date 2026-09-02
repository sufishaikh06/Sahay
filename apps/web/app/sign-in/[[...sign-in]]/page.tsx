import { SignIn } from '@clerk/nextjs';
import styles from './page.module.css';

export default function SignInPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Brand section */}
        <div className={styles.brand}>
          <div className={styles.logoWrap}>
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <rect width="48" height="48" rx="12" fill="var(--color-primary)" />
              <path
                d="M14 24h20M24 14v20"
                stroke="#fff"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h1 className={styles.title}>HealthBridge</h1>
          <p className={styles.subtitle}>
            Healthcare Access &amp; Coordination Platform
          </p>
          <p className={styles.description}>
            Sign in to access the healthcare coordination platform for rural and underserved communities.
          </p>
        </div>

        {/* Clerk SignIn component */}
        <div className={styles.authBox}>
          <SignIn
            appearance={{
              elements: {
                rootBox: {
                  width: '100%',
                },
                card: {
                  boxShadow: 'none',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
