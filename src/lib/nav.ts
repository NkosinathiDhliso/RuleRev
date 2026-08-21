export const NAV_LINKS = [
  { href: '/work', label: 'Work' },
  { href: '/services', label: 'Services' },
  { href: '/training', label: 'Training' },
  { href: '/writing', label: 'Writing' },
  { href: '/about', label: 'About' },
] as const;

export const FOOTER_PAGES = [
  { href: '/work', label: 'Work' },
  { href: '/services', label: 'Services' },
  { href: '/training', label: 'Training' },
  { href: '/scope', label: 'Scope a Project' },
  { href: '/writing', label: 'Writing' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const;

/**
 * Standalone static documents served straight from public/, outside the App
 * Router. These must render as plain <a> elements: next/link would attempt an
 * RSC soft navigation against a path the router has no route for.
 */
export const FOOTER_STATIC_PAGES = [
  { href: '/omni-risk-readiness', label: 'Omni-Risk Readiness Check' },
] as const;
