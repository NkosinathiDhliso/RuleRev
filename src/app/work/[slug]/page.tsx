import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import path from 'node:path';
import fs from 'node:fs';
import { CaseStudyShell } from '@/components/CaseStudyShell';
import { JsonLd, caseStudyLD } from '@/lib/jsonld';
import { FEATURED_CASE_STUDIES } from '@/content/case-studies';
import { readMdxFile } from '@/lib/mdx';

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content', 'case-studies');

export function generateStaticParams() {
  return FEATURED_CASE_STUDIES.map((cs) => ({ slug: cs.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = FEATURED_CASE_STUDIES.find((cs) => cs.slug === slug);
  if (!meta) return {};
  return {
    title: meta.title,
    description: meta.oneLine,
    alternates: { canonical: `/work/${slug}` },
    openGraph: { title: meta.title, description: meta.oneLine, url: `/work/${slug}` },
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = FEATURED_CASE_STUDIES.find((cs) => cs.slug === slug);
  if (!meta) notFound();

  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) notFound();
  const { content } = readMdxFile<Record<string, unknown>>(filePath);

  return (
    <>
      <JsonLd data={caseStudyLD({ title: meta!.title, description: meta!.oneLine, slug, publishedISO: meta!.publishedISO })} />
      <CaseStudyShell meta={meta!}>
        <MDXRemote source={content} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
      </CaseStudyShell>
    </>
  );
}
