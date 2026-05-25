import type { Metadata } from 'next';
import { Section, SectionHeading } from '@/components/Section';
import { Eyebrow } from '@/components/Eyebrow';
import { Button } from '@/components/Button';
import { ProofStrip } from '@/components/ProofStrip';
import { CaseStudyCardGrid, ServiceCardGrid } from '@/components/Cards';
import { FinalCTABand } from '@/components/FinalCTABand';
import { SplitChars } from '@/components/SplitChars';
import { GradientMesh } from '@/components/GradientMesh';
import { FEATURED_CASE_STUDIES } from '@/content/case-studies';
import { SERVICES } from '@/content/services';
import { SITE, bookCallHref } from '@/lib/site';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: `${SITE.name} - ${SITE.positioning}`,
  description:
    'I help South African founders and SMEs ship investor-ready products - POPIA compliance, cloud architecture, and shipped code that doesn\'t become the reason your next round slips a quarter.',
  alternates: { canonical: '/' },
};

export default function HomePage() {
  const featured = FEATURED_CASE_STUDIES.slice(0, 3);
  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <GradientMesh parallax parallaxStrength={40} grain />
        <div className="container-page">
          <div className={styles.hero_inner}>
            <div data-animate="fade-up-sm" style={{ ['--d' as string]: '0ms' }}>
              <Eyebrow>{SITE.scarcity.pillText}</Eyebrow>
            </div>
            <SplitChars
              as="h1"
              className={styles.h1}
              text="Technical product partner for South African founders."
            />
            <p
              className={styles.subhead}
              data-animate="fade-up-sm"
              style={{ ['--d' as string]: '650ms' }}
            >
              I help founders and SMEs ship investor-ready products — compliance, infrastructure, and code that won&rsquo;t
              be the reason your next round slips a quarter.
            </p>
            <div
              className={styles.hero_actions}
              data-animate="fade-up-sm"
              style={{ ['--d' as string]: '800ms' }}
            >
              <Button href={bookCallHref()} variant="primary" size="lg" external data-magnetic="">
                Book a 30-min discovery call
              </Button>
              <Button href="/work" variant="secondary" size="lg">
                See what I&rsquo;ve shipped
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Proof strip ──────────────────────────────────────────────── */}
      <Section tight>
        <div data-animate="scale-in">
          <ProofStrip />
        </div>
      </Section>

      {/* ─── Selected work — dark spotlight panel ─────────────────────── */}
      <div className={styles.showcase_wrap}>
        <section className={styles.showcase}>
          <GradientMesh variant="dark" parallax parallaxStrength={50} grain />
          <div className="container-page" style={{ position: 'relative', zIndex: 2 }}>
            <div data-animate="fade-up">
              <SectionHeading
                title="Selected work"
                lede="Three projects where the headline number does the talking."
              />
            </div>
            <div>
              <CaseStudyCardGrid items={featured} />
            </div>
          </div>
        </section>
      </div>

      {/* ─── Services ─────────────────────────────────────────────────── */}
      <Section>
        <div data-animate="fade-up">
          <SectionHeading
            title="What I offer"
            lede="Three productised engagements. Fixed scope, fixed timeline, named deliverables."
          />
        </div>
        <div>
          <ServiceCardGrid items={SERVICES} />
        </div>
      </Section>

      {/* ─── Trust badges ─────────────────────────────────────────────── */}
      <Section surface tight>
        <div className={styles.trust} data-animate="fade-up">
          <p className={styles.trust_text}>
            CIPC registered &middot; SARS registered &middot; POPIA registered with the Information Regulator.
          </p>
          <div className={styles.trust_badges}>
            <span className={styles.badge}>AWS</span>
            <span className={styles.badge}>Microsoft Azure</span>
            <span className={styles.badge}>AZ-305</span>
            <span className={styles.badge}>AZ-400</span>
            <span className={styles.badge}>Anthropic</span>
            <span className={styles.badge}>Terraform</span>
          </div>
        </div>
      </Section>

      {/* ─── How it works ─────────────────────────────────────────────── */}
      <Section>
        <div data-animate="fade-up">
          <SectionHeading title="How it works" lede="Three steps. No mystery." />
        </div>
        <div className={styles.steps}>
          <article className={styles.step} data-animate="fade-up" style={{ '--i': 0 } as React.CSSProperties}>
            <span className={styles.step_num}>01</span>
            <h3 className={styles.step_title}>Discovery call</h3>
            <p className={styles.step_body}>30 minutes, free. We figure out if we&rsquo;re a fit.</p>
          </article>
          <article className={styles.step} data-animate="fade-up" style={{ '--i': 1 } as React.CSSProperties}>
            <span className={styles.step_num}>02</span>
            <h3 className={styles.step_title}>Scoped proposal</h3>
            <p className={styles.step_body}>Fixed price, fixed timeline, named deliverables. You decide.</p>
          </article>
          <article className={styles.step} data-animate="fade-up" style={{ '--i': 2 } as React.CSSProperties}>
            <span className={styles.step_num}>03</span>
            <h3 className={styles.step_title}>Ship</h3>
            <p className={styles.step_body}>Weekly demos. You see progress. No surprises.</p>
          </article>
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
