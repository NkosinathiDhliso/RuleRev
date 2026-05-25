'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './Button';
import { NAV_LINKS } from '@/lib/nav';
import { SITE, bookCallHref } from '@/lib/site';
import { track } from '@/lib/analytics';
import styles from './Header.module.css';

export function Header() {
  const pathname = usePathname() ?? '/';
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <>
      <header className={styles.header}>
        <nav className={styles.pill} aria-label="Primary">
          <Link href="/" className={styles.brand} aria-label={`${SITE.name} home`}>
            {SITE.name}
          </Link>

          <div className={styles.nav_desktop}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.nav_link} ${isActive(link.href) ? styles.nav_link_active : ''}`}
                aria-current={isActive(link.href) ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className={styles.cta_desktop}>
            <a
              href={bookCallHref()}
              target="_blank"
              rel="noopener"
              className={styles.cta_btn}
              onClick={() => track('cta_click', { cta_type: 'book_call', page: pathname, location: 'header' })}
            >
              Book a call
            </a>
          </div>

          <button
            type="button"
            className={styles.menu_button}
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(true)}
          >
            <Menu size={18} aria-hidden="true" />
          </button>
        </nav>
      </header>

      {open ? (
        <div className={styles.overlay} role="dialog" aria-modal="true" id="mobile-menu" aria-label="Menu">
          <div className={styles.overlay_top}>
            <Link href="/" className={styles.overlay_brand}>
              {SITE.name}
            </Link>
            <button
              type="button"
              className={styles.menu_button}
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              style={{ background: 'rgba(255,255,255,0.1)' }}
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
          <nav className={styles.overlay_links} aria-label="Mobile primary">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.overlay_link} ${isActive(link.href) ? styles.overlay_link_active : ''}`}
                aria-current={isActive(link.href) ? 'page' : undefined}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/contact" className={styles.overlay_link} onClick={() => setOpen(false)}>
              Contact
            </Link>
          </nav>
          <div className={styles.overlay_cta}>
            <Button
              href={bookCallHref()}
              variant="accent"
              external
              full
              onClick={() => track('cta_click', { cta_type: 'book_call', page: pathname, location: 'header' })}
            >
              Book a call
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
}
