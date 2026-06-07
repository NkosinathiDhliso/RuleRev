// ─── Helpers ────────────────────────────────────────────────────────────────

/** Return the next calendar quarter label, e.g. "Q3 2026". */
function nextQuarterLabel(): string {
  const now = new Date();
  const currentQ = Math.floor(now.getMonth() / 3) + 1;
  const nextQ = currentQ === 4 ? 1 : currentQ + 1;
  const year = currentQ === 4 ? now.getFullYear() + 1 : now.getFullYear();
  return `Q${nextQ} ${year}`;
}

/** Number → written English word for small counts (1-10). Falls back to digit string. */
const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'] as const;
export function toWord(n: number): string {
  return WORDS[n] ?? String(n);
}

/** Capitalise the first letter of a string. */
export function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ─── Site configuration ─────────────────────────────────────────────────────

export const SITE = {
  name: 'RuleRev',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://rulerev.com',
  positioning: 'Technical product partner for South African founders.',
  founder: {
    name: 'Immanuel Nkosinathi Dhliso',
    shortName: 'Nathi',
    title: 'Technical Product Manager + Solutions Architect',
    initials: 'ID',
    location: 'Midrand, Gauteng, South Africa',
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'nkosinathi.dhliso@gmail.com',
    linkedin: 'https://linkedin.com/in/immanueldhliso',
    github: 'https://github.com/NkosinathiDhliso',
    /** Year career started — used for dynamic "X years of delivery" text. */
    careerStartYear: 2015,
  },
  contact: {
    phoneLocal: process.env.NEXT_PUBLIC_PHONE_LOCAL ?? '061 450 9800',
    phoneIntl: process.env.NEXT_PUBLIC_PHONE_INTL ?? '+27614509800',
    phoneIntlDisplay: '+27 61 450 9800',
    whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '27614509800',
    hoursLocal: 'Mon–Fri 09:00–17:00 SAST',
  },
  legal: {
    cipcReg: process.env.NEXT_PUBLIC_CIPC_REG ?? '',
    informationOfficer: 'Immanuel Nkosinathi Dhliso',
  },
  /** Metrics that appear across the site. Update here → propagates everywhere. */
  metrics: {
    saasCount: 2,
    aiProductsShipped: 3,
    enterpriseValue: '$2M+',
    sitesDelivered: 96,
    countriesServed: 3,
    natCostReduction: 80,
  },
  scarcity: {
    partnerSlots: Number(process.env.NEXT_PUBLIC_PARTNER_SLOTS ?? 2),
    get pillText(): string {
      const slots = this.partnerSlots;
      return `Accepting ${slots} founder partner${slots === 1 ? '' : 's'} for ${nextQuarterLabel()}`;
    },
  },
  external: {
    proprofile: 'https://proprofile.co.za',
    sensa: 'https://app.sensaai.co.za/',
    areacode: 'https://areacode.co.za',
  },
  anthropicModel: process.env.ANTHROPIC_MODEL ?? 'claude-haiku-4-5-20251001',
} as const;

export const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL ?? '';
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? '';

export function bookCallHref(): string {
  if (CALENDLY_URL) return CALENDLY_URL;
  const subject = encodeURIComponent('Discovery call request');
  const body = encodeURIComponent(
    "Hi Nathi,\n\nI'd like to book a 30-min discovery call. A few suggested times:\n\n- \n- \n- \n\nThanks.",
  );
  return `mailto:${SITE.founder.email}?subject=${subject}&body=${body}`;
}

/** Years of professional experience, computed from careerStartYear. */
export function yearsOfExperience(): number {
  return new Date().getFullYear() - SITE.founder.careerStartYear;
}
