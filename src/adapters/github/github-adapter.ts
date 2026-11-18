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

  public async checkAuth(): Promise<{
    authenticated: boolean;
    user?: string;
    reason?: string;
  }> {
    try {
      const { stdout } = await execFileAsync('gh', ['auth', 'status'], {
        cwd: this.cwd,
        windowsHide: true,
      });
      const match = stdout.match(
        /Logged in to github\.com account ([a-zA-Z0-9_\-]+)/
      );
      return { authenticated: true, user: match?.[1] };
    } catch (err: any) {
      return {
        authenticated: false,
        reason: 'GitHub CLI (`gh`) not installed or not logged in.',
      };
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

    const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
    if (token) {
      const { GitCli } = await import('../git/git-cli.js');
      const state = await new GitCli(this.cwd).getGitState();
      const slug = state.remoteUrl?.match(
        /^(?:git@github\.com:|https:\/\/github\.com\/)([\w.-]+\/[\w.-]+?)(?:\.git)?$/
      )?.[1];
      if (!slug)
        throw new Error(
          'A GitHub origin remote is required for metadata sync.'
        );
      const headers = {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json',
      };
      const update = async (suffix: string, method: string, body: unknown) => {
        const response = await fetch(
          `https://api.github.com/repos/${slug}${suffix}`,
          {
            method,
            headers,
            body: JSON.stringify(body),
            signal: AbortSignal.timeout(15000),
          }
        );
        if (!response.ok)
          throw new Error(
            `GitHub metadata update failed (${response.status}). Check repository Administration write permission.`
          );
      };
      await update('', 'PATCH', {
        description: plan.proposedDescription,
        ...(plan.suggestedHomepage ? { homepage: plan.suggestedHomepage } : {}),
      });
      // Preserve manually curated topics while adding configured or detected topics.
      const current = await fetch(
        `https://api.github.com/repos/${slug}/topics`,
        { headers, signal: AbortSignal.timeout(15000) }
      );
      if (!current.ok)
        throw new Error(`GitHub topics read failed (${current.status}).`);
      const { names } = (await current.json()) as { names: string[] };
      const topics = [...new Set([...names, ...plan.proposedTopics])];
      if (topics.length > 20)
        throw new Error(
          'GitHub allows 20 topics; curate existing topics before syncing.'
        );
      await update('/topics', 'PUT', { names: topics });
      return {
        success: true,
        dryRun: false,
        executedCommand: 'GitHub REST: update About and add topics',
        output: slug,
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
    if (plan.suggestedHomepage) args.push('--homepage', plan.suggestedHomepage);
    for (const topic of plan.proposedTopics) {
      args.push('--add-topic', topic);
    }

    const { stdout } = await execFileAsync('gh', args, {
      cwd: this.cwd,
      windowsHide: true,
    });
    return {
      success: true,
      dryRun: false,
      executedCommand: plan.commandPreview,
      output: stdout.trim(),
    };
  }
}
