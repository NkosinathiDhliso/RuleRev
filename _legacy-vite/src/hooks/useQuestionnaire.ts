import { useState, useCallback } from 'react';
import { QuestionnaireState, QuestionnaireResponse, ContactInfo, QuestionOption } from '../types/questionnaire';
import { questions } from '../data/questionnaireData';
import { sendDiscoveryEmail } from '../utils/sesClient';

const initialState: QuestionnaireState = {
  currentQuestionIndex: 0,
  responses: [],
  isComplete: false,
  isSubmitting: false,
  showSuccessModal: false
};

export const useQuestionnaire = () => {
  const [state, setState] = useState<QuestionnaireState>(initialState);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    name: '',
    email: '',
    company: '',
    phone: ''
  });

  const currentQuestion = questions[state.currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = ((state.currentQuestionIndex + 1) / totalQuestions) * 100;

  const nextQuestion = useCallback(() => {
    setState(prev => {
      const nextIndex = prev.currentQuestionIndex + 1;
      return {
        ...prev,
        currentQuestionIndex: nextIndex,
        isComplete: nextIndex >= totalQuestions
      };
    });
  }, [totalQuestions]);

  const previousQuestion = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentQuestionIndex: Math.max(0, prev.currentQuestionIndex - 1)
    }));
  }, []);

  const goToQuestion = useCallback((index: number) => {
    setState(prev => ({
      ...prev,
      currentQuestionIndex: Math.max(0, Math.min(index, totalQuestions - 1))
    }));
  }, [totalQuestions]);

  const updateResponse = useCallback((questionId: string, answer: string | string[] | number) => {
    setState(prev => {
      const existingIndex = prev.responses.findIndex(r => r.questionId === questionId);
      const newResponse: QuestionnaireResponse = {
        questionId,
        answer,
        timestamp: new Date()
      };

      let updatedResponses;
      if (existingIndex >= 0) {
        updatedResponses = [...prev.responses];
        updatedResponses[existingIndex] = newResponse;
      } else {
        updatedResponses = [...prev.responses, newResponse];
      }

      return {
        ...prev,
        responses: updatedResponses
      };
    });

    // Auto-advance for boolean, single-choice, and scale
    const q = questions.find(q => q.id === questionId);
    if (q) {
      if (q.type === 'boolean' || q.type === 'single-choice' || q.type === 'scale') {
        setTimeout(() => nextQuestion(), 120);
      }
    }
  }, [nextQuestion]);

  const updateContactInfo = useCallback((info: Partial<ContactInfo>) => {
    setContactInfo(prev => ({ ...prev, ...info }));
  }, []);

  const getCurrentResponse = useCallback((questionId: string) => {
    return state.responses.find(r => r.questionId === questionId)?.answer;
  }, [state.responses]);

  const isCurrentQuestionAnswered = useCallback(() => {
    if (!currentQuestion) return false;

    if (currentQuestion.type === 'contact') {
      return Boolean(contactInfo.name && contactInfo.email && contactInfo.company);
    }

    const response = getCurrentResponse(currentQuestion.id);
    if (!currentQuestion.required) return true;

    if (Array.isArray(response)) {
      return response.length > 0;
    }

    return response !== undefined && response !== '' && response !== null;
  }, [currentQuestion, getCurrentResponse, contactInfo]);

  const generateEmailContent = useCallback(() => {
    const responsesByCategory = questions.reduce((acc, question) => {
      if (!acc[question.category]) {
        acc[question.category] = [];
      }

      const response = state.responses.find(r => r.questionId === question.id);
      if (response || question.type === 'contact') {
        acc[question.category].push({
          question,
          response: question.type === 'contact' ? contactInfo : response
        });
      }

      return acc;
    }, {} as Record<string, any[]>);

    let emailContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>RuleRev - New Discovery Submission</title>
  <style>
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; line-height: 1.6; color: #0f172a; background: #ffffff; margin: 0; padding: 20px; }
    .container { max-width: 1200px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #00f5ff 0%, #1e90ff 50%, #20b2aa 100%); padding: 24px; display:flex; align-items:center; gap:12px; }
    .logo { height: 28px; display:block; }
    .header h1 { margin: 0; color: #0b1220; font-size: 22px; font-weight: 700; }
    .header p { margin: 6px 0 0 0; color: #0b1220; font-size: 14px; opacity: 0.85; }
    .content { padding: 28px; }
    .contact-info { background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 12px; padding: 16px; margin-bottom: 24px; }
    .contact-info h2 { margin: 0 0 12px 0; color: #0b1220; font-size: 18px; }
    .contact-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px; }
    .contact-item { display: flex; flex-direction: column; }
    .contact-label { font-size: 11px; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
    .contact-value { font-size: 15px; color: #0f172a; font-weight: 500; }
    .section { margin-bottom: 28px; }
    .section-title { color: #0b1220; font-size: 18px; font-weight: 600; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #e2e8f0; display: inline-block; }
    .questions-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 12px; }
    .question-item { background: #f8fafc; border-radius: 10px; padding: 16px; border-left: 4px solid #1e90ff; }
    .question-item.wide { grid-column: span 2; }
    .question-title { color: #0b1220; font-size: 15px; font-weight: 600; margin-bottom: 6px; }
    .question-answer { color: #0f172a; font-size: 14px; line-height: 1.5; }
    .scale-answer { display: inline-flex; align-items: center; background: #e0f2fe; color: #0b1220; padding: 6px 12px; border-radius: 20px; font-weight: 600; margin-right: 8px; }
    .multiple-choice { display: flex; flex-wrap: wrap; gap: 6px; }
    .choice-tag { background: #e0f2fe; color: #0369a1; padding: 6px 10px; border-radius: 16px; font-size: 13px; border: 1px solid #bae6fd; }
    .boolean-badge { display:inline-block; padding: 6px 10px; border-radius: 14px; font-weight: 600; font-size: 13px; }
    .boolean-yes { background:#dcfce7; color:#166534; border:1px solid #86efac; }
    .boolean-no { background:#fee2e2; color:#991b1b; border:1px solid #fecaca; }
    .footer { background: #f8fafc; padding: 16px 24px; text-align: center; color: #475569; font-size: 13px; border-top: 1px solid #e2e8f0; }
    .timestamp { color: #64748b; font-size: 12px; margin-top: 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img class="logo" src="https://rulerev.com/rulerev-logo.svg" alt="RuleRev" />
      <div>
        <h1>RuleRev - New Project Inquiry</h1>
        <p>Comprehensive Discovery Submission</p>
      </div>
    </div>
    <div class="content">
      <div class="contact-info">
        <h2>Contact Information</h2>
        <div class="contact-grid">
          <div class="contact-item">
            <div class="contact-label">Name</div>
            <div class="contact-value">${contactInfo.name}</div>
          </div>
          <div class="contact-item">
            <div class="contact-label">Email</div>
            <div class="contact-value">${contactInfo.email}</div>
          </div>
          <div class="contact-item">
            <div class="contact-label">Company</div>
            <div class="contact-value">${contactInfo.company}</div>
          </div>
          <div class="contact-item">
            <div class="contact-label">Phone</div>
            <div class="contact-value">${contactInfo.phone || 'Not provided'}</div>
          </div>
        </div>
      </div>
`;

    Object.entries(responsesByCategory).forEach(([category, items]) => {
      if (category === 'Contact Information') return; // Skip contact info as it's already displayed

      emailContent += `
            <div class="section">
                <h2 class="section-title">${category}</h2>
                <div class="questions-grid">
      `;

      items.forEach(({ question, response }) => {
        if (!response) return;

        let answerHtml = '';
        let extraClasses = '';

        if (question.type === 'scale') {
          const scaleValue = response.answer as number;
          answerHtml = `<span class="scale-answer">${scaleValue}/10</span>`;
          if (question.scaleLabels) {
            answerHtml += `<span style="color: #94a3b8; font-size: 14px;">(${question.scaleLabels.min} → ${question.scaleLabels.max})</span>`;
          }
        } else if (question.type === 'boolean') {
          const v = String(response.answer).toLowerCase();
          const yes = v === 'true' || v === 'yes' || v === '1';
          answerHtml = `<span class="boolean-badge ${yes ? 'boolean-yes' : 'boolean-no'}">${yes ? 'Yes' : 'No'}</span>`;
        } else if (question.type === 'multiple-choice') {
          const answers = response.answer as string[];
          answerHtml = `<div class="multiple-choice">`;
           answers.forEach(answer => {
            const option = question.options?.find((opt: QuestionOption) => opt.value === answer);
            answerHtml += `<span class="choice-tag">${option?.text || answer}</span>`;
          });
          answerHtml += `</div>`;
        } else if (question.type === 'single-choice') {
          const option = question.options?.find((opt: QuestionOption) => opt.value === response.answer);
          answerHtml = `<div class="question-answer">${option?.text || response.answer}</div>`;
        } else {
          answerHtml = `<div class="question-answer">${String(response.answer).replace(/\n/g, '<br>')}</div>`;
          const contentLength = String(response.answer || '').length;
          if (question.type === 'textarea' || contentLength > 160) {
            extraClasses = 'wide';
          }
        }

        emailContent += `
                <div class="question-item ${extraClasses}">
                    <div class="question-title">${question.title}</div>
                    ${answerHtml}
                    <div class="timestamp">Answered: ${new Date(response.timestamp).toLocaleString()}</div>
                </div>
        `;
      });

      emailContent += `
                </div>
            </div>`;
    });

    emailContent += `
        </div>

        <div class="footer">
            <p>This discovery was submitted through the RuleRev website.</p>
            <p>Submission Date: ${new Date().toLocaleString()}</p>
        </div>
    </div>
</body>
</html>
    `;

    return emailContent;
  }, [state.responses, contactInfo]);

  const submitQuestionnaire = useCallback(async () => {
    setState(prev => ({ ...prev, isSubmitting: true }));

    try {
      const emailContent = generateEmailContent();

      const success = await sendDiscoveryEmail({
        contactInfo,
        responses: state.responses,
        emailContent
      });

      if (success) {
        setState(prev => ({
          ...prev,
          isSubmitting: false,
          showSuccessModal: true
        }));
      } else {
        throw new Error('Failed to send discovery email');
      }

    } catch (error) {
      console.error('Error submitting discovery:', error);
      setState(prev => ({
        ...prev,
        isSubmitting: false
      }));
      // You could add error state handling here
    }
  }, [state.responses, contactInfo, generateEmailContent]);

  const closeSuccessModal = useCallback(() => {
    setState(prev => ({
      ...prev,
      showSuccessModal: false
    }));
  }, []);

  const resetQuestionnaire = useCallback(() => {
    setState(initialState);
    setContactInfo({ name: '', email: '', company: '', phone: '' });
  }, []);

  return {
    state,
    contactInfo,
    currentQuestion,
    totalQuestions,
    progress,
    updateResponse,
    updateContactInfo,
    nextQuestion,
    previousQuestion,
    goToQuestion,
    getCurrentResponse,
    isCurrentQuestionAnswered,
    submitQuestionnaire,
    closeSuccessModal,
    resetQuestionnaire
  };
};