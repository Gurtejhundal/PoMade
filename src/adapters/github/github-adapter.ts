import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import type { GitHubMetadataPlan } from '../../core/github/metadata-planner.js';

const execFileAsync = promisify(execFile);

export interface GitHubUpdateOptions {
  approvedRemote: boolean;
  dryRun?: boolean;
}

export interface GitHubUpdateResult {
  success: boolean;
  dryRun: boolean;
  executedCommand: string;
  output?: string;
}

export class GitHubAdapter {
  private readonly cwd: string;

  constructor(cwd: string) {
    this.cwd = cwd;
  }

  public async checkAuth(): Promise<{ authenticated: boolean; user?: string; reason?: string }> {
    try {
      const { stdout } = await execFileAsync('gh', ['auth', 'status'], { cwd: this.cwd, windowsHide: true });
      const match = stdout.match(/Logged in to github\.com account ([a-zA-Z0-9_\-]+)/);
      return { authenticated: true, user: match?.[1] };
    } catch (err: any) {
      return { authenticated: false, reason: 'GitHub CLI (`gh`) not installed or not logged in.' };
    }
  }

  public async updateMetadata(
    plan: GitHubMetadataPlan,
    options: GitHubUpdateOptions
  ): Promise<GitHubUpdateResult> {
    if (!options.approvedRemote) {
      const err = new Error(
        'Remote authorization required: Remote GitHub repository mutations are blocked. Pass `--approved-remote` to authorize.'
      );
      (err as any).exitCode = 4;
      throw err;
    }

    if (options.dryRun) {
      return {
        success: true,
        dryRun: true,
        executedCommand: plan.commandPreview,
      };
    }

    const auth = await this.checkAuth();
    if (!auth.authenticated) {
      const err = new Error(
        `Remote execution blocked: ${auth.reason}\nRun manually: ${plan.commandPreview}`
      );
      (err as any).exitCode = 5;
      throw err;
    }

    // Execute via gh
    const args = ['repo', 'edit', '--description', plan.proposedDescription];
    for (const topic of plan.proposedTopics) {
      args.push('--add-topic', topic);
    }

    const { stdout } = await execFileAsync('gh', args, { cwd: this.cwd, windowsHide: true });
    return {
      success: true,
      dryRun: false,
      executedCommand: plan.commandPreview,
      output: stdout.trim(),
    };
  }
}
