# Pomade Website Architecture & Frontend Specification

> **Main Design Concept:** *GitHub README meets an editorial developer-tool design studio.*

---

## 1. Information Architecture & Sitemap

```
/ (Home / Interactive README)
├── /templates (Curated Gallery of 6 Distinct README Designs)
├── /studio (Interactive Split-Pane README Customizer & Live GitHub Preview)
├── /how-it-works (Evidence-Based Methodology & Safety Invariants)
├── /docs (CLI Reference, Agent Skills Specification, and Configuration)
└── External: GitHub Repository (https://github.com/Gurtejhundal/PoMade)
```

---

## 2. Navigation & Repository Shell

The website shell incorporates the structure of a premier GitHub repository without impersonating GitHub's trademarked interface.

### 2.1 The Repository Header Rail
Located at the top of every page:
- **Repository Path:** `gurtejbirsinghh / pomade` (with subtle folder/repo icon).
- **Branch Pill:** `main` (branch dropdown style indicator).
- **Version Tag:** `v1.0.0-rc.1`.
- **Top Tabs:**
  - `README.md` (Points to `/`)
  - `Templates` (Points to `/templates`)
  - `Studio` (Points to `/studio`)
  - `How it Works` (Points to `/how-it-works`)
  - `Docs` (Points to `/docs`)
- **Theme Toggle:** Sun/Moon toggle for Light/Dark mode.
- **GitHub Link:** GitHub icon with real star count placeholder linking to `https://github.com/Gurtejhundal/PoMade`.

---

## 3. Page Specifications

### 3.1 Homepage (`/`) — The Living Repository

#### Section 1: Hero
- **Mascot Centerpiece:** Features the original Pomade mascot (`pomade-mascot.png`) at 200px width.
- **Project Title:** `Pomade` in bold Grotesk.
- **Tagline:** *Make every repo worth opening.*
- **Sub-Tagline:** *Your agent writes the code. Pomade makes the repository presentable.*
- **Primary CTAs:**
  - `[ Explore Templates ]` (Button, accent copper/amber, links to `/templates`)
  - `[ Open Studio ]` (Button, outline/secondary, links to `/studio`)
  - `[ GitHub ]` (Subtle text link with external icon)

#### Section 2: Interactive Terminal Demo
A realistic, interactive terminal simulation showcasing Pomade's CLI in action:
- Tabbed selector: `pomade scan` | `pomade audit` | `pomade plan` | `pomade apply`.
- Typing effect and formatted terminal output showing real scanner facts, evidence ledger claims, and stage-aware quality scores (96/100).

#### Section 3: The Problem (Before & After Slider)
- **Left (Before Pomade):** An ordinary AI-generated repository: generic `TODO` sections, missing badges, broken installation commands, absent visual media, vague one-liner description.
- **Right (After Pomade):** Gleaming, professional repository: evidence-backed features, exact package scripts in quickstart, vector SVG architecture diagram, compliant social preview card, MIT license badge, zero documentation drift.
- **Interactive Slider:** Allows dragging left/right to reveal the contrast.

#### Section 4: How Pomade Works (5-Step Walkthrough)
1. **Inspect:** Scanner discovers manifests, frameworks, entrypoints, and git state without side effects.
2. **Classify:** Evidence ledger extracts verified facts; audit engine scores repository health.
3. **Choose Design:** Select from 6 distinct README design templates tailored to project type.
4. **Preview & Diff:** Inspect proposed unified diffs; hand-written human sections outside markers are protected.
5. **Approve & Sync:** Apply changes atomically locally or sync GitHub topics/description remotely with permission.

#### Section 5: Feature Showcase Cards
- **Evidence-Backed Documentation:** Never invents features or fake commands.
- **Managed Markers:** Protects manual human writing using `<!-- pomade:start/end -->`.
- **Visual Assets Pipeline:** Vector SVG architecture diagrams and 1280x640 GitHub social cards.
- **Documentation Drift Engine:** Automatically flags outdated READMEs when code scripts change.
- **GitHub Community Hygiene:** Bug report templates, PR templates, and semantic release changelogs.

#### Section 6: Coding Agent Integrations
Visual breakdown of the agent integration model:
$$\text{Coding Agent} \longrightarrow \text{Pomade SKILL.md} \longrightarrow \text{Core Engine} \longrightarrow \text{Verified Repository}$$
- **Verified Supported Environments:** Claude Code, Antigravity, Cursor, Cline, Windsurf, Aider.
- **Future Integrations:** Labeled clearly as planned.

#### Section 7: Closing Call to Action
- Headline: *"Good code deserves a good introduction."*
- Mascot farewell cameo stamp.
- CTAs to launch Studio or install via `npm install -g pomade`.

---

### 3.2 Templates Gallery (`/templates`)

A curated gallery featuring the **6 genuinely distinct README templates**:
1. **Template 01 — The Character:** Centered mascot hero, personality-led, concise quickstart, minimal badge strip.
2. **Template 02 — Terminal Noir:** Command-line first, monospace typography, terminal session blocks, installation-first.
3. **Template 03 — Product Showcase:** High-impact screenshot hero, demonstration GIF layout, feature grid, platform matrix.
4. **Template 04 — Editorial:** Essayist storytelling headings, illustrated workflow, wide breathing room, reduced badge clutter.
5. **Template 05 — Technical Precision:** API/CLI reference, configuration tables, architecture diagram, strict developer documentation.
6. **Template 06 — Research Lab:** Thesis statement, methodology, dataset details, benchmark tables with verified sources, BibTeX citation.

**Gallery Controls:**
- Filter by project type: `All`, `CLI / Tool`, `Web / App`, `Library / SDK`, `Research / ML`.
- Card preview: Realistic miniature preview, description, supported sections, light/dark badge.
- Action: `[ Customize in Studio ]` $\rightarrow$ loads the selected template into `/studio`.

---

### 3.3 Interactive README Studio (`/studio`)

The flagship interactive component of the product.

```
+-----------------------------------+-----------------------------------------+
| STUDIO CONTROLS (Left Pane)       | LIVE PREVIEW & EXPORT (Right Pane)      |
+-----------------------------------+-----------------------------------------+
| [ Template Selector Dropdown ]    | [ Preview ] [ Source ] [ Diff ] [ Audit]|
|                                   | Mode: [ Light / Dark ]                  |
| - Project Basics (Name, Tagline)  +-----------------------------------------+
| - Description & Category          | # My Project                            |
| - Selected Badges                 | > Make every repo worth opening...      |
| - Quickstart Commands             |                                         |
| - Verified Features               | ## Overview                             |
| - Architecture Diagram Settings   | ... (Live GitHub Flavored Markdown)     |
| - Managed Markers Toggle          |                                         |
+-----------------------------------+-----------------------------------------+
| [ Reset ]   [ Load Sample Data ]  | [ Copy MD ] [ Download MD ] [ ZIP All ] |
+-----------------------------------+-----------------------------------------+
```

#### Left Pane: Customization Controls
- **Template Switcher:** Live dropdown to switch between the 6 template definitions.
- **Sample Project Loader:** Buttons to pre-fill with realistic sample projects (Node CLI, Python Library, Web App, ML Research).
- **Core Fields:** Project Name, Tagline, Description, Author, License, Repository URL, Homepage.
- **Section Controls:** Toggles to enable/disable sections (`Overview`, `Quickstart`, `Features`, `Usage`, `Architecture`, `Benchmarks`, `Citation`, `Contributing`, `License`).
- **Media Controls:** Include architecture diagram, social preview card, screenshot placeholder.

#### Right Pane: Multi-Mode Inspector
- **Preview Tab:** Renders the generated README using GitHub Flavored Markdown rules (tables, syntax highlighted code blocks, badges, task lists, and SVG diagrams). Supports Light/Dark theme toggle to simulate GitHub's appearance.
- **Source Tab:** Clean Markdown source view with line numbers and 1-click `[ Copy Markdown ]`.
- **Diff Tab:** Displays unified diff between the current project state and proposed template updates.
- **Audit Tab:** Shows real-time evidence validation checks (e.g., verifying that quickstart commands match package scripts).

#### Export Functionality
- **Copy Markdown:** Copies sanitized GFM to clipboard.
- **Download `README.md`:** Generates local file download.
- **Download Complete ZIP:** Packages `README.md`, `LICENSE`, `CONTRIBUTING.md`, and referenced SVG assets (`docs/media/architecture.svg`, `docs/media/social-preview.svg`) into a downloadable archive via `JSZip`.

---

### 3.4 How It Works (`/how-it-works`)
Detailed architectural explanation of Pomade's 5 pillars:
1. **Safe Filesystem Adapter:** Path traversal defense, secret exclusions (`.env*`, keys).
2. **Multi-Manifest Scanner:** Deterministic SHA-256 fingerprinting across Node, Python, Rust, Go.
3. **Evidence Ledger:** Strict provenance tracking to eliminate hallucination.
4. **Policy Guard & Atomic Applier:** Two-tier approval gates (`--approved` for local, `--approved-remote` for GitHub API).
5. **Drift Detector:** Real-time synchronization checks between code scripts and documentation.

---

### 3.5 Documentation (`/docs`)
- **CLI Reference:** Syntax, arguments, and examples for all 10 commands (`scan`, `audit`, `plan`, `diff`, `apply`, `doctor`, `drift`, `media`, `github`, `release`).
- **Agent Skill Reference:** How agents parse and execute `skills/pomade/SKILL.md`.
- **Managed Sections Spec:** Marker syntax (`<!-- pomade:start <id> -->`) and preservation rules.

---

## 4. Frontend Technology Stack

- **Framework:** Next.js (App Router) / React with TypeScript.
- **Styling:** Tailwind CSS with custom design tokens for Pomade's monochrome + copper palette.
- **Markdown & Syntax Highlighting:** GitHub Flavored Markdown renderer with support for tables, task lists, and code blocks.
- **Packaging / Client ZIP:** `jszip` and `file-saver` for instant local bundle export without server dependencies.
- **Icons:** Lightweight SVG iconography (Lucide / custom repo glyphs).
- **State Management:** React state + URL query parameters (e.g. `/studio?template=character`) + LocalStorage persistence.
