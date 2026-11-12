import type { RepositorySnapshot } from '../types/schemas.js';

export interface ReleasePlan {
  currentVersion: string;
  proposedVersion: string;
  bumpType: 'major' | 'minor' | 'patch';
  changelogEntry: string;
  releaseNotesDraft: string;
  verifiedTests: boolean;
  warnings: string[];
}

export class ReleasePlanner {
  public static plan(snapshot: RepositorySnapshot, commitMessages: string[] = []): ReleasePlan {
    const currentVersion = snapshot.manifests[0]?.version ?? '0.1.0';
    const warnings: string[] = [];

    // Analyze commit conventions
    let hasBreaking = false;
    let hasFeatures = false;
    let hasFixes = false;

    const features: string[] = [];
    const fixes: string[] = [];
    const others: string[] = [];

    for (const msg of commitMessages) {
      const trimmed = msg.trim();
      const lower = trimmed.toLowerCase();

      if (lower.includes('breaking change') || lower.startsWith('breaking:')) {
        hasBreaking = true;
        features.push(trimmed);
      } else if (lower.startsWith('feat:') || lower.startsWith('feat(')) {
        hasFeatures = true;
        features.push(trimmed.replace(/^feat(\([^)]+\))?:\s*/i, ''));
      } else if (lower.startsWith('fix:') || lower.startsWith('fix(')) {
        hasFixes = true;
        fixes.push(trimmed.replace(/^fix(\([^)]+\))?:\s*/i, ''));
      } else if (trimmed.length > 0) {
        others.push(trimmed);
      }
    }

    let bumpType: 'major' | 'minor' | 'patch' = 'patch';
    if (hasBreaking) {
      bumpType = 'major';
    } else if (hasFeatures) {
      bumpType = 'minor';
    }

    const proposedVersion = this.bumpVersion(currentVersion, bumpType);

    // Tests status
    const verifiedTests = snapshot.manifests.some((m) => m.scripts?.['test']) && snapshot.stage !== 'idea';
    if (!verifiedTests) {
      warnings.push('Test verification not completed or tests not observed; do not publish without running tests.');
    }

    const dateStr = new Date().toISOString().split('T')[0];
    const changelogLines: string[] = [`## [${proposedVersion}] - ${dateStr}`];

    if (features.length > 0) {
      changelogLines.push('\n### Added');
      features.forEach((f) => changelogLines.push(`- ${f}`));
    }
    if (fixes.length > 0) {
      changelogLines.push('\n### Fixed');
      fixes.forEach((f) => changelogLines.push(`- ${f}`));
    }
    if (others.length > 0 && features.length === 0 && fixes.length === 0) {
      changelogLines.push('\n### Changed');
      others.slice(0, 5).forEach((o) => changelogLines.push(`- ${o}`));
    }

    const changelogEntry = changelogLines.join('\n');
    const releaseNotesDraft = `# Release v${proposedVersion}\n\n${changelogEntry}\n\n> Note: Created as draft. Requires manual verification before public release.`;

    return {
      currentVersion,
      proposedVersion,
      bumpType,
      changelogEntry,
      releaseNotesDraft,
      verifiedTests,
      warnings,
    };
  }

  private static bumpVersion(version: string, type: 'major' | 'minor' | 'patch'): string {
    const parts = version.replace(/^[v^~]/, '').split('.').map((p) => parseInt(p, 10) || 0);
    while (parts.length < 3) parts.push(0);

    let [major, minor, patch] = parts;
    if (type === 'major') {
      major++;
      minor = 0;
      patch = 0;
    } else if (type === 'minor') {
      minor++;
      patch = 0;
    } else {
      patch++;
    }

    return `${major}.${minor}.${patch}`;
  }
}
