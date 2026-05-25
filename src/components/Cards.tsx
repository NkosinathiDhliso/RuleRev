import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { FeaturedCaseStudy, OtherClient } from '@/content/case-studies';
import type { Service } from '@/content/services';
import styles from './Cards.module.css';

export function CaseStudyCardGrid({ items }: { items: FeaturedCaseStudy[] }) {
  return (
    <div className={styles.case_grid}>
      {items.map((cs, i) => (
        <Link key={cs.slug} href={`/work/${cs.slug}`} className={styles.case_card} data-animate="fade-up" data-tilt="" data-glow="" style={{ '--i': i } as React.CSSProperties}>
          <span className={styles.case_card_eyebrow}>{cs.client}</span>
          <h3 className={styles.case_card_title}>{cs.title}</h3>
          <p className={styles.case_card_outcome}>{cs.oneLine}</p>
          <span className={styles.case_card_arrow}>Read the case study →</span>
        </Link>
      ))}
    </div>
  );
}

export function ServiceCardGrid({ items }: { items: Service[] }) {
  return (
    <div className={styles.service_grid}>
      {items.map((s, i) => (
        <article key={s.slug} className={styles.service_card} data-animate="fade-up" data-tilt="" data-glow="" style={{ '--i': i } as React.CSSProperties}>
          <h3 className={styles.service_card_title}>{s.name}</h3>
          <p className={styles.service_card_outcome}>{s.oneLine}</p>
          <p className={styles.service_card_meta}>
            {s.duration ? s.duration : 'Custom timeline'}
          </p>
          <Link href={`/services#${s.slug}`} className={styles.service_card_link}>
            See what&rsquo;s included →
          </Link>
        </article>
      ))}
    </div>
  );
}

export function OtherClientGrid({ items }: { items: OtherClient[] }) {
  return (
    <div className={styles.other_grid}>
      {items.map((c, i) => (
        <article key={c.name} className={styles.other_card} data-animate="fade-up" style={{ '--i': i } as React.CSSProperties}>
          <div className={styles.other_name}>
            {c.liveUrl ? (
              <a href={c.liveUrl} target="_blank" rel="noopener">
                {c.name}
                <ArrowUpRight size={14} aria-hidden="true" style={{ display: 'inline', marginLeft: 4, verticalAlign: '-2px' }} />
              </a>
            ) : (
              <span>{c.name}</span>
            )}
            {c.comingSoon ? <span className={styles.coming_soon}>Coming soon</span> : null}
          </div>
          {c.description ? <p className={styles.other_desc}>{c.description}</p> : null}
          {c.liveUrl && !c.description ? (
            <p className={styles.url}>
              <a href={c.liveUrl} target="_blank" rel="noopener">
                {c.liveUrl.replace(/^https?:\/\//, '')}
              </a>
            </p>
          ) : null}
        </article>
      ))}
    </div>
  );
}
