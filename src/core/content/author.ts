import * as path from 'node:path';
import type { RepositorySnapshot, Preset } from '../types/schemas.js';
import {
  presentationSections,
  renderPresentation,
  type PresentationFacts,
  type PresentationStyle,
} from './templates.js';

export interface AuthoringOptions {
  preset?: Preset;
  userIntent?: string;
  useManagedMarkers?: boolean;
  facts?: Partial<PresentationFacts>;
}

export class ContentAuthor {
  public readonly facts: PresentationFacts;
  public readonly style: PresentationStyle;
  private readonly useMarkers: boolean;

  constructor(snapshot: RepositorySnapshot, options: AuthoringOptions = {}) {
    const manifest = snapshot.manifests[0];
    const scripts = manifest?.scripts ?? {};
    const directory = manifest ? path.posix.dirname(manifest.path) : '.';
    const prefix = directory === '.' ? '' : `cd ${JSON.stringify(directory)}\n`;
    const install =
      manifest?.manifestType === 'npm'
        ? ['npm install', scripts.build ? 'npm run build' : '']
            .filter(Boolean)
            .join('\n')
        : manifest?.manifestType === 'pip'
          ? 'python3 -m pip install -r requirements.txt'
          : manifest?.manifestType === 'pyproject'
            ? 'python3 -m pip install -e .'
            : manifest?.manifestType === 'cargo'
              ? 'cargo build --release'
              : manifest?.manifestType === 'gomod'
                ? 'go build ./...'
                : undefined;
    const run =
      manifest?.manifestType === 'npm'
        ? scripts.dev
          ? 'npm run dev'
          : scripts.start
            ? 'npm start'
            : scripts.build
              ? 'npm run build'
              : undefined
        : manifest?.manifestType === 'cargo'
          ? 'cargo run -- --help'
          : undefined;
    const repo = snapshot.gitState.remoteUrl?.match(
      /^(?:git@github\.com:|https:\/\/github\.com\/)([\w.-]+\/[\w.-]+?)(?:\.git)?$/
    )?.[1];
    const preset = options.preset ?? 'minimal';
    this.style =
      preset === 'studio' || preset === 'maintainer' ? 'signature' : preset;
    this.useMarkers = options.useManagedMarkers ?? true;
    this.facts = {
      name: manifest?.name ?? path.basename(snapshot.repoRoot),
      description:
        options.userIntent ??
        manifest?.description ??
        `Source repository for ${manifest?.name ?? path.basename(snapshot.repoRoot)}.`,
      installCommand: install ? prefix + install : undefined,
      runCommand: run ? prefix + run : undefined,
      testCommand: scripts.test ? prefix + 'npm test' : undefined,
      features: snapshot.frameworks.map((title) => ({
        title,
        description: 'Declared in project dependencies.',
      })),
      version: manifest?.version,
      repositoryUrl: repo ? `https://github.com/${repo}` : undefined,
      license: snapshot.license?.spdxId,
      licensePath: snapshot.license?.path,
      workflowPath: snapshot.workflows.find((w) =>
        /(?:^|\/)ci\.ya?ml$/.test(w.path)
      )?.path,
      architectureMermaid: `flowchart LR\n${snapshot.manifests.map((m, i) => `  Repository --> Manifest${i}["${m.path.replace(/[^a-zA-Z0-9_./-]/g, '')}"]`).join('\n')}`,
      ...options.facts,
    };
  }

  public generateReadme(): string {
    return renderPresentation(this.facts, this.style, this.useMarkers);
  }
  public generateSectionMap(): Record<string, string> {
    return presentationSections(this.facts, this.style);
  }
}
