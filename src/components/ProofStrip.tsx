import { Counter } from './Counter';
import styles from './ProofStrip.module.css';

export type ProofStat = { value: string; label: string };

const DEFAULT_STATS: ProofStat[] = [
  { value: '$2M+', label: 'Enterprise infrastructure delivered — 96 sites across 3 countries.' },
  { value: '0', label: 'Production rollbacks across both shipped SaaS platforms.' },
  { value: '~80%', label: 'Cloud networking cost cut for a single-client deployment.' },
  { value: '−37%', label: 'Delivery cycle reduction — moved an enterprise programme from 8 weeks to 5.' },
];

export function ProofStrip({ stats = DEFAULT_STATS }: { stats?: ProofStat[] }) {
  return (
    <div className={styles.grid}>
      {stats.map((s, i) => (
        <div key={s.label} className={styles.cell}>
          <div className={styles.value}>
            {i === 0 && (
              <Counter to={2} prefix="$" suffix="M+" duration={1.8} className={styles.value_inner} />
            )}
            {i === 1 && (
              <Counter to={0} duration={0.8} className={styles.value_inner} />
            )}
            {i === 2 && (
              <Counter to={80} prefix="~" suffix="%" duration={1.6} className={styles.value_inner} />
            )}
            {i === 3 && (
              <Counter to={37} prefix="−" suffix="%" duration={1.4} className={styles.value_inner} />
            )}
          </div>
          <div className={styles.label}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}
