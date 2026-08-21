import type { Metadata } from 'next';
import Link from 'next/link';
import { Section, SectionHeading } from '@/components/Section';
import { Button } from '@/components/Button';
import { ProofStrip } from '@/components/ProofStrip';
import { ServiceCardGrid } from '@/components/Cards';
import { FinalCTABand } from '@/components/FinalCTABand';
import { FEATURED_CASE_STUDIES } from '@/content/case-studies';
import { SERVICES } from '@/content/services';
import { SITE, bookCallHref, capitalise, toWord } from '@/lib/site';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: `${SITE.name} - ${SITE.positioning}`,
  description:
    'I help South African founders and SMEs ship investor-ready products: POPIA compliance, cloud architecture, and shipped code that does not become the reason your next round slips a quarter.',
  alternates: { canonical: '/' },
};

const STEPS = [
  {
    title: 'Discovery call',
    body: '30 minutes, free. We work out whether this is a fit before anyone writes a proposal.',
  },
  {
    title: 'Scoped proposal',
    body: 'Fixed price, fixed timeline, named deliverables. You decide with the numbers in front of you.',
  },
  {
    title: 'Ship',
    body: 'Weekly demos against the scope. You see progress every week rather than at handover.',
  },
];

const CREDENTIALS = [
  'CIPC registered',
  'SARS registered',
  'POPIA registered with the Information Regulator',
  'Official Anthropic partner',
];

const CAPABILITIES = ['AWS', 'Microsoft Azure', 'AZ-305', 'AZ-400', 'Terraform'];

export default function HomePage() {
  // No slice. The section shows what exists; a reflexive cut to three is the tell.
  const work = FEATURED_CASE_STUDIES;

  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className="container-page">
          <div className={styles.hero_inner}>
            {/* Availability is real information, so it stays. The pill-and-dot
                chip treatment does not: that shape is the tell, not the fact. */}
            <p className={styles.availability}>{SITE.scarcity.pillText}</p>
            <h1 className={styles.h1}>Technical product partner for South African founders.</h1>
            <p className={styles.subhead}>
              I help founders and SMEs ship investor-ready products: compliance, infrastructure, and code that
              will not be the reason your next round slips a quarter.
            </p>
            <div className={styles.hero_actions}>
              <Button href={bookCallHref()} variant="primary" size="lg" external>
                Book a 30-min discovery call
              </Button>
              <Button href="/scope" variant="secondary" size="lg">
                Scope my project
              </Button>
              <Button href="/work" variant="secondary" size="lg">
                See what I have shipped
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Proof strip ──────────────────────────────────────────────── */}
      <Section tight>
        <div data-animate="fade">
          <ProofStrip />
        </div>
      </Section>

      {/* ─── Selected work ────────────────────────────────────────────────
          A ruled schedule rather than a card grid. Rows carry the headline
          figure in tabular numerals so the column actually aligns, which is how
          the reference documents present this kind of list. */}
      <Section>
        <div data-animate="fade-up">
          <SectionHeading
            title="Selected work"
            lede={`${capitalise(toWord(work.length))} projects, with the outcome stated as a number.`}
          />
        </div>
        <ol className={styles.worklist}>
          {work.map((cs) => (
            <li key={cs.slug} className={styles.work_item}>
              <Link href={`/work/${cs.slug}`} className={styles.work_row}>
                <span className={`${styles.work_num} tnum`}>{cs.headlineNumber}</span>
                <span className={styles.work_body}>
                  <span className={styles.work_client}>{cs.client}</span>
                  <span className={styles.work_title}>{cs.title}</span>
                  <span className={styles.work_line}>{cs.oneLine}</span>
                </span>
                <span className={styles.work_label}>{cs.headlineLabel}</span>
              </Link>
            </li>
          ))}
        </ol>
      </Section>

      {/* ─── Services ─────────────────────────────────────────────────── */}
      <Section>
        <div data-animate="fade-up">
          <SectionHeading
            title="What I offer"
            lede={`${capitalise(toWord(SERVICES.length))} productised engagements. Fixed scope, fixed timeline, named deliverables.`}
          />
        </div>
        <div>
          <ServiceCardGrid items={SERVICES} />
        </div>
      </Section>

      {/* ─── How it works ─────────────────────────────────────────────────
          Numbered rows, following the numbered-section convention of the
          reference documents. Three steps because there are three, not because
          three cards is the default shape. */}
      <Section>
        <div data-animate="fade-up">
          <SectionHeading title="How it works" lede="Three steps, and no stage where you are guessing." />
        </div>
        <ol className={styles.steplist}>
          {STEPS.map((s, i) => (
            <li key={s.title} className={styles.step_row}>
              <span className={`${styles.step_num} tnum`}>{String(i + 1).padStart(2, '0')}</span>
              <span className={styles.step_body}>
                <span className={styles.step_title}>{s.title}</span>
                <span className={styles.step_text}>{s.body}</span>
              </span>
            </li>
          ))}
        </ol>
      </Section>

      {/* ─── Standing and capability ──────────────────────────────────── */}
      <Section surface tight>
        <div className={styles.standing}>
          <div className={styles.standing_col}>
            <h2 className={styles.standing_h}>Standing</h2>
            <ul className={styles.credlist}>
              {CREDENTIALS.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
          <div className={styles.standing_col}>
            <h2 className={styles.standing_h}>Platforms and certification</h2>
            <ul className={styles.credlist}>
              {CAPABILITIES.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
          <div className={styles.standing_col}>
            <h2 className={styles.standing_h}>AI enablement</h2>
            <p className={styles.standing_text}>
              We build production AI systems with Claude and train enterprise teams to do the same.
            </p>
            <Link href="/training" className={styles.standing_link}>
              Training and enablement
            </Link>
          </div>
        </div>
      </Section>

      {/* ─── Final CTA ────────────────────────────────────────────────── */}
      <Section>
        <div data-animate="fade-up">
          <FinalCTABand />
        </div>
      </Section>
    </>
  );
}
