import { describe, it, expect } from 'vitest';
import { GitHubMetadataPlanner } from './metadata-planner.js';
import { LicenseAssistant } from './license-assistant.js';
import { CommunityTemplates } from './community-templates.js';
import { ReleasePlanner } from './release-planner.js';
import { GitHubAdapter } from '../../adapters/github/github-adapter.js';
import type { RepositorySnapshot } from '../types/schemas.js';

function createMockSnapshot(overrides: Partial<RepositorySnapshot> = {}): RepositorySnapshot {
  return {
    schemaVersion: '0.1.0',
    repoRoot: '/mock/repo',
    snapshotFingerprint: 'mock-fp-1234',
    scannedAt: '2026-11-12T00:00:00.000Z',
    kind: 'cli',
    stage: 'mvp',
    primaryLanguage: 'TypeScript',
    frameworks: ['Commander', 'Vitest'],
    manifests: [
      {
        manifestType: 'package.json',
        path: 'package.json',
        name: 'my-cli-tool',
        version: '1.2.3',
        description: 'A lightning-fast CLI utility for developers.',
        scripts: { test: 'vitest run' },
      },
    ],
    docs: [],
    assets: [],
    workflows: [],
    license: {
      spdxId: 'MIT',
      filePath: 'LICENSE',
      origin: 'file',
    },
    gitState: {
      isGit: true,
      branch: 'main',
      clean: true,
      commitSha: 'a1b2c3d4e5f6',
      remoteUrl: 'https://github.com/my-org/my-cli-tool.git',
      trackedFilesCount: 25,
    },
    warnings: [],
    ...overrides,
  };
}

describe('GitHubMetadataPlanner', () => {
  it('generates concise descriptions and evidence-backed topics', () => {
    const snapshot = createMockSnapshot();
    const plan = GitHubMetadataPlanner.plan(snapshot);

    expect(plan.proposedDescription).toBe('A lightning-fast CLI utility for developers');
    expect(plan.proposedTopics).toContain('typescript');
    expect(plan.proposedTopics).toContain('cli');
    expect(plan.proposedTopics).toContain('developer-tools');
    expect(plan.proposedTopics).toContain('commander');
    expect(plan.proposedTopics).toContain('vitest');
    expect(plan.commandPreview).toContain('gh repo edit my-org/my-cli-tool');
    expect(plan.commandPreview).toContain('--description "A lightning-fast CLI utility for developers"');
  });

  it('truncates long descriptions gracefully to under 100 characters', () => {
    const snapshot = createMockSnapshot({
      manifests: [
        {
          manifestType: 'package.json',
          path: 'package.json',
          name: 'long-desc-tool',
          version: '1.0.0',
          description:
            'This is an exceptionally verbose and needlessly detailed description that goes way beyond standard GitHub repository description guidelines.',
        },
      ],
    });

    const plan = GitHubMetadataPlanner.plan(snapshot);
    expect(plan.proposedDescription.length).toBeLessThanOrEqual(100);
    expect(plan.proposedDescription.endsWith('...')).toBe(true);
  });
});

describe('LicenseAssistant', () => {
  it('lists common standard licenses with summaries', () => {
    const options = LicenseAssistant.getOptions();
    expect(options.length).toBeGreaterThanOrEqual(4);
    const spdxIds = options.map((o) => o.spdxId);
    expect(spdxIds).toContain('MIT');
    expect(spdxIds).toContain('Apache-2.0');
    expect(spdxIds).toContain('BSD-3-Clause');
    expect(spdxIds).toContain('GPL-3.0');
  });

  it('generates standard notice text for MIT and Apache-2.0', () => {
    const mitNotice = LicenseAssistant.generateNotice('MIT', 'Acme Corp', 2026);
    expect(mitNotice).toContain('MIT License');
    expect(mitNotice).toContain('Copyright (c) 2026 Acme Corp');

    const apacheNotice = LicenseAssistant.generateNotice('Apache-2.0', 'Acme Corp', 2026);
    expect(apacheNotice).toContain('Licensed under the Apache License, Version 2.0');
    expect(apacheNotice).toContain('Copyright 2026 Acme Corp');
  });
});

describe('CommunityTemplates', () => {
  it('generates valid issue and pull request templates', () => {
    const bugReport = CommunityTemplates.bugReport();
    expect(bugReport).toContain('name: Bug Report');
    expect(bugReport).toContain('Steps to Reproduce');

    const featureRequest = CommunityTemplates.featureRequest();
    expect(featureRequest).toContain('name: Feature Request');
    expect(featureRequest).toContain('Problem Statement');

    const pr = CommunityTemplates.pullRequest();
    expect(pr).toContain('## Summary');
    expect(pr).toContain('## Checklist');

    const contributing = CommunityTemplates.contributing('MySuperProject');
    expect(contributing).toContain('# Contributing to MySuperProject');

    const security = CommunityTemplates.security('MySuperProject', 'sec@example.com');
    expect(security).toContain('sec@example.com');
  });
});

describe('ReleasePlanner', () => {
  it('bumps major version when breaking changes are detected', () => {
    const snapshot = createMockSnapshot();
    const commits = [
      'fix: resolve typo in help text',
      'feat: add interactive prompt',
      'BREAKING CHANGE: change command line signature',
    ];

    const plan = ReleasePlanner.plan(snapshot, commits);
    expect(plan.currentVersion).toBe('1.2.3');
    expect(plan.bumpType).toBe('major');
    expect(plan.proposedVersion).toBe('2.0.0');
    expect(plan.changelogEntry).toContain('### Added');
    expect(plan.changelogEntry).toContain('### Fixed');
    expect(plan.verifiedTests).toBe(true);
    expect(plan.warnings).toHaveLength(0);
  });

  it('bumps minor version when features are detected without breaking changes', () => {
    const snapshot = createMockSnapshot();
    const commits = ['feat: support custom themes', 'fix: edge case handling'];

    const plan = ReleasePlanner.plan(snapshot, commits);
    expect(plan.bumpType).toBe('minor');
    expect(plan.proposedVersion).toBe('1.3.0');
  });

  it('bumps patch version when only fixes or small changes are detected', () => {
    const snapshot = createMockSnapshot();
    const commits = ['fix: correct exit code on error'];

    const plan = ReleasePlanner.plan(snapshot, commits);
    expect(plan.bumpType).toBe('patch');
    expect(plan.proposedVersion).toBe('1.2.4');
  });

  it('flags warning when test script is not found', () => {
    const snapshot = createMockSnapshot({
      manifests: [
        {
          manifestType: 'package.json',
          path: 'package.json',
          name: 'untested',
          version: '0.1.0',
        },
      ],
    });

    const plan = ReleasePlanner.plan(snapshot, ['fix: patch something']);
    expect(plan.verifiedTests).toBe(false);
    expect(plan.warnings.length).toBeGreaterThan(0);
  });
});

describe('GitHubAdapter', () => {
  it('rejects remote update without explicit --approved-remote', async () => {
    const adapter = new GitHubAdapter('/mock/repo');
    const snapshot = createMockSnapshot();
    const plan = GitHubMetadataPlanner.plan(snapshot);

    await expect(adapter.updateMetadata(plan, { approvedRemote: false })).rejects.toThrow(
      /Remote authorization required/
    );
  });

  it('supports dry-run mode without invoking remote gh CLI', async () => {
    const adapter = new GitHubAdapter('/mock/repo');
    const snapshot = createMockSnapshot();
    const plan = GitHubMetadataPlanner.plan(snapshot);

    const result = await adapter.updateMetadata(plan, { approvedRemote: true, dryRun: true });
    expect(result.success).toBe(true);
    expect(result.dryRun).toBe(true);
    expect(result.executedCommand).toContain('gh repo edit');
  });
});
