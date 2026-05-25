import type { Metadata } from 'next';
import { Section } from '@/components/Section';
import { Button } from '@/components/Button';
import { FinalCTABand } from '@/components/FinalCTABand';
import { SplitWords } from '@/components/SplitWords';
import { JsonLd, serviceLD } from '@/lib/jsonld';
import { SERVICES } from '@/content/services';
import { SITE, bookCallHref } from '@/lib/site';
import { whatsappLink } from '@/lib/whatsapp';
import { formatZAR } from '@/lib/format';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Three productised offers: Founder Launch Pack, Compliance-Ready Website Retrofit, and Cloud Architecture Advisory. Fixed price, fixed timeline.',
  alternates: { canonical: '/services' },
};

export default function ServicesPage() {
  return (
    <>
      <section className={styles.intro}>
        <div className="container-page">
          <SplitWords as="h1" className={styles.intro_h1} text="Three productised offers. Self-qualify." baseDelay={0} />
          <p className={styles.intro_lede} data-animate="fade-up-sm" style={{ ['--d' as string]: '650ms' }}>
            Each offer has fixed scope, a fixed timeline, and named deliverables. If you don&rsquo;t see your situation in one
            of them, the discovery call is still free.
          </p>
        </div>
      </section>

      <JsonLd
        data={SERVICES.map((s) =>
          serviceLD({ name: s.name, url: `${SITE.url}/services#${s.slug}`, description: s.pitch }),
        )}
      />

      {SERVICES.map((s) => (
        <section key={s.slug} id={s.slug} className={styles.offer} aria-labelledby={`${s.slug}-title`}>
          <div className="container-page">
            <div className={styles.offer_grid}>
              <div className={styles.offer_left}>
                <span className={styles.offer_eyebrow}>{s.duration}</span>
                <h2 id={`${s.slug}-title`} className={styles.offer_title}>
                  {s.name}
                </h2>
                <p className={styles.offer_meta}>From {formatZAR(s.priceFrom).replace('From ', '')}</p>
              </div>
              <div>
                <p className={styles.offer_pitch}>{s.pitch}</p>

                <span className={styles.included_title}>What’s included</span>
                <ul className={styles.included}>
                  {s.included.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>

                <p className={styles.best_for}>
                  <strong>Best for:</strong> {s.bestFor}
                </p>

                {s.proof ? <p className={styles.proof}>{s.proof}</p> : null}

                <div className={styles.actions}>
                  <Button href={bookCallHref()} external variant="primary">
                    Book a discovery call
                  </Button>
                  <Button href={whatsappLink(s.whatsappContext)} external variant="secondary">
                    WhatsApp me
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      <Section>
        <FinalCTABand
          title="Not sure which one fits?"
          lede="Tell me what you’re trying to ship. I’ll point you at the right one - even if it’s not me."
        />
      </Section>
    </>
  );
}
