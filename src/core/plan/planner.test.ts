import { describe, it, expect } from 'vitest';
import * as path from 'node:path';
import { RepositoryScanner } from '../scan/scanner.js';
import { Planner } from './planner.js';

describe('Planner', () => {
  const fixturesDir = path.resolve(process.cwd(), 'fixtures');

  it('creates an action plan for empty repo without README', async () => {
    const scanner = new RepositoryScanner(path.join(fixturesDir, 'empty-repo'));
    const snapshot = await scanner.scan();

    const planner = new Planner(snapshot, { preset: 'minimal' });
    const plan = await planner.createPlan();

    expect(plan.actions).toHaveLength(1);
    expect(plan.actions[0].target).toBe('README.md');
    expect(plan.actions[0].kind).toBe('write-local');
    expect(plan.actions[0].beforeHash).toBe('');
    expect(plan.actions[0].proposedDiff).toContain('+<!-- pomade:start header -->');
  });

  it('creates plan with risk medium when updating existing unmanaged README', async () => {
    const scanner = new RepositoryScanner(path.join(fixturesDir, 'node-cli'));
    const snapshot = await scanner.scan();

    const planner = new Planner(snapshot, { preset: 'minimal' });
    const plan = await planner.createPlan();

    expect(plan.actions).toHaveLength(1);
    expect(plan.actions[0].risk).toBe('medium');
    expect(plan.actions[0].beforeHash).not.toBe('');
  });
});
