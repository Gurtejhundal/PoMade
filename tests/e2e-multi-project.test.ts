import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import * as os from 'node:os';
import { RepositoryScanner } from '../src/core/scan/scanner.js';
import { AuditEngine } from '../src/core/audit/audit-engine.js';
import { Planner } from '../src/core/plan/planner.js';
import { PlanApplier } from '../src/core/apply/applier.js';
import { DriftDetector } from '../src/core/drift/drift-detector.js';
import { MediaCapturePlanner } from '../src/core/media/capture-plan.js';
import { GitHubMetadataPlanner } from '../src/core/github/metadata-planner.js';
import { ReleasePlanner } from '../src/core/github/release-planner.js';

describe('Phase 6 E2E: Multi-Project Type Validation', () => {
  let tempBase: string;

  beforeEach(async () => {
    tempBase = await fs.mkdtemp(path.join(os.tmpdir(), 'pomade-e2e-'));
  });

  afterEach(async () => {
    await fs.rm(tempBase, { recursive: true, force: true });
  });

  it('scans, plans, audits, and applies documentation to a Node.js CLI repository', async () => {
    const projectDir = path.join(tempBase, 'node-cli');
    await fs.mkdir(path.join(projectDir, 'src'), { recursive: true });
    await fs.writeFile(path.join(projectDir, 'src/index.ts'), 'export const run = () => {};');
    await fs.writeFile(
      path.join(projectDir, 'package.json'),
      JSON.stringify(
        {
          name: 'super-cli',
          version: '1.0.0',
          description: 'A powerful CLI utility for developers',
          license: 'MIT',
          bin: { 'super-cli': './dist/bin.js' },
          scripts: {
            build: 'tsc',
            test: 'vitest run',
          },
          dependencies: {
            commander: '^12.0.0',
          },
          devDependencies: {
            typescript: '^5.0.0',
          },
        },
        null,
        2
      )
    );
    await fs.writeFile(path.join(projectDir, 'LICENSE'), 'MIT License\n\nCopyright 2026 Acme');

    // 1. Scan
    const scanner = new RepositoryScanner(projectDir);
    const snapshot = await scanner.scan();
    expect(snapshot.kind).toBe('cli');
    expect(snapshot.primaryLanguage).toBe('TypeScript');
    expect(snapshot.license?.spdxId).toBe('MIT');

    // 2. Audit
    const auditEngine = new AuditEngine();
    const auditReport = auditEngine.audit(snapshot);
    expect(auditReport.overallScore).toBeGreaterThanOrEqual(40);

    // 3. Plan & Apply
    const planner = new Planner(snapshot, { preset: 'minimal' });
    const plan = await planner.createPlan();
    expect(plan.actions.length).toBe(1);

    const applier = new PlanApplier(plan);
    const applyResult = await applier.apply({ approved: true });
    expect(applyResult.appliedCount).toBe(1);

    const generatedReadme = await fs.readFile(path.join(projectDir, 'README.md'), 'utf-8');
    expect(generatedReadme).toContain('# super-cli');
    expect(generatedReadme).toContain('npm test');

    // 4. Drift Check
    const driftDetector = new DriftDetector(await scanner.scan());
    const driftReport = await driftDetector.detectDrift();
    expect(driftReport.hasDrift).toBe(false);

    // 5. GitHub Metadata & Release Plan
    const ghPlan = GitHubMetadataPlanner.plan(snapshot);
    expect(ghPlan.proposedTopics).toContain('cli');

    const relPlan = ReleasePlanner.plan(snapshot, ['feat: add new command', 'fix: resolve edge case']);
    expect(relPlan.proposedVersion).toBe('1.1.0');
  });

  it('scans, plans, audits, and handles a Python Library repository', async () => {
    const projectDir = path.join(tempBase, 'python-lib');
    await fs.mkdir(path.join(projectDir, 'src'), { recursive: true });
    await fs.writeFile(
      path.join(projectDir, 'pyproject.toml'),
      `[project]
name = "hyper-calc"
version = "0.5.0"
description = "High precision math library"
dependencies = ["numpy", "pytest"]
`
    );
    await fs.writeFile(path.join(projectDir, 'LICENSE'), 'Apache License 2.0\n\nCopyright 2026');

    const scanner = new RepositoryScanner(projectDir);
    const snapshot = await scanner.scan();
    expect(snapshot.kind).toBe('library');
    expect(snapshot.primaryLanguage).toBe('Python');

    // Media capture planner should skip screenshots gracefully
    const mediaPlan = MediaCapturePlanner.createPlan(snapshot);
    expect(mediaPlan.captureRecommended).toBe(false);

    // Plan & Apply
    const planner = new Planner(snapshot, { preset: 'minimal' });
    const plan = await planner.createPlan();
    const applier = new PlanApplier(plan);
    await applier.apply({ approved: true });

    const readme = await fs.readFile(path.join(projectDir, 'README.md'), 'utf-8');
    expect(readme).toContain('# hyper-calc');
  });

  it('scans, plans, and configures media capture for a Web Application repository', async () => {
    const projectDir = path.join(tempBase, 'web-app');
    await fs.mkdir(path.join(projectDir, 'src'), { recursive: true });
    await fs.writeFile(
      path.join(projectDir, 'package.json'),
      JSON.stringify(
        {
          name: 'cloud-dashboard',
          version: '2.0.0',
          description: 'Cloud analytics dashboard interface',
          scripts: {
            dev: 'next dev',
            build: 'next build',
          },
          dependencies: {
            next: '^14.0.0',
            react: '^18.0.0',
          },
        },
        null,
        2
      )
    );

    const scanner = new RepositoryScanner(projectDir);
    const snapshot = await scanner.scan();
    expect(snapshot.kind).toBe('web');

    // UI detection
    const mediaPlan = MediaCapturePlanner.createPlan(snapshot);
    expect(mediaPlan.captureRecommended).toBe(true);
    expect(mediaPlan.uiDetection.hasRunnableUi).toBe(true);
    expect(mediaPlan.uiDetection.framework).toBe('Next.js');
  });

  it('scans and audits an empty/early-stage repository with leniency', async () => {
    const projectDir = path.join(tempBase, 'empty-repo');
    await fs.mkdir(projectDir, { recursive: true });

    const scanner = new RepositoryScanner(projectDir);
    const snapshot = await scanner.scan();
    expect(snapshot.stage).toBe('idea');

    const auditEngine = new AuditEngine();
    const auditReport = auditEngine.audit(snapshot);
    // Early stage should not catastrophically fail with blocking issues
    expect(auditReport.overallScore).toBeGreaterThanOrEqual(10);
  });
});
