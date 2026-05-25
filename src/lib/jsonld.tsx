import { SITE } from './site';

export function organizationLD() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    url: SITE.url,
    description: SITE.positioning,
    founder: personLD(),
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Midrand',
      addressRegion: 'Gauteng',
      addressCountry: 'ZA',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: SITE.contact.phoneIntl,
      email: SITE.founder.email,
      areaServed: 'ZA',
      availableLanguage: ['en'],
    },
  };
}

export function professionalServiceLD() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: SITE.name,
    url: SITE.url,
    description: SITE.positioning,
    areaServed: { '@type': 'Country', name: 'South Africa' },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Midrand',
      addressRegion: 'Gauteng',
      addressCountry: 'ZA',
    },
    telephone: SITE.contact.phoneIntl,
    email: SITE.founder.email,
    openingHours: 'Mo-Fr 09:00-17:00',
    priceRange: '$$',
  };
}

export function personLD() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE.founder.name,
    jobTitle: SITE.founder.title,
    url: `${SITE.url}/about`,
    sameAs: [SITE.founder.linkedin],
    worksFor: { '@type': 'Organization', name: SITE.name, url: SITE.url },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Midrand',
      addressRegion: 'Gauteng',
      addressCountry: 'ZA',
    },
  };
}

export function serviceLD(args: { name: string; url: string; description: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: args.name,
    description: args.description,
    url: args.url,
    provider: { '@type': 'Organization', name: SITE.name, url: SITE.url },
    areaServed: { '@type': 'Country', name: 'South Africa' },
  };
}

export function articleLD(args: {
  title: string;
  description: string;
  slug: string;
  publishedISO: string;
  modifiedISO?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: args.title,
    description: args.description,
    url: `${SITE.url}/writing/${args.slug}`,
    datePublished: args.publishedISO,
    dateModified: args.modifiedISO ?? args.publishedISO,
    author: { '@type': 'Person', name: SITE.founder.name, url: `${SITE.url}/about` },
    publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url },
    mainEntityOfPage: `${SITE.url}/writing/${args.slug}`,
  };
}

export function caseStudyLD(args: { title: string; description: string; slug: string; publishedISO: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: args.title,
    description: args.description,
    url: `${SITE.url}/work/${args.slug}`,
    datePublished: args.publishedISO,
    author: { '@type': 'Person', name: SITE.founder.name, url: `${SITE.url}/about` },
    publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url },
  };
}

export function JsonLd({ data }: { data: object | object[] }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((d, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }}
        />
      ))}
    </>
  );
}
