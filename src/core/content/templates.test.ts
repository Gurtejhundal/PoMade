import { describe, it, expect } from 'vitest';
import {
  renderPresentation,
  renderBanner,
  safeMediaUrl,
  type PresentationFacts,
} from './templates.js';
import { PresentationConfigSchema } from './config.js';
const facts: PresentationFacts = {
  name: '<Example>',
  tagline: 'A useful tool.',
  description: 'Real behavior.',
  installCommand: 'npm ci\n```\necho hi',
  runCommand: 'npm start',
  features: [{ title: 'Export', description: 'Writes JSON.' }],
};
describe('Shared presentation renderer', () => {
  it('keeps three distinct styles while preserving supplied facts and fenced commands', () => {
    const simple = renderPresentation(facts, 'minimal');
    const signature = renderPresentation(facts, 'signature');
    const motion = renderPresentation(
      {
        ...facts,
        bannerUrl: 'docs/media/pomade-motion.svg',
        staticBannerUrl: 'docs/media/pomade-static.svg',
      },
      'animated'
    );
    expect(simple).toContain('# &lt;Example&gt;');
    expect(simple).toContain('````bash\nnpm ci\n```\necho hi\n````');
    expect(signature).toContain('<h1 align="center">&lt;Example&gt;</h1>');
    expect(motion).toContain('docs/media/pomade-motion.svg');
    expect(motion).toContain('View the static cover');
    for (const output of [simple, signature, motion]) {
      expect(output).toContain('Writes JSON.');
      expect(output).not.toMatch(
        /build-passing|initializeEngine|github.com\/releases|Production-ready/
      );
    }
  });
  it('rejects executable, credential-bearing, and escaping URLs', () => {
    for (const url of [
      'javascript:alert(1)',
      'data:image/svg+xml,hi',
      '../private.png',
      'https://user:token@example.com/a.png',
      '//evil.test/a.png',
    ])
      expect(safeMediaUrl(url)).toBeUndefined();
    const output = renderPresentation(
      {
        ...facts,
        screenshotUrl: 'javascript:alert(1)',
        homepageUrl: 'javascript:alert(1)',
      },
      'signature'
    );
    expect(output).not.toContain('javascript:');
  });
  it('escapes SVG text and provides finite animation and a static variant', () => {
    expect(renderBanner(facts)).toContain('&lt;Example&gt;');
    expect(renderBanner(facts)).toContain('prefers-reduced-motion');
    expect(renderBanner(facts, false)).not.toContain('animation:blink');
  });
  it('validates configuration and rejects invalid styles, unknown options, unsafe media and topics', () => {
    expect(
      PresentationConfigSchema.safeParse({
        preset: 'animated',
        topics: ['developer-tools'],
      }).success
    ).toBe(true);
    for (const config of [
      { preset: 'typo' },
      { overwrite: true },
      { screenshot: '.env' },
      { topics: ['C++'] },
      { homepage: 'javascript:alert(1)' },
    ])
      expect(PresentationConfigSchema.safeParse(config).success).toBe(false);
  });
});
