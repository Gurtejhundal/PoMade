# RepoAtelier — Agent Plugin Blueprint

> **Make every repo worth opening.**

**Status:** Build specification, not a working plugin. **Date:** 2026-11-12. **Working brand:** RepoAtelier (name and package availability must be checked before launch).

RepoAtelier is a local-first, evidence-based repository presentation and maintenance layer for AI coding agents. It helps teams go from a bare Git directory to an honest, useful and beautifully presented GitHub project—and keeps that presentation synchronized with the code.

It is **not** a README template website, a fake popularity generator, a replacement for testing, or a service that silently pushes changes. The thesis is **documentation as a maintained projection of working software**.

## Use these files

1. Read [START_HERE.md](START_HERE.md) for the shortest build path and explicit v0.1 scope.
2. Give the implementation agent [prompts/BUILD-AGENT-PROMPT.md](prompts/BUILD-AGENT-PROMPT.md) and instruct it to follow [AGENTS.md](AGENTS.md).
3. Read [PRODUCT.md](PRODUCT.md), [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), and [docs/CLI-AND-MCP.md](docs/CLI-AND-MCP.md) before choosing dependencies.
4. Test against [docs/TEST-PLAN.md](docs/TEST-PLAN.md) and [examples/ACCEPTANCE-SCENARIOS.md](examples/ACCEPTANCE-SCENARIOS.md).
5. Check [docs/SOURCES.md](docs/SOURCES.md) for authoritative references and prior art.

## Intended user journey

```text
new Git repo   -> scan evidence -> choose small preset -> plan -> preview diffs -> approve apply
feature merged -> detect meaningful change -> suggest docs/media refresh -> review
release ready  -> confirm tests/version -> draft notes & assets -> approve remote release
```

## v0.1 deliverables

- Portable `skills/repo-atelier/SKILL.md` that guides an agent without new infrastructure.
- Local CLI for `scan`, `plan`, `diff`, `apply`, `audit`, and `doctor` (implemented in code later).
- Evidence-backed README generation plus stage-appropriate community-document drafts.
- Per-change reports with citations to local paths, trust levels and explicit proposed writes.
- Default read-only planning; local writes only on approval; GitHub remote writes deferred.

**Do not claim a feature exists until the test suite demonstrates it.** This archive specifies what to build; it does not contain implementation code.

## Design principles

**Evidence > adjectives.** **Useful demos > decorative animation.** **Stage-appropriate > giant boilerplate.** **Diff-first > surprise writes.** **Tasteful > noisy.** **Progressive adoption > complex first-run configuration.**
