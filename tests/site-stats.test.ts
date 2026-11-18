import { afterEach, expect, it, vi } from 'vitest';
import { loadRepositoryStars } from '../site/lib/github';
afterEach(() => vi.unstubAllGlobals());
it('preserves an actual zero-star result instead of inventing a growth curve', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ stargazers_count: 0 }),
    })
  );
  expect(await loadRepositoryStars()).toBe(0);
});
it('rejects unavailable or malformed GitHub data', async () => {
  for (const response of [
    { ok: false },
    { ok: true, json: async () => ({ stargazers_count: -1 }) },
  ]) {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));
    await expect(loadRepositoryStars()).rejects.toThrow();
  }
});
