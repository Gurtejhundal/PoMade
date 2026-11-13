import type { ProjectFacts, TemplateDefinition } from './types';

export function renderTechnicalPrecisionTemplate(facts: ProjectFacts): string {
  const marker = (id: string, content: string) => {
    if (!facts.includeManagedMarkers) return content;
    return `<!-- pomade:start ${id} -->\n${content}\n<!-- pomade:end ${id} -->`;
  };

  const headerContent = `# ${facts.name}

> \`SPECIFICATION\` :: ${facts.tagline}

[![NPM Version](https://img.shields.io/badge/npm-v1.0.0-informational.svg)](package.json)
[![TypeScript](https://img.shields.io/badge/types-included-blue.svg)](tsconfig.json)
[![License](https://img.shields.io/badge/license-${facts.license}-green.svg)](LICENSE)
[![CI](https://img.shields.io/badge/build-passing-brightgreen.svg)](.github/workflows/ci.yml)`;

  const overview = `## Project Specification

${facts.description}

### Key Invariants

1. **Deterministic Execution**: Given the same input, all operations yield identical outputs.
2. **Strict Type Safety**: Fully typed with TypeScript strict mode and zero \`any\` assumptions.
3. **Zero Side-Effects**: Read-only operations do not mutate file system state.`;

  const installation = `## Installation & Environment

Prerequisites: Node.js >= 18.0.0 or modern runtime environment.

\`\`\`bash
${facts.installCommand}
\`\`\``;

  const apiReference = `## API / Interface Reference

### \`initializeEngine(options: EngineOptions): Promise<EngineResult>\`

Initializes the core runner with the supplied configuration.

\`\`\`typescript
import { initializeEngine } from '${facts.name.toLowerCase()}';

const result = await initializeEngine({
  targetPath: process.cwd(),
  strictMode: true,
  maxConcurrency: 4,
});

console.log(\`Execution complete with status: \${result.status}\`);
\`\`\``;

  const configTable = `## Configuration Options

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| \`targetPath\` | \`string\` | \`process.cwd()\` | Absolute or relative path to target repository root |
| \`strictMode\` | \`boolean\` | \`true\` | Enforce schema validation and fail on unverified claims |
| \`timeoutMs\` | \`number\` | \`5000\` | Maximum execution time in milliseconds |
| \`approved\` | \`boolean\` | \`false\` | Explicit authorization confirmation for file mutations |`;

  const architecture = `## Architecture & Workflow

\`\`\`mermaid
graph TD
  Input([User Input / CLI]) --> Validator[Schema Validator]
  Validator --> Engine[Core Engine]
  Engine --> Guard[Policy Guard]
  Guard --> Applier[Atomic Applier]
  Applier --> Output([Verified Artifacts])
\`\`\``;

  const features = `## Supported Capabilities

${facts.features.map((f) => `- **\`${f.title}\`**: ${f.description}`).join('\n')}`;

  const testing = `## Verification & Test Suite

Run the verified test suite:

\`\`\`bash
${facts.testCommand || 'npm test'}
\`\`\``;

  const license = `## License

Licensed under the [${facts.license} License](LICENSE).`;

  return [
    marker('header', headerContent),
    '',
    marker('overview', overview),
    '',
    marker('quickstart', installation),
    '',
    apiReference,
    '',
    configTable,
    '',
    architecture,
    '',
    marker('features', features),
    '',
    testing,
    '',
    marker('license', license),
  ].join('\n');
}

export const TechnicalPrecisionTemplate: TemplateDefinition = {
  id: 'technical-precision',
  name: 'Template 05 — Technical Precision',
  tagline: 'Specification-grade documentation.',
  description:
    'Inspired by UI UX Pro Max and enterprise SDKs. Deep configuration tables, API signatures, Mermaid diagrams, and strict developer documentation.',
  category: 'api',
  recommendedFor: ['SDKs', 'Libraries', 'APIs', 'Enterprise Middleware', 'Algorithms'],
  supportedSections: [
    'Specification Header',
    'Project Specification',
    'Installation',
    'API Reference',
    'Configuration Table',
    'Architecture Diagram',
    'Capabilities',
    'Verification',
    'License',
  ],
  defaultSectionOrder: [
    'header',
    'overview',
    'quickstart',
    'api-ref',
    'config-table',
    'architecture',
    'features',
    'testing',
    'license',
  ],
  render: renderTechnicalPrecisionTemplate,
};
