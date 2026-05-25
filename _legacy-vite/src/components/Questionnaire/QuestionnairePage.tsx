import React from 'react';
import { useQuestionnaire } from '../../hooks/useQuestionnaire';
import { QuestionRenderer } from './QuestionRenderer';
import { ProgressIndicator } from './ProgressIndicator';
import { NavigationControls } from './NavigationControls';
import { SuccessModal } from './SuccessModal';
import styles from './QuestionnairePage.module.css';

export const QuestionnairePage: React.FC = () => {
  const questionnaire = useQuestionnaire();
  const { state, currentQuestion, totalQuestions, progress } = questionnaire;

  if (!currentQuestion) {
    return (
      <div className={styles.discoveryPage}>
        <div className="container">
          <div className={styles.errorState}>
            <h1>Discovery Complete</h1>
            <p>Thank you for your responses!</p>
          </div>
        </div>
      </div>
    );
  }

  const canProceed = questionnaire.isCurrentQuestionAnswered();
  const autoAdvanceTypes = new Set(['boolean', 'single-choice', 'scale']);
  const shouldHideNext = autoAdvanceTypes.has(currentQuestion.type);

  return (
    <div className={styles.discoveryPage}>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>Project Discovery</h1>
          <p className={styles.subtitle}>
            Help us understand your needs so we can create the perfect solution for you.
          </p>
          <ProgressIndicator 
            current={state.currentQuestionIndex + 1}
            total={totalQuestions}
            progress={progress}
            onStepClick={questionnaire.goToQuestion}
          />
        </div>

        <div className={styles.content}>
          <div className={styles.questionContainer}>
            <QuestionRenderer 
              question={currentQuestion}
              response={questionnaire.getCurrentResponse(currentQuestion.id)}
              contactInfo={questionnaire.contactInfo}
              onResponseChange={questionnaire.updateResponse}
              onContactInfoChange={questionnaire.updateContactInfo}
              canProceed={canProceed}
            />
          </div>

          <NavigationControls 
            currentIndex={state.currentQuestionIndex}
            totalQuestions={totalQuestions}
            canProceed={canProceed}
            isSubmitting={state.isSubmitting}
            isComplete={state.isComplete}
            onPrevious={questionnaire.previousQuestion}
            onNext={questionnaire.nextQuestion}
            onSubmit={questionnaire.submitQuestionnaire}
            hideNext={shouldHideNext}
          />
        </div>

        {state.showSuccessModal && (
          <SuccessModal onClose={questionnaire.closeSuccessModal} />
        )}
      </div>
    </div>
  );
};