import type { Metadata } from 'next';
import { ScopeChat } from '@/components/ScopeChat';
import { Section } from '@/components/Section';
import { SplitWords } from '@/components/SplitWords';
import { SITE } from '@/lib/site';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Scope Your Project with AI',
  description: 'Have a quick chat with our Claude-powered project advisor to scope your needs, get a recommended service, and fast-track your discovery call.',
  alternates: { canonical: '/scope' },
};

export default function ScopePage() {
  return (
    <>
      <Section className={styles.hero}>
        <div className="container-page">
          <div className={styles.header_content}>
            <SplitWords as="h1" className={styles.h1} text="Scope your project" baseDelay={0} />
            <p className={styles.lede} data-animate="fade-up" style={{ ['--d' as string]: '300ms' }}>
              Have a quick chat with our Claude-powered project advisor. Tell us what you&rsquo;re building, 
              and we&rsquo;ll recommend the right service and outline a preliminary scope before we even jump on a call.
            </p>
          </div>
          
          <div className={styles.chat_wrapper} data-animate="fade-up" style={{ ['--d' as string]: '600ms' }}>
            <ScopeChat />
          </div>
        </div>
      </Section>
    </>
  );
}
