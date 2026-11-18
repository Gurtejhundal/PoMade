import { it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import * as fs from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';
import { managePushHook, checkPresentation } from './hooks.js';
import { syncPresentation } from './sync.js';

it('installs only on approval, rejects owner hooks, checks committed presentation, and removes only its own hook', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'pomade-hooks-'));
  const git = (...args: string[]) =>
    execFileSync('git', args, { cwd: root, encoding: 'utf8' });
  try {
    git('init');
    git('config', 'user.name', 'Test');
    git('config', 'user.email', 'test@example.com');
    git('config', 'core.autocrlf', 'false');
    await fs.writeFile(
      path.join(root, 'package.json'),
      JSON.stringify({
        name: 'hook-example',
        version: '1.0.0',
        description: 'A concrete test project',
      })
    );
    await fs.writeFile(path.join(root, '.pomade.json'), '{"preset":"minimal"}');
    await syncPresentation(root, { approved: true });
    git('add', '.');
    git('commit', '-m', 'initial');
    expect((await managePushHook(root, 'install')).preview).toBe('install');
    expect((await managePushHook(root, 'status')).installed).toBe(false);
    expect((await managePushHook(root, 'install', true)).installed).toBe(true);
    expect((await checkPresentation(root)).current).toBe(true);
    await fs.appendFile(path.join(root, 'README.md'), '\nOwner note.\n');
    expect((await checkPresentation(root)).current).toBe(false);
    git('add', 'README.md');
    git('commit', '-m', 'owner note');
    const manifest = JSON.parse(
      await fs.readFile(path.join(root, 'package.json'), 'utf8')
    );
    manifest.version = '1.1.0';
    await fs.writeFile(
      path.join(root, 'package.json'),
      JSON.stringify(manifest)
    );
    expect((await checkPresentation(root)).current).toBe(false);
    await syncPresentation(root, { approved: true });
    expect((await checkPresentation(root)).current).toBe(false);
    git('add', '.');
    git('commit', '-m', 'refresh');
    expect((await checkPresentation(root)).current).toBe(true);
    await managePushHook(root, 'uninstall', true);
    const file = path.join(root, '.git/hooks/pre-push');
    await fs.writeFile(file, '#!/bin/sh\necho owner\n');
    await expect(managePushHook(root, 'install', true)).rejects.toThrow(
      'existing pre-push hook'
    );
    await expect(managePushHook(root, 'uninstall', true)).rejects.toThrow(
      'existing pre-push hook'
    );
    git('config', 'core.hooksPath', '.custom-hooks');
    await expect(managePushHook(root, 'install', true)).rejects.toThrow(
      'Custom core.hooksPath'
    );
    git('config', '--unset', 'core.hooksPath');
    await fs.rename(path.join(root, '.git/hooks'), path.join(root, '.git/owner-hooks'));
    await fs.symlink(path.join(root, '.git/owner-hooks'), path.join(root, '.git/hooks'), process.platform === 'win32' ? 'junction' : 'dir');
    await expect(managePushHook(root, 'install', true)).rejects.toThrow('Linked hooks directories');

  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
});
