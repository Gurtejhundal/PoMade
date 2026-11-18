import { it, expect } from 'vitest';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as os from 'node:os';
import { RepositoryScanner } from './scanner.js';
it('ignores malformed npm fields and gives the root manifest priority over nested examples', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'pomade-manifest-'));
  try {
    await fs.mkdir(path.join(root, 'examples'));
    await fs.writeFile(
      path.join(root, 'examples/package.json'),
      JSON.stringify({ name: 'nested-example' })
    );
    await fs.writeFile(
      path.join(root, 'package.json'),
      JSON.stringify({ name: 'root-package' })
    );
    expect((await new RepositoryScanner(root).scan()).manifests[0].name).toBe(
      'root-package'
    );
    await fs.writeFile(
      path.join(root, 'package.json'),
      JSON.stringify({ name: { command: 'bad' }, scripts: { start: 42 } })
    );
    const snapshot = await new RepositoryScanner(root).scan();
    expect(snapshot.manifests).toHaveLength(1);
    expect(
      snapshot.warnings.some((w) => w.includes('Failed to parse package.json'))
    ).toBe(true);
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
});
