import { describe, it, expect } from 'vitest';
import * as path from 'node:path';
import { RepositoryScanner } from '../scan/scanner.js';
import { ContentAuthor } from './author.js';

describe('ContentAuthor', () => {
  const fixturesDir = path.resolve(process.cwd(), 'fixtures');

  it('generates a minimal evidence-backed README for Node CLI', async () => {
    const scanner = new RepositoryScanner(path.join(fixturesDir, 'node-cli'));
    const snapshot = await scanner.scan();

    const author = new ContentAuthor(snapshot, { preset: 'minimal' });
    const readme = author.generateReadme();

    expect(readme).toContain('# sample-cli');
    expect(readme).toContain('<!-- pomade:start header -->');
    expect(readme).toContain('<!-- pomade:start quickstart -->');
    expect(readme).toContain('npm install');
    expect(readme).toContain('npm run build');
    expect(readme).toContain('License');
    expect(readme).toContain('MIT');
  });

  it('generates a studio preset README with mermaid architecture for web app', async () => {
    const scanner = new RepositoryScanner(path.join(fixturesDir, 'web-app'));
    const snapshot = await scanner.scan();

    const author = new ContentAuthor(snapshot, { preset: 'studio' });
    const readme = author.generateReadme();

    expect(readme).toContain('<h1 align="center">sample-web-dashboard</h1>');
    expect(readme).toContain('```mermaid');
    expect(readme).toContain('Next.js');
    expect(readme).toContain('Tailwind CSS');
  });

  it('respects user intent when provided', async () => {
    const scanner = new RepositoryScanner(path.join(fixturesDir, 'node-cli'));
    const snapshot = await scanner.scan();

    const author = new ContentAuthor(snapshot, {
      preset: 'minimal',
      userIntent: 'Automates cloud backups from terminal.',
    });
    const readme = author.generateReadme();

    expect(readme).toContain('Automates cloud backups from terminal.');
  });
});
