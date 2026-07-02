export type Service = {
  slug: 'founder-launch-pack' | 'compliance-retrofit' | 'cloud-advisory' | 'ai-enablement-training';
  name: string;
  oneLine: string;
  pitch: string;
  duration: string;
  bestFor: string;
  proof?: string;
  included: string[];
  priceFrom: number | null;
  whatsappContext: 'founder_launch_pack' | 'compliance_retrofit' | 'cloud_advisory' | 'ai_training';
};

export const SERVICES: Service[] = [
  {
    slug: 'founder-launch-pack',
    name: 'Founder Launch Pack',
    oneLine: 'Investor-ready marketing site, POPIA pack, payments, analytics.',
    pitch:
      'Investor-ready marketing site, POPIA pack, payments, analytics. Fixed price, 3 weeks.',
    duration: '3 weeks',
    bestFor: 'Pre-seed founders who need a credible web presence yesterday.',
    proof: 'Shipped AreaCode for an external founder. See the case study.',
    included: [
      '5-page marketing site (home, about, product/services, blog scaffold, contact)',
      'POPIA compliance pack (privacy policy, cookie policy, T&Cs, cookie consent banner, DPIA template)',
      'Yoco or Stripe payments integration',
      'GA4 + conversion tracking',
      'Domain, hosting, email DKIM/SPF/DMARC setup',
    ],
    priceFrom: null,
    whatsappContext: 'founder_launch_pack',
  },
  {
    slug: 'compliance-retrofit',
    name: 'Compliance-Ready Website Retrofit',
    oneLine: 'POPIA audit and retrofit for SMEs whose site predates enforcement.',
    pitch:
      'POPIA audit and retrofit for SMEs whose site predates enforcement. Fixed price, 1 week.',
    duration: '1 week',
    bestFor: 'SA SMEs quietly non-compliant since POPIA enforcement.',
    included: [
      "Privacy audit against POPIA's 8 conditions",
      'Privacy policy, cookie policy, T&Cs drafted to your business (not templated)',
      'Cookie consent banner (compliant, not theatre)',
      'DPIA template you can run for new projects',
      'Information Officer designation guidance',
    ],
    priceFrom: null,
    whatsappContext: 'compliance_retrofit',
  },
  {
    slug: 'cloud-advisory',
    name: 'Cloud Architecture Advisory',
    oneLine: 'AWS or Azure architecture review and cost optimisation.',
    pitch:
      'AWS or Azure architecture review and cost optimisation. Day-rate or fixed scope.',
    duration: 'Day-rate or fixed scope',
    bestFor:
      'SA teams paying more for cloud than they should, or unsure if their architecture survives the next outage.',
    proof:
      'AZ-305 / AZ-400 certified. Real example: ~80% NAT cost reduction on a live deployment.',
    included: [
      'Architecture review against AWS Well-Architected or Azure CAF',
      'FinOps review with concrete cost-cut recommendations',
      'Security posture review (IAM, secrets, network)',
      'Written report with prioritised actions',
    ],
    priceFrom: null,
    whatsappContext: 'cloud_advisory',
  },
  {
    slug: 'ai-enablement-training',
    name: 'AI Enablement & Training',
    oneLine: 'Team training on AI agents, tool design, MCP servers, and orchestration.',
    pitch:
      'Hands-on AI training for enterprise teams: an executive briefing, a practical track for non-technical staff, and developer build labs covering agents, tool design, MCP servers, and orchestration. Taught by an official Anthropic partner who runs multi-agent Claude in production.',
    duration: 'Half-day to 2 weeks',
    bestFor:
      'Enterprises and mid-size teams that want employees, technical or not, using and building AI safely and well.',
    proof:
      'Official Anthropic partner. The curriculum is drawn from Sensa, a Claude-powered multi-agent platform running in production.',
    included: [
      'Executive briefing: AI capability, risk, and a realistic adoption roadmap (half-day)',
      'End-user track: practical AI for non-technical departments, from prompting to workflow redesign',
      'Developer track: agents, tool design, MCP servers, orchestration, and evals, ending in a working internal agent',
      'POPIA-aware AI governance: data handling rules your teams can actually follow',
      'All training materials become yours after the engagement',
    ],
    priceFrom: null,
    whatsappContext: 'ai_training',
  },
];
