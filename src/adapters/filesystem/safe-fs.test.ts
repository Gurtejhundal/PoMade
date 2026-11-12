import { describe, it, expect } from 'vitest';
import * as path from 'node:path';
import { SafeFileSystem } from './safe-fs.js';

describe('SafeFileSystem', () => {
  const fixturesDir = path.resolve(process.cwd(), 'fixtures');
  const safeFs = new SafeFileSystem(fixturesDir);

  it('correctly resolves and validates paths within repository root', () => {
    expect(safeFs.isPathWithinRoot('node-cli/package.json')).toBe(true);
    expect(safeFs.isPathWithinRoot('empty-repo')).toBe(true);
    expect(safeFs.isPathWithinRoot('../package.json')).toBe(false);
    expect(safeFs.isPathWithinRoot('/etc/passwd')).toBe(false);
  });

  it('throws security error when accessing path escaping repository root', () => {
    expect(() => safeFs.assertPathWithinRoot('../../../etc/passwd')).toThrowError(/Security violation/);
  });

  it('detects sensitive files according to exclusion rules', () => {
    expect(safeFs.isSensitiveFile('.env')).toBe(true);
    expect(safeFs.isSensitiveFile('.env.local')).toBe(true);
    expect(safeFs.isSensitiveFile('id_rsa')).toBe(true);
    expect(safeFs.isSensitiveFile('server.key')).toBe(true);
    expect(safeFs.isSensitiveFile('credentials.json')).toBe(true);

    // Exceptions allowed
    expect(safeFs.isSensitiveFile('.env.example')).toBe(false);
    expect(safeFs.isSensitiveFile('README.md')).toBe(false);
  });

  it('omits .env files during directory scan', async () => {
    const hostileDir = path.join(fixturesDir, 'hostile-repo');
    const hostileFs = new SafeFileSystem(hostileDir);
    const files = await hostileFs.scanDirectory('');

    const hasEnv = files.some((f) => f.relativePath === '.env');
    expect(hasEnv).toBe(false);
    expect(files.some((f) => f.relativePath === 'README.md')).toBe(true);
  });

  it('enforces maximum file size limit on read', async () => {
    const nodeCliDir = path.join(fixturesDir, 'node-cli');
    const fsSmall = new SafeFileSystem(nodeCliDir);

    // Read with tiny 10 byte limit
    await expect(fsSmall.readFile('package.json', 10)).rejects.toThrowError(/exceeds limit/);
  });
});
