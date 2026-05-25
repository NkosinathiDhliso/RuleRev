import { Question } from '../types/questionnaire';

export const questions: Question[] = [
  // Business Overview (concise)
  {
    id: 'has-website',
    type: 'boolean',
    category: 'Business Overview',
    title: 'Do you currently have a website?',
    required: true,
  },
  {
    id: 'project-type',
    type: 'single-choice',
    category: 'Project Overview',
    title: 'What type of solution do you need?',
    required: true,
    options: [
      { id: 'marketing-website', text: 'Marketing Website', value: 'marketing-website' },
      { id: 'ecommerce', text: 'E‑commerce Store', value: 'ecommerce' },
      { id: 'web-app', text: 'Web Application', value: 'web-app' },
      { id: 'not-sure', text: 'Not sure', value: 'not-sure' }
    ]
  },
  {
    id: 'business-goals',
    type: 'multiple-choice',
    category: 'Project Overview',
    title: 'Primary business goals',
    description: 'Select all that apply',
    required: true,
    options: [
      { id: 'increase-sales', text: 'Increase sales', value: 'increase-sales' },
      { id: 'brand-awareness', text: 'Build brand awareness', value: 'brand-awareness' },
      { id: 'lead-gen', text: 'Generate leads', value: 'lead-gen' },
      { id: 'efficiency', text: 'Improve internal efficiency', value: 'efficiency' }
    ]
  },
  {
    id: 'long-term-vision',
    type: 'textarea',
    category: 'Future-Proofing & Reliability',
    title: 'Looking 3-5 years ahead, how do you see this platform evolving?',
    description: 'Consider potential growth in users, features, or traffic. This helps me design an architecture that can scale with your success.',
    required: false,
    placeholder: 'e.g., "We plan to expand to new regions," or "We expect user-generated content to become a major feature."'
  },
  {
    id: 'maintenance-concerns',
    type: 'multiple-choice',
    category: 'Future-Proofing & Reliability',
    title: 'What are your biggest concerns about the long-term health of your application?',
    description: 'Select all that apply. This helps me prioritize the behind-the-scenes safeguards.',
    required: false,
    options: [
      { id: 'security', text: 'Security vulnerabilities', value: 'security' },
      { id: 'downtime', text: 'Site going down / reliability', value: 'downtime' },
      { id: 'slow-performance', text: 'Slowing down as we grow', value: 'slow-performance' },
      { id: 'update-difficulty', text: 'Difficulty adding new features', value: 'update-difficulty' },
      { id: 'high-costs', text: 'Rising hosting/maintenance costs', value: 'high-costs' }
    ]
  },
  {
    id: 'key-features',
    type: 'multiple-choice',
    category: 'Requirements',
    title: 'Essential features',
    description: 'Select all that apply',
    required: true,
    options: [
      { id: 'forms', text: 'Contact forms', value: 'forms' },
      { id: 'payments', text: 'Online payments', value: 'payments' },
      { id: 'accounts', text: 'User accounts', value: 'accounts' },
      { id: 'cms', text: 'CMS (content management)', value: 'cms' },
      { id: 'integrations', text: '3rd‑party integrations', value: 'integrations' }
    ]
  },
  {
    id: 'design-style',
    type: 'single-choice',
    category: 'Design',
    title: 'Preferred design style',
    required: true,
    options: [
      { id: 'modern', text: 'Modern & Minimal', value: 'modern' },
      { id: 'bold', text: 'Bold & Creative', value: 'bold' },
      { id: 'professional', text: 'Professional', value: 'professional' },
      { id: 'classic', text: 'Classic', value: 'classic' }
    ]
  },
  {
    id: 'timeline',
    type: 'single-choice',
    category: 'Timeline & Budget',
    title: 'Ideal project timeline',
    required: true,
    options: [
      { id: 'asap', text: 'ASAP', value: 'asap' },
      { id: '1-2m', text: '1–2 months', value: '1-2m' },
      { id: '3-4m', text: '3–4 months', value: '3-4m' },
      { id: 'flexible', text: 'Flexible', value: 'flexible' }
    ]
  },
  {
    id: 'budget-range',
    type: 'single-choice',
    category: 'Timeline & Budget',
    title: 'Budget range',
    required: true,
    options: [
      { id: 'under-10k', text: 'Under R 10,000', value: 'under-10k' },
      { id: '10k-25k', text: 'R 10,000 – R 25,000', value: '10k-25k' },
      { id: '25k-50k', text: 'R 25,000 – R 50,000', value: '25k-50k' },
      { id: '50k+', text: 'R 50,000+', value: '50k+' }
    ]
  },
  {
    id: 'contact-info',
    type: 'contact',
    category: 'Contact Information',
    title: 'Your Contact Information',
    description: 'We’ll use this to send you a personalized proposal',
    required: true
  }
];