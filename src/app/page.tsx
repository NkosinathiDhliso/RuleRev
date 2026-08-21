import type { Metadata } from 'next';
import Link from 'next/link';
import { Section, SectionHeading } from '@/components/Section';
import { Eyebrow } from '@/components/Eyebrow';
import { Button } from '@/components/Button';
import { ProofStrip } from '@/components/ProofStrip';
import { CaseStudyCardGrid, ServiceCardGrid } from '@/components/Cards';
import { FinalCTABand } from '@/components/FinalCTABand';
import { GradientMesh } from '@/components/GradientMesh';
import { FEATURED_CASE_STUDIES } from '@/content/case-studies';
import { SERVICES } from '@/content/services';
import { SITE, bookCallHref, capitalise, toWord } from '@/lib/site';
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
        <GradientMesh grain />
        <div className="container-page">
          <div className={styles.hero_inner}>
            <Eyebrow>{SITE.scarcity.pillText}</Eyebrow>
            <h1 className={styles.h1}>
              Technical product partner for South African founders.
            </h1>
            <p className={styles.subhead}>
              I help founders and SMEs ship investor-ready products, compliance, infrastructure, and code that won&rsquo;t
              be the reason your next round slips a quarter.
            </p>
            <div className={styles.hero_actions}>
              <Button href={bookCallHref()} variant="primary" size="lg" external>
                Book a 30-min discovery call
              </Button>
              <Button href="/scope" variant="accent" size="lg">
                Scope my project with AI
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
        <div data-animate="fade">
          <ProofStrip />
        </div>
      </Section>

      {/* ─── Selected work: dark spotlight panel ─────────────────────── */}
      <div className={styles.showcase_wrap}>
        <section className={styles.showcase}>
          <GradientMesh variant="dark" parallax parallaxStrength={20} grain />
          <div className="container-page" style={{ position: 'relative', zIndex: 2 }}>
            <div data-animate="fade-up">
              <SectionHeading
                title="Selected work"
                lede={`${capitalise(toWord(featured.length))} projects where the headline number does the talking.`}
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
            lede={`${capitalise(toWord(SERVICES.length))} productised engagements. Fixed scope, fixed timeline, named deliverables.`}
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
          <div className={styles.trust_badges} data-stagger-children="">
            <span className={styles.badge}>AWS</span>
            <span className={styles.badge}>Microsoft Azure</span>
            <span className={styles.badge}>AZ-305</span>
            <span className={styles.badge}>AZ-400</span>
            <span className={styles.badge}>Terraform</span>
          </div>
        </div>

        {/* ─── Anthropic partnership: elevated from badges ────────────── */}
        <Link href="/training" className={styles.partner_card} data-animate="fade-up">
          <div className={styles.partner_icon} aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 46 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M32.73 0H26.23L38.46 32h6.5L32.73 0ZM13.27 0 1.04 32h6.5l2.5-6.6h12.96l2.5 6.6h6.5L19.73 0h-6.46Zm-1.1 20.14L16.5 9.48l4.33 10.66H12.17Z" fill="currentColor"/>
            </svg>
          </div>
          <div className={styles.partner_body}>
            <span className={styles.partner_label}>Official Anthropic Partner</span>
            <span className={styles.partner_desc}>
              We build production AI systems with Claude and train enterprise teams to do the same.
            </span>
          </div>
          <span className={styles.partner_arrow} aria-hidden="true">&rarr;</span>
        </Link>
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
