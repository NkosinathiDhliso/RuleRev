'use client';

import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { whatsappLink } from '@/lib/whatsapp';
import { track } from '@/lib/analytics';
import styles from './FloatingWhatsApp.module.css';

export function FloatingWhatsApp() {
  const pathname = usePathname() ?? '/';
  return (
    <a
      href={whatsappLink('floating')}
      target="_blank"
      rel="noopener"
      className={styles.fab}
      aria-label="Chat on WhatsApp"
      onClick={() => track('cta_click', { cta_type: 'whatsapp', page: pathname, location: 'floating' })}
    >
      <MessageCircle size={24} aria-hidden="true" />
    </a>
  );
}
