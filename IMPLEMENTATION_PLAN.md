# Pomade — Implementation Plan

> **Tagline:** Make every repo worth opening.  
> **Repository:** `Pomade`  
> **Date:** November 2026  
> **Status:** Architecture & Planning Phase (Pre-Implementation)

---

## 1. Executive Summary & Vision

**Pomade** is a production-quality, local-first agent-native plugin and toolkit that equips AI coding agents (and human developers) to prepare, polish, and maintain truthful, approachable, and professional GitHub repositories.

Unlike naive README generators that hallucinate installation commands, fabricate benchmark numbers, or dump 40 meaningless badges into a markdown file, Pomade is built on an **evidence-backed projection thesis**:
> *Repository presentation must be a maintained, verifiable projection of working software.*

Every factual statement in generated copy, every badge, every quickstart command, and every screenshot plan is traceable back to an observed file, machine manifest, git state, or executed verification step.

---

## 2. Blueprint Analysis & Problem Resolution

An exhaustive review of all 27 specification documents in `mds/PoMade-Agent-Plugin-Blueprint/RepoAtelier-Blueprint/` was conducted. The analysis identified key challenges, inconsistencies, and edge cases, resolved below:

| Dimension | Blueprint Analysis / Inconsistency | Pomade Resolution |
| :--- | :--- | :--- |
| **Product Naming** | Blueprint uses "RepoAtelier" as a working brand name alongside mentions of Pomade. | The unified product name is **Pomade** (`pomade` CLI, `.pomade.yml` configuration, `<!-- pomade:start/end -->` markers, `skills/pomade/SKILL.md`). |
| **Scope & Modularity** | Objectives span READMEs, GitHub topics, licenses, real screenshots, releases, and MCP servers. Attempting this all at once leads to fragile bloat. | Strict phased build order: Functional Core + Verification first (Phases 0–5), Agent Skill + CLI (Phase 6), Media + Remote GitHub (Phase 7), MCP + Distribution (Phase 8). |
| **Hallucination Prevention** | Coding agents tend to invent commands (e.g. `npm install -g`, fake `--verbose` flags, mock benchmarks). | **Evidence Ledger**: Claims are classified as `verified`, `conditional`, `unknown`, or `contradicted`. Unverified claims are omitted or marked conditional. |
| **File Overwrite Protection** | Unsafe tools replace entire READMEs, wiping human contributions. | **Zero-Surprise Principle**: Managed sections (`<!-- pomade:start <id> -->`) or non-destructive unified diffs. Local writes require explicit user approval with hash checking. |
| **Social Preview API Limitation** | Often assumed that repository social cards can be uploaded via standard GitHub API. | GitHub REST/GraphQL API does not support automated social card image upload. Pomade generates compliant 1280×640 PNGs with step-by-step instructions for GitHub Web Settings. |
| **License Governance** | Agents often default to adding MIT licenses indiscriminately. | Selecting a legal license is strictly an owner decision. Pomade flags missing licenses as an audit item (`BLOCK`), but will never autonomously write a license file without an explicit choice. |
| **Security & Execution Boundary** | Running code during a scan poses remote code execution risks on untrusted repositories. | Scans, audits, plans, and diffs are 100% read-only and static. No app code or subprocess execution occurs during analysis. Code execution for media capture requires isolated explicit authorization. |

---

## 3. System Architecture & Components

```
                    +------------------------------------------+
                    |    Coding Agent Host / Human Developer   |
                    +--------------------+---------------------+
                                         |
            +----------------------------+----------------------------+
            |                                                         |
            v                                                         v
   [ Portable Agent Skill ]                                    [ Pomade CLI ]
   (skills/pomade/SKILL.md)                                  (bin/pomade.ts)
            |                                                         |
            +----------------------------+----------------------------+
                                         |
                                         v
                         +-------------------------------+
                         |      Core Orchestrator        |
                         +---------------+---------------+
                                         |
        +------------------+-------------+-------------+------------------+
        |                  |                           |                  |
        v                  v                           v                  v
  [ core/scan ]     [ core/evidence ]           [ core/audit ]     [ core/plan ]
  Discovery &       Claims, Ledger &            Rubric & Stage-    Action Graph,
  Git Inspection    Confidence Classification   Aware Diagnostics  Diffs & Templates
        |                  |                           |                  |
        +------------------+-------------+-------------+------------------+
                                         |
                                         v
                                  [ core/policy ]
                        Approval Guards & Hash Integrity
                                         |
                                         v
                                  [ core/apply ]
                            Atomic Safe Local Writes
                                         |
        +--------------------------------+--------------------------------+
        |                                |                                |
        v                                v                                v
[ adapters/fs ]                  [ adapters/git ]                 [ adapters/gh ]
Bounded Path-Safe FS             Read-Only Git Subprocesses       (Opt-in Remote gh)
```

### 3.1 Domain Schemas (Zod-validated)
- **`RepositorySnapshot`**: `repoRoot`, `gitState` (branch, clean/dirty, tracked files), `kind` (CLI, Web, API, Library, ML, Monorepo, Unknown), `stage` (Idea, Prototype, Usable, Released, Maintained), `manifestFacts`, `docs`, `tests`, `assets`, `fingerprint`.
- **`Evidence`**: `id`, `kind` (`file`, `manifest`, `command-result`, `git`, `user-supplied`), `pathOrCommand`, `observedValue`, `confidence`, `fingerprint`.
- **`Claim`**: `id`, `text`, `evidenceIds`, `status` (`verified`, `conditional`, `unknown`, `contradicted`).
- **`Finding`**: `ruleId`, `category` (Clarity, First-Run, Trust, Discoverability, Presentation, Maintainability), `status` (`pass`, `warn`, `fail`, `not-applicable`, `blocked`), `severity` (`P0`, `P1`, `P2`, `P3`), `reason`, `suggestedActionIds`.
- **`Action`**: `id`, `target`, `kind` (`write-local`, `create-media-plan`, `update-remote-metadata`, `draft-release`), `beforeHash`, `proposedDiff`, `evidenceIds`, `risk`, `permissionLevel`.
- **`Plan`**: `planId`, `baseSnapshotFingerprint`, `createdAt`, `preset` (`minimal`, `studio`, `maintainer`), `actions`, `warnings`.

---

## 4. Phased Development Plan

The implementation is broken down into structured, verifiable phases. In accordance with engineering instructions, work will progress sequentially, validating each phase with automated tests before proceeding.

### Phase 0: Project Foundation & Architecture Setup
- **Goal:** Establish clean TypeScript project configuration, test harness, dependency graph, domain schemas, and CLI stub.
- **Deliverables:**
  - `package.json` with ESM, scripts (`build`, `test`, `typecheck`, `lint`).
  - `tsconfig.json` (strict TypeScript, NodeNext module resolution).
  - Vitest test runner configuration.
  - Core domain schemas in `src/core/types/` using Zod.
  - CLI entrypoint stub in `src/cli/index.ts` registering commands (`scan`, `audit`, `plan`, `diff`, `apply`, `doctor`).
- **Acceptance Criteria:** `npm run build`, `npm run typecheck`, and `npm test` execute cleanly with 100% pass rate.

### Phase 1: Safe Filesystem & Git Scanner (`core/scan`)
- **Goal:** Robust, path-safe repository exploration and Git state inspection without side effects.
- **Deliverables:**
  - `src/adapters/filesystem/`: Bounded reads (file size caps, depth caps, total byte limits), symlink detection, `.gitignore` compliance, path traversal defenses (`../` escapes).
  - Exclusion engine: Strict exclusion of `.env*`, secret keys, credentials, `node_modules/`, `.git/objects/`, binaries.
  - `src/adapters/git/`: Read-only subprocess runner with argument arrays (no shell injection) checking branch, commit hash, tracked files, clean/dirty state.
  - Manifest detectors: Node (`package.json`), Python (`pyproject.toml`, `requirements.txt`), Rust (`Cargo.toml`), Go (`go.mod`), Docker.
  - Classification engine: Project kind (`cli`, `web`, `api`, `library`, `ml`, `monorepo`, `unknown`) and maturity stage (`idea`, `prototype`, `usable`, `released`, `maintained`).
- **Acceptance Criteria:** Tests pass across 6 fixtures (empty, Node CLI, Python, Web app, monorepo, hostile path-traversal). Zero file modifications.

### Phase 2: Evidence Ledger & Claim Engine (`core/evidence`)
- **Goal:** Deterministic extraction of factual evidence and claim verification.
- **Deliverables:**
  - Fact extractor for scripts, entrypoints, routes, dependencies, licenses, existing docs.
  - Claim classifier binding each statement to observed evidence:
    - `verified`: Directly proven by observed file structure or test outputs.
    - `conditional`: Script or route exists in manifest/code but has not been executed.
    - `unknown`: No supporting evidence; flagged for omission.
    - `contradicted`: Disproven by codebase (e.g. claiming `npm start` when no such script exists).
- **Acceptance Criteria:** Deterministic evidence mapping; hostile README text treated as untrusted data; unit tests verifying all claim states.

### Phase 3: Stage-Aware Quality Rubric & Audit Engine (`core/audit`)
- **Goal:** Comprehensive, explainable quality auditing across the 6 core categories.
- **Deliverables:**
  - Categorized rules:
    - **Clarity:** Project name, one-line value proposition, target audience, core problem.
    - **First-run Success:** Verifiable install and run commands, prerequisites.
    - **Trust:** Evidence-backed claims, license status, security notices.
    - **Discoverability:** Topics, description, table of contents.
    - **Presentation:** Heading rhythm, alt text on images, clean formatting.
    - **Maintainability:** Contribution docs, changelog, issue templates.
  - Stage-sensitive applicability: Prototype repos are not penalized for missing release notes; CLI tools are marked `N/A` for UI screenshots (no penalty).
  - Diagnostic reporter supporting console table/human format and structured `--json`.
- **Acceptance Criteria:** Audit correctly outputs PASS, WARN, FAIL, N/A, and BLOCK for each fixture without arbitrary scoring anomalies.

### Phase 4: Content Authoring, Presets & Diff Engine (`core/content`, `core/plan`, `core/diff`)
- **Goal:** Evidence-driven README and community doc synthesis, managed section parsing, and unified diff generation.
- **Deliverables:**
  - Presets: `minimal` (essential facts, quickstart, verified scripts), `studio` (spacious narrative, media plans), `maintainer` (contributing, security, architecture).
  - Managed Section AST/parser: `<!-- pomade:start <id> -->` and `<!-- pomade:end <id> -->` with strict parity checking and preservation of surrounding manual text.
  - Non-destructive Unified Diff generator using standard diff formatting.
  - Plan assembly: Generates atomic actions with `beforeHash`, `proposedDiff`, risk ratings, and evidence linkages.
- **Acceptance Criteria:** Pristine idempotency (running plan on a generated README produces zero diff); handwritten text outside markers is preserved byte-for-byte.

### Phase 5: Policy Guards & Atomic Local Apply (`core/policy`, `core/apply`)
- **Goal:** Bulletproof execution of approved plans with cryptographic verification and rollback safety.
- **Deliverables:**
  - Permission guard: Refuses to execute any action without explicit user approval token/flag (`--approved`).
  - Stale Plan guard: Checks current target file hashes against `beforeHash`; aborts immediately with code 3 (`STALE_PLAN`) if an external edit occurred.
  - Atomic writer: Writes to temporary files and swaps atomically; creates backup recovery notes on failure.
  - Dry-run verification: Post-apply audit verifying new state matches expected criteria.
- **Acceptance Criteria:** Unit and integration tests demonstrating rejection without `--approved`, rejection on modified targets, clean atomic writes, and idempotent re-scans.

### Phase 6: Agent Integrations & CLI Polish (`skills/pomade/`, `cli/`)
- **Goal:** Canonical Agent Skill specification and complete CLI command suite.
- **Deliverables:**
  - `skills/pomade/SKILL.md`: Compliant Agent Skills specification with trigger rules, workflow constraints, approval prompts, and style guide.
  - Consumer `AGENTS.md` snippet for projects adopting Pomade.
  - Full CLI implementation:
    - `pomade scan [path] [--json]`
    - `pomade audit [path] [--format text|json]`
    - `pomade plan [path] [--preset minimal|studio|maintainer] [--json]`
    - `pomade diff --plan <path>`
    - `pomade apply --plan <path> --approved`
    - `pomade doctor [path]`
  - Standardized exit codes (0 = success, 1 = audit failure, 2 = bad args, 3 = stale plan, 4 = unapproved, 5 = runtime error, 6 = security block).
- **Acceptance Criteria:** CLI runs smoothly across all fixture scenarios in text and JSON modes; agent skill passes linting and discovery checks.

### Phase 7: Media Pipeline & GitHub Metadata Automation (`adapters/media`, `adapters/github`)
- **Goal:** Truthful media capture plans and opt-in GitHub CLI automation with strict approval barriers.
- **Deliverables:**
  - `adapters/media`: Detects runnable web routes and CLI entrypoints; generates media capture plans with Playwright/VHS instructions; redacts mock credentials.
  - Social preview card generator: 1280×640 PNG renderer adhering to GitHub specifications with manual upload instructions.
  - `adapters/github`: Inspects `gh auth status`, proposes verified description, topics, and homepage updates via `gh repo edit` with separate explicit authorization.
  - Release planner: Semantic versioning suggestions based on conventional commit diffs and draft release notes.
- **Acceptance Criteria:** Strictly refuses fake screenshots; remote commands produce dry-run proposals and require isolated confirmation; no unverified credentials logged.

### Phase 8: Hardened Test Matrix, Packaging & MCP Adapter
- **Goal:** Comprehensive end-to-end fixture validation, MCP server adapter, and clean distribution setup.
- **Deliverables:**
  - Fixture Suite:
    - Fixture A: Empty repository
    - Fixture B: TypeScript CLI tool
    - Fixture C: Python package (`pyproject.toml`)
    - Fixture D: Web application (Next.js / Vite)
    - Fixture E: Mature OSS with handwritten sections
    - Fixture F: Private monorepo with `.env`
    - Fixture G: Malicious repository (prompt injection & symlink traversal)
    - Fixture H: Dirty git working tree
  - MCP Server adapter (`src/mcp/`) exposing read-only and authorized write tools.
  - Clean build packaging (`npm pack` inspection, licensing review, distribution readiness).
- **Acceptance Criteria:** 100% of end-to-end acceptance tests in `docs/TEST-PLAN.md` pass without flakiness or manual intervention.

---

## 5. Security & Safety Invariants

1. **Read-Only Default:** `scan`, `audit`, `plan`, `diff`, and `doctor` will NEVER mutate any file in the workspace or run project scripts.
2. **Explicit Approval Gate:** Local file writes require `--approved` with plan fingerprint matching. Remote actions require separate explicit user confirmation.
3. **No Shell Interpolation:** All Git and subprocess invocations use strict argument arrays (e.g. `execFile('git', ['status', '--porcelain'])`) to eliminate command injection.
4. **Path Traversal Defense:** All paths are normalized and verified to resolve within the target `repoRoot`. Symlinks pointing outside the repository are blocked.
5. **Secret Sanitization:** File scanners explicitly bypass `.env*`, `*.pem`, `id_rsa`, credentials, and tokens. Output logs and diffs never expose secret patterns.
6. **Untrusted Data Isolation:** Prompts or instructions found in repository files are treated strictly as data payloads and never executed as agent directives.

---

## 6. Verification and Exit Strategy

Every phase requires:
1. Automated unit/integration tests written with Vitest.
2. Zero typecheck errors (`tsc --noEmit`).
3. Verification on fixture repositories.
4. An updated `PROGRESS.md` reflecting real accomplishments, test metrics, and known limitations.
5. Explicit human review and approval before beginning subsequent phases.
