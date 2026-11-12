import { describe, it, expect } from 'vitest';
import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import { runScan, runAudit, runPlan, runDiff, runApply, runDrift } from '../src/cli/commands.js';
import { RepositoryScanner } from '../src/core/scan/scanner.js';
import { Planner } from '../src/core/plan/planner.js';
import { PlanApplier } from '../src/core/apply/applier.js';
import { DriftDetector } from '../src/core/drift/drift-detector.js';

describe('Agent Integration & Lifecycle Simulation', () => {
  const agentWorkspace = path.resolve(process.cwd(), 'fixtures/agent-e2e-workspace');
  const skillFile = path.resolve(process.cwd(), 'skills/pomade/SKILL.md');

  it('validates that portable SKILL.md adheres to Agent Skills specification', async () => {
    const content = await fs.readFile(skillFile, 'utf-8');

    // Check YAML frontmatter
    expect(content).toMatch(/^---\n[\s\S]*?\n---/);
    expect(content).toContain('name: pomade');
    expect(content).toContain('description:');
    expect(content).toContain('compatibility:');

    // Check agent rules
    expect(content).toContain('Evidence > Adjectives');
    expect(content).toContain('Preserve Human Writing');
    expect(content).toContain('pomade apply --approved');
  });

  it('simulates end-to-end coding agent lifecycle: scan -> audit -> plan -> diff -> approval -> apply -> drift -> patch', async () => {
    // Clean start
    await fs.rm(agentWorkspace, { recursive: true, force: true });
    await fs.mkdir(agentWorkspace, { recursive: true });

    // Step 1: Initialize a minimal node tool in the workspace
    await fs.writeFile(
      path.join(agentWorkspace, 'package.json'),
      JSON.stringify(
        {
          name: 'agent-managed-tool',
          version: '0.1.0',
          description: 'A developer utility maintained by an AI agent',
          scripts: {
            build: 'tsc',
            test: 'vitest run',
          },
        },
        null,
        2
      )
    );

    try {
      // Step 2: Agent executes scan and audit
      const scanCode = await runScan(agentWorkspace);
      expect(scanCode).toBe(0);

      const auditCode = await runAudit(agentWorkspace);
      // Fails or warns because README is initially missing
      expect(auditCode).toBe(1);

      // Step 3: Agent executes plan & diff
      const planCode = await runPlan(agentWorkspace, { preset: 'minimal' });
      expect(planCode).toBe(0);

      const diffCode = await runDiff(agentWorkspace, { preset: 'minimal' });
      expect(diffCode).toBe(0);

      // Step 4: Agent attempts apply WITHOUT approval -> must be refused!
      const unauthorizedCode = await runApply(agentWorkspace, { approved: false });
      expect(unauthorizedCode).toBe(4);

      // Verify file was NOT created
      const readmeExistsBefore = await fs
        .access(path.join(agentWorkspace, 'README.md'))
        .then(() => true)
        .catch(() => false);
      expect(readmeExistsBefore).toBe(false);

      // Step 5: User grants approval -> apply succeeds
      const approvedCode = await runApply(agentWorkspace, { approved: true, preset: 'minimal' });
      expect(approvedCode).toBe(0);

      // Verify README was created with managed markers
      const initialReadme = await fs.readFile(path.join(agentWorkspace, 'README.md'), 'utf-8');
      expect(initialReadme).toContain('# agent-managed-tool');
      expect(initialReadme).toContain('<!-- pomade:start header -->');
      expect(initialReadme).toContain('<!-- pomade:start quickstart -->');

      // Human user inserts a custom manual note outside managed markers
      const humanCustomizedReadme = `${initialReadme}\n\n## Custom Human Section\nWritten by developer by hand.\n`;
      await fs.writeFile(path.join(agentWorkspace, 'README.md'), humanCustomizedReadme, 'utf-8');

      // Step 6: Code change occurs! Developer adds a new script to package.json
      const updatedPkg = JSON.parse(await fs.readFile(path.join(agentWorkspace, 'package.json'), 'utf-8'));
      updatedPkg.scripts.dev = 'node src/dev.js';
      await fs.writeFile(path.join(agentWorkspace, 'package.json'), JSON.stringify(updatedPkg, null, 2), 'utf-8');

      // Step 7: Drift detection runs!
      const scannerAfterCodeChange = new RepositoryScanner(agentWorkspace);
      const snapshotAfterCodeChange = await scannerAfterCodeChange.scan();
      const driftDetector = new DriftDetector(snapshotAfterCodeChange);
      const driftReport = await driftDetector.detectDrift();

      // Drift detector identifies that 'dev' script was added to code but missing from README!
      expect(driftReport.hasDrift).toBe(true);
      expect(driftReport.findings.some((f) => f.id === 'drift-script-dev')).toBe(true);

      // Step 8: Agent runs plan to resolve drift
      const planner = new Planner(snapshotAfterCodeChange, { preset: 'minimal' });
      const patchPlan = await planner.createPlan();

      expect(patchPlan.actions).toHaveLength(1);
      // Proposes update to README
      expect(patchPlan.actions[0].proposedDiff).toContain('+npm run dev');

      // Step 9: Agent applies the approved patch
      const applier = new PlanApplier(patchPlan);
      const applyResult = await applier.apply({ approved: true });
      expect(applyResult.appliedCount).toBe(1);

      // Step 10: Verify the human-written custom section is 100% PRESERVED!
      const finalReadme = await fs.readFile(path.join(agentWorkspace, 'README.md'), 'utf-8');
      expect(finalReadme).toContain('## Custom Human Section');
      expect(finalReadme).toContain('Written by developer by hand.');
      expect(finalReadme).toContain('npm run dev');

      // Step 11: Re-check drift -> Zero drift!
      const scannerFinal = new RepositoryScanner(agentWorkspace);
      const snapshotFinal = await scannerFinal.scan();
      const driftFinal = await new DriftDetector(snapshotFinal).detectDrift();
      expect(driftFinal.hasDrift).toBe(false);
    } finally {
      await fs.rm(agentWorkspace, { recursive: true, force: true });
    }
  });
});
