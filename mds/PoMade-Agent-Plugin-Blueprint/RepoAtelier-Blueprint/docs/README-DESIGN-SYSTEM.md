# README design system — premium without template sludge

## Product promise

A reader should know **what it does, why it matters and how to try it** within one screen or quick scan. Aim for credible, specific, human-sounding writing. Design should amplify the product, not distract from it.

## Visual presets

### 1. `minimal` (default)

One-line value proposition; 0–3 factual badges only if useful; a short demo or concise code block; tiny feature list; 60-second installation; basic usage; honest status; license if chosen. For tiny CLI projects, a single image may add nothing.

### 2. `studio`

A considered visual identity with optional wordmark/logo, screenshot or meaningful GIF, spacious heading rhythm, 1–4 honest badges, carefully edited feature stories, use-case examples, and links to docs. Never autoplay an enormous animation without useful static fallback.

### 3. `maintainer`

Clear installation matrix, API/user docs, compatibility, release versions, contribution/security guidance, reproducible examples, link checking, advanced TOC only when document length warrants it. Professional beats ornamental.

## Recommended README narrative (adaptively omit sections)

1. Project name + concrete promise: 'X turns [input] into [outcome] without [pain]'.
2. A **real** demo / screenshot only when it helps the reader understand behavior.
3. 'Why this exists' as a specific user problem, not an AI-written mission statement.
4. What it currently does (3–5 capability bullets; do not call future plans features).
5. Fast start: prerequisites, exact install, exact run, expected result when verified.
6. Example workflow: copied command/code or short before-after, explained in plain terms.
7. Architecture or integration diagram only if complexity warrants.
8. Limitations, status, roadmap (where appropriate).
9. Contributing, security reporting, license—only if applicable.

## Human-language editor rules

- Lead with a specific observable verb and object: 'Records a Playwright flow and saves a GIF' instead of 'Revolutionizes visual storytelling'.
- No stale hype: 'cutting-edge', 'seamless', 'ultimate', 'powered by magic', 'unlock the power of', 'state-of-the-art' unless concretely supported.
- One idea per sentence; examples over repetitive feature praise; avoid fake corporate tone.
- Never write first-person maintainer backstory unless the maintainer supplied it.
- Show honest limitations and supported versions instead of invented perfection.
- Do not copy another project's README branding or artwork without permission.
- Include alt text for every informational image, and descriptive captions where needed.
- Highlight design taste with spacing/structure; native GitHub Markdown has limited CSS—avoid fragile embedded scripts/HTML/CSS hacks.
- GitHub READMEs are static content; 'interactive animation' is usually a GIF or linked demo, not executable JavaScript. Some remote renderers and SVG behaviors are restricted.

## README media budget (guidance, not law)

- First screen: one relevant hero/demo image at most; limit emoji and badges.
- Prefer PNG/WebP screenshots for interfaces and GIF only when motion is the point.
- For mobile, ensure images resize with Markdown; don't fix huge pixel widths.
- Keep large assets out of the README first load when possible; use `docs/media` and click-through to longer videos.
- Avoid creating fake performance graphs, fabricated GitHub metrics, false endorsements or benchmark bars without actual runs and methodology.

## Managed content strategy

If a README already exists, default to a proposed patch; never replace it from scratch without approval. For opted-in generated zones, use exact Markdown comments:

```markdown
<!-- repoatelier:start overview -->
... generated, verified overview ...
<!-- repoatelier:end overview -->
```

Guarantees: markers are balanced, unique per section, escaped safely, stable ordering, deterministic formatting. An invalid or duplicated marker blocks automatic replacement. Content outside managed sections remains byte-for-byte unchanged.

## Demo README skeleton (replace from real facts only)

```markdown
# ProjectName

<One specific promise derived from evidence or owner statement.>

<Optional screenshot with meaningful alt text.>

## Why it exists
<One real user problem.>

## Quickstart
<Exact verified commands; show prerequisites.>

## Usage
<One real example.>

## Current status
<Current capabilities and known limits.>

## Contributing
<Link only if real and useful.>

## License
<Only after owner selects and adds it.>
```
