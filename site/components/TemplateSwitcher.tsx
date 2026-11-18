'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  PRESENTATION_STYLES,
  type PresentationStyle,
} from '../../src/core/content/templates';
import { POMADE_SAMPLE } from '../lib/templates/samples';
import { ReadmePreview } from './ReadmePreview';
export function TemplateSwitcher() {
  const [style, setStyle] = useState<PresentationStyle>('signature');
  return (
    <div className="template-switcher">
      <div className="style-tabs" aria-label="README template">
        {PRESENTATION_STYLES.map((t) => (
          <button
            key={t.id}
            aria-pressed={style === t.id}
            onClick={() => setStyle(t.id)}
          >
            {t.name}
          </button>
        ))}
      </div>
      <div className="template-demo">
        <ReadmePreview
          facts={{
            ...POMADE_SAMPLE,
            installCommand:
              'pomade init --preset signature --approved\npomade diff\npomade apply --approved',
          }}
          style={style}
          compact
        />
      </div>
      <p className="template-use-link">
        <Link href={`/studio?template=${style}`}>
          Edit this README in Studio →
        </Link>
      </p>
    </div>
  );
}
