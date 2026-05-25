import React, { useState } from 'react';
import { Card, CardBody, Button } from '../ui';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { sendContactEmail } from '../../utils/sesClient';
import styles from './Connect.module.css';

export const Connect: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const success = await sendContactEmail({
        name: formData.name,
        email: formData.email,
        company: formData.company,
        message: formData.message
      });
      
      if (success) {
        setIsSubmitted(true);
      } else {
        setSubmitError('Failed to send message. Please try again or contact us directly.');
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      setSubmitError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (isSubmitted) {
    return (
      <div className={styles.connectPage}>
        <div className="container">
          <div className={styles.successMessage}>
            <CheckCircle size={64} className={styles.successIcon} />
            <h1 className={styles.successTitle}>Message Sent Successfully!</h1>
            <p className={styles.successText}>
              Thank you for reaching out. We'll get back to you within 24 hours.
            </p>
            <Button 
              variant="accent" 
              onClick={() => window.location.href = '/'}
            >
              Return Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.connectPage}>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>Let's Connect</h1>
          <p className={styles.subtitle}>
            Ready to start your digital journey? We're here to help bring your vision to life.
          </p>
        </div>

        <div className={styles.content}>
          <div className={styles.contactInfo}>
            <Card variant="elevated" className={styles.infoCard}>
              <CardBody>
                <h2 className={styles.infoTitle}>Get in Touch</h2>
                
                <div className={styles.contactItem}>
                  <Mail size={24} className={styles.contactIcon} />
                  <div>
                    <h3 className={styles.contactLabel}>Email</h3>
                    <p className={styles.contactValue}>support@rulerev.com</p>
                  </div>
                </div>

                <div className={styles.contactItem}>
                  <Phone size={24} className={styles.contactIcon} />
                  <div>
                    <h3 className={styles.contactLabel}>Phone</h3>
                    <p className={styles.contactValue}>+27 (0) 61 450 9800</p>
                  </div>
                </div>

                <div className={styles.contactItem}>
                  <MapPin size={24} className={styles.contactIcon} />
                  <div>
                    <h3 className={styles.contactLabel}>Location</h3>
                    <p className={styles.contactValue}>Fourways, South Africa</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          <div className={styles.contactForm}>
            <Card variant="elevated" className={styles.formCard}>
              <CardBody>
                <h2 className={styles.formTitle}>Send us a Message</h2>
                
                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.label}>Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className={styles.input}
                      placeholder="Your full name"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={styles.input}
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="company" className={styles.label}>Company</label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="Your company name"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="message" className={styles.label}>Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className={styles.textarea}
                      placeholder="Tell us about your project..."
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="accent"
                    size="large"
                    fullWidth
                    loading={isSubmitting}
                    rightIcon={!isSubmitting ? <Send size={20} /> : undefined}
                    disabled={!formData.name || !formData.email || !formData.message}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                  
                  {submitError && (
                    <div className={styles.errorMessage}>
                      <p>{submitError}</p>
                    </div>
                  )}
                </form>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};