import type { RepositorySnapshot, Preset } from '../types/schemas.js';
import { ManagedSections } from './managed-sections.js';

export interface AuthoringOptions {
  preset?: Preset;
  userIntent?: string;
  useManagedMarkers?: boolean;
}

export class ContentAuthor {
  private readonly snapshot: RepositorySnapshot;
  private readonly preset: Preset;
  private readonly userIntent?: string;
  private readonly useMarkers: boolean;

  constructor(snapshot: RepositorySnapshot, options: AuthoringOptions = {}) {
    this.snapshot = snapshot;
    this.preset = options.preset ?? 'minimal';
    this.userIntent = options.userIntent;
    this.useMarkers = options.useManagedMarkers ?? true;
  }

  public generateReadme(): string {
    const sections: Record<string, string> = {
      header: this.generateHeader(),
      overview: this.generateOverview(),
      quickstart: this.generateQuickstart(),
      features: this.generateFeatures(),
      usage: this.generateUsage(),
      status: this.generateStatus(),
    };

    if (this.preset === 'studio' || this.preset === 'maintainer') {
      sections['architecture'] = this.generateArchitecture();
    }

    if (this.preset === 'maintainer') {
      sections['maintenance'] = this.generateMaintenance();
    }

    sections['license'] = this.generateLicense();

    if (!this.useMarkers) {
      return Object.values(sections).join('\n\n') + '\n';
    }

    const wrapped = Object.entries(sections)
      .map(([id, content]) => ManagedSections.wrap(id, content))
      .join('\n\n');

    return wrapped + '\n';
  }

  public generateSectionMap(): Record<string, string> {
    const map: Record<string, string> = {
      header: this.generateHeader(),
      overview: this.generateOverview(),
      quickstart: this.generateQuickstart(),
      features: this.generateFeatures(),
      usage: this.generateUsage(),
      status: this.generateStatus(),
      license: this.generateLicense(),
    };

    if (this.preset === 'studio' || this.preset === 'maintainer') {
      map['architecture'] = this.generateArchitecture();
    }
    if (this.preset === 'maintainer') {
      map['maintenance'] = this.generateMaintenance();
    }

    return map;
  }

  private generateHeader(): string {
    const primaryManifest = this.snapshot.manifests[0];
    const name = primaryManifest?.name ?? this.getFallbackName();
    const desc = primaryManifest?.description ?? this.userIntent ?? this.getDefaultDescription();

    const badges = this.generateBadges();
    const badgeLine = badges.length > 0 ? `\n\n${badges.join(' ')}` : '';

    return `# ${name}\n\n> ${desc}${badgeLine}`;
  }

  private generateBadges(): string[] {
    const badges: string[] = [];

    // 1. License badge (only if standard license detected)
    if (this.snapshot.license?.isStandard && this.snapshot.license.spdxId) {
      const spdx = encodeURIComponent(this.snapshot.license.spdxId);
      badges.push(`[![License](https://img.shields.io/badge/license-${spdx}-blue.svg)](LICENSE)`);
    }

    // 2. Version badge (from manifest)
    const version = this.snapshot.manifests[0]?.version;
    if (version) {
      badges.push(`![Version](https://img.shields.io/badge/version-v${version}-informational)`);
    }

    // 3. Stage badge
    badges.push(`![Stage](https://img.shields.io/badge/stage-${this.snapshot.stage}-orange)`);

    // Limit badge count to 3 for minimal, 4 for studio/maintainer
    const limit = this.preset === 'minimal' ? 3 : 4;
    return badges.slice(0, limit);
  }

  private generateOverview(): string {
    const lines: string[] = ['## Overview'];

    if (this.userIntent) {
      lines.push(this.userIntent);
    } else {
      lines.push(
        `${this.getFallbackName()} is a ${this.snapshot.kind.toUpperCase()} project built with ${
          this.snapshot.primaryLanguage ?? 'modern tooling'
        }.`
      );
    }

    // Kind-specific overview details
    switch (this.snapshot.kind) {
      case 'cli':
        lines.push('Designed for fast, automated command-line execution and developer workflows.');
        break;
      case 'web':
        lines.push('Provides a responsive, user-friendly interface with modern UI components.');
        break;
      case 'api':
        lines.push('Exposes structured service endpoints with high performance and reliable contracts.');
        break;
      case 'library':
        lines.push('Provides modular, reusable utilities that can be imported across projects.');
        break;
      case 'monorepo':
        lines.push('Organized as a multi-package workspace for shared development and maintenance.');
        break;
    }

    return lines.join('\n\n');
  }

  private generateQuickstart(): string {
    const lines: string[] = ['## Quickstart'];
    const manifest = this.snapshot.manifests[0];

    lines.push('### Prerequisites');
    if (this.snapshot.primaryLanguage === 'TypeScript' || this.snapshot.primaryLanguage === 'JavaScript') {
      lines.push('- Node.js (LTS recommended)\n- npm or compatible package manager');
    } else if (this.snapshot.primaryLanguage === 'Python') {
      lines.push('- Python 3.10+ and pip');
    } else if (this.snapshot.primaryLanguage === 'Rust') {
      lines.push('- Rust toolchain and cargo');
    } else if (this.snapshot.primaryLanguage === 'Go') {
      lines.push('- Go 1.21+ toolchain');
    } else {
      lines.push('- Standard developer environment');
    }

    lines.push('### Installation & Setup');

    const installCmds: string[] = [];
    if (manifest?.manifestType === 'npm') {
      installCmds.push('npm install');
      const scripts = manifest.scripts ?? {};
      if (scripts['build']) installCmds.push('npm run build');
      if (scripts['test']) installCmds.push('npm test');
      if (scripts['dev']) installCmds.push('npm run dev');
      else if (scripts['start']) installCmds.push('npm start');
    } else if (manifest?.manifestType === 'pyproject' || manifest?.manifestType === 'pip') {
      installCmds.push('pip install -r requirements.txt || pip install -e .');
    } else if (manifest?.manifestType === 'cargo') {
      installCmds.push('cargo build --release');
    } else if (manifest?.manifestType === 'gomod') {
      installCmds.push('go build ./...');
    } else {
      installCmds.push('# Clone repository\ngit clone <repo-url>\ncd ' + this.getFallbackName());
    }

    lines.push('```bash\n' + installCmds.join('\n') + '\n```');
    return lines.join('\n\n');
  }

  private generateFeatures(): string {
    const lines: string[] = ['## Features'];
    const features: string[] = [];

    // Kind features
    if (this.snapshot.kind === 'cli') {
      features.push('**Command-Line Interface**: Ergonomic terminal flags and options.');
    } else if (this.snapshot.kind === 'web') {
      features.push('**Interactive User Interface**: Modern web components.');
    } else if (this.snapshot.kind === 'api') {
      features.push('**Service Endpoints**: Reliable request/response handling.');
    }

    // Framework features
    for (const fw of this.snapshot.frameworks) {
      features.push(`**${fw} Integration**: Built with ${fw} for robust performance.`);
    }

    // Quality/tests
    if (this.snapshot.manifests.some((m) => m.scripts?.['test'])) {
      features.push('**Automated Testing**: Test suites configured for verified correctness.');
    }

    if (this.snapshot.workflows.length > 0) {
      features.push('**Continuous Integration**: Automated GitHub Actions workflows.');
    }

    if (features.length === 0) {
      features.push('**Modular Architecture**: Clean, maintainable project structure.');
    }

    lines.push(features.slice(0, 5).map((f) => `- ${f}`).join('\n'));
    return lines.join('\n\n');
  }

  private generateUsage(): string {
    const lines: string[] = ['## Usage'];
    const manifest = this.snapshot.manifests[0];

    if (this.snapshot.kind === 'cli') {
      const binName = manifest?.name ?? 'cli';
      lines.push('Run the command line tool:');
      lines.push(`\`\`\`bash\n${binName} --help\n\`\`\``);
    } else if (this.snapshot.kind === 'web') {
      lines.push('Start the local development server and open your browser:');
      lines.push('```bash\nnpm run dev\n# Open http://localhost:3000\n```');
    } else {
      lines.push('Basic execution example:');
      lines.push('```bash\n# See quickstart instructions above\n```');
    }

    return lines.join('\n\n');
  }

  private generateArchitecture(): string {
    const lines: string[] = ['## Architecture'];

    lines.push('```mermaid\ngraph TD');
    lines.push(`  User([User / Consumer]) --> Entry["${this.getFallbackName()}"]`);
    if (this.snapshot.frameworks.length > 0) {
      lines.push(`  Entry --> Frameworks["Frameworks: ${this.snapshot.frameworks.slice(0, 3).join(', ')}"]`);
    }
    lines.push('  Entry --> Core[Core Logic]');
    lines.push('```');

    return lines.join('\n\n');
  }

  private generateMaintenance(): string {
    const lines: string[] = ['## Development & Contributing'];
    lines.push('Contributions are welcome! Please ensure all tests pass before submitting pull requests.');

    const manifest = this.snapshot.manifests[0];
    if (manifest?.scripts?.['test']) {
      lines.push('Run the test suite:');
      lines.push('```bash\nnpm test\n```');
    }

    return lines.join('\n\n');
  }

  private generateStatus(): string {
    const lines: string[] = ['## Current Status'];
    const stageDesc: Record<string, string> = {
      idea: 'Early Idea — Planning and architecture phase.',
      prototype: 'Active Prototype — Functional baseline implemented; APIs may evolve.',
      usable: 'Usable — Core capabilities verified and ready for initial workflows.',
      released: 'Released — Stable version published.',
      maintained: 'Maintained — Production-ready with continuous integration.',
    };

    lines.push(stageDesc[this.snapshot.stage] ?? 'Under active development.');
    return lines.join('\n\n');
  }

  private generateLicense(): string {
    const lines: string[] = ['## License'];
    if (this.snapshot.license?.spdxId) {
      lines.push(`This project is licensed under the [${this.snapshot.license.spdxId} License](LICENSE).`);
    } else {
      lines.push('No license has been declared yet. All rights reserved until a license is selected by the repository owner.');
    }
    return lines.join('\n\n');
  }

  private getFallbackName(): string {
    return (
      this.snapshot.manifests[0]?.name ??
      this.snapshot.repoRoot.split('/').filter(Boolean).pop() ??
      'Project'
    );
  }

  private getDefaultDescription(): string {
    return `A ${this.snapshot.kind.toUpperCase()} repository maintained with verifiable documentation.`;
  }
}
