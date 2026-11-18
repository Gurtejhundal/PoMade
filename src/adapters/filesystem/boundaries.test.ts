import { it, expect } from 'vitest';
import * as fs from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';
import { SafeFileSystem } from './safe-fs.js';
it('rejects reads and writes through a parent symlink, including a nonexistent target', async () => {
  const scratch = await fs.mkdtemp(path.join(os.tmpdir(), 'pomade-boundary-'));
  try {
    const root = path.join(scratch, 'repo');
    const outside = path.join(scratch, 'outside');
    await fs.mkdir(root);
    await fs.mkdir(outside);
    await fs.writeFile(path.join(outside, 'private.txt'), 'keep this');
    await fs.symlink(
      outside,
      path.join(root, 'linked'),
      process.platform === 'win32' ? 'junction' : 'dir'
    );
    const safe = new SafeFileSystem(root);
    await expect(safe.readFile('linked/private.txt')).rejects.toThrow(
      'Security violation'
    );
    await expect(
      safe.atomicWriteFile('linked/new/file.txt', 'oops')
    ).rejects.toThrow('Security violation');
    expect(await fs.readFile(path.join(outside, 'private.txt'), 'utf8')).toBe(
      'keep this'
    );
    await expect(fs.access(path.join(outside, 'new'))).rejects.toThrow();
  } finally {
    await fs.rm(scratch, { recursive: true, force: true });
  }
});
