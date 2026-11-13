import type { ProjectFacts, TemplateDefinition } from './types';

export function renderResearchLabTemplate(facts: ProjectFacts): string {
  const marker = (id: string, content: string) => {
    if (!facts.includeManagedMarkers) return content;
    return `<!-- pomade:start ${id} -->\n${content}\n<!-- pomade:end ${id} -->`;
  };

  const headerContent = `# ${facts.name}: An Empirical Evaluation

**Authors:** ${facts.author} et al.  
*${facts.tagline}*

<p align="center">
  <a href="${facts.homepageUrl || '#'}"><img src="https://img.shields.io/badge/Paper-ArXiv%20PDF-B31B1B.svg" alt="Paper" /></a>
  <a href="${facts.repositoryUrl}"><img src="https://img.shields.io/badge/Weights-HuggingFace-FFD21E.svg" alt="Model Weights" /></a>
  <a href="${facts.repositoryUrl}"><img src="https://img.shields.io/badge/Dataset-Verified%20Open-blue.svg" alt="Dataset" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-${facts.license}-green.svg" alt="License" /></a>
</p>`;

  const abstract = `## Abstract

${facts.description}

We demonstrate that disciplined repository presentation and verifiable evidence provenance significantly improve reproduction fidelity across independent evaluation suites.`;

  const methodology = `## Model Architecture & Methodology

\`\`\`
[Input Tokens] ──► [Sparse Attention Layer] ──► [Critic Feedback Loop] ──► [Verified Solution]
                                                         │
                                                         ▼
                                                [Confidence Score > 0.95]
\`\`\`

The framework employs structured rejection sampling to filter speculative responses, ensuring zero hallucinated benchmark results.`;

  const benchmarksTable = `## Verifiable Benchmarks

All evaluation results below are directly reproducible via the provided evaluation scripts:

| Benchmark Dataset | Metric | Baseline (GPT-4o) | ${facts.name} (Ours) | Verification Source |
| :--- | :--- | :--- | :--- | :--- |
| **HumanEval** | Pass@1 | 82.4% | **89.1%** | [\`eval/humaneval.py\`](eval/) |
| **MBPP** | Pass@1 | 80.2% | **86.4%** | [\`eval/mbpp.py\`](eval/) |
| **SWE-Bench Lite** | Resolved | 24.5% | **33.2%** | [\`eval/swe_bench.py\`](eval/) |
| **RepoPresentation** | Audit Score | 42/100 | **96/100** | [\`pomade audit\`](#) |

> **Note on Verification:** Unlike synthetic leaderboard claims, every metric in this table links directly to execution scripts and raw evaluation logs.`;

  const reproducibility = `## Reproducibility & Environment Setup

### 1. Environment Configuration

\`\`\`bash
# Create isolated environment
conda create -n ${facts.name.toLowerCase()} python=3.10 -y
conda activate ${facts.name.toLowerCase()}

# Install dependencies
${facts.installCommand}
\`\`\`

### 2. Run Evaluation Suite

\`\`\`bash
${facts.runCommand}
\`\`\``;

  const limitations = `## Limitations & Ethical Considerations

- **Hardware Requirements**: Optimal throughput requires at least one NVIDIA A100 (80GB) or equivalent compute cluster.
- **Scope**: Designed specifically for code generation and repository synthesis; performance on conversational tasks is not benchmarked.`;

  const citation = `## BibTeX Citation

\`\`\`bibtex
@article{${facts.name.toLowerCase().replace(/[^a-z0-9]/g, '')}${new Date().getFullYear()},
  title={${facts.name}: ${facts.tagline}},
  author={${facts.author}},
  journal={arXiv preprint arXiv:2604.00000},
  year={${new Date().getFullYear()}},
  url={${facts.repositoryUrl}}
}
\`\`\``;

  const license = `## License & Acknowledgments

This research artifact is distributed under the [${facts.license} License](LICENSE).`;

  return [
    marker('header', headerContent),
    '',
    abstract,
    '',
    methodology,
    '',
    benchmarksTable,
    '',
    marker('quickstart', reproducibility),
    '',
    limitations,
    '',
    citation,
    '',
    marker('license', license),
  ].join('\n');
}

export const ResearchLabTemplate: TemplateDefinition = {
  id: 'research-lab',
  name: 'Template 06 — Research Lab',
  tagline: 'Scientific and ML research repository.',
  description:
    'Designed for AI models, scientific codebases, and academic research. Paper abstract, verifiable benchmarks comparison table with source links, and BibTeX citation.',
  category: 'research',
  recommendedFor: ['ML Models', 'Academic Research', 'Datasets', 'Scientific Algorithms'],
  supportedSections: [
    'Paper Title & Links',
    'Abstract',
    'Methodology',
    'Verifiable Benchmarks',
    'Reproducibility Guide',
    'Limitations',
    'BibTeX Citation',
    'License',
  ],
  defaultSectionOrder: [
    'header',
    'abstract',
    'methodology',
    'benchmarks',
    'reproducibility',
    'limitations',
    'citation',
    'license',
  ],
  render: renderResearchLabTemplate,
};
