'use client';

import { usePathname } from 'next/navigation';
import { Calendar, MessageCircle, Phone } from 'lucide-react';
import { Button } from './Button';
import { whatsappLink, telLink } from '@/lib/whatsapp';
import { bookCallHref } from '@/lib/site';
import { track } from '@/lib/analytics';
import type { CTALocation } from '@/lib/analytics';
import type { WhatsAppContext } from '@/lib/whatsapp';
import styles from './FinalCTABand.module.css';

type Props = {
  title?: string;
  lede?: string;
  whatsappContext?: WhatsAppContext;
  location?: CTALocation;
};

export function FinalCTABand({
  title = 'Tell me what you’re building.',
  lede = 'Pick the path that suits you. I respond within 1 business day.',
  whatsappContext = 'final_cta',
  location = 'final_band',
}: Props) {
  const pathname = usePathname() ?? '/';
  return (
    <div className={styles.band}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.lede}>{lede}</p>
      <div className={styles.actions}>
        <Button
          href={bookCallHref()}
          variant="accent"
          external
          onClick={() => track('cta_click', { cta_type: 'book_call', page: pathname, location })}
        >
          <Calendar size={16} aria-hidden="true" />
          Book a call
        </Button>
        <a
          href={whatsappLink(whatsappContext)}
          target="_blank"
          rel="noopener"
          className={`${styles.dark_button_outline}`}
          onClick={() => track('cta_click', { cta_type: 'whatsapp', page: pathname, location })}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 18px',
            borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.32)',
            color: '#fff',
            fontSize: 15,
            fontWeight: 500,
          }}
        >
          <MessageCircle size={16} aria-hidden="true" />
          WhatsApp
        </a>
        <a
          href={telLink()}
          onClick={() => track('cta_click', { cta_type: 'phone', page: pathname, location })}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 18px',
            borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.32)',
            color: '#fff',
            fontSize: 15,
            fontWeight: 500,
          }}
        >
          <Phone size={16} aria-hidden="true" />
          Call now
        </a>
      </div>
    </div>
  );
}
