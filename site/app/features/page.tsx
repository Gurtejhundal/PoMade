import Link from 'next/link';
import type { Metadata } from 'next';
import { CodeBlock } from '../../components/CodeBlock';
import { FEATURES } from '../../lib/product';
export const metadata: Metadata = {
  title: 'Functions — PoMade',
  description:
    'What PoMade does: inspection, README authoring, real media, reviewed plans, hooks, and GitHub maintenance.',
};
export default function FeaturesPage() {
  return (
    <article className="readme-page" id="content">
      <p className="doc-breadcrumb">PoMade / Functions</p>
      <h1>A good introduction is part of the product.</h1>
      <p className="doc-lead">
        From a project folder to a repository people can understand. Each
        function has a concrete input, a reviewable output, and a clear
        boundary.
      </p>
      <nav className="page-toc" aria-label="On this page">
        {FEATURES.map((f) => (
          <a key={f.id} href={`#${f.id}`}>
            {f.title}
          </a>
        ))}
      </nav>
      {FEATURES.map((f, i) => (
        <section className="markdown-section" id={f.id} key={f.id}>
          <p className="section-index">0{i + 1}</p>
          <h2>{f.title}</h2>
          <p>{f.text}</p>
          <CodeBlock>{f.command}</CodeBlock>
          <blockquote>{f.detail}</blockquote>
        </section>
      ))}
      <section className="markdown-section">
        <h2>Choose your way in</h2>
        <p>
          <Link href="/install">Install the tool →</Link> ·{' '}
          <Link href="/studio">Try it in your browser →</Link> ·{' '}
          <Link href="/docs">Read every command →</Link>
        </p>
      </section>
    </article>
  );
}
