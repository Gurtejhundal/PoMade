import { describe, it, expect } from 'vitest';
import { UnifiedDiff } from './unified-diff.js';

describe('UnifiedDiff', () => {
  it('returns empty string when content is unchanged', () => {
    const text = 'Line 1\nLine 2';
    const diff = UnifiedDiff.create('README.md', text, text);
    expect(diff).toBe('');
  });

  it('generates standard unified diff format for newly created files', () => {
    const newContent = 'Line A\nLine B';
    const diff = UnifiedDiff.create('README.md', '', newContent);

    expect(diff).toContain('--- a/README.md');
    expect(diff).toContain('+++ b/README.md');
    expect(diff).toContain('+Line A');
    expect(diff).toContain('+Line B');
  });

  it('generates unified diff with deletions and additions for modified files', () => {
    const orig = 'Old Line 1\nSame Line';
    const updated = 'New Line 1\nSame Line';
    const diff = UnifiedDiff.create('README.md', orig, updated);

    expect(diff).toContain('-Old Line 1');
    expect(diff).toContain('+New Line 1');
    expect(diff).toContain(' Same Line');
  });

  it('computes sha256 hash correctly', () => {
    const hash = UnifiedDiff.hash('test string');
    expect(hash).toHaveLength(64);
    expect(UnifiedDiff.hash('')).toBe('');
  });
});
