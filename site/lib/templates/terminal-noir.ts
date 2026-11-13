import type { ProjectFacts, TemplateDefinition } from './types';

export function renderTerminalNoirTemplate(facts: ProjectFacts): string {
  const marker = (id: string, content: string) => {
    if (!facts.includeManagedMarkers) return content;
    return `<!-- pomade:start ${id} -->\n${content}\n<!-- pomade:end ${id} -->`;
  };

  const asciiBanner = `\`\`\`
  ╔════════════════════════════════════════════════════════════════════╗
  ║  ██████╗  ██████╗ ███╗   ███╗ █████╗ ██████╗ ███████╗              ║
  ║  ██╔══██╗██╔═══██╗████╗ ████║██╔══██╗██╔══██╗██╔════╝              ║
  ║  ██████╔╝██║   ██║██╔████╔██║███████║██║  ██║█████╗                ║
  ║  ██╔═══╝ ██║   ██║██║╚██╔╝██║██╔══██║██║  ██║██╔══╝                ║
  ║  ██║     ╚██████╔╝██║ ╚═╝ ██║██║  ██║██████╔╝███████╗              ║
  ║  ╚═╝      ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝╚═════╝ ╚══════╝              ║
  ║  >> ${facts.name.toUpperCase()} :: ${facts.tagline.toUpperCase()}
  ╚════════════════════════════════════════════════════════════════════╝
\`\`\``;

  const headerContent = `${asciiBanner}

# ${facts.name}

> \`$ ${facts.tagline}\`

\`[arch: x86_64/arm64]\` \`[license: ${facts.license}]\` \`[status: production-ready]\``;

  const quickRun = `## Quick Execution

Execute directly in your terminal:

\`\`\`bash
# 1. Install ${facts.name}
$ ${facts.installCommand}

# 2. Launch interactive execution
$ ${facts.runCommand}
\`\`\``;

  const featuresList = facts.features
    .map((f) => `- **\`${f.title}\`**: ${f.description}`)
    .join('\n');

  const technicalBlocks = `## Technical Capabilities

${featuresList}`;

  const processTree = `## Process Architecture

\`\`\`
[Host Shell]
     │
     ▼ (IPC / CLI Flags)
[${facts.name} Daemon]
     ├── Engine Core (Deterministic Execution)
     ├── Evidence Ledger (Cryptographic Provenance)
     └── SafeFS Sandbox (Strict Isolation)
\`\`\``;

  const platformMatrix = `## Multi-Platform Support Matrix

| Platform | Target Architecture | Binary / Package | Verified Status |
| :--- | :--- | :--- | :--- |
| **Linux (Ubuntu/Debian)** | x86_64, aarch64 | Native / npm / cargo | :white_check_mark: Passing |
| **macOS (Darwin)** | Apple Silicon (M1-M4), Intel | Homebrew / npm | :white_check_mark: Passing |
| **Windows (WSL2 / Native)** | x86_64 | Native CLI | :white_check_mark: Passing |`;

  const envVars = `## Environment Variables

| Variable | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| \`${facts.name.toUpperCase().replace(/[^A-Z0-9]/g, '_')}_DEBUG\` | boolean | \`false\` | Enable verbose trace logging |
| \`${facts.name.toUpperCase().replace(/[^A-Z0-9]/g, '_')}_TIMEOUT\` | integer | \`5000\` | Network / process timeout in milliseconds |`;

  const verification = `## Testing & Verification

\`\`\`bash
$ ${facts.testCommand || 'npm test'}
\`\`\``;

  const licenseContent = `## License

Licensed under the [${facts.license} License](LICENSE).`;

  return [
    marker('header', headerContent),
    '',
    marker('quickstart', quickRun),
    '',
    marker('features', technicalBlocks),
    '',
    processTree,
    '',
    platformMatrix,
    '',
    envVars,
    '',
    verification,
    '',
    marker('license', licenseContent),
  ].join('\n');
}

export const TerminalNoirTemplate: TemplateDefinition = {
  id: 'terminal-noir',
  name: 'Template 02 — Terminal Noir',
  tagline: 'Terminal-first command line utility.',
  description:
    'Inspired by Hermes Agent. ASCII terminal banner, monospaced typography, command prompts, platform compatibility matrix, and process tree.',
  category: 'cli',
  recommendedFor: ['System Utilities', 'Backend Daemons', 'Agent Harnesses', 'Infrastructure'],
  supportedSections: [
    'Header Banner',
    'Quick Execution',
    'Technical Capabilities',
    'Process Architecture',
    'Platform Matrix',
    'Environment Variables',
    'License',
  ],
  defaultSectionOrder: ['header', 'quickstart', 'features', 'process-tree', 'platform-matrix', 'env-vars', 'license'],
  render: renderTerminalNoirTemplate,
};
