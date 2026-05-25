import React from 'react';
import { Card, CardBody } from '../ui';
import { Shield } from 'lucide-react';
import styles from './Privacy.module.css';

export const Privacy: React.FC = () => {
  return (
    <div className={styles.privacyPage}>
      <div className="container">
        <div className={styles.header}>
          <div className={styles.icon}>
            <Shield size={48} />
          </div>
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.subtitle}>
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
          <p className={styles.lastUpdated}>Last updated: January 2025</p>
        </div>

        <div className={styles.content}>
          <Card variant="elevated" className={styles.policyCard}>
            <CardBody className={styles.policyBody}>
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Information We Collect</h2>
                <p className={styles.text}>
                  We collect information you provide directly to us, such as when you:
                </p>
                <ul className={styles.list}>
                  <li>Complete our Discovery questionnaire</li>
                  <li>Contact us through our forms or email</li>
                  <li>Subscribe to our communications</li>
                  <li>Engage with our services</li>
                </ul>
                <p className={styles.text}>
                  This may include your name, email address, company information, project details, 
                  and any other information you choose to provide.
                </p>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>How We Use Your Information</h2>
                <p className={styles.text}>
                  We use the information we collect to:
                </p>
                <ul className={styles.list}>
                  <li>Provide and improve our services</li>
                  <li>Respond to your inquiries and requests</li>
                  <li>Send you relevant project updates and communications</li>
                  <li>Analyze and improve our website and services</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Information Sharing</h2>
                <p className={styles.text}>
                  We do not sell, trade, or otherwise transfer your personal information to third parties 
                  without your consent, except as described in this policy. We may share information:
                </p>
                <ul className={styles.list}>
                  <li>With trusted service providers who assist in our operations</li>
                  <li>When required by law or to protect our rights</li>
                  <li>In connection with a business transfer or acquisition</li>
                </ul>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Data Security</h2>
                <p className={styles.text}>
                  We implement appropriate security measures to protect your personal information against 
                  unauthorized access, alteration, disclosure, or destruction. However, no method of 
                  transmission over the internet is 100% secure.
                </p>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Your Rights</h2>
                <p className={styles.text}>
                  You have the right to:
                </p>
                <ul className={styles.list}>
                  <li>Access and update your personal information</li>
                  <li>Request deletion of your data</li>
                  <li>Opt out of marketing communications</li>
                  <li>Request a copy of your data</li>
                </ul>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Cookies and Tracking</h2>
                <p className={styles.text}>
                  We use cookies and similar technologies to enhance your experience on our website. 
                  You can control cookie settings through your browser preferences.
                </p>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Contact Us</h2>
                <p className={styles.text}>
                  If you have any questions about this Privacy Policy or our data practices, 
                  please contact us at:
                </p>
                <div className={styles.contactInfo}>
                  <p><strong>Email:</strong> support@rulerev.com</p>
                  <p><strong>Address:</strong> Fourways, South Africa</p>
                </div>
              </section>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};