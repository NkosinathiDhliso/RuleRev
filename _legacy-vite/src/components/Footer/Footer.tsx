import React from 'react';
import styles from './Footer.module.css';

// Preload page components on hover
const preloadPage = (path: string) => {
  switch (path) {
    case '/privacy':
      import('../Privacy/Privacy');
      break;
    case '/terms':
      import('../Terms/Terms');
      break;
    case '/connect':
      import('../Connect/Connect');
      break;
  }
};

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.content}>
          <div className={styles.brand}>
            <h3 className={styles.logo}>RuleRev</h3>
            <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--font-size-xs)', marginTop: 'var(--spacing-2)' }}>
              Engineering Perpetual Web Applications.
            </p>
          </div>
          
          <nav className={styles.nav}>
            <a 
              href="/privacy" 
              className={styles.link}
              onMouseEnter={() => preloadPage('/privacy')}
            >
              Privacy
            </a>
            <a 
              href="/terms" 
              className={styles.link}
              onMouseEnter={() => preloadPage('/terms')}
            >
              Terms
            </a>
            <a 
              href="/connect" 
              className={styles.link}
              onMouseEnter={() => preloadPage('/connect')}
            >
              Connect
            </a>
          </nav>
          
          <div className={styles.copyright}>
            <p>© 2025 RuleRev</p>
          </div>
        </div>
      </div>
    </footer>
  );
};