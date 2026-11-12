import { describe, it, expect } from 'vitest';
import * as path from 'node:path';
import { RepositoryScanner } from '../scan/scanner.js';
import { AuditEngine } from './audit-engine.js';

describe('AuditEngine', () => {
  const fixturesDir = path.resolve(process.cwd(), 'fixtures');
  const engine = new AuditEngine();

  it('audits Node CLI fixture and passes relevant criteria while marking UI media as N/A', async () => {
    const scanner = new RepositoryScanner(path.join(fixturesDir, 'node-cli'));
    const snapshot = await scanner.scan();
    const report = engine.audit(snapshot);

    expect(report.schemaVersion).toBe('0.1.0');
    expect(report.overallScore).toBeGreaterThan(60);

    const mediaFinding = report.findings.find((f) => f.ruleId === 'presentation.media-assets');
    expect(mediaFinding).toBeDefined();
    // For CLI projects, UI media is N/A, not a failure
    expect(mediaFinding?.status).toBe('not-applicable');

    const licenseFinding = report.findings.find((f) => f.ruleId === 'trust.license');
    expect(licenseFinding?.status).toBe('pass');
  });

  it('audits empty repo fixture and applies early-stage leniency', async () => {
    const scanner = new RepositoryScanner(path.join(fixturesDir, 'empty-repo'));
    const snapshot = await scanner.scan();
    const report = engine.audit(snapshot);

    // Empty repo has no license chosen -> blocked
    const licenseFinding = report.findings.find((f) => f.ruleId === 'trust.license');
    expect(licenseFinding?.status).toBe('blocked');

    // Empty repo does not fail for missing CI workflows
    const ciFinding = report.findings.find((f) => f.ruleId === 'maintainability.ci-workflows');
    expect(ciFinding?.status).toBe('not-applicable');
  });

  it('audits web app fixture and checks for assets and workflows', async () => {
    const scanner = new RepositoryScanner(path.join(fixturesDir, 'web-app'));
    const snapshot = await scanner.scan();
    const report = engine.audit(snapshot);

    const mediaFinding = report.findings.find((f) => f.ruleId === 'presentation.media-assets');
    expect(mediaFinding?.status).toBe('pass');

    const ciFinding = report.findings.find((f) => f.ruleId === 'maintainability.ci-workflows');
    expect(ciFinding?.status).toBe('pass');
  });
});
