import React from 'react';
import { Button } from '../ui';
import { ChevronLeft, ChevronRight, Send } from 'lucide-react';
import styles from './NavigationControls.module.css';

interface NavigationControlsProps {
  currentIndex: number;
  totalQuestions: number;
  canProceed: boolean;
  isSubmitting: boolean;
  isComplete: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  hideNext?: boolean;
}

export const NavigationControls: React.FC<NavigationControlsProps> = ({
  currentIndex,
  totalQuestions,
  canProceed,
  isSubmitting,
  isComplete,
  onPrevious,
  onNext,
  onSubmit,
  hideNext
}) => {
  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === totalQuestions - 1;

  return (
    <div className={styles.navigationControls}>
      <div className={styles.controlsContainer}>
        <div className={styles.leftControls}>
          {!isFirstQuestion && (
            <Button
              variant="ghost"
              leftIcon={<ChevronLeft size={20} />}
              onClick={onPrevious}
              disabled={isSubmitting}
            >
              Previous
            </Button>
          )}
        </div>

        <div className={styles.centerInfo}>
          <span className={styles.questionCounter}>
            {currentIndex + 1} of {totalQuestions}
          </span>
        </div>

        <div className={styles.rightControls}>
          {isLastQuestion ? (
            <Button
              variant="accent"
              size="large"
              rightIcon={isSubmitting ? undefined : <Send size={20} />}
              onClick={onSubmit}
              disabled={!canProceed || isSubmitting}
              loading={isSubmitting}
              className={styles.submitButton}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Discovery'}
            </Button>
          ) : (
            !hideNext && (
              <Button
                variant={canProceed ? 'accent' : 'ghost'}
                rightIcon={<ChevronRight size={20} />}
                onClick={onNext}
                disabled={!canProceed}
              >
                Next Question
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  );
};