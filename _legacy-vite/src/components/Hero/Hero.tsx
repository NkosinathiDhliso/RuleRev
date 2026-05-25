import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui';
import { ArrowRight } from 'lucide-react';
import styles from './Hero.module.css';
import gsap from 'gsap';

export const Hero: React.FC = () => {
  const rootRef = useRef<HTMLElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.set([`.${styles.headline}`, `.${styles.subtitle}`, `.${styles.cta}`], { opacity: 0, y: 24 });
      gsap.to(`.${styles.headline}`, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
      gsap.to(`.${styles.subtitle}`, { opacity: 1, y: 0, duration: 0.8, delay: 0.15, ease: 'power3.out' });
      gsap.to(`.${styles.cta}`, { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: 'power3.out' });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.hero} ref={rootRef}>
      <div className="container">
        <div className={styles.content}>
          <h1 className={styles.headline}>
            Beyond the Launch. <span className="gradient-text">Built to Last.</span>
          </h1>
          <p className={styles.subtitle}>
            As a DevOps Engineer and Solutions Architect, I build web applications with a perpetual lifecycle. 
            I engineer the reliable, behind-the-scenes architecture that prevents the "build and neglect" cycle, ensuring your digital presence is a long-term asset, not a short-term project.
          </p>
          <div className={styles.cta}>
            <Button 
              variant="accent" 
              size="large" 
              rightIcon={<ArrowRight size={20} />}
              onClick={() => navigate('/discovery')}
            >
              Begin Your Project
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};