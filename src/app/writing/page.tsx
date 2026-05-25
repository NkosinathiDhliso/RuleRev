import type { Metadata } from 'next';
import Link from 'next/link';
import { Section, SectionHeading } from '@/components/Section';
import { SplitWords } from '@/components/SplitWords';
import { ARTICLES } from '@/content/articles';
import { formatDateZA } from '@/lib/format';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Writing',
  description:
    'Cornerstone articles on POPIA-compliant websites, AWS to Azure zero-downtime migration, AWS NAT cost cutting, Section 18A donation systems, and hiring a technical co-founder vs RuleRev.',
  alternates: { canonical: '/writing' },
};

export default function WritingIndexPage() {
  const sorted = [...ARTICLES].sort((a, b) => (a.publishedISO < b.publishedISO ? 1 : -1));
  return (
    <Section>
      <div>
        <SectionHeading
          as="h1"
          title={<SplitWords text="Writing" />}
          lede={<span data-animate="fade-up-sm" style={{ ['--d' as string]: '350ms' } as React.CSSProperties}>Working notes and cornerstone pieces. Each one maps to a real engagement.</span>}
        />
      </div>
      <div className={styles.list}>
        {sorted.map((a, i) => (
          <Link key={a.slug} href={`/writing/${a.slug}`} className={styles.row} data-animate="fade-up" style={{ '--i': i } as React.CSSProperties}>
            <div className={styles.meta}>
              <span>{formatDateZA(a.publishedISO)}</span>
              <span>{a.readingMinutes} min read</span>
              {a.status === 'draft' ? <span className={styles.draft}>Draft</span> : null}
            </div>
            <h2 className={styles.title}>{a.title}</h2>
            <p className={styles.desc}>{a.description}</p>
          </Link>
        ))}
      </div>
    </Section>
  );
}
