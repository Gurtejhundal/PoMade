import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import type { GitState } from '../../core/types/schemas.js';

const execFileAsync = promisify(execFile);

export class GitCli {
  private readonly cwd: string;
  private readonly timeoutMs: number;

  constructor(cwd: string, timeoutMs = 5000) {
    this.cwd = cwd;
    this.timeoutMs = timeoutMs;
  }

  private async run(args: string[]): Promise<string> {
    const { stdout } = await execFileAsync('git', args, {
      cwd: this.cwd,
      timeout: this.timeoutMs,
      maxBuffer: 1024 * 1024 * 2,
      windowsHide: true,
    });
    return stdout.trim();
  }

  public sanitizeUrl(rawUrl: string): string {
    // Redact basic auth tokens / passwords in URLs
    return rawUrl.replace(/:\/\/[^@/\s]+@/g, '://***@');
  }

  public async getGitState(): Promise<GitState> {
    try {
      // Check if inside a work tree
      const isInside = await this.run(['rev-parse', '--is-inside-work-tree']);
      if (isInside !== 'true') {
        return this.emptyGitState();
      }

      // Branch name
      let branch: string | null = null;
      try {
        branch = await this.run(['rev-parse', '--abbrev-ref', 'HEAD']);
        if (branch === 'HEAD') {
          // Detached HEAD
          branch = null;
        }
      } catch {
        branch = null;
      }

      // Commit sha
      let commitSha: string | null = null;
      try {
        commitSha = await this.run(['rev-parse', 'HEAD']);
      } catch {
        commitSha = null;
      }

      // Working tree clean status
      let clean = true;
      try {
        const status = await this.run(['status', '--porcelain']);
        clean = status.length === 0;
      } catch {
        clean = true;
      }

      // Remote URL
      let remoteUrl: string | null = null;
      try {
        const rawRemote = await this.run(['config', '--get', 'remote.origin.url']);
        remoteUrl = rawRemote ? this.sanitizeUrl(rawRemote) : null;
      } catch {
        remoteUrl = null;
      }

      // Tracked files count
      let trackedFilesCount = 0;
      try {
        const tracked = await this.run(['ls-files']);
        trackedFilesCount = tracked ? tracked.split('\n').filter(Boolean).length : 0;
      } catch {
        trackedFilesCount = 0;
      }

      return {
        isGit: true,
        branch,
        clean,
        commitSha,
        remoteUrl,
        trackedFilesCount,
      };
    } catch {
      // Git command failed or not a git repository
      return this.emptyGitState();
    }
  }

  public async log(limit = 30): Promise<string[]> {
    try {
      const output = await this.run(['log', `-${limit}`, '--pretty=format:%s']);
      return output ? output.split('\n').filter(Boolean) : [];
    } catch {
      return [];
    }
  }

  private emptyGitState(): GitState {
    return {
      isGit: false,
      branch: null,
      clean: true,
      commitSha: null,
      remoteUrl: null,
      trackedFilesCount: 0,
    };
  }
}
