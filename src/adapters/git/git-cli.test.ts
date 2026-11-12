import { describe, it, expect } from 'vitest';
import { GitCli } from './git-cli.js';

describe('GitCli', () => {
  it('sanitizes embedded credentials from remote URLs', () => {
    const git = new GitCli(process.cwd());

    const tokenUrl = 'https://ghp_abc12345xyz@github.com/owner/repo.git';
    expect(git.sanitizeUrl(tokenUrl)).toBe('https://***@github.com/owner/repo.git');

    const userPassUrl = 'https://user:password@github.com/owner/repo.git';
    expect(git.sanitizeUrl(userPassUrl)).toBe('https://***@github.com/owner/repo.git');

    const cleanUrl = 'https://github.com/owner/repo.git';
    expect(git.sanitizeUrl(cleanUrl)).toBe('https://github.com/owner/repo.git');
  });

  it('handles non-git directories gracefully without throwing unhandled exceptions', async () => {
    // Non-git path
    const git = new GitCli('/tmp');
    const state = await git.getGitState();

    expect(state.isGit).toBe(false);
    expect(state.branch).toBeNull();
    expect(state.commitSha).toBeNull();
  });
});
