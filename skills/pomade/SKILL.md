---
name: pomade
description: Prepare, polish, and maintain truthful, approachable, and professional GitHub repository presentation. Use when asked to create or refresh a README, audit repository quality, recommend topics, or maintain documentation in sync with code changes. Always scans project evidence, proposes plans and unified diffs, and requests approval before writing.
compatibility: Designed for coding agents with terminal and filesystem access; uses the local `pomade` CLI.
metadata:
  version: "0.1.0"
  author: "Pomade Core Team"
  repository: "https://github.com/pomade/pomade"
---

# Pomade — Make every repo worth opening

Pomade is an agent-native repository presentation maintainer. It keeps GitHub projects polished, approachable, and strictly accurate from the first commit through subsequent releases.

As an AI coding agent, treat repository presentation as a **maintained projection of working software**. Never invent capabilities, fake metrics, or hallucinate commands.

---

## When to Activate

Use Pomade when the user asks you to:
- Create, improve, or refresh a repository's `README.md` or docs.
- Audit a repository's outward presentation, discoverability, or first-run experience.
- Align documentation with recent code changes (e.g. after adding scripts, frameworks, or routes).
- Prepare a new project for public release or make an existing codebase approachable.

**Do NOT activate on unrelated code turns.** Only suggest a documentation refresh when meaningful public interfaces, scripts, or workflows have changed.

---

## Canonical Agent Workflow

Follow this deterministic 6-step lifecycle:

```text
1. Scan evidence    →  pomade scan
2. Quality audit    →  pomade audit
3. Plan changes     →  pomade plan [--preset minimal|studio|maintainer]
4. Preview diff     →  pomade diff
5. User approval    →  "I have prepared a plan for README.md. May I apply it?"
6. Guarded apply    →  pomade apply --approved
```

### Step 1: Scan Facts
Run `pomade scan` to inspect:
- Primary language, frameworks, and machine manifests (`package.json`, `pyproject.toml`, `Cargo.toml`, etc.).
- Observed executable scripts and entrypoints.
- Existing documentation, licenses, assets, and GitHub Action workflows.

### Step 2: Audit Quality
Run `pomade audit` to check clarity, first-run success, trust, discoverability, presentation, and maintainability.
- If a finding is `N/A` (e.g. UI screenshots for CLI tools), do not treat it as a failure.
- If a finding is `BLOCK` (e.g. unchosen license), remind the user that license selection requires an explicit owner decision.

### Step 3: Generate Plan
Run `pomade plan --preset minimal` (or `studio` for showcase UIs, `maintainer` for mature OSS).
- Pomade analyzes the existing `README.md`.
- If managed sections exist (`<!-- pomade:start <id> -->`), Pomade updates **only** the managed content and preserves all human writing outside the markers.
- If no managed sections exist, Pomade prepares a non-destructive proposal as a diff.

### Step 4: Preview Diff
Run `pomade diff` to review the proposed unified diff.
- Verify every factual statement against observed evidence.
- Ensure no hype, fake testimonials, or unsubstantiated benchmarks (`99% faster`) are present.

### Step 5: Ask for Human Approval
Always ask for human confirmation before writing files:
> *"I have prepared an evidence-backed README update for this project using Pomade. I will preserve all your existing handwritten notes. May I apply these changes?"*

### Step 6: Apply Approved Plan
Once approved, execute:
```bash
pomade apply --approved
```
Pomade cryptographically verifies target file hashes before writing. If files were modified externally, it aborts to prevent conflicts.

---

## Agent Rules of Engagement

1. **Evidence > Adjectives:** Every feature bullet, quickstart step, and usage example must reflect real manifest scripts or observed entrypoints.
2. **Preserve Human Writing:** Never overwrite user-written sections without explicit consent.
3. **No License Auto-Commit:** Never autonomously assign an MIT or Apache license. Flag missing licenses as an owner decision.
4. **No Phantom Code Execution:** Never execute untrusted scripts or spin up local servers without explicit permission.
5. **No Badge Walls:** Limit badges to 3–4 factual badges (license, version, stage, real CI).
6. **Accessible Markdown:** Ensure all images have descriptive alt text and static fallbacks.
