/**
 * Client-side helpers to call the backend API for sending emails.
 * All email sending is handled on the server with Nodemailer.
 */

export interface EmailData {
  name: string;
  email: string;
  company: string;
  message: string;
  phone?: string;
}

export interface DiscoveryEmailData {
  contactInfo: {
    name: string;
    email: string;
    company: string;
    phone: string;
  };
  responses: Array<{
    questionId: string;
    answer: string | string[] | number;
    timestamp: Date;
  }>;
  emailContent: string;
}

// Base URL for API. On Netlify set VITE_API_BASE_URL to your server origin.
const API_BASE: string = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Send contact form email via backend API
 */
export const sendContactEmail = async (data: EmailData): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) return false;
    const json = await response.json();
    return Boolean(json?.ok);
  } catch (error) {
    console.error('Error sending contact email via API:', error);
    return false;
  }
};

/**
 * Send discovery form email via backend API
 */
export const sendDiscoveryEmail = async (data: DiscoveryEmailData): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE}/api/discovery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) return false;
    const json = await response.json();
    return Boolean(json?.ok);
  } catch (error) {
    console.error('Error sending discovery email via API:', error);
    return false;
  }
};