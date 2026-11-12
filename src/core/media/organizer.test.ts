import { describe, it, expect } from 'vitest';
import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import { RepositoryScanner } from '../scan/scanner.js';
import { MediaOrganizer } from './organizer.js';

describe('MediaOrganizer', () => {
  const scratchDir = path.resolve(process.cwd(), 'fixtures/scratch-media-test');

  it('formats accessible markdown image snippets with descriptive alt text', () => {
    const snippet = MediaOrganizer.formatMarkdownImage(
      'docs/media/architecture.svg',
      'System Architecture Diagram',
      'Component flow from CLI to core'
    );

    expect(snippet).toBe('![System Architecture Diagram](docs/media/architecture.svg)\n*Component flow from CLI to core*');
  });

  it('formats accessible picture tag with static PNG fallback for animated GIFs', () => {
    const gifSnippet = MediaOrganizer.formatAccessibleGif(
      'docs/media/demo.gif',
      'docs/media/demo-static.png',
      'Animated demo of the application workflow'
    );

    expect(gifSnippet).toContain('<picture>');
    expect(gifSnippet).toContain('srcset="docs/media/demo.gif"');
    expect(gifSnippet).toContain('src="docs/media/demo-static.png"');
    expect(gifSnippet).toContain('alt="Animated demo of the application workflow"');
    expect(gifSnippet).toContain('</picture>');
  });

  it('saves vector architecture SVG and social preview SVG into docs/media/', async () => {
    await fs.mkdir(scratchDir, { recursive: true });
    await fs.writeFile(
      path.join(scratchDir, 'package.json'),
      JSON.stringify({ name: 'media-test-tool', version: '1.0.0' }, null, 2)
    );

    try {
      const scanner = new RepositoryScanner(scratchDir);
      const snapshot = await scanner.scan();
      const organizer = new MediaOrganizer(scratchDir);

      const archPath = await organizer.saveArchitectureDiagram(snapshot);
      expect(archPath).toBe('docs/media/architecture.svg');

      const cardPath = await organizer.saveSocialCard(snapshot);
      expect(cardPath).toBe('docs/media/social-preview.svg');

      const archContent = await fs.readFile(path.join(scratchDir, archPath), 'utf-8');
      expect(archContent).toContain('<svg');
      expect(archContent).toContain('media-test-tool');

      const cardContent = await fs.readFile(path.join(scratchDir, cardPath), 'utf-8');
      expect(cardContent).toContain('1280');
      expect(cardContent).toContain('640');
    } finally {
      await fs.rm(scratchDir, { recursive: true, force: true });
    }
  });
});
