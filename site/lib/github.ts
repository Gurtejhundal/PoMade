export async function loadRepositoryStars(
  signal?: AbortSignal
): Promise<number> {
  const response = await fetch(
    'https://api.github.com/repos/Gurtejhundal/PoMade',
    { signal }
  );
  if (!response.ok) throw new Error('GitHub statistics are unavailable.');
  const data = await response.json();
  if (!Number.isSafeInteger(data.stargazers_count) || data.stargazers_count < 0)
    throw new Error('Invalid GitHub star count.');
  return data.stargazers_count;
}
