import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as os from 'node:os';
import { syncPresentation } from './sync.js';
import { RepositoryScanner } from '../scan/scanner.js';
import { Planner } from '../plan/planner.js';
import { PlanApplier } from '../apply/applier.js';
import { ManagedSections } from '../content/managed-sections.js';
import { runApply, runInit } from '../../cli/commands.js';
let root: string;
beforeEach(async () => {
  root = await fs.mkdtemp(path.join(os.tmpdir(), 'pomade-sync-'));
  await fs.writeFile(
    path.join(root, 'package.json'),
    JSON.stringify({
      name: 'real-project',
      version: '0.1.0',
      description: 'Does a real thing.',
      scripts: { start: 'node app.js', test: 'node --test' },
    })
  );
});
afterEach(async () => {
  await fs.rm(root, { recursive: true, force: true });
  vi.restoreAllMocks();
});
describe('Presentation push lifecycle', () => {
  it('creates motion assets, preserves exact manual prose, and settles to no changes', async () => {
    await fs.writeFile(
      path.join(root, '.pomade.json'),
      JSON.stringify({
        preset: 'animated',
        tagline: 'Useful, on purpose.',
        topics: ['developer-tools'],
      })
    );
    await fs.writeFile(
      path.join(root, 'README.md'),
      'My own intro.  \n\n' +
        ManagedSections.wrap('header', '# Previous title') +
        '\n\nMy own footer.  \n'
    );
    const result = await syncPresentation(root, { approved: true });
    expect(result.modifiedFiles).toContain('docs/media/pomade-motion.svg');
    const readme = await fs.readFile(path.join(root, 'README.md'), 'utf8');
    expect(readme.startsWith('My own intro.  \n\n')).toBe(true);
    expect(readme).toContain('\n\nMy own footer.  \n');
    expect(readme).toContain('Useful, on purpose.');
    expect(
      (await syncPresentation(root, { approved: true })).appliedCount
    ).toBe(0);
  });
  it('reorders a fully generated document when switching to a richer template', async () => {
    await syncPresentation(root, { approved: true, preset: 'minimal' });
    await fs.mkdir(path.join(root, 'docs/media'), { recursive: true });
    await fs.writeFile(
      path.join(root, 'docs/media/hero.png'),
      'test image placeholder'
    );
    await fs.writeFile(
      path.join(root, '.pomade.json'),
      JSON.stringify({ preset: 'signature', screenshot: 'docs/media/hero.png' })
    );
    await syncPresentation(root, { approved: true });
    const readme = await fs.readFile(path.join(root, 'README.md'), 'utf8');
    expect(readme.indexOf('## See it in action')).toBeLessThan(
      readme.indexOf('## Quickstart')
    );
    expect(
      (await syncPresentation(root, { approved: true })).appliedCount
    ).toBe(0);
  });
  it('refuses unmarked and malformed existing documents without touching them', async () => {
    for (const readme of [
      '# My handwritten README',
      '<!-- pomade:start header -->\nMy notes',
    ]) {
      await fs.writeFile(path.join(root, 'README.md'), readme);
      await expect(
        syncPresentation(root, { approved: true })
      ).rejects.toThrow();
      expect(await fs.readFile(path.join(root, 'README.md'), 'utf8')).toBe(
        readme
      );
    }
  });
  it('dry-run does not write or call the network', async () => {
    const fetch = vi.spyOn(globalThis, 'fetch');
    const result = await syncPresentation(root, {
      approved: true,
      approvedRemote: true,
      dryRun: true,
      preset: 'animated',
    });
    expect(result.dryRun).toBe(true);
    expect(fetch).not.toHaveBeenCalled();
    await expect(fs.access(path.join(root, 'README.md'))).rejects.toThrow();
  });
  it('applies the exact saved plan even if source metadata changes, and rejects a stale target', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const plan = await new Planner(
      await new RepositoryScanner(root).scan()
    ).createPlan();
    const saved = path.join(root, 'saved-plan.json');
    await fs.writeFile(saved, JSON.stringify(plan));
    await fs.writeFile(
      path.join(root, 'package.json'),
      JSON.stringify({ name: 'changed-after-review' })
    );
    expect(await runApply(root, { approved: true, plan: saved })).toBe(0);
    expect(await fs.readFile(path.join(root, 'README.md'), 'utf8')).toContain(
      'real-project'
    );
    expect(await runApply(root, { approved: true, plan: saved })).toBe(3);
  });
  it('previews setup, installs without overwriting, and rejects missing media', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(await runInit(root)).toBe(0);
    await expect(fs.access(path.join(root, '.pomade.json'))).rejects.toThrow();
    expect(await runInit(root, { approved: true })).toBe(0);
    expect(await runInit(root, { approved: true, preset: 'animated' })).toBe(5);
    expect(
      JSON.parse(await fs.readFile(path.join(root, '.pomade.json'), 'utf8'))
        .preset
    ).toBe('signature');
    await fs.writeFile(
      path.join(root, '.pomade.json'),
      JSON.stringify({ screenshot: 'docs/media/missing.png' })
    );
    await expect(
      new Planner(await new RepositoryScanner(root).scan()).createPlan()
    ).rejects.toThrow('does not exist');
  });
});
