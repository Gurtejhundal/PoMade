import * as crypto from 'node:crypto';
import { PresetSchema } from '../types/schemas.js';
import { readPresentationConfig } from '../content/config.js';
import { renderBanner } from '../content/templates.js';
import type {
  RepositorySnapshot,
  Plan,
  Action,
  Preset,
} from '../types/schemas.js';
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
  private readonly preset?: Preset;
  private readonly userIntent?: string;

  constructor(snapshot: RepositorySnapshot, options: PlanOptions = {}) {
    this.snapshot = snapshot;
    this.fs = new SafeFileSystem(snapshot.repoRoot);
    this.preset = options.preset
      ? PresetSchema.parse(options.preset)
      : undefined;
    this.userIntent = options.userIntent;
  }

  public async createPlan(): Promise<Plan> {
    const config = await readPresentationConfig(this.fs);
    const preset = this.preset ?? config?.preset ?? 'minimal';
    const author = new ContentAuthor(this.snapshot, {
      preset,
      facts: config
        ? {
            ...(config.name ? { name: config.name } : {}),
            ...(config.description ? { description: config.description } : {}),
            ...(config.installCommand !== undefined
              ? { installCommand: config.installCommand }
              : {}),
            ...(config.runCommand !== undefined
              ? { runCommand: config.runCommand }
              : {}),
            ...(config.testCommand !== undefined
              ? { testCommand: config.testCommand }
              : {}),
            tagline: config.tagline,
            features:
              config.features ??
              this.snapshot.frameworks.map((title) => ({
                title,
                description: 'Declared in project dependencies.',
              })),
            homepageUrl: config.homepage,
            screenshotUrl: config.screenshot,
            demoGifUrl: config.demo,
            demoPosterUrl: config.demoPoster,
            logoUrl: config.logo,
            ...(preset === 'animated'
              ? {
                  bannerUrl: 'docs/media/pomade-motion.svg',
                  staticBannerUrl: 'docs/media/pomade-static.svg',
                }
              : {}),
          }
        : preset === 'animated'
          ? {
              bannerUrl: 'docs/media/pomade-motion.svg',
              staticBannerUrl: 'docs/media/pomade-static.svg',
            }
          : undefined,
      userIntent: this.userIntent,
      useManagedMarkers: true,
    });

    const targetFile = 'README.md';
    let currentContent = '';
    let exists = false;

    exists = await this.fs.fileExists(targetFile);
    if (exists) currentContent = await this.fs.readFile(targetFile);

    let proposedContent = '';
    let risk: 'low' | 'medium' | 'high' = 'low';
    let description = '';

    if (!exists) {
      // Create new README
      proposedContent = author.generateReadme();
      risk = 'low';
      description = `Create initial ${preset} README.md from observed repository evidence.`;
    } else if (ManagedSections.hasManagedSections(currentContent)) {
      // Preserve existing manual content, update only managed sections
      const sectionMap = author.generateSectionMap();
      const parsed = [...ManagedSections.parse(currentContent).values()];
      const outside = parsed
        .sort((a, b) => b.startMarkerIndex - a.startMarkerIndex)
        .reduce(
          (text, section) =>
            text.slice(0, section.startMarkerIndex) +
            text.slice(section.endMarkerIndex),
          currentContent
        );
      const knownSections = new Set([
        ...Object.keys(sectionMap),
        'preview',
        'architecture',
        'development',
        'status',
        'maintenance',
      ]);
      proposedContent =
        !outside.trim() &&
        parsed.every((section) => knownSections.has(section.id))
          ? author.generateReadme()
          : ManagedSections.updateAllSections(currentContent, sectionMap);
      description =
        'Update managed README sections; preserve all text outside markers.';
    } else {
      // Existing README without markers: propose structured template as diff, preserving user control
      proposedContent = author.generateReadme();
      risk = 'medium';
      description = `Existing README.md does not contain Pomade markers. Proposing structured update.`;
    }

    const beforeHash = exists ? UnifiedDiff.hash(currentContent) : '';
    const afterHash = UnifiedDiff.hash(proposedContent);
    const diff = UnifiedDiff.create(
      targetFile,
      currentContent,
      proposedContent
    );

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
        evidenceIds: this.snapshot.manifests.map(
          (m) => `manifest:${m.manifestType}:${m.path}`
        ),
        permission: 'local-write',
        risk,
      });
    }

    if (preset === 'animated') {
      for (const [target, animated] of [
        ['docs/media/pomade-motion.svg', true],
        ['docs/media/pomade-static.svg', false],
      ] as const) {
        const before = (await this.fs.fileExists(target))
          ? await this.fs.readFile(target)
          : '';
        const proposedContent = renderBanner(author.facts, animated);
        if (before === proposedContent) continue;
        actions.push({
          id: `act-${animated ? 'motion' : 'static'}`,
          kind: 'write-local',
          target,
          description: 'Generate a repository cover from project identity.',
          beforeHash: before ? UnifiedDiff.hash(before) : '',
          afterHash: UnifiedDiff.hash(proposedContent),
          proposedContent,
          proposedDiff: UnifiedDiff.create(target, before, proposedContent),
          evidenceIds: [],
          permission: 'local-write',
          risk: 'low',
        });
      }
    }

    const planHash = crypto
      .createHash('sha256')
      .update(
        this.snapshot.snapshotFingerprint +
          preset +
          actions.map((a) => a.afterHash).join() +
          beforeHash
      )
      .digest('hex')
      .substring(0, 10);

    const summary =
      actions.length === 0
        ? 'No documentation changes needed — repository is up to date.'
        : `Proposed ${actions.length} action(s) for ${preset} presentation update.`;

    return {
      schemaVersion: '0.1.0',
      planId: `plan-${planHash}`,
      repoRoot: this.snapshot.repoRoot,
      baseSnapshotFingerprint: this.snapshot.snapshotFingerprint,
      createdAt: new Date().toISOString(),
      preset,
      actions,
      warnings: this.snapshot.warnings,
      summary,
    };
  }
}
