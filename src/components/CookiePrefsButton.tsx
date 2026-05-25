'use client';

import styles from './Footer.module.css';

export function CookiePrefsButton() {
  return (
    <button
      type="button"
      className={styles.link}
      onClick={() => window.dispatchEvent(new Event('rulerev:consent-reset'))}
      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit' }}
    >
      Cookie preferences
    </button>
  );
}
