import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import { RepositoryScanner } from '../core/scan/scanner.js';
import { AuditEngine } from '../core/audit/audit-engine.js';
import { Planner } from '../core/plan/planner.js';
import { PlanApplier } from '../core/apply/applier.js';
import { DriftDetector } from '../core/drift/drift-detector.js';
import { MediaCapturePlanner } from '../core/media/capture-plan.js';
import { MediaOrganizer } from '../core/media/organizer.js';
import type { Preset } from '../core/types/schemas.js';
import {
  formatScanText,
  formatAuditText,
  formatPlanText,
  formatDiffText,
  formatApplyText,
  formatDriftText,
  formatMediaPlanText,
} from './formatter.js';

export async function runScan(targetPath?: string, options?: { json?: boolean }): Promise<number> {
  try {
    const resolvedPath = path.resolve(targetPath ?? process.cwd());
    const scanner = new RepositoryScanner(resolvedPath);
    const snapshot = await scanner.scan();

    if (options?.json) {
      console.log(JSON.stringify(snapshot, null, 2));
    } else {
      console.log(formatScanText(snapshot));
    }

    return 0;
  } catch (err: any) {
    console.error(`Error during scan: ${err.message}`);
    if (err.message.includes('does not exist') || err.message.includes('Security violation')) {
      return 2;
    }
    return 5;
  }
}

export async function runAudit(
  targetPath?: string,
  options?: { format?: 'text' | 'json'; minScore?: number }
): Promise<number> {
  try {
    const resolvedPath = path.resolve(targetPath ?? process.cwd());
    const scanner = new RepositoryScanner(resolvedPath);
    const snapshot = await scanner.scan();

    const auditEngine = new AuditEngine();
    const report = auditEngine.audit(snapshot);

    if (options?.format === 'json') {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log(formatAuditText(report));
    }

    if (options?.minScore !== undefined && report.overallScore < options.minScore) {
      return 1; // Quality gate failed
    }

    // If any P0 failure or blocker exists, return exit code 1
    const hasP0Failure = report.findings.some(
      (f) => (f.status === 'fail' || f.status === 'blocked') && f.severity === 'P0'
    );

    return hasP0Failure ? 1 : 0;
  } catch (err: any) {
    console.error(`Error during audit: ${err.message}`);
    if (err.message.includes('does not exist') || err.message.includes('Security violation')) {
      return 2;
    }
    return 5;
  }
}

export async function runPlan(
  targetPath?: string,
  options?: { preset?: Preset; json?: boolean; output?: string; userIntent?: string }
): Promise<number> {
  try {
    const resolvedPath = path.resolve(targetPath ?? process.cwd());
    const scanner = new RepositoryScanner(resolvedPath);
    const snapshot = await scanner.scan();

    const planner = new Planner(snapshot, {
      preset: options?.preset ?? 'minimal',
      userIntent: options?.userIntent,
    });
    const plan = await planner.createPlan();

    if (options?.output) {
      await fs.writeFile(path.resolve(options.output), JSON.stringify(plan, null, 2), 'utf-8');
      console.log(`Plan written to ${options.output}`);
    }

    if (options?.json) {
      console.log(JSON.stringify(plan, null, 2));
    } else {
      console.log(formatPlanText(plan));
    }

    return 0;
  } catch (err: any) {
    console.error(`Error during plan: ${err.message}`);
    if (err.message.includes('does not exist') || err.message.includes('Security violation')) {
      return 2;
    }
    return 5;
  }
}

export async function runDiff(
  targetPath?: string,
  options?: { preset?: Preset; json?: boolean; userIntent?: string }
): Promise<number> {
  try {
    const resolvedPath = path.resolve(targetPath ?? process.cwd());
    const scanner = new RepositoryScanner(resolvedPath);
    const snapshot = await scanner.scan();

    const planner = new Planner(snapshot, {
      preset: options?.preset ?? 'minimal',
      userIntent: options?.userIntent,
    });
    const plan = await planner.createPlan();

    if (options?.json) {
      console.log(
        JSON.stringify(
          {
            planId: plan.planId,
            diffs: plan.actions.map((a) => ({ target: a.target, diff: a.proposedDiff })),
          },
          null,
          2
        )
      );
    } else {
      console.log(formatDiffText(plan));
    }

    return 0;
  } catch (err: any) {
    console.error(`Error during diff: ${err.message}`);
    if (err.message.includes('does not exist') || err.message.includes('Security violation')) {
      return 2;
    }
    return 5;
  }
}

export async function runApply(
  targetPath?: string,
  options?: { approved?: boolean; preset?: Preset; dryRun?: boolean; json?: boolean; userIntent?: string }
): Promise<number> {
  try {
    const resolvedPath = path.resolve(targetPath ?? process.cwd());
    const scanner = new RepositoryScanner(resolvedPath);
    const snapshot = await scanner.scan();

    const planner = new Planner(snapshot, {
      preset: options?.preset ?? 'minimal',
      userIntent: options?.userIntent,
    });
    const plan = await planner.createPlan();

    const applier = new PlanApplier(plan);
    const result = await applier.apply({
      approved: Boolean(options?.approved),
      dryRun: Boolean(options?.dryRun),
    });

    if (options?.json) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log(formatApplyText(result));
    }

    return 0;
  } catch (err: any) {
    console.error(`Error during apply: ${err.message}`);
    if (err.exitCode) {
      return err.exitCode;
    }
    if (err.message.includes('Authorization required')) {
      return 4;
    }
    if (err.message.includes('Stale plan')) {
      return 3;
    }
    if (err.message.includes('does not exist') || err.message.includes('Security violation')) {
      return 2;
    }
    return 5;
  }
}

export async function runDoctor(targetPath?: string): Promise<number> {
  try {
    const resolvedPath = path.resolve(targetPath ?? process.cwd());
    console.log(`\nPomade Doctor checking environment in ${resolvedPath}...`);

    console.log(`Node.js version: ${process.version}`);
    console.log(`Platform:        ${process.platform} (${process.arch})`);

    const scanner = new RepositoryScanner(resolvedPath);
    const snapshot = await scanner.scan();

    console.log(`Git available:   ${snapshot.gitState.isGit ? 'Yes' : 'No'}`);
    console.log(`Manifests found: ${snapshot.manifests.length}`);
    console.log(`Docs found:      ${snapshot.docs.length}`);
    console.log('\nStatus: System checks passed successfully.\n');

    return 0;
  } catch (err: any) {
    console.error(`Doctor check failed: ${err.message}`);
    return 5;
  }
}

export async function runDrift(
  targetPath?: string,
  options?: { json?: boolean; failOnDrift?: boolean }
): Promise<number> {
  try {
    const resolvedPath = path.resolve(targetPath ?? process.cwd());
    const scanner = new RepositoryScanner(resolvedPath);
    const snapshot = await scanner.scan();

    const detector = new DriftDetector(snapshot);
    const report = await detector.detectDrift();

    if (options?.json) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log(formatDriftText(report));
    }

    if (options?.failOnDrift && report.hasDrift) {
      return 1;
    }

    return 0;
  } catch (err: any) {
    console.error(`Error during drift check: ${err.message}`);
    if (err.message.includes('does not exist') || err.message.includes('Security violation')) {
      return 2;
    }
    return 5;
  }
}

export async function runMediaPlan(targetPath?: string, options?: { json?: boolean }): Promise<number> {
  try {
    const resolvedPath = path.resolve(targetPath ?? process.cwd());
    const scanner = new RepositoryScanner(resolvedPath);
    const snapshot = await scanner.scan();

    const plan = MediaCapturePlanner.createPlan(snapshot);

    if (options?.json) {
      console.log(JSON.stringify(plan, null, 2));
    } else {
      console.log(formatMediaPlanText(plan));
    }

    return 0;
  } catch (err: any) {
    console.error(`Error during media plan: ${err.message}`);
    if (err.message.includes('does not exist') || err.message.includes('Security violation')) {
      return 2;
    }
    return 5;
  }
}

export async function runGenerateDiagram(targetPath?: string, options?: { output?: string }): Promise<number> {
  try {
    const resolvedPath = path.resolve(targetPath ?? process.cwd());
    const scanner = new RepositoryScanner(resolvedPath);
    const snapshot = await scanner.scan();

    const organizer = new MediaOrganizer(resolvedPath);
    const outPath = options?.output ?? 'docs/media/architecture.svg';
    await organizer.saveArchitectureDiagram(snapshot, outPath);

    console.log(`\n✔ Architecture diagram successfully generated: ${outPath}\n`);
    return 0;
  } catch (err: any) {
    console.error(`Error generating diagram: ${err.message}`);
    if (err.message.includes('does not exist') || err.message.includes('Security violation')) {
      return 2;
    }
    return 5;
  }
}

export async function runGenerateCard(targetPath?: string, options?: { output?: string }): Promise<number> {
  try {
    const resolvedPath = path.resolve(targetPath ?? process.cwd());
    const scanner = new RepositoryScanner(resolvedPath);
    const snapshot = await scanner.scan();

    const organizer = new MediaOrganizer(resolvedPath);
    const outPath = options?.output ?? 'docs/media/social-preview.svg';
    await organizer.saveSocialCard(snapshot, outPath);

    console.log(`\n✔ 1280x640 GitHub social preview card successfully generated: ${outPath}\n`);
    return 0;
  } catch (err: any) {
    console.error(`Error generating social card: ${err.message}`);
    if (err.message.includes('does not exist') || err.message.includes('Security violation')) {
      return 2;
    }
    return 5;
  }
}
