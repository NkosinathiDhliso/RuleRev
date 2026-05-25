import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../ui';
import { Menu, X } from 'lucide-react';
import styles from './Header.module.css';
import gsap from 'gsap';
import { Link, useNavigate } from 'react-router-dom';

// Preload page components on hover for instant navigation
const preloadPage = (path: string) => {
  switch (path) {
    case '/discovery':
      import('../Questionnaire/QuestionnairePage');
      break;
    case '/connect':
      import('../Connect/Connect');
      break;
    case '/projects':
      import('../Projects/Projects');
      break;
    case '/privacy':
      import('../Privacy/Privacy');
      break;
    case '/terms':
      import('../Terms/Terms');
      break;
  }
};

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!headerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.set([`.${styles.logo}`, `.${styles.nav} a`], { opacity: 0, y: -12 });
      gsap.to(`.${styles.logo}`, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
      gsap.to(`.${styles.nav} a`, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.08, delay: 0.1 });
    }, headerRef);
    return () => ctx.revert();
  }, []);

  return (
    <header className={styles.header} ref={headerRef}>
      <div className="container">
        <div className={styles.content}>
          <div className={styles.brand}>
            <button 
              className={styles.logoButton}
              onClick={() => navigate('/')}
              aria-label="Go to homepage"
            >
              <h1 className={styles.logo}>RuleRev</h1>
            </button>
          </div>
          
          <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
            <Link 
              to="/projects" 
              className={styles.navLink}
              onMouseEnter={() => preloadPage('/projects')}
            >
              Projects
            </Link>
            <Link 
              to="/discovery" 
              className={styles.navLink}
              onMouseEnter={() => preloadPage('/discovery')}
            >
              Discovery
            </Link>
            <Link 
              to="/connect" 
              className={styles.navLink}
              onMouseEnter={() => preloadPage('/connect')}
            >
              Connect
            </Link>
          </nav>
          
          <button 
            className={styles.menuToggle}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
};