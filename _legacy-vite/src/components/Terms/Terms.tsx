import React from 'react';
import { Card, CardBody } from '../ui';
import { FileText } from 'lucide-react';
import styles from './Terms.module.css';

export const Terms: React.FC = () => {
  return (
    <div className={styles.termsPage}>
      <div className="container">
        <div className={styles.header}>
          <div className={styles.icon}>
            <FileText size={48} />
          </div>
          <h1 className={styles.title}>Terms of Service</h1>
          <p className={styles.subtitle}>
            These terms govern your use of our services and website. Please read them carefully.
          </p>
          <p className={styles.lastUpdated}>Last updated: January 2025</p>
        </div>

        <div className={styles.content}>
          <Card variant="elevated" className={styles.termsCard}>
            <CardBody className={styles.termsBody}>
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Acceptance of Terms</h2>
                <p className={styles.text}>
                  By accessing and using RuleRev's website and services, you accept and agree to be bound 
                  by the terms and provision of this agreement. If you do not agree to abide by the above, 
                  please do not use this service.
                </p>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Services Description</h2>
                <p className={styles.text}>
                  RuleRev provides digital solutions including:
                </p>
                <ul className={styles.list}>
                  <li>Website design and development</li>
                  <li>E-commerce platform creation</li>
                  <li>Private workspace development</li>
                  <li>Digital consultation services</li>
                  <li>Ongoing support and maintenance</li>
                </ul>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Client Responsibilities</h2>
                <p className={styles.text}>
                  As a client, you agree to:
                </p>
                <ul className={styles.list}>
                  <li>Provide accurate and complete information</li>
                  <li>Respond to requests for information in a timely manner</li>
                  <li>Review and approve deliverables within agreed timeframes</li>
                  <li>Make payments according to the agreed schedule</li>
                  <li>Respect intellectual property rights</li>
                </ul>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Payment Terms</h2>
                <p className={styles.text}>
                  Payment terms will be specified in individual project agreements. Generally:
                </p>
                <ul className={styles.list}>
                  <li>A deposit is required before work begins</li>
                  <li>Progress payments may be required for larger projects</li>
                  <li>Final payment is due upon project completion</li>
                  <li>Late payments may incur additional fees</li>
                </ul>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Intellectual Property</h2>
                <p className={styles.text}>
                  Upon full payment, clients receive ownership of the final deliverables. However:
                </p>
                <ul className={styles.list}>
                  <li>RuleRev retains rights to general methodologies and techniques</li>
                  <li>Third-party components remain subject to their respective licenses</li>
                  <li>RuleRev may showcase completed work in portfolios</li>
                </ul>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Limitation of Liability</h2>
                <p className={styles.text}>
                  RuleRev's liability is limited to the amount paid for services. We are not liable for:
                </p>
                <ul className={styles.list}>
                  <li>Indirect or consequential damages</li>
                  <li>Loss of profits or business opportunities</li>
                  <li>Third-party service interruptions</li>
                  <li>Data loss not caused by our negligence</li>
                </ul>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Termination</h2>
                <p className={styles.text}>
                  Either party may terminate services with written notice. Upon termination:
                </p>
                <ul className={styles.list}>
                  <li>Payment is due for work completed</li>
                  <li>Deliverables completed to date will be provided</li>
                  <li>Confidential information must be returned</li>
                </ul>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Governing Law</h2>
                <p className={styles.text}>
                  These terms are governed by the laws of South Africa. Any disputes will be resolved 
                  through the courts of Johannesburg, South Africa.
                </p>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Contact Information</h2>
                <p className={styles.text}>
                  For questions about these terms, please contact us at:
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