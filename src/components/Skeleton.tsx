import styles from './Skeleton.module.css';

export function SkeletonLine({ size = 'md', width }: { size?: 'sm' | 'md' | 'lg' | 'xl'; width?: string }) {
  const cls = [
    styles.pulse,
    size === 'sm' ? styles.line_sm : size === 'lg' ? styles.line_lg : size === 'xl' ? styles.line_xl : styles.line,
  ].join(' ');
  return <div className={cls} style={width ? { maxWidth: width } : undefined} />;
}

export function SkeletonBlock({ height }: { height?: number }) {
  return <div className={`${styles.pulse} ${styles.block}`} style={height ? { height } : undefined} />;
}

export function SkeletonCard() {
  return <div className={`${styles.pulse} ${styles.card}`} />;
}

export function SkeletonGrid({ count = 3 }: { count?: number }) {
  return (
    <div className={styles.grid}>
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonPage({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.wrap}>
      <div className="container-page">{children}</div>
    </div>
  );
}
