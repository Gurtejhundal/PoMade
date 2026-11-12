# Pomade README Design Engine Specification

> **Purpose:** Define the data models, layout composition pipeline, validation rules, and template schemas for Pomade's 6 distinct README designs.

---

## 1. Core Architecture Pipeline

The README Design Engine is decoupled from UI presentation so the same typed engine powers both the interactive website studio and the CLI plugin:

```
[ Repository Facts / User Input ]
             │
             ▼
  [ ProjectFacts Schema ]
             │
             ▼
   [ Template Registry ] ──> Selects 1 of 6 Layout Engines
             │
             ▼
   [ Section Composers ] ──> Evaluates Section Rules & Managed Markers
             │
             ▼
   [ Markdown Assembler ] ──> Formats GitHub Flavored Markdown (GFM)
             │
             ▼
 [ Safety & Quality Linter ] ──> Verifies Paths, Zero Hallucination, Badges
             │
             ├───────────────┬────────────────┐
             ▼               ▼                ▼
    [ Live Rendered ]   [ Source MD ]   [ Export ZIP ]
```

---

## 2. The 6 Genuinely Distinct Templates

Each template possesses distinct visual hierarchy, content order, typographic density, and section layout.

### Template 01 — The Character
- **Inspiration:** *Ponytail*, indie dev tools, personality-first utilities.
- **Hero:** Centered monochrome mascot (`docs/media/pomade-mascot.png` or project logo) $\rightarrow$ Centered Title $\rightarrow$ Italicized tagline $\rightarrow$ Clean 3-badge row (License, Version, CI).
- **Voice:** Dry, concise, senior developer tone.
- **Section Order:**
  1. Centered Hero & Mascot
  2. The Hook / Philosophy (1-2 sentences)
  3. The Problem & Solution
  4. Quickstart (Installation + 1-line execution)
  5. Core Rules / Decision Tree
  6. Configuration Options
  7. License & Credits
- **Best For:** CLI tools, developer utilities, agent plugins, indie libraries.

---

### Template 02 — Terminal Noir
- **Inspiration:** *Hermes Agent*, terminal-first infrastructure, hacker utilities.
- **Hero:** Wide dark-mode terminal banner $\rightarrow$ Monospaced title $\rightarrow$ Terminal command pill $\rightarrow$ Execution badges.
- **Voice:** High-tech, precise, command-line native.
- **Visual Features:** Rich terminal session mockups with command prompts (`$`), flags table, and ASCII/Unicode process trees.
- **Section Order:**
  1. Terminal Header Banner
  2. Terminal Quick Run (`curl -fsSL ... | bash` or `npm install -g ...`)
  3. Commands & Flag Reference
  4. Architecture / Process Flow
  5. Multi-Platform Support Matrix (Linux, macOS, WSL2, Windows)
  6. Configuration Environment Variables
  7. License
- **Best For:** System tools, backend daemons, developer CLIs, terminal applications.

---

### Template 03 — Product Showcase
- **Inspiration:** *OpenDesign*, Raycast extensions, modern desktop/web apps.
- **Hero:** Wide visual product hero screenshot $\rightarrow$ High-level pitch $\rightarrow$ Feature overview $\rightarrow$ Live demo link.
- **Visual Features:** Screenshot grid with window drop-shadow frames, GIF walkthrough fallback, feature grid with icon badges.
- **Section Order:**
  1. Visual Product Hero (Mac OS frame mockup)
  2. Product Pitch & Key Value
  3. Interactive/Visual Feature Grid (2-column layout with screenshots)
  4. Live Demo & Sandbox Links
  5. Installation & Platform Binaries (Web, macOS, Windows)
  6. Usage Walkthrough
  7. Roadmap
  8. License
- **Best For:** Web apps, SaaS products, desktop tools, dashboard interfaces.

---

### Template 04 — Editorial
- **Inspiration:** *Traqu*, essayist software, creative tooling, craft-driven apps.
- **Hero:** Large editorial title $\rightarrow$ Thoughtful poetic subheading $\rightarrow$ Illustrated workflow diagram.
- **Voice:** Human-written, thoughtful, narrative-driven. Wide breathing room, zero badge clutter.
- **Section Order:**
  1. Editorial Headline & Story Subtitle
  2. The Friction (Why this exists)
  3. The Core Concept (Illustrated workflow)
  4. How It Works (Step-by-step narrative)
  5. Daily Ritual / Workflow
  6. Getting Started
  7. Community & Philosophy
  8. License
- **Best For:** Creative software, productivity tools, note-taking apps, independent projects.

---

### Template 05 — Technical Precision
- **Inspiration:** *UI UX Pro Max*, Stripe SDKs, Rust crates, enterprise libraries.
- **Hero:** Compact title $\rightarrow$ Version/build badges $\rightarrow$ Precise specification paragraph.
- **Voice:** Rigorous, unambiguous, specification-grade.
- **Visual Features:** Deep configuration tables, API signature blocks, input/output type definitions, Mermaid state diagrams.
- **Section Order:**
  1. Technical Title & Specification Pill
  2. Installation & Prerequisites
  3. API / Interface Reference
  4. Code Examples (TypeScript / Python snippets)
  5. Configuration Options Table (Param, Type, Default, Description)
  6. Architecture & State Diagram (Mermaid)
  7. Benchmarks & Testing Verification
  8. Contributing Guidelines
  9. License
- **Best For:** Libraries, SDKs, APIs, enterprise middleware, algorithms.

---

### Template 06 — Research Lab
- **Inspiration:** ArXiv ML repos, Nous Research, HuggingFace models.
- **Hero:** Paper Title $\rightarrow$ Authors / Affiliations $\rightarrow$ Links (Paper PDF, Weights, Dataset, Demo) $\rightarrow$ Abstract.
- **Voice:** Academic, objective, methodology-focused.
- **Visual Features:** Verifiable benchmark comparison tables, evaluation metrics, BibTeX citation block.
- **Section Order:**
  1. Paper Title, Authors, and Artifact Links
  2. Abstract & Research Thesis
  3. Model Architecture & Training Methodology
  4. Dataset & Benchmarks (Verified metrics table with links to sources)
  5. Reproducibility Guide (Environment setup, CUDA requirements, evaluation script)
  6. Limitations & Ethical Considerations
  7. BibTeX Citation
  8. Acknowledgments & License
- **Best For:** Machine learning models, academic research, datasets, scientific software.

---

## 3. Data Contracts & Interfaces

```typescript
export interface ProjectFacts {
  name: string;
  tagline: string;
  description: string;
  category: 'cli' | 'web' | 'library' | 'api' | 'research';
  author: string;
  license: string;
  repositoryUrl: string;
  homepageUrl?: string;
  primaryLanguage: string;
  frameworks: string[];
  installCommand: string;
  buildCommand?: string;
  testCommand?: string;
  runCommand: string;
  features: Array<{
    title: string;
    description: string;
    screenshotUrl?: string;
  }>;
  badges: Array<{
    label: string;
    value: string;
    color: string;
    linkUrl?: string;
  }>;
  architectureMermaid?: string;
  benchmarks?: Array<{
    metric: string;
    score: string;
    baseline: string;
    source: string;
  }>;
  citationBibtex?: string;
}

export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  recommendedFor: string[];
  supportedSections: string[];
  defaultSectionOrder: string[];
  render: (facts: ProjectFacts, options?: TemplateRenderOptions) => string;
}

export interface TemplateRenderOptions {
  includeManagedMarkers?: boolean; // wraps sections in <!-- pomade:start/end -->
  lightDarkMode?: 'light' | 'dark' | 'auto';
  mascotUrl?: string;
}
```

---

## 4. Anti-Hallucination & Quality Invariants

The engine enforces strict validation before emitting Markdown:
1. **No Fake Badges:** Badges are only rendered if their values exist in `ProjectFacts`.
2. **Path Verification:** Relative asset links (`docs/media/...`) must correspond to actual files or export bundles.
3. **No Fabricated Benchmarks:** Benchmarks in Template 06 must contain explicit `source` provenance.
4. **Valid GFM:** Emits strictly valid GitHub Flavored Markdown (HTML limited to supported elements: `<p align="center">`, `<img>`, `<picture>`, `<details>`, `<summary>`).
