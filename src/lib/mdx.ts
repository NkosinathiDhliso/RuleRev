import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export type LoadedMdx<T extends object> = {
  slug: string;
  frontmatter: T;
  content: string;
};

export function readMdxFile<T extends object>(absolutePath: string): LoadedMdx<T> {
  const raw = fs.readFileSync(absolutePath, 'utf8');
  const { data, content } = matter(raw);
  const slug = path.basename(absolutePath).replace(/\.mdx?$/, '');
  return { slug, frontmatter: data as T, content };
}

export function listMdxSlugs(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /\.mdx?$/.test(f))
    .map((f) => f.replace(/\.mdx?$/, ''));
}

export function readAllMdx<T extends object>(dir: string): LoadedMdx<T>[] {
  return listMdxSlugs(dir).map((slug) => readMdxFile<T>(path.join(dir, `${slug}.mdx`)));
}
