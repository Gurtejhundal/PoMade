import { describe, it, expect } from 'vitest';
import { ManagedSections } from './managed-sections.js';

describe('ManagedSections', () => {
  it('wraps content in standard Pomade markers', () => {
    const wrapped = ManagedSections.wrap('overview', 'This is an overview.');
    expect(wrapped).toContain('<!-- pomade:start overview -->');
    expect(wrapped).toContain('This is an overview.');
    expect(wrapped).toContain('<!-- pomade:end overview -->');
  });

  it('detects managed markers in content', () => {
    expect(ManagedSections.hasManagedSections('Plain text')).toBe(false);
    expect(ManagedSections.hasManagedSections('<!-- pomade:start header --># Hi<!-- pomade:end header -->')).toBe(true);
    expect(ManagedSections.hasManagedSections('<!-- repoatelier:start header --># Hi<!-- repoatelier:end header -->')).toBe(true);
  });

  it('parses multiple valid managed sections correctly', () => {
    const doc = `
# Human Intro
Some text written by a human.

<!-- pomade:start quickstart -->
npm install
<!-- pomade:end quickstart -->

More human notes.

<!-- pomade:start usage -->
npm start
<!-- pomade:end usage -->
`;
    const parsed = ManagedSections.parse(doc);
    expect(parsed.size).toBe(2);
    expect(parsed.has('quickstart')).toBe(true);
    expect(parsed.has('usage')).toBe(true);
    expect(parsed.get('quickstart')?.rawContent.trim()).toBe('npm install');
  });

  it('throws descriptive error on unbalanced markers', () => {
    const doc = `
<!-- pomade:start quickstart -->
npm install
`;
    expect(() => ManagedSections.parse(doc)).toThrowError(/parity error/);
  });

  it('throws descriptive error on duplicate section ids', () => {
    const doc = `
<!-- pomade:start dup -->1<!-- pomade:end dup -->
<!-- pomade:start dup -->2<!-- pomade:end dup -->
`;
    expect(() => ManagedSections.parse(doc)).toThrowError(/Duplicate managed section/);
  });

  it('preserves surrounding human-written content when updating a section', () => {
    const original = `
# My Project
Handwritten intro paragraph.

<!-- pomade:start quickstart -->
npm install
<!-- pomade:end quickstart -->

Handwritten footer paragraph.
`;
    const updated = ManagedSections.replaceSection(original, 'quickstart', 'npm install && npm test');

    expect(updated).toContain('Handwritten intro paragraph.');
    expect(updated).toContain('Handwritten footer paragraph.');
    expect(updated).toContain('npm install && npm test');
    expect(updated).not.toContain('\nnpm install\n');
  });
});
