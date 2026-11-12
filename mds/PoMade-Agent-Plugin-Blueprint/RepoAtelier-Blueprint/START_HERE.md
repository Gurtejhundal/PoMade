# Start here — build order

## Definition of the product

A repo-maintenance plugin for coding agents that prepares and maintains the outward-facing parts of a repository. Start with one command in an existing project; the agent checks what is real, proposes proportional improvements, and asks before writing.

## Fastest feasible implementation

**Language:** TypeScript on Node.js LTS. **CLI framework:** commander or equivalent. **Validation:** Zod or equivalent. **Tests:** Vitest. **Git operations:** invoke git read-only subprocesses with argument arrays (no shell injection); authenticated remote operations later via `gh` CLI or Octokit. **Markdown:** a Markdown AST parser or a carefully bounded managed-section strategy. Do not bring in a database, hosted service, or paid LLM API for v0.1.

Milestones in implementation order:

1. **Repo scanner:** detect Git root, project kind, primary package manifest, commands, tests, license, docs, assets and remote. Output structured evidence.
2. **Rules-only skill:** implement `SKILL.md`; connect agent to CLI output; no fictitious claims.
3. **Quality audit:** useful, explainable, stage-sensitive checklist with `pass/warn/blocked/na` statuses.
4. **Plan and preview:** deterministic proposal, unified diff, safety checks, ignore protected content.
5. **Local apply:** explicit confirmation/flag, only expected files, atomic writes, backup or clean revert strategy.
6. **README authoring:** from evidence, a compelling intro, verified quickstart, a real demo when available, truthful caveats and links.
7. **Media draft:** detect real running UI, propose capture plan and instructions; optional screenshot capture after test URL is available.
8. **Integration tests and packaging:** fixture repos, idempotency, dry-run, Windows/macOS/Linux path tests where practical.

### Deliberately postpone

Full MCP server; native plugin manifests for every agent; GitHub App/OAuth; automatic pushing; release publishing; automated logo generation; multi-theme design editor; website/dashboard; cron jobs; embedding vector store; GitHub social preview uploading via UI automation.

## Example v0.1 UX (proposed, NOT yet implemented)

```bash
repoatelier scan
repoatelier plan --preset minimal
repoatelier diff
repoatelier apply --approved
repoatelier audit
```

Optional agent request: `Use repo-atelier to audit this repo, propose a minimal professional README, show me a diff, and wait for approval before edits.`

## First ten tasks for an implementation agent

- [ ] Create package, typechecking, linting, test runner, executable CLI entrypoint.
- [ ] Implement filesystem + git scanner, excluding vendor directories and secrets.
- [ ] Define `Evidence`, `Claim`, `Finding`, `Action`, `Plan` typed schemas.
- [ ] Write test fixtures for empty, CLI, Python, Node web app, monorepo, private repo.
- [ ] Define deterministic evaluation rules and explainable findings.
- [ ] Create first-run minimal README with verifiable installation commands.
- [ ] Implement local-only plan / unified diff / approved apply.
- [ ] Preserve user-written sections and avoid duplicate sections on reruns.
- [ ] Add security tests for path traversal, secrets, dirty tree and shell injection.
- [ ] Write install/usage docs and run end-to-end fixture demos.

## Hard acceptance bar for v0.1

See `docs/TEST-PLAN.md`. A successful prototype should produce a concise useful README for a real fixture without inventing install commands; refuse publishing, avoid stomping handwritten docs, and leave the repo unchanged in scan/plan/diff mode. It must perform a second run without introducing noise.
