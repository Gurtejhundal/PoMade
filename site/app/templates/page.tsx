import Link from 'next/link';
import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'README templates — PoMade',
  description:
    'Compare Simple, Signature, and Motion. Preview real content and customize your README in Studio.',
};
import { ArrowRight } from 'lucide-react';
import { PRESENTATION_STYLES } from '../../../src/core/content/templates';
import { POMADE_SAMPLE } from '../../lib/templates/samples';
import { ReadmePreview } from '../../components/ReadmePreview';
export default function TemplatesPage() {
  return (
    <div className="inner-page" id="content">
      <div className="page-eyebrow">THE README COLLECTION / 3 STYLES</div>
      <h1>
        Good structure.
        <br />
        <em>Your kind of polish.</em>
      </h1>
      <p className="page-lead">
        Three ways to introduce the same project. Start with the quiet one,
        build an identity, or let the product move.
      </p>
      <div className="markdown-table-wrap">
        <table className="template-comparison">
          <thead>
            <tr>
              <th>Style</th>
              <th>Best fit</th>
              <th>What it adds</th>
              <th>Preset</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Simple</td>
              <td>Libraries, CLI tools, early projects</td>
              <td>Direct title, description, setup, features</td>
              <td>
                <code>minimal</code>
              </td>
            </tr>
            <tr>
              <td>Signature</td>
              <td>Projects with a visual identity</td>
              <td>Centered logo, tagline, badges, screenshot</td>
              <td>
                <code>signature</code>
              </td>
            </tr>
            <tr>
              <td>Motion</td>
              <td>Products that benefit from a demo</td>
              <td>Animated SVG, real GIF, static alternatives</td>
              <td>
                <code>animated</code>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="markdown-note">
        Every style uses your project facts. Animated covers are generated;
        product screenshots and recordings are supplied by you. Studio exports
        Markdown, config, and referenced sample assets.
      </p>
      <div className="template-collection">
        {PRESENTATION_STYLES.map((t) => (
          <section className="collection-item" key={t.id}>
            <div className="collection-description">
              <span className="template-number">{t.number}</span>
              <h2>{t.name}</h2>
              <h3>{t.line}</h3>
              <p>{t.description}</p>
              <small>Structure references: {t.reference}</small>
              <Link
                className="primary-button"
                href={`/studio?template=${t.id}`}
              >
                Use {t.name}
                <ArrowRight size={15} />
              </Link>
            </div>
            <div className="readme-file">
              <ReadmePreview
                facts={{
                  ...POMADE_SAMPLE,
                  installCommand: 'npm ci\nnpm run build\nnpm link',
                }}
                style={t.id}
                idPrefix={t.id}
                compact
              />
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
