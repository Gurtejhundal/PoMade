import { describe, it, expect } from 'vitest';
import * as path from 'node:path';
import { RepositoryScanner } from './scanner.js';

describe('RepositoryScanner', () => {
  const fixturesDir = path.resolve(process.cwd(), 'fixtures');

  it('scans an empty repository fixture accurately', async () => {
    const scanner = new RepositoryScanner(path.join(fixturesDir, 'empty-repo'));
    const snapshot = await scanner.scan();

    expect(snapshot.stage).toBe('idea');
    expect(snapshot.manifests).toHaveLength(0);
    expect(snapshot.docs).toHaveLength(0);
  });

  it('scans a Node CLI fixture and detects kind and scripts', async () => {
    const scanner = new RepositoryScanner(path.join(fixturesDir, 'node-cli'));
    const snapshot = await scanner.scan();

    expect(snapshot.kind).toBe('cli');
    expect(snapshot.primaryLanguage).toBe('TypeScript');
    expect(snapshot.manifests).toHaveLength(1);
    expect(snapshot.manifests[0].name).toBe('sample-cli');
    expect(snapshot.manifests[0].scripts).toBeDefined();
    expect(snapshot.manifests[0].scripts?.['test']).toBe('vitest run');
    expect(snapshot.license?.spdxId).toBe('MIT');
    expect(snapshot.docs.some((d) => d.kind === 'readme')).toBe(true);
  });

  it('scans a Python library fixture and detects pyproject metadata', async () => {
    const scanner = new RepositoryScanner(path.join(fixturesDir, 'python-lib'));
    const snapshot = await scanner.scan();

    expect(snapshot.primaryLanguage).toBe('Python');
    expect(snapshot.frameworks).toContain('FastAPI');
    expect(snapshot.manifests).toHaveLength(1);
    expect(snapshot.manifests[0].name).toBe('sample-python-lib');
    expect(snapshot.manifests[0].version).toBe('0.2.0');
  });

  it('scans a Web Application fixture and detects web frameworks and assets', async () => {
    const scanner = new RepositoryScanner(path.join(fixturesDir, 'web-app'));
    const snapshot = await scanner.scan();

    expect(snapshot.kind).toBe('web');
    expect(snapshot.frameworks).toContain('Next.js');
    expect(snapshot.frameworks).toContain('React');
    expect(snapshot.assets).toHaveLength(1);
    expect(snapshot.assets[0].kind).toBe('image');
    expect(snapshot.workflows).toHaveLength(1);
    expect(snapshot.workflows[0].name).toBe('ci');
  });

  it('scans a monorepo fixture and classifies kind as monorepo', async () => {
    const scanner = new RepositoryScanner(path.join(fixturesDir, 'monorepo'));
    const snapshot = await scanner.scan();

    expect(snapshot.kind).toBe('monorepo');
    expect(snapshot.manifests.length).toBeGreaterThanOrEqual(1);
  });

  it('scans hostile repo without leaking .env secrets or following instructions', async () => {
    const scanner = new RepositoryScanner(path.join(fixturesDir, 'hostile-repo'));
    const snapshot = await scanner.scan();

    // Verify .env is completely excluded
    const jsonStr = JSON.stringify(snapshot);
    expect(jsonStr).not.toContain('super_secret_token_12345');
    expect(jsonStr).not.toContain('super_secret_db_pass');

    // Verify prompt injection text is treated as raw doc data only
    expect(snapshot.docs.some((d) => d.kind === 'readme')).toBe(true);
  });

  it('produces deterministic snapshot fingerprints for the same directory', async () => {
    const scanner1 = new RepositoryScanner(path.join(fixturesDir, 'node-cli'));
    const scanner2 = new RepositoryScanner(path.join(fixturesDir, 'node-cli'));

    const snap1 = await scanner1.scan();
    const snap2 = await scanner2.scan();

    expect(snap1.snapshotFingerprint).toBe(snap2.snapshotFingerprint);
  });

  it('handles malformed manifests gracefully without crashing', async () => {
    const scanner = new RepositoryScanner(path.join(fixturesDir, 'malformed-manifest'));
    const snapshot = await scanner.scan();

    expect(snapshot.manifests).toHaveLength(0);
    expect(snapshot.warnings.some((w) => w.includes('Failed to parse package.json'))).toBe(true);
  });

  it('throws a descriptive error when target repository directory does not exist', async () => {
    const scanner = new RepositoryScanner(path.join(fixturesDir, 'does-not-exist-dir'));
    await expect(scanner.scan()).rejects.toThrowError(/does not exist/);
  });
});
