export type FeaturedCaseStudy = {
  slug: string;
  client: string;
  title: string;
  oneLine: string;
  headlineNumber: string;
  headlineLabel: string;
  relatedService?: 'founder-launch-pack' | 'compliance-retrofit' | 'cloud-advisory';
  liveUrl?: string;
  publishedISO: string;
};

export const FEATURED_CASE_STUDIES: FeaturedCaseStudy[] = [
  {
    slug: 'proprofile',
    client: 'ProProfile',
    title: 'ProProfile - POPIA-compliant video-first identity SaaS',
    oneLine: 'Video-first professional identity platform. Built and shipped end-to-end.',
    headlineNumber: '0',
    headlineLabel: 'production rollbacks',
    relatedService: 'founder-launch-pack',
    liveUrl: 'https://proprofile.co.za',
    publishedISO: '2025-09-01',
  },
  {
    slug: 'sensa',
    client: 'Sensa',
    title: 'Sensa - multi-agent simulated workplace',
    oneLine: 'AI-managed virtual workplace where candidates earn placement through real work.',
    headlineNumber: '1 700+',
    headlineLabel: 'lines of PRD shipped to production architecture',
    relatedService: 'founder-launch-pack',
    liveUrl: 'https://sensaai.co.za',
    publishedISO: '2025-10-01',
  },
  {
    slug: 'cotton-on-group',
    client: 'Cotton On Group',
    title: 'Cotton On Group - $2M+ retail infrastructure rollout, 3 countries',
    oneLine: '96 retail sites across SA, Botswana and Namibia. Zero trading interruptions.',
    headlineNumber: '$2M+',
    headlineLabel: 'enterprise programme delivered, 98% on-time',
    relatedService: 'cloud-advisory',
    publishedISO: '2024-06-01',
  },
  {
    slug: 'rt-dynamic',
    client: 'RT Dynamic Business Consulting',
    title: 'RT Dynamic - AWS to Azure migration with zero downtime',
    oneLine: 'Phased parallel-environment migration during tax season. Nobody noticed.',
    headlineNumber: '0',
    headlineLabel: 'minutes of downtime during cutover',
    relatedService: 'cloud-advisory',
    liveUrl: 'https://rtdynamicbc.co.za',
    publishedISO: '2025-04-01',
  },
  {
    slug: 'thfc',
    client: 'THFC',
    title: 'THFC - Section 18A donation system with immutable audit log',
    oneLine: 'Tamper-evident donation logging for SARS-defensible Section 18A certificates.',
    headlineNumber: '100%',
    headlineLabel: 'of donations traceable end-to-end for SARS audit',
    relatedService: 'compliance-retrofit',
    publishedISO: '2025-08-01',
  },
];

export type OtherClient = {
  name: string;
  description: string | null;
  liveUrl?: string;
  comingSoon?: boolean;
};

export const OTHER_CLIENTS: OtherClient[] = [
  {
    name: 'AreaCode',
    description:
      'Real-time venue discovery and rewards app for South Africa. Shows which Johannesburg, Cape Town, and Durban venues are quiet, active, buzzing, or popping right now; users check in to earn rewards. Live Founder Launch Pack engagement.',
    liveUrl: 'https://areacode.co.za',
  },
  {
    name: 'Adv. M.J. Motsusi',
    description:
      "Marketing site for an admitted advocate of the High Court. Junior advocate, holds chambers at Groenkloof Advocates Chambers (Pretoria). Brand language: “Dedicated to Justice and Client Success.” Schedule Consultation as primary CTA.",
    liveUrl: 'https://advmotsusi.co.za',
  },
  {
    name: 'Landulani Physiotherapy',
    description:
      "Multi-location physiotherapy practice across Yeoville, Carltonville, Wonderkop, and Tembisa. HPCSA registered (Reg No: PT 0124613). Brand language: “Reclaim Your Movement, Restore Your Life.”",
    liveUrl: 'https://landulaniphysio.com',
  },
  {
    name: 'IP Navigator',
    description: null,
    liveUrl: 'https://ipnavigator.co.za',
    comingSoon: true,
  },
  {
    name: 'Malumz Movement',
    description:
      'Site for The Dog Trainer, a memoir, and the Six Trainers framework for men rebuilding themselves after apartheid. Supports book sales and Brotherhood Circle community signups.',
    liveUrl: 'https://malumz.co.za',
  },
  {
    name: 'KafenFarm',
    description: null,
    liveUrl: 'https://kafenfarm.co.za',
    comingSoon: true,
  },
];
