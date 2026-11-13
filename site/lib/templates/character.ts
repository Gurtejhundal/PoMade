import type { ProjectFacts, TemplateDefinition } from './types';

export function renderCharacterTemplate(facts: ProjectFacts): string {
  const marker = (id: string, content: string) => {
    if (!facts.includeManagedMarkers) return content;
    return `<!-- pomade:start ${id} -->\n${content}\n<!-- pomade:end ${id} -->`;
  };

  const mascotTag = facts.includeMascot !== false
    ? `<p align="center">\n  <img src="docs/media/pomade-mascot.png" alt="${facts.name} Mascot" width="200" />\n</p>\n\n`
    : '';

  const badges = [
    `[![License](https://img.shields.io/badge/license-${encodeURIComponent(facts.license)}-blue.svg)](LICENSE)`,
    `![Version](https://img.shields.io/badge/version-v1.0.0-informational.svg)`,
    `![Stage](https://img.shields.io/badge/stage-maintained-orange.svg)`,
  ].join(' ');

  const headerContent = `${mascotTag}# ${facts.name}

> ${facts.tagline}

<p align="center">
  ${badges}
</p>`;

  const overviewContent = `## Overview

${facts.description}

> *"The best code is the code you never wrote. The best repo is the one that speaks for itself."*`;

  const quickstartContent = `## Quickstart

\`\`\`bash
${facts.installCommand}
${facts.runCommand}
\`\`\``;

  const decisionTree = `## The Decision Ladder

Before writing complex custom wrappers, we walk this ladder:
1. **Does this feature need to exist?** (YAGNI)
2. **Is it already solved natively?** (Standard library first)
3. **Can an existing dependency handle it?** (Avoid bloat)
4. **Can it be written in under ten lines?** (Simplicity wins)`;

  const featuresList = facts.features.map((f) => `- **${f.title}**: ${f.description}`).join('\n');
  const featuresContent = `## Core Rules & Features

${featuresList}`;

  const licenseContent = `## License

Released under the [${facts.license} License](LICENSE). Copyright (c) ${new Date().getFullYear()} ${facts.author}.`;

  return [
    marker('header', headerContent),
    '',
    marker('overview', overviewContent),
    '',
    marker('quickstart', quickstartContent),
    '',
    decisionTree,
    '',
    marker('features', featuresContent),
    '',
    marker('license', licenseContent),
  ].join('\n');
}

export const CharacterTemplate: TemplateDefinition = {
  id: 'character',
  name: 'Template 01 — The Character',
  tagline: 'Personality-led senior developer utility.',
  description:
    'Inspired by Ponytail. Centered monochrome character illustration, bold project name, memorable tagline, restrained 3-badge row, and concise quickstart.',
  category: 'cli',
  recommendedFor: ['Agent Skills', 'CLI Tools', 'Developer Utilities', 'Minimalist Libraries'],
  supportedSections: ['Hero', 'Overview', 'Quickstart', 'The Decision Ladder', 'Features', 'License'],
  defaultSectionOrder: ['header', 'overview', 'quickstart', 'decision-tree', 'features', 'license'],
  render: renderCharacterTemplate,
};
