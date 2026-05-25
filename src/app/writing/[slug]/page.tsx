import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import path from 'node:path';
import fs from 'node:fs';
import { ARTICLES } from '@/content/articles';
import { SERVICES } from '@/content/services';
import { FEATURED_CASE_STUDIES } from '@/content/case-studies';
import { Button } from '@/components/Button';
import { SplitWords } from '@/components/SplitWords';
import { JsonLd, articleLD } from '@/lib/jsonld';
import { bookCallHref } from '@/lib/site';
import { whatsappLink } from '@/lib/whatsapp';
import { formatDateZA } from '@/lib/format';
import { readMdxFile } from '@/lib/mdx';
import shellStyles from '@/components/CaseStudyShell.module.css';

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content', 'articles');

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const meta = ARTICLES.find((a) => a.slug === slug);
  if (!meta) return {};
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `/writing/${slug}` },
    openGraph: { title: meta.title, description: meta.description, url: `/writing/${slug}` },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = ARTICLES.find((a) => a.slug === slug);
  if (!meta) notFound();

  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) notFound();
  const { content } = readMdxFile<Record<string, unknown>>(filePath);

  const relatedService = SERVICES.find((s) => s.slug === meta!.relatedService);
  const relatedCase = FEATURED_CASE_STUDIES.find((c) => c.slug === meta!.relatedCaseStudy);

  return (
    <article>
      <JsonLd
        data={articleLD({
          title: meta!.title,
          description: meta!.description,
          slug,
          publishedISO: meta!.publishedISO,
        })}
      />
      <section className={shellStyles.hero}>
        <div className="container-page">
          <span className={shellStyles.client} data-animate="fade-up-sm" style={{ ['--d' as string]: '0ms' }}>
            {formatDateZA(meta!.publishedISO)} &middot; {meta!.readingMinutes} min read
          </span>
          <SplitWords as="h1" className={shellStyles.title} text={meta!.title} baseDelay={2} />
          <p className={shellStyles.lede} data-animate="fade-up-sm" style={{ ['--d' as string]: '450ms' }}>
            {meta!.description}
          </p>
        </div>
      </section>
      <section>
        <div className="container-page">
          <div className={shellStyles.body} data-animate="fade-up">
            <MDXRemote source={content} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
          </div>

          {relatedService || relatedCase ? (
            <div className={shellStyles.related} data-animate="fade-up">
              <p className={shellStyles.related_text}>
                {relatedService ? (
                  <>
                    Related service:{' '}
                    <Link href={`/services#${relatedService.slug}`}>{relatedService.name}</Link>.
                  </>
                ) : null}{' '}
                {relatedCase ? (
                  <>
                    Related case study:{' '}
                    <Link href={`/work/${relatedCase.slug}`}>{relatedCase.client}</Link>.
                  </>
                ) : null}
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Button href={bookCallHref()} external variant="primary" size="sm">
                  Book a call
                </Button>
                <Button href={whatsappLink('contact')} external variant="secondary" size="sm">
                  WhatsApp me
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </article>
  );
}
