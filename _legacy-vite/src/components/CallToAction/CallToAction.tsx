import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui';
import { MessageCircle } from 'lucide-react';
import styles from './CallToAction.module.css';

export const CallToAction: React.FC = () => {
  const navigate = useNavigate();
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.content}>
          <h2 className={styles.headline}>Ready to Build Your Digital Foundation?</h2>
          <p className={styles.description}>
            Let's move beyond a simple launch. I'm here to architect a reliable, perpetual solution that grows with your business. Let's start the conversation about your project's future.
          </p>
          <div className={styles.actions}>
            <Button 
              variant="accent" 
              size="large" 
              onClick={() => navigate('/discovery')}
            >
              Start Your Project Discovery
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};