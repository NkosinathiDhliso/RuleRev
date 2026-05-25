import type { ReactNode } from 'react';
import styles from './Eyebrow.module.css';

export function Eyebrow({ children, withDot = true }: { children: ReactNode; withDot?: boolean }) {
  return (
    <span className={styles.pill}>
      {withDot ? <span className={styles.dot} aria-hidden="true" /> : null}
      <span>{children}</span>
    </span>
  );
}
