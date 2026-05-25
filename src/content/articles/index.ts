export type Article = {
  slug: string;
  title: string;
  description: string;
  publishedISO: string;
  readingMinutes: number;
  relatedService?: 'founder-launch-pack' | 'compliance-retrofit' | 'cloud-advisory';
  relatedCaseStudy?: string;
  status: 'published' | 'draft';
};

export const ARTICLES: Article[] = [
  {
    slug: 'popia-website-checklist',
    title: 'How to make a website POPIA-compliant: an engineer’s checklist (2026 update)',
    description:
      'A working engineer’s checklist for POPIA-compliant websites in South Africa: privacy policy, consent, cookies, data flows, retention, breach response.',
    publishedISO: '2026-01-15',
    readingMinutes: 9,
    relatedService: 'compliance-retrofit',
    status: 'published',
  },
  {
    slug: 'aws-azure-migration-playbook',
    title: 'AWS to Azure migration: a zero-downtime playbook from a real client',
    description:
      'How I migrated a South African accounting firm’s billable application from AWS to Azure during tax season with zero perceptible downtime.',
    publishedISO: '2026-02-10',
    readingMinutes: 11,
    relatedService: 'cloud-advisory',
    relatedCaseStudy: 'rt-dynamic',
    status: 'published',
  },
  {
    slug: 'fck-nat-vs-managed-nat',
    title: 'fck-nat vs Managed NAT Gateway: how I cut AWS networking spend by ~80%',
    description:
      'A practical comparison of fck-nat vs AWS Managed NAT Gateway, with the production trade-offs and the cost numbers from a live deployment.',
    publishedISO: '2026-03-05',
    readingMinutes: 8,
    relatedService: 'cloud-advisory',
    relatedCaseStudy: 'proprofile',
    status: 'published',
  },
  {
    slug: 'section-18a-donation-system',
    title: 'Section 18A donation systems: what SARS actually expects from your codebase',
    description:
      'The non-repudiation, audit and reporting requirements behind a defensible Section 18A donation certificate - and what that means for the system you build.',
    publishedISO: '2026-04-02',
    readingMinutes: 10,
    relatedService: 'compliance-retrofit',
    relatedCaseStudy: 'thfc',
    status: 'published',
  },
  {
    slug: 'fractional-cto-vs-rulerev',
    title: 'Hiring a technical co-founder vs hiring RuleRev: the honest comparison',
    description:
      'When a technical co-founder is the right answer, when a fractional CTO is, and when working with RuleRev makes the most sense for a South African founder.',
    publishedISO: '2026-04-20',
    readingMinutes: 10,
    relatedService: 'founder-launch-pack',
    status: 'published',
  },
];
