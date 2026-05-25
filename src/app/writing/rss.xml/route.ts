import { ARTICLES } from '@/content/articles';
import { SITE } from '@/lib/site';

export const dynamic = 'force-static';

function escapeXml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function GET() {
  const base = SITE.url.replace(/\/$/, '');
  const sorted = [...ARTICLES].sort((a, b) => (a.publishedISO < b.publishedISO ? 1 : -1));
  const items = sorted
    .map(
      (a) => `
    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${base}/writing/${a.slug}</link>
      <guid isPermaLink="true">${base}/writing/${a.slug}</guid>
      <pubDate>${new Date(a.publishedISO).toUTCString()}</pubDate>
      <description>${escapeXml(a.description)}</description>
    </item>`,
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE.name)} - Writing</title>
    <link>${base}/writing</link>
    <description>${escapeXml(SITE.positioning)}</description>
    <language>en-ZA</language>
    <atom:link href="${base}/writing/rss.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
