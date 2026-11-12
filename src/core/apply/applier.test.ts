import { describe, it, expect } from 'vitest';
import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import { RepositoryScanner } from '../scan/scanner.js';
import { Planner } from '../plan/planner.js';
import { PlanApplier } from './applier.js';

describe('PlanApplier & PolicyGuard', () => {
  const scratchDir = path.resolve(process.cwd(), 'fixtures/scratch-apply-test');

  it('refuses to apply without explicit user approval', async () => {
    const scanner = new RepositoryScanner(path.resolve(process.cwd(), 'fixtures/empty-repo'));
    const snapshot = await scanner.scan();
    const planner = new Planner(snapshot);
    const plan = await planner.createPlan();

    const applier = new PlanApplier(plan);
    await expect(applier.apply({ approved: false })).rejects.toThrowError(/Authorization required/);
  });

  it('safely applies plan with approval, atomic write, and achieves idempotency', async () => {
    // 1. Create a temporary test repo directory
    await fs.mkdir(scratchDir, { recursive: true });
    await fs.writeFile(
      path.join(scratchDir, 'package.json'),
      JSON.stringify({ name: 'temp-apply-tool', version: '0.1.0' }, null, 2),
      'utf-8'
    );

    try {
      // 2. Scan and plan
      const scanner = new RepositoryScanner(scratchDir);
      const snapshot = await scanner.scan();
      const planner = new Planner(snapshot, { preset: 'minimal' });
      const plan = await planner.createPlan();

      expect(plan.actions).toHaveLength(1);

      // 3. Dry-run verify: no file created
      const applier = new PlanApplier(plan);
      const dryResult = await applier.apply({ approved: true, dryRun: true });
      expect(dryResult.dryRun).toBe(true);

      const existsAfterDryRun = await fs
        .access(path.join(scratchDir, 'README.md'))
        .then(() => true)
        .catch(() => false);
      expect(existsAfterDryRun).toBe(false);

      // 4. Approved apply: writes atomically
      const applyResult = await applier.apply({ approved: true });
      expect(applyResult.appliedCount).toBe(1);
      expect(applyResult.modifiedFiles).toContain('README.md');

      const readmeContent = await fs.readFile(path.join(scratchDir, 'README.md'), 'utf-8');
      expect(readmeContent).toContain('# temp-apply-tool');
      expect(readmeContent).toContain('<!-- pomade:start header -->');

      // 5. Idempotency test: Re-scan and re-plan on the updated repo
      const scanner2 = new RepositoryScanner(scratchDir);
      const snapshot2 = await scanner2.scan();
      const planner2 = new Planner(snapshot2, { preset: 'minimal' });
      const plan2 = await planner2.createPlan();

      // Zero actions proposed on second run!
      expect(plan2.actions).toHaveLength(0);
      expect(plan2.summary).toContain('No documentation changes needed');
    } finally {
      // Cleanup scratch directory
      await fs.rm(scratchDir, { recursive: true, force: true });
    }
  });

  it('detects stale plan conflict if file was modified after plan creation', async () => {
    await fs.mkdir(scratchDir, { recursive: true });
    const targetFile = path.join(scratchDir, 'README.md');
    await fs.writeFile(targetFile, '# Original Version\n', 'utf-8');

    try {
      const scanner = new RepositoryScanner(scratchDir);
      const snapshot = await scanner.scan();
      const planner = new Planner(snapshot);
      const plan = await planner.createPlan();

      // Simulate external edit to target file after plan was generated
      await fs.writeFile(targetFile, '# Externally Modified Version\n', 'utf-8');

      const applier = new PlanApplier(plan);
      await expect(applier.apply({ approved: true })).rejects.toThrowError(/Stale plan conflict/);
    } finally {
      await fs.rm(scratchDir, { recursive: true, force: true });
    }
  });
});
