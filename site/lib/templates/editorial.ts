import type { ProjectFacts, TemplateDefinition } from './types';

export function renderEditorialTemplate(facts: ProjectFacts): string {
  const marker = (id: string, content: string) => {
    if (!facts.includeManagedMarkers) return content;
    return `<!-- pomade:start ${id} -->\n${content}\n<!-- pomade:end ${id} -->`;
  };

  const headerContent = `# ${facts.name}

> *${facts.tagline}*

A thoughtful developer tool by ${facts.author}.`;

  const theFriction = `## The Friction

Developers spend days crafting elegant software, yet repository documentation often reads like an afterthought. We leave behind sparse READMEs, missing installation instructions, and unrunnable setup steps.

${facts.name} was born out of a desire for craftsmanship. We believe your repository should be as carefully maintained as your codebase.`;

  const coreConcept = `## The Core Concept

\`\`\`
   Raw Idea ──► Thoughtful Design ──► Disciplined Execution ──► Finished Showcase
                                                                      │
                                                                      ▼
                                                                Worth Opening
\`\`\`

${facts.description}`;

  const theWorkflow = `## How It Works in Practice

${facts.features
  .map(
    (f, idx) => `### Chapter ${idx + 1}: ${f.title}

${f.description}`
  )
  .join('\n\n')}`;

  const gettingStarted = `## Getting Started

Set up your workspace in three simple commands:

\`\`\`bash
${facts.installCommand}
${facts.runCommand}
\`\`\``;

  const philosophy = `## Philosophy & Community

- **Craft over Hype**: We value longevity, readability, and quiet competence.
- **Zero Hallucination**: Every claim in our documentation links to verified reality.
- **Human First**: Built for people who care about how their work is remembered.`;

  const licenseContent = `## License

Crafted with care under the [${facts.license} License](LICENSE).`;

  return [
    marker('header', headerContent),
    '',
    theFriction,
    '',
    coreConcept,
    '',
    marker('features', theWorkflow),
    '',
    marker('quickstart', gettingStarted),
    '',
    philosophy,
    '',
    marker('license', licenseContent),
  ].join('\n');
}

export const EditorialTemplate: TemplateDefinition = {
  id: 'editorial',
  name: 'Template 04 — Editorial',
  tagline: 'Storytelling-first documentation.',
  description:
    'Inspired by Traqu. Distinctive heading hierarchy, human-written narrative, illustrated workflow diagrams, wide visual breathing room, and zero badge clutter.',
  category: 'library',
  recommendedFor: ['Creative Software', 'Productivity Tools', 'Craft-Driven Apps', 'Independent Projects'],
  supportedSections: ['Editorial Title', 'The Friction', 'Core Concept', 'Chapters/Workflow', 'Getting Started', 'Philosophy', 'License'],
  defaultSectionOrder: ['header', 'friction', 'concept', 'features', 'quickstart', 'philosophy', 'license'],
  render: renderEditorialTemplate,
};
