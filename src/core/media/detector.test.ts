import { describe, it, expect } from 'vitest';
import * as path from 'node:path';
import { RepositoryScanner } from '../scan/scanner.js';
import { UiDetector } from './detector.js';

describe('UiDetector', () => {
  const fixturesDir = path.resolve(process.cwd(), 'fixtures');

  it('detects runnable web application with local port and launch script', async () => {
    const scanner = new RepositoryScanner(path.join(fixturesDir, 'web-app'));
    const snapshot = await scanner.scan();

    const result = UiDetector.detect(snapshot);
    expect(result.hasRunnableUi).toBe(true);
    expect(result.uiKind).toBe('web');
    expect(result.defaultPort).toBe(3000);
    expect(result.defaultUrl).toBe('http://localhost:3000');
    expect(result.startCommand).toBe('npm run dev');
  });

  it('detects CLI project and indicates terminal recording instead of GUI screenshots', async () => {
    const scanner = new RepositoryScanner(path.join(fixturesDir, 'node-cli'));
    const snapshot = await scanner.scan();

    const result = UiDetector.detect(snapshot);
    expect(result.hasRunnableUi).toBe(false);
    expect(result.uiKind).toBe('cli');
    expect(result.reason).toContain('graphical UI screenshots are not applicable');
  });

  it('skips screenshots gracefully for libraries and backend services', async () => {
    const scanner = new RepositoryScanner(path.join(fixturesDir, 'python-lib'));
    const snapshot = await scanner.scan();

    const result = UiDetector.detect(snapshot);
    expect(result.hasRunnableUi).toBe(false);
    expect(result.uiKind).toBe('none');
    expect(result.reason).toContain('Screenshot capture skipped gracefully');
  });
});
