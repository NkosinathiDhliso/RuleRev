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
    github: 'https://github.com/',
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
  scarcity: {
    pillText: 'Accepting 2 founder partners for Q3 2026',
  },
  external: {
    proprofile: 'https://proprofile.co.za',
    sensa: 'https://sensaai.co.za',
    areacode: 'https://areacode.co.za',
  },
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
