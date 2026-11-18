import { it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { UnifiedDiff } from './unified-diff.js';
it('emits Git-applicable patches for missing final newlines and large READMEs', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pomade-patch-'));
  try {
    for (const [before, after] of [
      ['old\nkeep', 'new\nkeep'],
      ['same', 'same\n'],
      ['a\n', ''],
      ['', 'new'],
      [Array(1400).fill('old').join('\n'), Array(1400).fill('new').join('\n')],
    ]) {
      const file = path.join(root, 'README.md');
      fs.writeFileSync(file, before);
      execFileSync('git', ['apply', '--unsafe-paths', '-'], {
        cwd: root,
        input: UnifiedDiff.create('README.md', before, after),
      });
      expect(fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '').toBe(
        after
      );
    }
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
