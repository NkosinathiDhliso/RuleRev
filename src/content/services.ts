export type Service = {
  slug: 'founder-launch-pack' | 'compliance-retrofit' | 'cloud-advisory';
  name: string;
  oneLine: string;
  pitch: string;
  duration: string;
  bestFor: string;
  proof?: string;
  included: string[];
  priceFrom: number | null;
  whatsappContext: 'founder_launch_pack' | 'compliance_retrofit' | 'cloud_advisory';
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
    proof: "Currently shipping for a founder building AreaCode.",
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
];
