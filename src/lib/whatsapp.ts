import { SITE } from './site';

export type WhatsAppContext =
  | 'home'
  | 'final_cta'
  | 'founder_launch_pack'
  | 'compliance_retrofit'
  | 'cloud_advisory'
  | 'contact'
  | 'floating'
  | { caseStudy: string }
  | { notFoundUrl: string }
  | { custom: string };

const PRESETS: Record<string, string> = {
  home: "Hi Nathi, I saw your site and I'd like to chat about a project.",
  final_cta: "Hi Nathi, I saw your site and I'd like to chat about a project.",
  floating: "Hi Nathi, I saw your site and I'd like to chat about a project.",
  founder_launch_pack: "Hi Nathi, I'm interested in the Founder Launch Pack.",
  compliance_retrofit: 'Hi Nathi, I need a POPIA compliance retrofit for my site.',
  cloud_advisory: "Hi Nathi, I'd like a cloud architecture review.",
  contact: "Hi Nathi, I'd like to get in touch.",
};

export function whatsappLink(context: WhatsAppContext): string {
  let message: string;
  if (typeof context === 'string') {
    message = PRESETS[context] ?? PRESETS.home;
  } else if ('caseStudy' in context) {
    message = `Hi Nathi, I'd like to talk about a project similar to your work with ${context.caseStudy}.`;
  } else if ('notFoundUrl' in context) {
    message = `Hi Nathi, I was trying to find ${context.notFoundUrl} on your site.`;
  } else {
    message = context.custom;
  }
  return `https://wa.me/${SITE.contact.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function telLink(): string {
  return `tel:${SITE.contact.phoneIntl}`;
}

export function emailLink(subject?: string): string {
  const base = `mailto:${SITE.founder.email}`;
  return subject ? `${base}?subject=${encodeURIComponent(subject)}` : base;
}
