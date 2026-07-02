import type { Metadata } from 'next';
import { Section, SectionHeading } from '@/components/Section';
import { Eyebrow } from '@/components/Eyebrow';
import { Button } from '@/components/Button';
import { FinalCTABand } from '@/components/FinalCTABand';
import { JsonLd, serviceLD } from '@/lib/jsonld';
import { SITE, bookCallHref } from '@/lib/site';
import { whatsappLink } from '@/lib/whatsapp';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'AI Training for Enterprise Teams',
  description:
    'Hands-on AI training for enterprise teams: agents, tool design, MCP servers, and orchestration for developers, practical AI for every other department. Taught by an official Anthropic partner running multi-agent Claude in production.',
  alternates: { canonical: '/training' },
};

const TRACKS = [
  {
    eyebrow: 'Half-day · Leadership',
    title: 'Executive briefing',
    body: 'What AI agents can and cannot do today, where the risk actually sits, and what an adoption roadmap looks like for your organisation. No hype, no vendor theatre.',
    outcome: 'You leave with: a one-page adoption roadmap and a risk register your board can read.',
  },
  {
    eyebrow: '1 to 3 days · All departments',
    title: 'End-user track',
    body: 'Practical AI for non-technical teams: finance, legal, operations, HR, marketing. From prompting fundamentals to redesigning a real workflow from your own department.',
    outcome: 'You leave with: three of your own workflows rebuilt with AI, documented and repeatable.',
  },
  {
    eyebrow: '3 days to 2 weeks · Engineering',
    title: 'Developer track',
    body: 'Agents, tool design, MCP servers, orchestration, and evals. Built on the Claude stack we run in production. Your developers build against your systems, not toy examples.',
    outcome: 'You leave with: a working internal agent your team built, plus the architecture to extend it.',
  },
];

const PROOF = [
  {
    title: 'Official Anthropic Partner',
    body: 'We integrate Claude into production systems where compliance and security are non-negotiable. The curriculum is drawn from Sensa, a multi-agent Claude platform running in production, not from slides.',
  },
  {
    title: 'Enterprise-scale delivery',
    body: `A ${SITE.metrics.enterpriseValue} infrastructure programme across ${SITE.metrics.sitesDelivered} retail sites in ${SITE.metrics.countriesServed} countries for the Cotton On Group. Enterprise constraints are familiar territory, not a surprise.`,
  },
  {
    title: 'Certified architecture',
    body: 'Azure Solutions Architect Expert (AZ-305) and Azure DevOps Engineer Expert (AZ-400). Training covers how agents fit your existing cloud estate, identity, and network posture.',
  },
  {
    title: 'Governance built in',
    body: 'POPIA Information Officer registered with the Information Regulator. Every track includes data handling rules for AI that your teams can actually follow.',
  },
];

export default function TrainingPage() {
  return (
    <>
      <JsonLd
        data={serviceLD({
          name: 'AI Enablement & Training',
          url: `${SITE.url}/training`,
          description:
            'Hands-on AI training for enterprise teams: agents, tool design, MCP servers, and orchestration for developers, practical AI for every other department.',
        })}
      />

      <section className={styles.intro}>
        <div className="container-page">
          <Eyebrow>Enterprise AI enablement</Eyebrow>
          <h1 className={styles.intro_h1}>Train your teams to build with AI.</h1>
          <p className={styles.intro_lede}>
            From an executive briefing to developer build labs on agents, tool design, MCP servers, and
            orchestration. Taught by an official Anthropic partner who runs multi-agent Claude in production,
            with POPIA-aware governance in every track.
          </p>
          <div className={styles.intro_actions}>
            <Button href={bookCallHref()} variant="primary" size="lg" external>
              Book a discovery call
            </Button>
            <Button href={whatsappLink('ai_training')} variant="secondary" size="lg" external>
              WhatsApp me
            </Button>
          </div>
        </div>
      </section>

      <Section>
        <div data-animate="fade-up">
          <SectionHeading
            title="Three tracks, one outcome"
            lede="Every track ends with a named deliverable, not a certificate of attendance."
          />
        </div>
        <div className={styles.tracks}>
          {TRACKS.map((t, i) => (
            <article key={t.title} className={styles.track} data-animate="fade-up" style={{ '--i': i } as React.CSSProperties}>
              <span className={styles.track_eyebrow}>{t.eyebrow}</span>
              <h3 className={styles.track_title}>{t.title}</h3>
              <p className={styles.track_body}>{t.body}</p>
              <p className={styles.track_outcome}>
                <strong>{t.outcome.split(':')[0]}:</strong>
                {t.outcome.split(':').slice(1).join(':')}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section surface>
        <div data-animate="fade-up">
          <SectionHeading
            title="Taught from production, not slides"
            lede="The credibility checklist your procurement team will ask about anyway."
          />
        </div>
        <div className={styles.proof_grid}>
          {PROOF.map((p, i) => (
            <article key={p.title} className={styles.proof_card} data-animate="fade-up" style={{ '--i': i } as React.CSSProperties}>
              <h3 className={styles.proof_title}>{p.title}</h3>
              <p className={styles.proof_body}>{p.body}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section>
        <div data-animate="fade-up">
          <SectionHeading title="How delivery works" lede="Built for how enterprises actually buy training." />
        </div>
        <ul className={styles.delivery_list} data-animate="fade-up">
          <li>
            <strong>On-site in Gauteng or remote.</strong> Workshops run at your offices or over video, in SAST
            business hours.
          </li>
          <li>
            <strong>Small, capped cohorts.</strong> You get the person who built the systems, not a junior
            facilitator. Cohort sizes stay small so that remains true.
          </li>
          <li>
            <strong>Your stack, your policies.</strong> Exercises are built around your tools, security posture,
            and approval workflows, agreed before day one.
          </li>
          <li>
            <strong>Materials are yours.</strong> Slides, labs, code, and templates transfer to you at the end of
            the engagement for internal reuse.
          </li>
        </ul>
        <p className={styles.data_note}>
          <strong>Data handling:</strong> nothing from your environment is used in exercises or demos without
          written agreement, and every track covers what may and may not be sent to an AI model under POPIA. As a
          registered Information Officer, I hold this line in my own products too.
        </p>
      </Section>

      <Section>
        <div data-animate="fade-up">
          <FinalCTABand
            title="Ready to upskill your team?"
            lede="Tell me who needs training and what they should be able to do afterwards. I respond within 1 business day."
            whatsappContext="ai_training"
          />
        </div>
      </Section>
    </>
  );
}
