import { GA_MEASUREMENT_ID } from './site';

type Pathname = string;

export type CTALocation =
  | 'hero'
  | 'footer'
  | 'floating'
  | 'service_card'
  | 'case_study'
  | 'final_band'
  | 'header'
  | 'contact_page'
  | 'not_found';

export type AnalyticsEvent =
  | { name: 'cta_click'; params: { cta_type: 'book_call' | 'whatsapp' | 'phone' | 'email'; page: Pathname; location: CTALocation } }
  | { name: 'page_scroll_depth'; params: { depth: 25 | 50 | 75 | 100; page: Pathname } }
  | { name: 'case_study_view'; params: { slug: string; page: Pathname } }
  | { name: 'service_section_view'; params: { service_name: 'founder_launch_pack' | 'compliance_retrofit' | 'cloud_advisory' } }
  | { name: 'article_read_complete'; params: { slug: string; read_time_seconds: number } };

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __ruleRevConsent?: 'granted' | 'denied' | undefined;
  }
}

export function track<E extends AnalyticsEvent>(event: E['name'], params: Extract<AnalyticsEvent, { name: E['name'] }>['params']): void {
  if (typeof window === 'undefined') return;
  if (!GA_MEASUREMENT_ID) return;
  if (window.__ruleRevConsent !== 'granted') return;
  window.gtag?.('event', event, params);
}

export function hasGA(): boolean {
  return Boolean(GA_MEASUREMENT_ID);
}
