import type { ReactNode } from 'react';
import styles from './Eyebrow.module.css';

/**
 * A rule-topped label. `withDot` is retained for call-site compatibility but no
 * longer renders anything: the decorative dot was removed with the pill shape.
 */
export function Eyebrow({ children }: { children: ReactNode; withDot?: boolean }) {
  return <span className={styles.label}>{children}</span>;
}
