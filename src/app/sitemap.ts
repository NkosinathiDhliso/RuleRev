import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';
import { FEATURED_CASE_STUDIES } from '@/content/case-studies';
import { ARTICLES } from '@/content/articles';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, '');
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/work`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/services`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/writing`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.6 },
  ];
  const cases: MetadataRoute.Sitemap = FEATURED_CASE_STUDIES.map((cs) => ({
    url: `${base}/work/${cs.slug}`,
    lastModified: new Date(cs.publishedISO),
    changeFrequency: 'yearly',
    priority: 0.7,
  }));
  const articles: MetadataRoute.Sitemap = ARTICLES.map((a) => ({
    url: `${base}/writing/${a.slug}`,
    lastModified: new Date(a.publishedISO),
    changeFrequency: 'yearly',
    priority: 0.6,
  }));
  return [...staticRoutes, ...cases, ...articles];
}
