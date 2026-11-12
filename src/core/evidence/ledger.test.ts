import { describe, it, expect } from 'vitest';
import * as path from 'node:path';
import { RepositoryScanner } from '../scan/scanner.js';
import { EvidenceLedger } from './ledger.js';

describe('EvidenceLedger', () => {
  const fixturesDir = path.resolve(process.cwd(), 'fixtures');

  it('populates evidence map from repository snapshot', async () => {
    const scanner = new RepositoryScanner(path.join(fixturesDir, 'node-cli'));
    const snapshot = await scanner.scan();
    const ledger = new EvidenceLedger(snapshot);

    const evidenceList = ledger.getAllEvidence();
    expect(evidenceList.length).toBeGreaterThan(0);

    const scriptEvidence = ledger.getEvidence('manifest:npm:package.json:script:test');
    expect(scriptEvidence).toBeDefined();
    expect(scriptEvidence?.observedValue).toBe('vitest run');

    const licenseEvidence = ledger.getEvidence('license:MIT');
    expect(licenseEvidence).toBeDefined();
  });

  it('evaluates claims against evidence ledger', async () => {
    const scanner = new RepositoryScanner(path.join(fixturesDir, 'node-cli'));
    const snapshot = await scanner.scan();
    const ledger = new EvidenceLedger(snapshot);

    // 1. Script claim -> conditional
    const claim1 = ledger.evaluateClaim('Run test with vitest');
    expect(claim1.status).toBe('conditional');

    // 2. License claim -> verified
    const claim2 = ledger.evaluateClaim('Released under the MIT license');
    expect(claim2.status).toBe('verified');

    // 3. Superlative claim -> contradicted
    const claim3 = ledger.evaluateClaim('99% faster than any alternative');
    expect(claim3.status).toBe('contradicted');

    // 4. Unsupported claim -> unknown
    const claim4 = ledger.evaluateClaim('Integrates with quantum cloud compute');
    expect(claim4.status).toBe('unknown');
  });
});
