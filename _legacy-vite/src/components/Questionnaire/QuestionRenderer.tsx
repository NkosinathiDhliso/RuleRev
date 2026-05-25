import React from 'react';
import { Card, CardBody, Button } from '../ui';
import { Question, ContactInfo } from '../../types/questionnaire';
import styles from './QuestionRenderer.module.css';

interface QuestionRendererProps {
  question: Question;
  response: string | string[] | number | undefined;
  contactInfo: ContactInfo;
  onResponseChange: (questionId: string, answer: string | string[] | number) => void;
  onContactInfoChange: (info: Partial<ContactInfo>) => void;
  canProceed?: boolean;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  response,
  contactInfo,
  onResponseChange,
  onContactInfoChange,
  canProceed
}) => {
  const renderQuestionContent = () => {
    switch (question.type) {
      case 'boolean':
        return (
          <div className={styles.choiceGrid}>
            {['yes', 'no'].map(val => (
              <Button
                key={val}
                variant={response === val ? 'accent' : 'glass'}
                className={styles.choiceButton}
                onClick={() => onResponseChange(question.id, val)}
              >
                {val === 'yes' ? 'Yes' : 'No'}
              </Button>
            ))}
          </div>
        );
      case 'single-choice':
        return (
          <div className={styles.choiceGrid}>
            {question.options?.map((option) => (
              <Button
                key={option.id}
                variant={response === option.value ? 'accent' : 'glass'}
                className={styles.choiceButton}
                onClick={() => onResponseChange(question.id, option.value)}
              >
                {option.text}
              </Button>
            ))}
          </div>
        );

      case 'multiple-choice':
        const selectedValues = Array.isArray(response) ? response : [];
        return (
          <div className={styles.choiceGrid}>
            {question.options?.map((option) => {
              const isSelected = selectedValues.includes(option.value);
              return (
                <Button
                  key={option.id}
                  variant={isSelected ? 'accent' : 'glass'}
                  className={styles.choiceButton}
                  onClick={() => {
                    const newSelection = isSelected
                      ? selectedValues.filter(v => v !== option.value)
                      : [...selectedValues, option.value];
                    onResponseChange(question.id, newSelection);
                  }}
                >
                  {option.text}
                </Button>
              );
            })}
          </div>
        );

      case 'scale':
        const scaleValue = typeof response === 'number' ? response : question.min || 1;
        return (
          <div className={styles.scaleContainer}>
            <div className={styles.scaleLabels}>
              <span className={styles.scaleLabel}>{question.scaleLabels?.min}</span>
              <span className={styles.scaleLabel}>{question.scaleLabels?.max}</span>
            </div>
            <div className={styles.scaleSlider}>
              <input
                type="range"
                min={question.min || 1}
                max={question.max || 10}
                value={scaleValue}
                onChange={(e) => onResponseChange(question.id, parseInt(e.target.value))}
                className={styles.slider}
              />
              <div className={styles.scaleValue}>
                {scaleValue} / {question.max || 10}
              </div>
            </div>
          </div>
        );

      case 'text':
        return (
          <input
            type="text"
            value={typeof response === 'string' ? response : ''}
            onChange={(e) => onResponseChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            className={styles.textInput}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={typeof response === 'string' ? response : ''}
            onChange={(e) => onResponseChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            rows={6}
            className={styles.textarea}
          />
        );

      case 'contact':
        return (
          <div className={styles.contactForm}>
            <div className={styles.contactGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Full Name *</label>
                <input
                  type="text"
                  value={contactInfo.name}
                  onChange={(e) => onContactInfoChange({ name: e.target.value })}
                  className={styles.textInput}
                  placeholder="Your full name"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Email Address *</label>
                <input
                  type="email"
                  value={contactInfo.email}
                  onChange={(e) => onContactInfoChange({ email: e.target.value })}
                  className={styles.textInput}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Company Name *</label>
                <input
                  type="text"
                  value={contactInfo.company}
                  onChange={(e) => onContactInfoChange({ company: e.target.value })}
                  className={styles.textInput}
                  placeholder="Your company name"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Phone Number</label>
                <input
                  type="tel"
                  value={contactInfo.phone}
                  onChange={(e) => onContactInfoChange({ phone: e.target.value })}
                  className={styles.textInput}
                  placeholder="+27 (0) 61 450 9800"
                />
              </div>
            </div>
          </div>
        );

      default:
        return <div>Unsupported question type</div>;
    }
  };

  return (
    <Card variant="elevated" className={styles.questionCard}>
      <CardBody className={styles.questionBody}>
        <div className={styles.questionHeader}>
          <div className={styles.categoryTag}>{question.category}</div>
          <h2 className={styles.questionTitle}>
            {question.title}
            {question.required && <span className={styles.required}>*</span>}
          </h2>
          {question.description && (
            <p className={styles.questionDescription}>{question.description}</p>
          )}
        </div>
        <div className={styles.questionContent}>{renderQuestionContent()}</div>
      </CardBody>
    </Card>
  );
};