import type { Metadata } from 'next';
import { MonogramBlock } from '@/components/Monogram';
import { Section } from '@/components/Section';
import { FinalCTABand } from '@/components/FinalCTABand';
import { SplitWords } from '@/components/SplitWords';
import { JsonLd, personLD } from '@/lib/jsonld';
import { SITE } from '@/lib/site';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Founder bio: a decade of delivery, two shipped SaaS platforms, AZ-305 and AZ-400 certified, currently shipping AreaCode for an external founder. Based in Midrand, Gauteng.',
  alternates: { canonical: '/about' },
};

const CREDENTIALS = [
  { title: 'AZ-305', meta: 'Microsoft Azure Solutions Architect Expert' },
  { title: 'AZ-400', meta: 'Microsoft Azure DevOps Engineer Expert' },
  { title: 'AZ-900', meta: 'Microsoft Azure Fundamentals' },
  { title: 'Google Project Management', meta: 'Professional Certificate' },
  { title: 'POPIA Information Officer', meta: 'Information Regulator registered' },
  { title: 'BSc Computer Science', meta: 'University of the People (part-time)' },
];

const NO_LIST = [
  'I don\u2019t take projects where the founder won\u2019t be involved weekly.',
  'I don\u2019t ship to production without monitoring.',
  'I don\u2019t write a privacy policy you haven\u2019t read.',
  'I don\u2019t take retainers where I can\u2019t measure value.',
  'I don\u2019t sub-contract the work to people you haven\u2019t met.',
];

const BUILDING = [
  {
    name: 'ProProfile',
    desc: 'Video-first professional identity. POPIA-compliant SaaS in production.',
    href: SITE.external.proprofile,
  },
  {
    name: 'Sensa',
    desc: 'Multi-agent simulated workplace where candidates earn placement through real work.',
    href: SITE.external.sensa,
  },
  {
    name: 'AreaCode',
    desc: 'Real-time venue discovery and rewards app for South Africa. Live Founder Launch Pack engagement.',
    href: SITE.external.areacode,
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={personLD()} />

      <section>
        <div className="container-page">
          <div className={styles.hero}>
            <div className={styles.hero_monogram} data-animate="fade-up-sm" style={{ ['--d' as string]: '0ms' }}>
              <MonogramBlock initials={SITE.founder.initials} size="md" label="Founder portrait placeholder" />
            </div>
            <div>
              <SplitWords as="h1" className={styles.h1} text={SITE.founder.name} baseDelay={2} />
              <div className={styles.bio} data-animate="fade-up-sm" style={{ ['--d' as string]: '650ms' }}>
                <p>
                  I&rsquo;m a Technical Product Manager and Solutions Architect based in Midrand, Gauteng. RuleRev is a
                  one-person studio: when you hire me, you get me. I&rsquo;ve spent the last decade delivering on the
                  awkward seam between engineering and the business - a $2M+ infrastructure programme across 96 retail
                  sites in South Africa, Botswana and Namibia for the Cotton On Group, and now two production SaaS
                  platforms shipped under my own roof.
                </p>
                <p>
                  ProProfile is a POPIA-compliant, video-first identity SaaS. Sensa is a multi-agent simulated workplace
                  where candidates earn a placement by doing the work. I&rsquo;m currently shipping AreaCode for an
                  external founder under the Founder Launch Pack. Azure Solutions Architect Expert (AZ-305) and Azure
                  DevOps Engineer Expert (AZ-400) certified. Information Officer registered with the Information
                  Regulator under POPIA.
                </p>
                <p>
                  What drives the work: South African founders deserve the same calibre of technical partner that founders
                  in San Francisco take for granted, without paying San Francisco salaries to get it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container-page">
          <h2 className={styles.h2} data-animate="fade-up">
            Credentials
          </h2>
          <div className={styles.creds}>
            {CREDENTIALS.map((c, i) => (
              <div key={c.title} className={styles.cred} data-animate="fade-up" style={{ '--i': i } as React.CSSProperties}>
                <div className={styles.cred_title}>{c.title}</div>
                <div className={styles.cred_meta}>{c.meta}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container-page">
          <h2 className={styles.h2} data-animate="fade-up">
            What I say no to
          </h2>
          <ul className={styles.no_list}>
            {NO_LIST.map((item, i) => (
              <li key={item} data-animate="fade-up" style={{ '--i': i } as React.CSSProperties}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container-page">
          <h2 className={styles.h2} data-animate="fade-up">
            What I&rsquo;m building right now
          </h2>
          <div className={styles.building}>
            {BUILDING.map((b, i) => (
              <a
                key={b.name}
                href={b.href}
                target="_blank"
                rel="noopener"
                className={styles.building_card}
                data-animate="fade-up"
                style={{ '--i': i } as React.CSSProperties}
              >
                <div className={styles.building_name}>{b.name}</div>
                <div className={styles.building_desc}>{b.desc}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <Section>
        <div data-animate="fade-up">
          <FinalCTABand title="Want to work together?" />
        </div>
      </Section>
    </>
  );
}
