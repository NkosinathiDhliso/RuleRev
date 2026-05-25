import React from 'react';
import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  fullScreen = false,
  message = 'Initializing...'
}) => {
  if (fullScreen) {
    return (
      <div className={styles.fullScreenContainer}>
        <div className={styles.logoContainer}>
          <img 
            src="/rulerev-logo.svg" 
            alt="RuleRev" 
            className={styles.logo}
          />
        </div>
        <div className={styles.spinnerContainer}>
          <div className={`${styles.spinner} ${styles[size]}`}>
            <div className={styles.wave1}></div>
            <div className={styles.wave2}></div>
            <div className={styles.wave3}></div>
          </div>
          <p className={styles.loadingText}>{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.spinnerContainer}>
      <div className={`${styles.spinner} ${styles[size]}`}>
        <div className={styles.wave1}></div>
        <div className={styles.wave2}></div>
        <div className={styles.wave3}></div>
      </div>
      {message && <p className={styles.loadingText}>{message}</p>}
    </div>
  );
};