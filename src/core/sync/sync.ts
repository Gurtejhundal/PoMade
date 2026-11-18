import { RepositoryScanner } from '../scan/scanner.js';
import { Planner } from '../plan/planner.js';
import { PlanApplier } from '../apply/applier.js';
import { SafeFileSystem } from '../../adapters/filesystem/safe-fs.js';
import { ManagedSections } from '../content/managed-sections.js';
import { GitHubMetadataPlanner } from '../github/metadata-planner.js';
import { GitHubAdapter } from '../../adapters/github/github-adapter.js';
import { readPresentationConfig } from '../content/config.js';
import type { Preset } from '../types/schemas.js';

export async function syncPresentation(
  root: string,
  options: {
    approved: boolean;
    dryRun?: boolean;
    approvedRemote?: boolean;
    preset?: Preset;
  }
) {
  const fs = new SafeFileSystem(root);
  const config = await readPresentationConfig(fs);
  const snapshot = await new RepositoryScanner(root).scan();
  if (await fs.fileExists('README.md')) {
    const readme = await fs.readFile('README.md');
    if (readme.trim() && !ManagedSections.hasManagedSections(readme)) {
      throw new Error(
        'Automatic sync requires managed README markers. Review `pomade diff`, then adopt with `pomade apply --approved` once.'
      );
    }
  }
  const plan = await new Planner(snapshot, {
    preset: options.preset,
  }).createPlan();
  const result = await new PlanApplier(plan).apply(options);
  let metadata;
  if (options.approvedRemote) {
    const remotePlan = GitHubMetadataPlanner.plan(snapshot, config);
    metadata = await new GitHubAdapter(root).updateMetadata(remotePlan, {
      approvedRemote: true,
      dryRun: options.dryRun,
    });
  }
  return {
    ...result,
    metadata,
    note: 'Only managed content is refreshed. Review authored claims and refresh real screenshots when product behavior changes.',
  };
}
