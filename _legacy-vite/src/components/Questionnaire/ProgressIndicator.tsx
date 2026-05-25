import React from 'react';
import styles from './ProgressIndicator.module.css';

interface ProgressIndicatorProps {
  current: number;
  total: number;
  progress: number;
  onStepClick: (index: number) => void;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  current,
  total,
  progress,
  onStepClick
}) => {
  return (
    <div className={styles.progressContainer}>
      {/* Progress Bar */}
      <div className={styles.progressBar}>
        <div 
          className={styles.progressFill}
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Progress Text */}
      <div className={styles.progressText}>
        <span className={styles.currentStep}>Question {current} of {total}</span>
        <span className={styles.percentage}>{Math.round(progress)}% Complete</span>
      </div>
      
      {/* Step Indicators */}
      <div className={styles.stepIndicators}>
        {Array.from({ length: Math.min(total, 10) }, (_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === current;
          const isCompleted = stepNumber < current;
          const isClickable = stepNumber <= current;
          
          return (
            <button
              key={index}
              className={`${styles.stepIndicator} ${
                isActive ? styles.active : ''
              } ${isCompleted ? styles.completed : ''} ${
                isClickable ? styles.clickable : ''
              }`}
              onClick={() => isClickable && onStepClick(index)}
              disabled={!isClickable}
              aria-label={`Go to question ${stepNumber}`}
            >
              {isCompleted ? '✓' : stepNumber}
            </button>
          );
        })}
        
        {total > 10 && (
          <span className={styles.moreIndicator}>
            +{total - 10} more
          </span>
        )}
      </div>
    </div>
  );
};