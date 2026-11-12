import type { RepositorySnapshot, Evidence, Claim, ClaimStatus } from '../types/schemas.js';

export class EvidenceLedger {
  private readonly evidenceMap = new Map<string, Evidence>();

  constructor(snapshot?: RepositorySnapshot) {
    if (snapshot) {
      this.populateFromSnapshot(snapshot);
    }
  }

  public addEvidence(evidence: Evidence): void {
    this.evidenceMap.set(evidence.id, evidence);
  }

  public getEvidence(id: string): Evidence | undefined {
    return this.evidenceMap.get(id);
  }

  public getAllEvidence(): Evidence[] {
    return Array.from(this.evidenceMap.values());
  }

  public getEvidenceMap(): Record<string, Evidence> {
    const res: Record<string, Evidence> = {};
    for (const [k, v] of this.evidenceMap) {
      res[k] = v;
    }
    return res;
  }

  private populateFromSnapshot(snapshot: RepositorySnapshot): void {
    // 1. Git evidence
    this.addEvidence({
      id: 'git:state',
      kind: 'git',
      pathOrCommand: 'git status',
      observedValue: {
        isGit: snapshot.gitState.isGit,
        branch: snapshot.gitState.branch,
        clean: snapshot.gitState.clean,
        commitSha: snapshot.gitState.commitSha,
        remoteUrl: snapshot.gitState.remoteUrl,
      },
      confidence: 'high',
    });

    // 2. Manifest evidence
    for (const m of snapshot.manifests) {
      this.addEvidence({
        id: `manifest:${m.manifestType}:${m.path}`,
        kind: 'manifest',
        pathOrCommand: m.path,
        observedValue: {
          name: m.name,
          version: m.version,
          description: m.description,
          scriptsCount: Object.keys(m.scripts ?? {}).length,
        },
        confidence: 'high',
      });

      if (m.scripts) {
        for (const [scriptName, scriptCmd] of Object.entries(m.scripts)) {
          this.addEvidence({
            id: `manifest:${m.manifestType}:${m.path}:script:${scriptName}`,
            kind: 'manifest',
            pathOrCommand: `${m.path}#scripts.${scriptName}`,
            observedValue: scriptCmd,
            confidence: 'high',
          });
        }
      }
    }

    // 3. Documentation evidence
    for (const d of snapshot.docs) {
      this.addEvidence({
        id: `doc:${d.kind}:${d.path}`,
        kind: 'file',
        pathOrCommand: d.path,
        observedValue: {
          sizeBytes: d.sizeBytes,
          hasManagedSections: d.hasManagedSections,
        },
        confidence: 'high',
      });
    }

    // 4. License evidence
    if (snapshot.license) {
      this.addEvidence({
        id: `license:${snapshot.license.spdxId ?? 'unrecognized'}`,
        kind: snapshot.license.origin === 'file' ? 'file' : 'manifest',
        pathOrCommand: snapshot.license.path ?? 'manifest',
        observedValue: {
          spdxId: snapshot.license.spdxId,
          isStandard: snapshot.license.isStandard,
        },
        confidence: 'high',
      });
    }

    // 5. Workflows evidence
    for (const w of snapshot.workflows) {
      this.addEvidence({
        id: `workflow:${w.name}`,
        kind: 'file',
        pathOrCommand: w.path,
        observedValue: { name: w.name },
        confidence: 'high',
      });
    }
  }

  public evaluateClaim(claimText: string): Claim {
    const textLower = claimText.toLowerCase();

    // Check script claims
    for (const [id, ev] of this.evidenceMap) {
      if (id.includes(':script:')) {
        const scriptName = id.split(':script:')[1];
        if (textLower.includes(`run ${scriptName}`) || textLower.includes(`test`) && scriptName === 'test') {
          return {
            id: `claim-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            text: claimText,
            evidenceIds: [id],
            status: 'conditional',
            verificationNote: `Script '${scriptName}' declared in manifest but not executed.`,
          };
        }
      }
    }

    // Check install claims
    if (textLower.includes('npm install') || textLower.includes('pip install') || textLower.includes('cargo build')) {
      const manifests = Array.from(this.evidenceMap.keys()).filter((k) => k.startsWith('manifest:'));
      if (manifests.length > 0) {
        return {
          id: `claim-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          text: claimText,
          evidenceIds: manifests,
          status: 'conditional',
          verificationNote: 'Manifest exists for package manager, but installation not tested in sandbox.',
        };
      }
    }

    // Check license claims
    if (textLower.includes('mit') || textLower.includes('apache') || textLower.includes('license')) {
      const licenseEv = Array.from(this.evidenceMap.keys()).find((k) => k.startsWith('license:'));
      if (licenseEv) {
        return {
          id: `claim-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          text: claimText,
          evidenceIds: [licenseEv],
          status: 'verified',
          verificationNote: `License verified via ${licenseEv}`,
        };
      }
    }

    // Contradicted or unknown
    if (textLower.includes('99%') || textLower.includes('100k') || textLower.includes('state of the art')) {
      return {
        id: `claim-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        text: claimText,
        evidenceIds: [],
        status: 'contradicted',
        verificationNote: 'Unsubstantiated superlative or metric without recorded benchmark.',
      };
    }

    return {
      id: `claim-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      text: claimText,
      evidenceIds: [],
      status: 'unknown',
      verificationNote: 'No supporting evidence observed in repository.',
    };
  }
}
