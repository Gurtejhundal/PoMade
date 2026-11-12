import type { RepositorySnapshot } from '../types/schemas.js';
import { SafeFileSystem } from '../../adapters/filesystem/safe-fs.js';
import { ManagedSections } from '../content/managed-sections.js';

export interface DriftItem {
  id: string;
  category: 'scripts' | 'frameworks' | 'version' | 'missing-docs' | 'stale-claim';
  severity: 'info' | 'suggested' | 'required';
  affectedSection: string;
  description: string;
}

export interface DriftReport {
  schemaVersion: '0.1.0';
  timestamp: string;
  repoRoot: string;
  hasDrift: boolean;
  findings: DriftItem[];
  recommendedAction: string;
}

export class DriftDetector {
  private readonly snapshot: RepositorySnapshot;
  private readonly fs: SafeFileSystem;

  constructor(snapshot: RepositorySnapshot) {
    this.snapshot = snapshot;
    this.fs = new SafeFileSystem(snapshot.repoRoot);
  }

  public async detectDrift(): Promise<DriftReport> {
    const findings: DriftItem[] = [];
    const readmeFile = 'README.md';
    const hasReadme = await this.fs.fileExists(readmeFile);

    if (!hasReadme) {
      findings.push({
        id: 'drift-missing-readme',
        category: 'missing-docs',
        severity: 'required',
        affectedSection: 'all',
        description: 'README.md is missing from the repository.',
      });

      return {
        schemaVersion: '0.1.0',
        timestamp: new Date().toISOString(),
        repoRoot: this.snapshot.repoRoot,
        hasDrift: true,
        findings,
        recommendedAction: "Run 'pomade plan' and 'pomade apply --approved' to generate an initial README.",
      };
    }

    const readmeContent = await this.fs.readFile(readmeFile);
    const primaryManifest = this.snapshot.manifests[0];

    // 1. Check version drift
    if (primaryManifest?.version) {
      const manifestVer = primaryManifest.version;
      if (!readmeContent.includes(manifestVer)) {
        findings.push({
          id: 'drift-version-mismatch',
          category: 'version',
          severity: 'suggested',
          affectedSection: 'header',
          description: `Manifest version is v${manifestVer}, but README does not reflect this version.`,
        });
      }
    }

    // 2. Check manifest script drift
    if (primaryManifest?.scripts) {
      const scripts = primaryManifest.scripts;
      for (const [scriptName, scriptCmd] of Object.entries(scripts)) {
        // High-importance scripts: dev, start, build, test
        if (['dev', 'start', 'build', 'test'].includes(scriptName)) {
          const expectedMention = `npm run ${scriptName}`;
          const altMention = `npm ${scriptName}`;
          if (!readmeContent.includes(expectedMention) && !readmeContent.includes(altMention)) {
            findings.push({
              id: `drift-script-${scriptName}`,
              category: 'scripts',
              severity: 'suggested',
              affectedSection: 'quickstart',
              description: `Script '${scriptName}' (${scriptCmd}) exists in manifest but is not documented in README quickstart.`,
            });
          }
        }
      }
    }

    // 3. Check framework drift
    for (const fw of this.snapshot.frameworks) {
      if (!readmeContent.toLowerCase().includes(fw.toLowerCase())) {
        findings.push({
          id: `drift-framework-${fw.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          category: 'frameworks',
          severity: 'info',
          affectedSection: 'features',
          description: `Framework '${fw}' is installed in project dependencies but not mentioned in README features.`,
        });
      }
    }

    // 4. Check managed section hygiene
    if (ManagedSections.hasManagedSections(readmeContent)) {
      try {
        ManagedSections.parse(readmeContent);
      } catch (err: any) {
        findings.push({
          id: 'drift-corrupted-markers',
          category: 'stale-claim',
          severity: 'required',
          affectedSection: 'all',
          description: `Pomade managed section markers are malformed: ${err.message}`,
        });
      }
    }

    const hasDrift = findings.length > 0;
    const recommendedAction = hasDrift
      ? "Run 'pomade plan' to preview synchronized documentation diffs, then apply with user approval."
      : 'Documentation is synchronized with observed codebase reality.';

    return {
      schemaVersion: '0.1.0',
      timestamp: new Date().toISOString(),
      repoRoot: this.snapshot.repoRoot,
      hasDrift,
      findings,
      recommendedAction,
    };
  }
}
