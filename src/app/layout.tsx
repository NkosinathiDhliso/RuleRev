import type { Metadata, Viewport } from 'next';
import { Inter, Instrument_Serif } from 'next/font/google';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { ConsentBanner } from '@/components/ConsentBanner';
import { Animator } from '@/components/Animator';
import { JsonLd, organizationLD, professionalServiceLD, personLD } from '@/lib/jsonld';
import { SITE } from '@/lib/site';
import './globals.css';

const sans = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans-loaded',
  weight: ['400', '500'],
});

const serif = Instrument_Serif({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif-loaded',
  weight: ['400'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} - ${SITE.positioning}`,
    template: `%s - ${SITE.name}`,
  },
  description:
    'I help South African founders and SMEs ship investor-ready products - compliance, infrastructure, and code that won’t be the reason your next round slips a quarter.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} - ${SITE.positioning}`,
    description: SITE.positioning,
    images: ['/og'],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} - ${SITE.positioning}`,
    description: SITE.positioning,
    images: ['/og'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-ZA" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <a
          href="#main"
          style={{
            position: 'absolute',
            left: '-9999px',
            top: 'auto',
            width: 1,
            height: 1,
            overflow: 'hidden',
          }}
        >
          Skip to content
        </a>
        <JsonLd data={[organizationLD(), professionalServiceLD(), personLD()]} />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <FloatingWhatsApp />
        <ConsentBanner />
        <Animator />
      </body>
    </html>
  );
}
