import type { Metadata } from 'next';
import Link from 'next/link';
import { whatsappLink } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Not found',
  robots: { index: false, follow: false },
};

const QUICK_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/work', label: 'Work' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contact' },
];

export default function NotFound() {
  return (
    <section>
      <div className="container-page" style={{ paddingBlock: '96px 96px', maxWidth: 720 }}>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 500, letterSpacing: '-0.015em' }}>
          This page doesn&rsquo;t exist.
        </h1>
        <p style={{ marginTop: 16, color: 'var(--color-muted)', fontSize: 16, lineHeight: 1.7 }}>
          Here&rsquo;s where you probably wanted to go:
        </p>
        <ul style={{ listStyle: 'none', padding: 0, margin: '24px 0 32px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {QUICK_LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} style={{ color: 'var(--color-accent)', fontWeight: 500 }}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <p style={{ color: 'var(--color-muted)', fontSize: 15, lineHeight: 1.7 }}>
          Or just{' '}
          <a
            href={whatsappLink({ notFoundUrl: 'a missing page' })}
            target="_blank"
            rel="noopener"
            style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}
          >
            tell me what you were looking for
          </a>
          .
        </p>
      </div>
    </section>
  );
}
