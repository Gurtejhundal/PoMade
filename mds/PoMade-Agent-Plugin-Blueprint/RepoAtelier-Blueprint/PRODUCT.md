# Product requirements — RepoAtelier

## One sentence

An agent-native repository presentation maintainer that keeps GitHub projects polished, approachable and accurate from the first commit through later releases.

## Problem

Developers spend effort on features but inconsistently write README sections, add project metadata, capture real demos, create community files and keep everything current. Repeatedly asking coding agents to 'make the repo look nice' produces different results and sometimes invented content. Existing README generators or scoring tools cover only slices of the problem.

## Audience

- Indie hackers publishing an early project.
- Student developers with demo-worthy portfolio repos.
- Open-source maintainers tired of stale docs and screenshots.
- Teams that want light, reproducible docs standards across many repos.

## Jobs to be done

1. **At creation:** 'Set up a clean repo without spending a day writing boilerplate.'
2. **At milestone:** 'Make the actual feature understandable and visible.'
3. **At release:** 'Create truthful release notes and a professional release experience.'
4. **Any time:** 'Tell me exactly what looks weak or stale and fix only what I approve.'

## Product behavior

Inputs: local repo + optional GitHub remote + explicit style preset + verified user preferences. Outputs: audit findings, ranked repair plan, README and community doc diffs, optional real media assets, GitHub metadata suggestions and, later, draft release actions.

### v0.1 MUST

- Detect project type: CLI/library, web UI, API/service, data/ML, docs-only, monorepo, unknown.
- Classify maturity: empty/prototype/usable/released/maintained. Do not force release docs onto an empty project.
- Propose 60-second user value explanation, verified quickstart, examples and honest state.
- Show local diffs; refuse unsafe writes and avoid modifying files without approval.
- Prevent hallucination: claim-evidence log, refusal to invent screenshots/results/metrics.
- Let user choose `minimal`, `studio`, or `maintainer` presets and independently toggle extras.
- CLI + portable `SKILL.md` integration.

### v0.2 SHOULD

- Record real web screenshots via Playwright, optional CLI recordings via VHS/asciinema.
- Compare changes and flag stale README and media.
- `gh` remote read + explicit approved edits for description/topics/homepage.
- Optional MCP tools and one major agent adapter (after tests).

### v0.3+ MAY

- Release drafts from verified tags and test results.
- GitHub Action PR-based suggestions after release or weekly, no direct push.
- Optional social card renderer and user-assisted upload.
- Multiple native integrations; hosted UI only if justified by usage.

## Explicit non-goals

Viral growth hacks; manipulating stars; faking repo age and activity; writing app code or tests to make docs seem true; auto-licensing; SEO keyword stuffing; automatic git push; remote visibility changes; automated social preview upload claimed as supported when it is not; support for every agent from day one.

## Acceptance stories

- Fresh CLI project: compact copy with one verified command and output example (if output is actually observed), no demo GIF requirement.
- Web app: screenshot only when runnable and privacy-safe; installation steps derived from actual manifest.
- Private codebase: no cloud uploads, no new public URLs, no remote writes.
- Complex mature OSS: preserve current docs, surface missing maintenance files and stale claims, avoid a one-size template.

## Success measurements

Primary: percent of proposed actions accepted; percent of generated factual claims with evidence; idempotent rerun rate; time from repo creation to useful first README; broken commands and links found. Secondary: human blind preference against baseline README generators. **Do not use star count as the primary success metric.**
