import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { RepositoryScanner } from '../scan/scanner.js';
import { Planner } from '../plan/planner.js';
import { readPresentationConfig } from '../content/config.js';
import { SafeFileSystem } from '../../adapters/filesystem/safe-fs.js';

const exec = promisify(execFile);
export const PRE_PUSH_HOOK = `#!/bin/sh
# PoMade managed pre-push hook
if ! command -v pomade >/dev/null 2>&1; then
  echo 'PoMade CLI is missing. Install it or run pomade hooks uninstall --approved.' >&2
  exit 1
fi
pomade hooks check
`;

export async function managePushHook(
  root: string,
  action: 'install' | 'uninstall' | 'status',
  approved = false
) {
  const git = async (args: string[]) =>
    (await exec('git', args, { cwd: root, timeout: 5000 })).stdout.trim();
  const gitRoot = await git(['rev-parse', '--show-toplevel']);
  let custom = '';
  try {
    custom = await git(['config', '--get', 'core.hooksPath']);
  } catch (error: any) {
    if (error.code !== 1) throw error;
  }
  if (custom)
    throw new Error(
      'Custom core.hooksPath is configured. Add `pomade hooks check` to your existing hook manager instead.'
    );
  const file = path.resolve(
    root,
    await git(['rev-parse', '--git-path', 'hooks/pre-push'])
  );
  try {
    if ((await fs.lstat(path.dirname(file))).isSymbolicLink())
      throw new Error(
        'Linked hooks directories are preserved. Add pomade hooks check manually.'
      );
  } catch (error: any) {
    if (error.code !== 'ENOENT') throw error;
  }
  let current: string | undefined;
  try {
    const stat = await fs.lstat(file);
    if (!stat.isFile() || stat.isSymbolicLink())
      throw new Error('Refusing a non-regular pre-push hook.');
    current = await fs.readFile(file, 'utf8');
  } catch (error: any) {
    if (error.code !== 'ENOENT') throw error;
  }
  const installed = current === PRE_PUSH_HOOK;
  if (action === 'status')
    return { installed, existingHook: current !== undefined, file };
  if (current !== undefined && !installed)
    throw new Error(
      'An existing pre-push hook is preserved. Add `pomade hooks check` to it manually.'
    );
  if (!approved) return { installed, file, preview: action };
  if (action === 'install' && !installed) {
    const config = await readPresentationConfig(new SafeFileSystem(gitRoot));
    if (!config)
      throw new Error(
        'Run pomade init first, then adopt the README with pomade apply --approved.'
      );
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, PRE_PUSH_HOOK, { flag: 'wx', mode: 0o755 });
  } else if (action === 'uninstall' && installed) await fs.unlink(file);
  return { installed: action === 'install', file };
}

export async function checkPresentation(root: string) {
  root = (
    await exec('git', ['rev-parse', '--show-toplevel'], {
      cwd: root,
      timeout: 5000,
    })
  ).stdout.trim();
  const config = await readPresentationConfig(new SafeFileSystem(root));
  if (!config) throw new Error('No .pomade.json found. Run pomade init first.');
  const snapshot = await new RepositoryScanner(root).scan();
  const plan = await new Planner(snapshot).createPlan();
  const changed = plan.actions
    .filter((action) => action.kind === 'write-local')
    .map((action) => action.target);
  const { stdout } = await exec(
    'git',
    [
      'diff',
      '--name-only',
      'HEAD',
      '--',
      'README.md',
      'docs/media/pomade-motion.svg',
      'docs/media/pomade-static.svg',
    ],
    { cwd: root, timeout: 5000 }
  );
  const files = [
    ...new Set([...changed, ...stdout.trim().split(/\r?\n/).filter(Boolean)]),
  ];
  return { current: files.length === 0, files };
}
