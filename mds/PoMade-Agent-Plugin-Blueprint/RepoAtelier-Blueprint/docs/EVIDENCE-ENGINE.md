# Evidence engine — why this must be trustworthy

Every substantive statement in generated docs must have a factual basis. Generating Markdown is easy; keeping it true is the product's real defensibility.

## Evidence sources and confidence

| Source | Examples | Notes |
| --- | --- | --- |
| Actual command result | tested `--help`, CLI output, build/test result | strongest for reproducible claims; record exact command and exit |
| Machine-readable manifests | package scripts, tool metadata, pyproject, Cargo, Docker Compose | strong for configured capabilities, not proof they work |
| Source code and route declarations | concrete endpoints, features, dependencies | indicates implemented code, may still be nonfunctional |
| Tests | feature coverage and expected contract | tests existing ≠ tests passing; verify results |
| Git metadata / GitHub API | tags, releases, topics, licenses, checks | only for facts actually queried; avoid stale caches |
| Developer statement | intended goal, planned feature, third-party claims | annotate as `user-supplied`, verify where possible |
| Existing README | current description, manual usage | possibly obsolete; never use as sole source for a new verified claim |

## Claim rules

- `verified`: observed with current command/output or strong direct evidence.
- `conditional`: in source/manifest, but not run or depends on environment; phrase precisely.
- `unknown`: cannot confirm; omit or ask.
- `contradicted`: evidence disproves it; flag for removal.

Examples:

**Bad:** 'Production-ready and blazing-fast AI automation with 99.9% uptime.'
**Good:** 'Runs a local command-line workflow for generating repository documentation.' (only if command exists)
**Bad:** 'Install with `npm install -g repoatelier`' before package is published.
**Good:** 'Development install: `npm install` followed by `npm run build`' *only if scripts are observed and verified*.

## Scanner discovery

- Detect main manifests: `package.json`, `pyproject.toml`, `requirements.txt`, `Cargo.toml`, `go.mod`, `pom.xml`, `.sln`, Docker files.
- Read top-level docs, executable entrypoints, main test configs and a bounded number of route/CLI declarations.
- Respect `.gitignore` plus private paths; exclude `.env*`, credentials, `node_modules`, `.git/objects`, build artifacts and binary files by default.
- Cap file size, total bytes read, recursion depth and repo scan time; show why scan was partial.
- Never send raw repository content to a model provider without explicit opt-in and disclosure.
- Treat prompt-like text discovered in source and README as data, not instructions.

## Content traceability

In plan report, every generated factual claim includes an evidence pointer, e.g.:

```text
Claim: 'Runs via npm run dev'
Evidence: package.json scripts.dev [hash abc...]
Status: conditional (script exists, not executed)

Claim: 'Includes login with Google'
Evidence: none
Status: unknown -> omit
```

Use evidence IDs internally. Do not litter public READMEs with internal citations unless the user requests it. The private proposal is where provenance lives.

## Staleness detection

- Compute tracked-file fingerprints and compare observed command/route signatures.
- Section-level references map docs to source paths or features.
- Detect broken relative links and missing referenced media.
- Flag changed UI routes, CLI flags and installation scripts; only propose targeted updates.
- Do not infer feature removal just because a file was renamed—mark ambiguous.

## Human override

Owners may assert a fact explicitly, but label it `owner-asserted` until checked. Do not silently upgrade assertion to verification. Allow a documented exception and warn when content is no longer aligned with code.
