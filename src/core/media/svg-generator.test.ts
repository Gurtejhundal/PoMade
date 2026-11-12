import { describe, it, expect } from 'vitest';
import * as path from 'node:path';
import { RepositoryScanner } from '../scan/scanner.js';
import { SvgGenerator } from './svg-generator.js';

describe('SvgGenerator', () => {
  const fixturesDir = path.resolve(process.cwd(), 'fixtures');

  it('generates a valid vector SVG architecture diagram', async () => {
    const scanner = new RepositoryScanner(path.join(fixturesDir, 'node-cli'));
    const snapshot = await scanner.scan();

    const svg = SvgGenerator.generateArchitectureDiagram(snapshot);

    expect(svg).toContain('<svg');
    expect(svg).toContain('viewBox="0 0 800 360"');
    expect(svg).toContain('sample-cli');
    expect(svg).toContain('Client / Consumer');
    expect(svg).toContain('Dependencies');
    expect(svg).toContain('</svg>');
  });

  it('generates a compliant 1280x640 GitHub social preview card asset', async () => {
    const scanner = new RepositoryScanner(path.join(fixturesDir, 'web-app'));
    const snapshot = await scanner.scan();

    const svg = SvgGenerator.generateSocialCard(snapshot);

    expect(svg).toContain('<svg');
    expect(svg).toContain('viewBox="0 0 1280 640"');
    expect(svg).toContain('width="1280" height="640"');
    expect(svg).toContain('sample-web-dashboard');
    expect(svg).toContain('WEB');
    expect(svg).toContain('Pomade');
    expect(svg).toContain('</svg>');
  });
});
