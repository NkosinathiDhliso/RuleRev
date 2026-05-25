import type { ReactNode } from 'react';
import Link from 'next/link';
import { Button } from './Button';
import { SplitWords } from './SplitWords';
import { whatsappLink } from '@/lib/whatsapp';
import { bookCallHref } from '@/lib/site';
import type { FeaturedCaseStudy } from '@/content/case-studies';
import { SERVICES } from '@/content/services';
import styles from './CaseStudyShell.module.css';

export function CaseStudyShell({ meta, children }: { meta: FeaturedCaseStudy; children: ReactNode }) {
  const related = SERVICES.find((s) => s.slug === meta.relatedService);
  return (
    <article>
      <section className={styles.hero}>
        <div className="container-page">
          <span className={styles.client} data-animate="fade-up-sm" style={{ ['--d' as string]: '0ms' }}>
            {meta.client}
          </span>
          <SplitWords as="h1" className={styles.title} text={meta.title} baseDelay={2} />
          <p className={styles.lede} data-animate="fade-up-sm" style={{ ['--d' as string]: '450ms' }}>
            {meta.oneLine}
          </p>
        </div>
      </section>

      <section>
        <div className="container-page">
          <div className={styles.headline} data-animate="scale-in">
            <div className={styles.headline_num}>{meta.headlineNumber}</div>
            <div className={styles.headline_label}>{meta.headlineLabel}</div>
          </div>

          <div className={styles.body} data-animate="fade-up">
            {children}
          </div>

          <div className={styles.related} data-animate="fade-up">
            <p className={styles.related_text}>
              {related ? (
                <>
                  Working on something similar? See the <Link href={`/services#${related.slug}`}>{related.name}</Link> service.
                </>
              ) : (
                <>Working on something similar? Tell me about it.</>
              )}
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Button href={bookCallHref()} external variant="primary" size="sm">
                Book a call
              </Button>
              <Button href={whatsappLink({ caseStudy: meta.client })} external variant="secondary" size="sm">
                WhatsApp me
              </Button>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
