import styles from './Monogram.module.css';

export function MonogramBlock({ initials, size = 'md', label }: { initials: string; size?: 'md' | 'lg'; label?: string }) {
  return (
    <div
      className={`${styles.block} ${size === 'lg' ? styles.block_lg : styles.block_md}`}
      role="img"
      aria-label={label ?? `${initials} monogram`}
    >
      {initials}
    </div>
  );
}

export function CaseStudyThumb({ name }: { name: string }) {
  return (
    <div className={styles.thumb} role="img" aria-label={`${name} case study thumbnail`}>
      <span>{name}</span>
    </div>
  );
}
