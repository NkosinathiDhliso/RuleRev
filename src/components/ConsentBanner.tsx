'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { GA_MEASUREMENT_ID } from '@/lib/site';
import { hasGA } from '@/lib/analytics';
import styles from './ConsentBanner.module.css';

const STORAGE_KEY = 'rulerev:consent';
type ConsentValue = 'granted' | 'denied';

export function ConsentBanner() {
  const [consent, setConsent] = useState<ConsentValue | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY) as ConsentValue | null;
      if (stored === 'granted' || stored === 'denied') {
        setConsent(stored);
        window.__ruleRevConsent = stored;
      }
    } catch {}
  }, []);

  const decide = (value: ConsentValue) => {
    setConsent(value);
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {}
    window.__ruleRevConsent = value;
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        analytics_storage: value,
        ad_storage: 'denied',
      });
    }
  };

  if (!mounted) return null;

  return (
    <>
      {hasGA() && consent === 'granted' ? (
        <>
          <Script
            id="ga-src"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', { anonymize_ip: true });
            `}
          </Script>
        </>
      ) : null}

      {consent === null ? (
        <div className={styles.banner} role="dialog" aria-label="Cookie consent">
          <p className={styles.text}>
            I use cookies to measure how the site is performing. Nothing tracks you across other sites. You can accept,
            reject, or change your mind later.
          </p>
          <div className={styles.actions}>
            <button type="button" className={styles.button} onClick={() => decide('denied')}>
              Reject
            </button>
            <button
              type="button"
              className={`${styles.button} ${styles.button_primary}`}
              onClick={() => decide('granted')}
            >
              Accept
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
