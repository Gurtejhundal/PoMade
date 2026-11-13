import type { ProjectFacts, TemplateDefinition } from './types';

export function renderProductShowcaseTemplate(facts: ProjectFacts): string {
  const marker = (id: string, content: string) => {
    if (!facts.includeManagedMarkers) return content;
    return `<!-- pomade:start ${id} -->\n${content}\n<!-- pomade:end ${id} -->`;
  };

  const heroImage = facts.screenshotUrl || 'docs/media/social-preview.svg';

  const headerContent = `<p align="center">
  <img src="${heroImage}" alt="${facts.name} Hero Screenshot" width="800" />
</p>

# ${facts.name}

> **${facts.tagline}**

<p align="center">
  <a href="${facts.homepageUrl || facts.repositoryUrl}"><strong>Explore Live Demo »</strong></a>
  <br />
  <br />
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-${facts.license}-blue.svg" alt="License" /></a>
  <img src="https://img.shields.io/badge/platform-Web%20%7C%20macOS%20%7C%20Windows-green.svg" alt="Platforms" />
</p>`;

  const overview = `## The Product

${facts.description}

### Why Teams Choose ${facts.name}

- **Frictionless Onboarding**: Start testing immediately with zero mandatory configuration.
- **Visual Clarity**: Every output is designed for immediate human understanding.
- **Local-First Privacy**: Your project code stays entirely on your local machine.`;

  const featureCards = facts.features
    .map(
      (f, i) => `### ${i + 1}. ${f.title}

${f.description}

${f.screenshotUrl ? `<p align="center">\n  <img src="${f.screenshotUrl}" alt="${f.title}" width="600" />\n</p>` : ''}`
    )
    .join('\n\n');

  const featuresSection = `## Feature Highlights

${featureCards}`;

  const installation = `## Installation & Getting Started

### Web / CLI

\`\`\`bash
${facts.installCommand}
${facts.runCommand}
\`\`\`

### Pre-Built Binaries

| Operating System | Package Type | Download Link |
| :--- | :--- | :--- |
| **macOS** | Universal \`.dmg\` | [Download for Mac](https://github.com/releases) |
| **Windows** | Setup \`.exe\` | [Download for Windows](https://github.com/releases) |
| **Linux** | AppImage / deb | [Download for Linux](https://github.com/releases) |`;

  const roadmap = `## Product Roadmap

- [x] Initial release candidate with core rendering engine
- [x] Multi-manifest scanner and evidence ledger
- [ ] Real-time collaborative workspace plugin
- [ ] Cloud export integration`;

  const license = `## License

${facts.name} is open source under the [${facts.license} License](LICENSE).`;

  return [
    marker('header', headerContent),
    '',
    marker('overview', overview),
    '',
    marker('features', featuresSection),
    '',
    marker('quickstart', installation),
    '',
    roadmap,
    '',
    marker('license', license),
  ].join('\n');
}

export const ProductShowcaseTemplate: TemplateDefinition = {
  id: 'product-showcase',
  name: 'Template 03 — Product Showcase',
  tagline: 'Visual product documentation with screenshots.',
  description:
    'Inspired by OpenDesign. Large visual product hero, 2-column feature breakdown, download binaries table, and live demo showcase.',
  category: 'web',
  recommendedFor: ['Web Applications', 'Desktop Tools', 'Dashboards', 'SaaS Products'],
  supportedSections: ['Visual Hero', 'Product Pitch', 'Feature Highlights', 'Platform Downloads', 'Roadmap', 'License'],
  defaultSectionOrder: ['header', 'overview', 'features', 'quickstart', 'roadmap', 'license'],
  render: renderProductShowcaseTemplate,
};
