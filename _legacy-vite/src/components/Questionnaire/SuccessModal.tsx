import React from 'react';
import { Card, CardBody, Button } from '../ui';
import { CheckCircle, X } from 'lucide-react';
import styles from './SuccessModal.module.css';

interface SuccessModalProps {
  onClose: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ onClose }) => {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <Card 
        variant="elevated" 
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <CardBody className={styles.modalBody}>
          <button 
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
          
          <div className={styles.icon}>
            <CheckCircle size={64} />
          </div>
          
          <h2 className={styles.title}>Discovery Submitted Successfully!</h2>
          
          <div className={styles.content}>
            <p className={styles.message}>
              Thank you for providing these crucial insights. This information is the first step in architecting a robust and reliable digital solution that is built not just for launch, but for a perpetual lifecycle.
            </p>
            
            <div className={styles.nextSteps}>
              <h3 className={styles.nextStepsTitle}>What happens next?</h3>
              <ul className={styles.stepsList}>
                <li>We'll review your responses within 24 hours</li>
                <li>Our team will prepare a personalized proposal</li>
                <li>We'll schedule a consultation call to discuss your project</li>
                <li>Together, we'll refine the perfect solution for you</li>
              </ul>
            </div>
          </div>
          
          <div className={styles.actions}>
            <Button 
              variant="accent" 
              onClick={() => window.location.href = '/'}
              className={styles.homeButton}
            >
              Return to Homepage
            </Button>
            <Button 
              variant="ghost" 
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};