import styles from './ProofStrip.module.css';

export type ProofStat = { value: string; label: string };

const DEFAULT_STATS: ProofStat[] = [
  { value: '$2M+', label: 'Enterprise infrastructure delivered - 96 sites across 3 countries.' },
  { value: '0', label: 'Production rollbacks across both shipped SaaS platforms.' },
  { value: '~80%', label: 'Cloud networking cost cut for a single-client deployment.' },
  { value: '−37%', label: 'Delivery cycle reduction - moved an enterprise programme from 8 weeks to 5.' },
];

export function ProofStrip({ stats = DEFAULT_STATS }: { stats?: ProofStat[] }) {
  return (
    <div className={styles.grid}>
      {stats.map((s) => (
        <div key={s.label} className={styles.cell}>
          <div className={styles.value}>{s.value}</div>
          <div className={styles.label}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}
