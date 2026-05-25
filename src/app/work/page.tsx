import type { Metadata } from 'next';
import { Section, SectionHeading } from '@/components/Section';
import { CaseStudyCardGrid, OtherClientGrid } from '@/components/Cards';
import { FinalCTABand } from '@/components/FinalCTABand';
import { SplitWords } from '@/components/SplitWords';
import { FEATURED_CASE_STUDIES, OTHER_CLIENTS } from '@/content/case-studies';

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Selected case studies and client work - POPIA-compliant SaaS, zero-downtime cloud migrations, immutable audit systems, and a $2M+ retail rollout.',
  alternates: { canonical: '/work' },
};

export default function WorkIndexPage() {
  return (
    <>
      <Section>
        <div>
          <SectionHeading
            as="h1"
            title={<SplitWords text="Selected work" />}
            lede={<span data-animate="fade-up-sm" style={{ ['--d' as string]: '350ms' } as React.CSSProperties}>Featured case studies first. Each one has a headline number and the trade-offs behind it.</span>}
          />
        </div>
        <div>
          <CaseStudyCardGrid items={FEATURED_CASE_STUDIES} />
        </div>
      </Section>

      <Section surface>
        <div data-animate="fade-up">
          <SectionHeading
            title="Other client work"
            lede="Smaller engagements and live builds. Some sites are SPAs my fetcher couldn’t read - those are flagged."
          />
        </div>
        <div>
          <OtherClientGrid items={OTHER_CLIENTS} />
        </div>
      </Section>

      <Section>
        <div data-animate="fade-up">
          <FinalCTABand
            title="See yourself in any of this?"
            lede="Tell me what you’re building. I reply within 1 business day."
          />
        </div>
      </Section>
    </>
  );
}
