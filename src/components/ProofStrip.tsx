import { Counter } from './Counter';
import { SITE } from '@/lib/site';
import styles from './ProofStrip.module.css';

export type ProofStat = { value: string; label: string };

const DEFAULT_STATS: ProofStat[] = [
  { value: SITE.metrics.enterpriseValue, label: `Enterprise infrastructure delivered — ${SITE.metrics.sitesDelivered} sites across ${SITE.metrics.countriesServed} countries.` },
  { value: '0', label: `Production rollbacks across ${SITE.metrics.saasCount} shipped SaaS platforms.` },
  { value: `~${SITE.metrics.natCostReduction}%`, label: 'Cloud networking cost cut for a single-client deployment.' },
  { value: String(SITE.metrics.aiProductsShipped), label: 'AI-powered products shipped to production with Claude.' },
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
              <Counter to={SITE.metrics.aiProductsShipped} duration={1.2} className={styles.value_inner} />
            )}
          </div>
          <div className={styles.label}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}
