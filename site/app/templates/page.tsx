import Link from 'next/link';
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
