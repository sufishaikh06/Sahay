import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.code}>404</div>
      <h2 className={styles.title}>Page not found</h2>
      <p className={styles.message}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/" className={styles.link}>
        Return home
      </Link>
    </div>
  );
}
