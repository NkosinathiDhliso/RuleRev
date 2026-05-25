import type { Metadata } from 'next';
import { Calendar, MessageCircle, Phone } from 'lucide-react';
import { SplitWords } from '@/components/SplitWords';
import { SITE, bookCallHref } from '@/lib/site';
import { whatsappLink, telLink } from '@/lib/whatsapp';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Three ways to reach RuleRev: book a discovery call, WhatsApp, or phone. I reply within 1 business day during SAST hours.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <section>
      <div className="container-page">
        <div className={styles.hero}>
          <SplitWords as="h1" className={styles.h1} text="Tell me what you're building." baseDelay={0} />
          <p className={styles.lede} data-animate="fade-up-sm" style={{ ['--d' as string]: '650ms' }}>
            Three ways through. Pick whichever you actually use. I reply within 1 business day during SAST hours.
          </p>
        </div>

        <div className={styles.cta_grid} data-animate="fade-up-sm" style={{ ['--d' as string]: '800ms' }}>
          <a href={bookCallHref()} target="_blank" rel="noopener" className={styles.cta_card}>
            <span className={styles.cta_icon}>
              <Calendar size={18} aria-hidden="true" />
            </span>
            <span className={styles.cta_title}>Book a call</span>
            <span className={styles.cta_meta}>30 minutes. Free. Pick a time that works for you.</span>
          </a>

          <a
            href={whatsappLink('contact')}
            target="_blank"
            rel="noopener"
            className={styles.cta_card}
          >
            <span className={styles.cta_icon}>
              <MessageCircle size={18} aria-hidden="true" />
            </span>
            <span className={styles.cta_title}>WhatsApp me</span>
            <span className={styles.cta_meta}>{SITE.contact.phoneIntlDisplay}</span>
          </a>

          <a href={telLink()} className={styles.cta_card}>
            <span className={styles.cta_icon}>
              <Phone size={18} aria-hidden="true" />
            </span>
            <span className={styles.cta_title}>Call now</span>
            <span className={styles.cta_meta}>{SITE.contact.phoneIntlDisplay}</span>
          </a>
        </div>

        <div className={styles.meta_block} data-animate="fade-up">
          <div>
            <p className={styles.meta_h3}>Where</p>
            <p className={styles.meta_body}>
              {SITE.founder.location}
              <br />
              <a href={`mailto:${SITE.founder.email}`}>{SITE.founder.email}</a>
            </p>
          </div>
          <div>
            <p className={styles.meta_h3}>When</p>
            <p className={styles.meta_body}>
              {SITE.contact.hoursLocal}
              <br />I reply within 1 business day.
            </p>
          </div>
        </div>

        <p className={styles.compliance} data-animate="fade">
          CIPC Reg: {SITE.legal.cipcReg || '-'} &middot; POPIA Information Officer: {SITE.legal.informationOfficer}{' '}
          &middot; VAT status on request.
        </p>
      </div>
    </section>
  );
}
