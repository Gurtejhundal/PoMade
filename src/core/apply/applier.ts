import type { Plan } from '../types/schemas.js';
import { SafeFileSystem } from '../../adapters/filesystem/safe-fs.js';
import { PolicyGuard } from '../policy/guard.js';

export interface ApplyOptions {
  approved: boolean;
  dryRun?: boolean;
}

export interface ApplyResult {
  planId: string;
  appliedCount: number;
  modifiedFiles: string[];
  dryRun: boolean;
  timestamp: string;
}

export class PlanApplier {
  private readonly plan: Plan;
  private readonly fs: SafeFileSystem;

  constructor(plan: Plan) {
    this.plan = plan;
    this.fs = new SafeFileSystem(plan.repoRoot);
  }

  public async apply(options: ApplyOptions): Promise<ApplyResult> {
    // 1. Guard check: Authorization required
    PolicyGuard.verifyApproval(options.approved);

    const modifiedFiles: string[] = [];

    // 2. Guard check: Freshness of all targets before writing any file
    for (const action of this.plan.actions) {
      if (action.kind === 'write-local') {
        await PolicyGuard.verifyFreshness(this.fs, action);
      }
    }

    if (options.dryRun) {
      return {
        planId: this.plan.planId,
        appliedCount: this.plan.actions.length,
        modifiedFiles: this.plan.actions.map((a) => a.target),
        dryRun: true,
        timestamp: new Date().toISOString(),
      };
    }

    // 3. Execute atomic writes
    for (const action of this.plan.actions) {
      if (action.kind === 'write-local') {
        await this.fs.atomicWriteFile(action.target, action.proposedContent);
        modifiedFiles.push(action.target);
      }
    }

    return {
      planId: this.plan.planId,
      appliedCount: modifiedFiles.length,
      modifiedFiles,
      dryRun: false,
      timestamp: new Date().toISOString(),
    };
  }
}
