import { describe, it, expect } from 'vitest';
import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import { RepositoryScanner } from '../scan/scanner.js';
import { DriftDetector } from './drift-detector.js';

describe('DriftDetector', () => {
  const fixturesDir = path.resolve(process.cwd(), 'fixtures');
  const scratchDir = path.resolve(process.cwd(), 'fixtures/scratch-drift-test');

  it('detects required drift when README is missing', async () => {
    const scanner = new RepositoryScanner(path.join(fixturesDir, 'empty-repo'));
    const snapshot = await scanner.scan();

    const detector = new DriftDetector(snapshot);
    const report = await detector.detectDrift();

    expect(report.hasDrift).toBe(true);
    expect(report.findings.some((f) => f.category === 'missing-docs')).toBe(true);
  });

  it('detects script drift when package manifest scripts are missing from README', async () => {
    await fs.mkdir(scratchDir, { recursive: true });
    await fs.writeFile(
      path.join(scratchDir, 'package.json'),
      JSON.stringify(
        {
          name: 'drift-test-pkg',
          version: '1.0.0',
          scripts: {
            dev: 'node server.js',
            build: 'tsc',
          },
        },
        null,
        2
      )
    );
    // README only mentions version and name, missing dev and build scripts
    await fs.writeFile(
      path.join(scratchDir, 'README.md'),
      '# drift-test-pkg v1.0.0\n\nNo scripts mentioned here.\n'
    );

    try {
      const scanner = new RepositoryScanner(scratchDir);
      const snapshot = await scanner.scan();

      const detector = new DriftDetector(snapshot);
      const report = await detector.detectDrift();

      expect(report.hasDrift).toBe(true);
      expect(report.findings.some((f) => f.id === 'drift-script-dev')).toBe(true);
      expect(report.findings.some((f) => f.id === 'drift-script-build')).toBe(true);
    } finally {
      await fs.rm(scratchDir, { recursive: true, force: true });
    }
  });

  it('reports zero drift when documentation is in sync with codebase reality', async () => {
    await fs.mkdir(scratchDir, { recursive: true });
    await fs.writeFile(
      path.join(scratchDir, 'package.json'),
      JSON.stringify(
        {
          name: 'sync-pkg',
          version: '1.0.0',
          scripts: {
            build: 'tsc',
          },
        },
        null,
        2
      )
    );
    await fs.writeFile(
      path.join(scratchDir, 'README.md'),
      '# sync-pkg v1.0.0\n\nRun npm run build to compile.\n'
    );

    try {
      const scanner = new RepositoryScanner(scratchDir);
      const snapshot = await scanner.scan();

      const detector = new DriftDetector(snapshot);
      const report = await detector.detectDrift();

      expect(report.hasDrift).toBe(false);
      expect(report.findings).toHaveLength(0);
    } finally {
      await fs.rm(scratchDir, { recursive: true, force: true });
    }
  });
});
