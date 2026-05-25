import Link from 'next/link';
import { Linkedin, Github } from 'lucide-react';
import { SITE } from '@/lib/site';
import { FOOTER_PAGES } from '@/lib/nav';
import { whatsappLink, telLink, emailLink } from '@/lib/whatsapp';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container-page">
        <div className={styles.grid}>
          <div>
            <Link href="/" className={styles.brand}>
              {SITE.name}
            </Link>
            <p className={styles.tagline}>{SITE.positioning}</p>
            <div className={styles.social}>
              <a href={SITE.founder.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn">
                <Linkedin size={16} aria-hidden="true" />
              </a>
              <a href={SITE.founder.github} target="_blank" rel="noopener" aria-label="GitHub">
                <Github size={16} aria-hidden="true" />
              </a>
            </div>
          </div>

          <div>
            <p className={styles.col_title}>Pages</p>
            <ul className={styles.list}>
              {FOOTER_PAGES.map((p) => (
                <li key={p.href}>
                  <Link href={p.href} className={styles.link}>
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className={styles.col_title}>Contact</p>
            <ul className={styles.list}>
              <li>
                <a href={telLink()} className={styles.link}>
                  {SITE.contact.phoneIntlDisplay}
                </a>
              </li>
              <li>
                <a href={emailLink()} className={styles.link}>
                  {SITE.founder.email}
                </a>
              </li>
              <li>
                <a href={whatsappLink('contact')} className={styles.link} target="_blank" rel="noopener">
                  WhatsApp
                </a>
              </li>
              <li>
                <address className={styles.address}>{SITE.founder.location}</address>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>
            &copy; {new Date().getFullYear()} {SITE.name}. CIPC Reg: {SITE.legal.cipcReg || '-'}. POPIA Information Officer:{' '}
            {SITE.legal.informationOfficer}.
          </p>
          <div className={styles.bottom_links}>
            <Link href="/sitemap.xml" title="XML Sitemap for search engines">Sitemap</Link>
            <Link href="/writing/rss.xml" title="Subscribe via RSS reader">RSS</Link>
            <a href={SITE.external.proprofile} target="_blank" rel="noopener">
              Building ProProfile
            </a>
            <a href={SITE.external.sensa} target="_blank" rel="noopener">
              Building Sensa
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
