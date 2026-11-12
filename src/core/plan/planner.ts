import * as crypto from 'node:crypto';
import type { RepositorySnapshot, Plan, Action, Preset } from '../types/schemas.js';
import { SafeFileSystem } from '../../adapters/filesystem/safe-fs.js';
import { ContentAuthor } from '../content/author.js';
import { ManagedSections } from '../content/managed-sections.js';
import { UnifiedDiff } from '../diff/unified-diff.js';

export interface PlanOptions {
  preset?: Preset;
  userIntent?: string;
}

export class Planner {
  private readonly snapshot: RepositorySnapshot;
  private readonly fs: SafeFileSystem;
  private readonly preset: Preset;
  private readonly userIntent?: string;

  constructor(snapshot: RepositorySnapshot, options: PlanOptions = {}) {
    this.snapshot = snapshot;
    this.fs = new SafeFileSystem(snapshot.repoRoot);
    this.preset = options.preset ?? 'minimal';
    this.userIntent = options.userIntent;
  }

  public async createPlan(): Promise<Plan> {
    const author = new ContentAuthor(this.snapshot, {
      preset: this.preset,
      userIntent: this.userIntent,
      useManagedMarkers: true,
    });

    const targetFile = 'README.md';
    let currentContent = '';
    let exists = false;

    try {
      exists = await this.fs.fileExists(targetFile);
      if (exists) {
        currentContent = await this.fs.readFile(targetFile);
      }
    } catch {
      exists = false;
      currentContent = '';
    }

    let proposedContent = '';
    let risk: 'low' | 'medium' | 'high' = 'low';
    let description = '';

    if (!exists) {
      // Create new README
      proposedContent = author.generateReadme();
      risk = 'low';
      description = `Create initial ${this.preset} README.md from observed repository evidence.`;
    } else if (ManagedSections.hasManagedSections(currentContent)) {
      // Preserve existing manual content, update only managed sections
      try {
        const sectionMap = author.generateSectionMap();
        proposedContent = ManagedSections.updateAllSections(currentContent, sectionMap);
        risk = 'low';
        description = `Update managed sections in README.md; non-managed human text preserved.`;
      } catch (err: any) {
        // If markers are corrupted, fail safely to proposing full template
        proposedContent = author.generateReadme();
        risk = 'medium';
        description = `Existing README markers corrupted (${err.message}); propose clean managed template.`;
      }
    } else {
      // Existing README without markers: propose structured template as diff, preserving user control
      proposedContent = author.generateReadme();
      risk = 'medium';
      description = `Existing README.md does not contain Pomade markers. Proposing structured update.`;
    }

    const beforeHash = exists ? UnifiedDiff.hash(currentContent) : '';
    const afterHash = UnifiedDiff.hash(proposedContent);
    const diff = UnifiedDiff.create(targetFile, currentContent, proposedContent);

    const actions: Action[] = [];
    if (diff.length > 0) {
      actions.push({
        id: 'act-readme-update',
        kind: 'write-local',
        target: targetFile,
        description,
        beforeHash,
        afterHash,
        proposedContent,
        proposedDiff: diff,
        evidenceIds: this.snapshot.manifests.map((m) => `manifest:${m.manifestType}:${m.path}`),
        permission: 'local-write',
        risk,
      });
    }

    const planHash = crypto
      .createHash('sha256')
      .update(this.snapshot.snapshotFingerprint + this.preset + actions.length + beforeHash)
      .digest('hex')
      .substring(0, 10);

    const summary =
      actions.length === 0
        ? 'No documentation changes needed — repository is up to date.'
        : `Proposed ${actions.length} action(s) for ${this.preset} presentation update.`;

    return {
      schemaVersion: '0.1.0',
      planId: `plan-${planHash}`,
      repoRoot: this.snapshot.repoRoot,
      baseSnapshotFingerprint: this.snapshot.snapshotFingerprint,
      createdAt: new Date().toISOString(),
      preset: this.preset,
      actions,
      warnings: this.snapshot.warnings,
      summary,
    };
  }
}
