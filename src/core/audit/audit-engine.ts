import type {
  RepositorySnapshot,
  AuditReport,
  Finding,
  AuditCategory,
  FindingStatus,
  FindingSeverity,
} from '../types/schemas.js';
import { EvidenceLedger } from '../evidence/ledger.js';

export interface AuditRule {
  id: string;
  category: AuditCategory;
  severity: FindingSeverity;
  evaluate: (snapshot: RepositorySnapshot, ledger: EvidenceLedger) => Finding;
}

export class AuditEngine {
  private readonly rules: AuditRule[] = [];

  constructor() {
    this.registerRules();
  }

  private registerRules(): void {
    // 1. CLARITY RULES
    this.rules.push({
      id: 'clarity.project-name',
      category: 'clarity',
      severity: 'P1',
      evaluate: (snapshot) => {
        const manifestName = snapshot.manifests[0]?.name;
        const readme = snapshot.docs.find((d) => d.kind === 'readme');
        if (manifestName || readme) {
          return {
            id: 'find-clarity-name',
            ruleId: 'clarity.project-name',
            category: 'clarity',
            status: 'pass',
            severity: 'P1',
            title: 'Project Name Identifiable',
            reason: `Identified project name from ${manifestName ? 'manifest' : 'README'}.`,
            evidenceIds: manifestName ? [`manifest:${snapshot.manifests[0].manifestType}:${snapshot.manifests[0].path}`] : ['doc:readme'],
          };
        }
        return {
          id: 'find-clarity-name',
          ruleId: 'clarity.project-name',
          category: 'clarity',
          status: 'fail',
          severity: 'P1',
          title: 'Missing Project Name',
          reason: 'No package manifest or README found to declare project name.',
          evidenceIds: [],
          suggestedAction: 'Add a project name in manifest or README H1.',
        };
      },
    });

    this.rules.push({
      id: 'clarity.one-liner',
      category: 'clarity',
      severity: 'P2',
      evaluate: (snapshot) => {
        const desc = snapshot.manifests[0]?.description;
        if (desc && desc.trim().length > 10) {
          return {
            id: 'find-clarity-oneliner',
            ruleId: 'clarity.one-liner',
            category: 'clarity',
            status: 'pass',
            severity: 'P2',
            title: 'Clear One-Line Description',
            reason: `Found concise description: "${desc.substring(0, 60)}..."`,
            evidenceIds: [`manifest:${snapshot.manifests[0].manifestType}:${snapshot.manifests[0].path}`],
          };
        }
        return {
          id: 'find-clarity-oneliner',
          ruleId: 'clarity.one-liner',
          category: 'clarity',
          status: snapshot.stage === 'idea' ? 'warn' : 'fail',
          severity: 'P2',
          title: 'Missing One-Line Description',
          reason: 'No clear one-sentence summary explaining what the project does.',
          evidenceIds: [],
          suggestedAction: 'Add a concise tagline stating the concrete outcome the project delivers.',
        };
      },
    });

    // 2. FIRST-RUN RULES
    this.rules.push({
      id: 'first-run.readme-present',
      category: 'first-run',
      severity: 'P0',
      evaluate: (snapshot) => {
        const readme = snapshot.docs.find((d) => d.kind === 'readme');
        if (readme) {
          return {
            id: 'find-firstrun-readme',
            ruleId: 'first-run.readme-present',
            category: 'first-run',
            status: 'pass',
            severity: 'P0',
            title: 'README File Present',
            reason: `README exists at '${readme.path}' (${readme.sizeBytes} bytes).`,
            evidenceIds: [`doc:readme:${readme.path}`],
          };
        }
        return {
          id: 'find-firstrun-readme',
          ruleId: 'first-run.readme-present',
          category: 'first-run',
          status: 'fail',
          severity: 'P0',
          title: 'README Missing',
          reason: 'No README found. First-time visitors have no guidance on how to use the repository.',
          evidenceIds: [],
          suggestedAction: 'Generate a minimal, evidence-backed README.md.',
        };
      },
    });

    this.rules.push({
      id: 'first-run.quickstart-scripts',
      category: 'first-run',
      severity: 'P1',
      evaluate: (snapshot) => {
        const scripts = snapshot.manifests[0]?.scripts ?? {};
        const hasScripts = Object.keys(scripts).length > 0;
        if (snapshot.stage === 'idea') {
          return {
            id: 'find-firstrun-scripts',
            ruleId: 'first-run.quickstart-scripts',
            category: 'first-run',
            status: 'not-applicable',
            severity: 'P1',
            title: 'Verifiable Scripts (Stage: Idea)',
            reason: 'Idea-stage projects do not require working executable scripts.',
            evidenceIds: [],
          };
        }
        if (hasScripts) {
          return {
            id: 'find-firstrun-scripts',
            ruleId: 'first-run.quickstart-scripts',
            category: 'first-run',
            status: 'pass',
            severity: 'P1',
            title: 'Executable Manifest Scripts Found',
            reason: `Found ${Object.keys(scripts).length} manifest scripts (${Object.keys(scripts).slice(0, 3).join(', ')}).`,
            evidenceIds: Object.keys(scripts).slice(0, 3).map((s) => `manifest:${snapshot.manifests[0].manifestType}:${snapshot.manifests[0].path}:script:${s}`),
          };
        }
        return {
          id: 'find-firstrun-scripts',
          ruleId: 'first-run.quickstart-scripts',
          category: 'first-run',
          status: 'warn',
          severity: 'P1',
          title: 'No Manifest Scripts Configured',
          reason: 'No build, test, or run scripts declared in primary manifest.',
          evidenceIds: [],
          suggestedAction: 'Define standard build/test/start scripts in the manifest.',
        };
      },
    });

    // 3. TRUST RULES
    this.rules.push({
      id: 'trust.license',
      category: 'trust',
      severity: 'P0',
      evaluate: (snapshot) => {
        if (snapshot.license?.isStandard) {
          return {
            id: 'find-trust-license',
            ruleId: 'trust.license',
            category: 'trust',
            status: 'pass',
            severity: 'P0',
            title: 'Standard Open Source License Detected',
            reason: `Detected ${snapshot.license.spdxId} license via ${snapshot.license.origin}.`,
            evidenceIds: [snapshot.license.origin === 'file' ? `doc:license:${snapshot.license.path}` : 'manifest'],
          };
        }
        return {
          id: 'find-trust-license',
          ruleId: 'trust.license',
          category: 'trust',
          status: 'blocked',
          severity: 'P0',
          title: 'License Not Chosen by Owner',
          reason: 'No standard open-source license found. Pomade refuses to auto-select a legal license.',
          evidenceIds: [],
          suggestedAction: 'Owner should explicitly select and add a LICENSE file (e.g., MIT, Apache-2.0).',
        };
      },
    });

    this.rules.push({
      id: 'trust.clean-working-tree',
      category: 'trust',
      severity: 'P2',
      evaluate: (snapshot) => {
        if (!snapshot.gitState.isGit) {
          return {
            id: 'find-trust-git',
            ruleId: 'trust.clean-working-tree',
            category: 'trust',
            status: 'warn',
            severity: 'P2',
            title: 'Not a Git Repository',
            reason: 'Directory is not a Git repository. Version tracking and rollback are unavailable.',
            evidenceIds: ['git:state'],
            suggestedAction: 'Initialize Git with `git init`.',
          };
        }
        if (snapshot.gitState.clean) {
          return {
            id: 'find-trust-git',
            ruleId: 'trust.clean-working-tree',
            category: 'trust',
            status: 'pass',
            severity: 'P2',
            title: 'Clean Git Working Tree',
            reason: 'Working directory is clean with no uncommitted modifications.',
            evidenceIds: ['git:state'],
          };
        }
        return {
          id: 'find-trust-git',
          ruleId: 'trust.clean-working-tree',
          category: 'trust',
          status: 'warn',
          severity: 'P2',
          title: 'Uncommitted Changes Present',
          reason: 'Git working tree has unstaged or untracked changes.',
          evidenceIds: ['git:state'],
          suggestedAction: 'Commit or stash changes before applying automated documentation edits.',
        };
      },
    });

    // 4. DISCOVERABILITY RULES
    this.rules.push({
      id: 'discoverability.git-remote',
      category: 'discoverability',
      severity: 'P2',
      evaluate: (snapshot) => {
        if (snapshot.gitState.remoteUrl) {
          return {
            id: 'find-discoverability-remote',
            ruleId: 'discoverability.git-remote',
            category: 'discoverability',
            status: 'pass',
            severity: 'P2',
            title: 'GitHub / Git Remote Configured',
            reason: `Remote origin is configured to '${snapshot.gitState.remoteUrl}'.`,
            evidenceIds: ['git:state'],
          };
        }
        return {
          id: 'find-discoverability-remote',
          ruleId: 'discoverability.git-remote',
          category: 'discoverability',
          status: 'warn',
          severity: 'P2',
          title: 'No Remote Origin Set',
          reason: 'No remote URL found; project cannot synchronize GitHub metadata or releases.',
          evidenceIds: ['git:state'],
          suggestedAction: 'Add a GitHub remote origin when ready to publish.',
        };
      },
    });

    // 5. PRESENTATION RULES
    this.rules.push({
      id: 'presentation.media-assets',
      category: 'presentation',
      severity: 'P2',
      evaluate: (snapshot) => {
        if (snapshot.kind === 'cli' || snapshot.kind === 'library') {
          return {
            id: 'find-presentation-media',
            ruleId: 'presentation.media-assets',
            category: 'presentation',
            status: 'not-applicable',
            severity: 'P2',
            title: 'UI Visuals (Not Applicable)',
            reason: `Project is a ${snapshot.kind.toUpperCase()}; graphical screenshots are not required.`,
            evidenceIds: [],
          };
        }
        if (snapshot.assets.length > 0) {
          return {
            id: 'find-presentation-media',
            ruleId: 'presentation.media-assets',
            category: 'presentation',
            status: 'pass',
            severity: 'P2',
            title: 'Visual Assets Found',
            reason: `Found ${snapshot.assets.length} image/media asset(s).`,
            evidenceIds: snapshot.assets.slice(0, 3).map((a) => `file:${a.path}`),
          };
        }
        return {
          id: 'find-presentation-media',
          ruleId: 'presentation.media-assets',
          category: 'presentation',
          status: snapshot.stage === 'idea' || snapshot.stage === 'prototype' ? 'warn' : 'fail',
          severity: 'P2',
          title: 'Missing Screenshots or UI Media',
          reason: `Project kind is '${snapshot.kind}' but contains no real screenshots or visual diagrams.`,
          evidenceIds: [],
          suggestedAction: 'Capture a truthful screenshot of the working UI after local execution is approved.',
        };
      },
    });

    // 6. MAINTAINABILITY RULES
    this.rules.push({
      id: 'maintainability.contributing',
      category: 'maintainability',
      severity: 'P3',
      evaluate: (snapshot) => {
        const hasContributing = snapshot.docs.some((d) => d.kind === 'contributing');
        if (snapshot.stage === 'idea' || snapshot.stage === 'prototype') {
          return {
            id: 'find-maintain-contributing',
            ruleId: 'maintainability.contributing',
            category: 'maintainability',
            status: 'not-applicable',
            severity: 'P3',
            title: 'Contribution Policy (Stage: Early)',
            reason: 'Early-stage projects do not require contributing guidelines.',
            evidenceIds: [],
          };
        }
        if (hasContributing) {
          return {
            id: 'find-maintain-contributing',
            ruleId: 'maintainability.contributing',
            category: 'maintainability',
            status: 'pass',
            severity: 'P3',
            title: 'Contributing Guide Present',
            reason: 'CONTRIBUTING.md provides clear developer contribution expectations.',
            evidenceIds: ['doc:contributing'],
          };
        }
        return {
          id: 'find-maintain-contributing',
          ruleId: 'maintainability.contributing',
          category: 'maintainability',
          status: 'warn',
          severity: 'P3',
          title: 'Missing CONTRIBUTING.md',
          reason: 'Public or usable projects benefit from clear contribution workflows.',
          evidenceIds: [],
          suggestedAction: 'Add a concise CONTRIBUTING.md outlining setup and pull request expectations.',
        };
      },
    });

    this.rules.push({
      id: 'maintainability.ci-workflows',
      category: 'maintainability',
      severity: 'P2',
      evaluate: (snapshot) => {
        if (snapshot.stage === 'idea') {
          return {
            id: 'find-maintain-ci',
            ruleId: 'maintainability.ci-workflows',
            category: 'maintainability',
            status: 'not-applicable',
            severity: 'P2',
            title: 'CI Workflows (Stage: Idea)',
            reason: 'Idea-stage projects do not require automated CI workflows.',
            evidenceIds: [],
          };
        }
        if (snapshot.workflows.length > 0) {
          return {
            id: 'find-maintain-ci',
            ruleId: 'maintainability.ci-workflows',
            category: 'maintainability',
            status: 'pass',
            severity: 'P2',
            title: 'Automated Workflows Detected',
            reason: `Found ${snapshot.workflows.length} GitHub Action workflow(s) (${snapshot.workflows.map((w) => w.name).join(', ')}).`,
            evidenceIds: snapshot.workflows.map((w) => `workflow:${w.name}`),
          };
        }
        return {
          id: 'find-maintain-ci',
          ruleId: 'maintainability.ci-workflows',
          category: 'maintainability',
          status: 'warn',
          severity: 'P2',
          title: 'No Automated CI Workflows',
          reason: 'No continuous integration workflows found in .github/workflows.',
          evidenceIds: [],
          suggestedAction: 'Add a GitHub Actions workflow to run typechecks and tests on pull requests.',
        };
      },
    });
  }

  public audit(snapshot: RepositorySnapshot): AuditReport {
    const ledger = new EvidenceLedger(snapshot);
    const findings: Finding[] = [];

    const categories: AuditCategory[] = [
      'clarity',
      'first-run',
      'trust',
      'discoverability',
      'presentation',
      'maintainability',
    ];

    const categorySummary: Record<
      AuditCategory,
      { score: number; pass: number; warn: number; fail: number; na: number; blocked: number }
    > = {
      clarity: { score: 100, pass: 0, warn: 0, fail: 0, na: 0, blocked: 0 },
      'first-run': { score: 100, pass: 0, warn: 0, fail: 0, na: 0, blocked: 0 },
      trust: { score: 100, pass: 0, warn: 0, fail: 0, na: 0, blocked: 0 },
      discoverability: { score: 100, pass: 0, warn: 0, fail: 0, na: 0, blocked: 0 },
      presentation: { score: 100, pass: 0, warn: 0, fail: 0, na: 0, blocked: 0 },
      maintainability: { score: 100, pass: 0, warn: 0, fail: 0, na: 0, blocked: 0 },
    };

    for (const rule of this.rules) {
      const finding = rule.evaluate(snapshot, ledger);
      findings.push(finding);

      const cat = categorySummary[finding.category];
      if (finding.status === 'pass') cat.pass++;
      else if (finding.status === 'warn') cat.warn++;
      else if (finding.status === 'fail') cat.fail++;
      else if (finding.status === 'blocked') cat.blocked++;
      else if (finding.status === 'not-applicable') cat.na++;
    }

    // Compute category scores (0 - 100)
    let totalScoreSum = 0;
    for (const cat of categories) {
      const summary = categorySummary[cat];
      const evaluatedRules = summary.pass + summary.warn + summary.fail + summary.blocked;
      if (evaluatedRules === 0) {
        summary.score = 100;
      } else {
        const points = summary.pass * 1.0 + summary.warn * 0.5;
        summary.score = Math.round((points / evaluatedRules) * 100);
      }
      totalScoreSum += summary.score;
    }

    const overallScore = Math.round(totalScoreSum / categories.length);

    // Extract top actionable items
    const topActions = findings
      .filter((f) => f.status === 'fail' || f.status === 'blocked' || f.status === 'warn')
      .sort((a, b) => {
        const sevOrder = { P0: 0, P1: 1, P2: 2, P3: 3 };
        return sevOrder[a.severity] - sevOrder[b.severity];
      })
      .map((f) => f.suggestedAction)
      .filter((a): a is string => Boolean(a))
      .slice(0, 5);

    return {
      schemaVersion: '0.1.0',
      timestamp: new Date().toISOString(),
      repoRoot: snapshot.repoRoot,
      kind: snapshot.kind,
      stage: snapshot.stage,
      findings,
      categoryScores: categorySummary,
      overallScore,
      topActions,
      evidenceMap: ledger.getEvidenceMap(),
    };
  }
}
