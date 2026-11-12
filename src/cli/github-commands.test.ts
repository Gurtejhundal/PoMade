import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import * as os from 'node:os';
import {
  runGitHubPlan,
  runGitHubApply,
  runInitCommunity,
  runReleasePlan,
} from './commands.js';

describe('GitHub & Release CLI commands', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'pomade-gh-cli-test-'));
    // Setup a minimal valid Node project
    await fs.writeFile(
      path.join(tempDir, 'package.json'),
      JSON.stringify(
        {
          name: 'test-cli-pkg',
          version: '1.0.0',
          description: 'A test package for GitHub command tests.',
          scripts: { test: 'vitest run' },
        },
        null,
        2
      )
    );
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it('runs pomade github plan successfully', async () => {
    const code = await runGitHubPlan(tempDir, { json: true });
    expect(code).toBe(0);
  });

  it('runs pomade github apply in dry-run mode with approval', async () => {
    const code = await runGitHubApply(tempDir, { approvedRemote: true, dryRun: true, json: true });
    expect(code).toBe(0);
  });

  it('fails pomade github apply without approvedRemote', async () => {
    const code = await runGitHubApply(tempDir, { approvedRemote: false });
    expect(code).toBe(4);
  });

  it('runs pomade github init-community with dry-run without modifying disk', async () => {
    const code = await runInitCommunity(tempDir, { approved: true, dryRun: true });
    expect(code).toBe(0);

    // Verify files were not actually created on disk
    const issueTemplateExists = await fs
      .access(path.join(tempDir, '.github/ISSUE_TEMPLATE/bug_report.md'))
      .then(() => true)
      .catch(() => false);
    expect(issueTemplateExists).toBe(false);
  });

  it('runs pomade github init-community with approval creating templates and license', async () => {
    const code = await runInitCommunity(tempDir, {
      approved: true,
      license: 'MIT',
      author: 'Test Maintainer',
    });
    expect(code).toBe(0);

    // Verify created files
    const bugReport = await fs.readFile(
      path.join(tempDir, '.github/ISSUE_TEMPLATE/bug_report.md'),
      'utf-8'
    );
    expect(bugReport).toContain('name: Bug Report');

    const prTemplate = await fs.readFile(path.join(tempDir, '.github/pull_request_template.md'), 'utf-8');
    expect(prTemplate).toContain('## Summary');

    const contributing = await fs.readFile(path.join(tempDir, 'CONTRIBUTING.md'), 'utf-8');
    expect(contributing).toContain('# Contributing to test-cli-pkg');

    const license = await fs.readFile(path.join(tempDir, 'LICENSE'), 'utf-8');
    expect(license).toContain('MIT License');
    expect(license).toContain('Test Maintainer');

    // Second run should be idempotent
    const code2 = await runInitCommunity(tempDir, { approved: true });
    expect(code2).toBe(0);
  });

  it('runs pomade release plan successfully', async () => {
    const code = await runReleasePlan(tempDir, { json: true });
    expect(code).toBe(0);
  });
});
