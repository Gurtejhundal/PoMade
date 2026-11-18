import { it, expect, vi, afterEach } from 'vitest';
import { GitHubAdapter } from './github-adapter.js';
import { GitCli } from '../git/git-cli.js';
const plan = {
  proposedDescription: 'A real tool.',
  currentTopics: [],
  proposedTopics: ['cli'],
  commandPreview: 'preview',
};
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});
it('uses GitHub API without exposing a token and preserves manually curated topics', async () => {
  vi.stubEnv('GH_TOKEN', 'private-test-token');
  vi.spyOn(GitCli.prototype, 'getGitState').mockResolvedValue({
    isGit: true,
    branch: 'main',
    clean: true,
    commitSha: 'a',
    remoteUrl: 'git@github.com:owner/project.name.git',
    trackedFilesCount: 1,
  });
  const fetch = vi
    .fn()
    .mockResolvedValueOnce({ ok: true })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ names: ['curated-topic'] }),
    })
    .mockResolvedValueOnce({ ok: true });
  vi.stubGlobal('fetch', fetch);
  const result = await new GitHubAdapter('.').updateMetadata(plan, {
    approvedRemote: true,
  });
  expect(result.success).toBe(true);
  expect(JSON.stringify(result)).not.toContain('private-test-token');
  expect(fetch.mock.calls[0][0]).toBe(
    'https://api.github.com/repos/owner/project.name'
  );
  expect(JSON.parse(fetch.mock.calls[2][1].body)).toEqual({
    names: ['curated-topic', 'cli'],
  });
});
it('reports permission failures and does not claim remote success', async () => {
  vi.stubEnv('GH_TOKEN', 'private-test-token');
  vi.spyOn(GitCli.prototype, 'getGitState').mockResolvedValue({
    isGit: true,
    branch: 'main',
    clean: true,
    commitSha: 'a',
    remoteUrl: 'https://github.com/owner/repo.git',
    trackedFilesCount: 1,
  });
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 403 }));
  await expect(
    new GitHubAdapter('.').updateMetadata(plan, { approvedRemote: true })
  ).rejects.toThrow('Administration write permission');
});
