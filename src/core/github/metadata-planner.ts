import type { RepositorySnapshot } from '../types/schemas.js';

export interface GitHubMetadataPlan {
  currentDescription?: string;
  proposedDescription: string;
  currentTopics: string[];
  proposedTopics: string[];
  suggestedHomepage?: string;
  evidence: string[];
  commandPreview: string;
}

export class GitHubMetadataPlanner {
  public static plan(snapshot: RepositorySnapshot): GitHubMetadataPlan {
    const manifest = snapshot.manifests[0];
    const name = manifest?.name ?? 'project';
    const rawDesc = manifest?.description ?? `A ${snapshot.kind} project built with ${snapshot.primaryLanguage ?? 'modern tooling'}.`;

    // Ensure concise, professional description <= 100 chars, no trailing period
    let proposedDescription = rawDesc.trim();
    if (proposedDescription.endsWith('.')) {
      proposedDescription = proposedDescription.slice(0, -1);
    }
    if (proposedDescription.length > 100) {
      proposedDescription = proposedDescription.slice(0, 97) + '...';
    }

    // Determine evidence-backed topics (3-8 topics)
    const topicSet = new Set<string>();

    // 1. Language topics
    if (snapshot.primaryLanguage) {
      topicSet.add(snapshot.primaryLanguage.toLowerCase());
    }

    // 2. Kind topics
    if (snapshot.kind === 'cli') {
      topicSet.add('cli');
      topicSet.add('developer-tools');
    } else if (snapshot.kind === 'web') {
      topicSet.add('web');
      topicSet.add('frontend');
    } else if (snapshot.kind === 'api') {
      topicSet.add('api');
      topicSet.add('backend');
    } else if (snapshot.kind === 'library') {
      topicSet.add('library');
    } else if (snapshot.kind === 'monorepo') {
      topicSet.add('monorepo');
    }

    // 3. Framework topics
    for (const fw of snapshot.frameworks) {
      const sanitized = fw.toLowerCase().replace(/[^a-z0-9]/g, '-');
      topicSet.add(sanitized);
    }

    // Always relevant
    topicSet.add('documentation');

    const proposedTopics = Array.from(topicSet).slice(0, 7);

    // Build command preview for gh repo edit
    const topicFlags = proposedTopics.map((t) => `--add-topic ${t}`).join(' ');
    const repoSlug = snapshot.gitState.remoteUrl
      ? snapshot.gitState.remoteUrl.replace(/^.*github\.com[/:]([^/]+\/[^/.]+)(\.git)?$/, '$1')
      : 'OWNER/REPO';

    const commandPreview = `gh repo edit ${repoSlug} --description "${proposedDescription}" ${topicFlags}`;

    return {
      currentDescription: manifest?.description,
      proposedDescription,
      currentTopics: [],
      proposedTopics,
      evidence: [
        manifest ? `manifest:${manifest.manifestType}:${manifest.path}` : 'snapshot',
        ...snapshot.frameworks.map((f) => `framework:${f}`),
      ],
      commandPreview,
    };
  }
}
