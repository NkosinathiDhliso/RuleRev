export interface QuestionOption {
  id: string;
  text: string;
  value: string;
}

export interface Question {
  id: string;
  type: 'single-choice' | 'multiple-choice' | 'text' | 'textarea' | 'scale' | 'contact' | 'boolean';
  category: string;
  title: string;
  description?: string;
  required: boolean;
  options?: QuestionOption[];
  placeholder?: string;
  min?: number;
  max?: number;
  scaleLabels?: { min: string; max: string };
}

export interface QuestionnaireResponse {
  questionId: string;
  answer: string | string[] | number;
  timestamp: Date;
}

export interface QuestionnaireState {
  currentQuestionIndex: number;
  responses: QuestionnaireResponse[];
  isComplete: boolean;
  isSubmitting: boolean;
  showSuccessModal: boolean;
}

export interface ContactInfo {
  name: string;
  email: string;
  company: string;
  phone: string;
}