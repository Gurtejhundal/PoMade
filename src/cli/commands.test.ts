import { describe, it, expect } from 'vitest';
import * as path from 'node:path';
import { runScan, runAudit, runDoctor, runPlan, runDiff, runApply } from './commands.js';

describe('CLI Commands', () => {
  const fixturesDir = path.resolve(process.cwd(), 'fixtures');

  it('runs scan in text mode with exit code 0', async () => {
    const code = await runScan(path.join(fixturesDir, 'node-cli'));
    expect(code).toBe(0);
  });

  it('runs scan in json mode with exit code 0', async () => {
    const code = await runScan(path.join(fixturesDir, 'web-app'), { json: true });
    expect(code).toBe(0);
  });

  it('runs audit on compliant fixture with exit code 0', async () => {
    const code = await runAudit(path.join(fixturesDir, 'node-cli'));
    expect(code).toBe(0);
  });

  it('runs audit on empty repo fixture and returns exit code 1 due to missing license / P0 items', async () => {
    const code = await runAudit(path.join(fixturesDir, 'empty-repo'));
    expect(code).toBe(1);
  });

  it('runs doctor command with exit code 0', async () => {
    const code = await runDoctor(fixturesDir);
    expect(code).toBe(0);
  });

  it('returns exit code 2 when target path does not exist for scan', async () => {
    const code = await runScan(path.join(fixturesDir, 'non-existent-path-12345'));
    expect(code).toBe(2);
  });

  it('returns exit code 2 when target path does not exist for audit', async () => {
    const code = await runAudit(path.join(fixturesDir, 'non-existent-path-12345'));
    expect(code).toBe(2);
  });

  it('returns exit code 1 when audit score fails to meet --min-score threshold', async () => {
    // node-cli score is around 79%, minScore 99 will trigger failure
    const code = await runAudit(path.join(fixturesDir, 'node-cli'), { minScore: 99 });
    expect(code).toBe(1);
  });

  it('guarantees zero file modifications during scan and audit operations', async () => {
    const fs = await import('node:fs/promises');
    const targetFile = path.join(fixturesDir, 'node-cli', 'README.md');
    const beforeStat = await fs.stat(targetFile);
    const beforeContent = await fs.readFile(targetFile, 'utf-8');

    // Run both scan and audit
    await runScan(path.join(fixturesDir, 'node-cli'));
    await runAudit(path.join(fixturesDir, 'node-cli'));

    const afterStat = await fs.stat(targetFile);
    const afterContent = await fs.readFile(targetFile, 'utf-8');

    expect(afterContent).toBe(beforeContent);
    expect(afterStat.mtimeMs).toBe(beforeStat.mtimeMs);
  });

  it('runs plan command in text and json mode with exit code 0', async () => {
    const codeText = await runPlan(path.join(fixturesDir, 'node-cli'));
    expect(codeText).toBe(0);

    const codeJson = await runPlan(path.join(fixturesDir, 'web-app'), { json: true });
    expect(codeJson).toBe(0);
  });

  it('runs diff command with exit code 0', async () => {
    const code = await runDiff(path.join(fixturesDir, 'node-cli'));
    expect(code).toBe(0);
  });

  it('runs apply with dry-run and refuses apply without approval', async () => {
    // Unapproved apply returns exit code 4
    const codeDenied = await runApply(path.join(fixturesDir, 'node-cli'), { approved: false });
    expect(codeDenied).toBe(4);

    // Dry-run apply returns exit code 0
    const codeDry = await runApply(path.join(fixturesDir, 'node-cli'), { approved: true, dryRun: true });
    expect(codeDry).toBe(0);
  });
});
