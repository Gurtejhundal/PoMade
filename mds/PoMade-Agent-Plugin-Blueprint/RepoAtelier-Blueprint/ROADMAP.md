# Implementation roadmap — small enough to ship

| Milestone | Deliverable | Exit condition |
| --- | --- | --- |
| M0 — foundation | TS CLI, schemas, fixtures, test/lint pipeline | `scan` works offline on 6 fixture types |
| M1 — trust core | claim evidence, audit and deterministic plan | every proposed factual claim has traceable source |
| M2 — authoring | project-sensitive README, managed sections, concise docs | approved apply; rerun causes no drift |
| M3 — skill | portable `SKILL.md`, commands mapping to CLI | agent follows plan-first approval workflow |
| M4 — visuals | optional real screenshot workflow, useful GIF guidance | no mock or secret; provenance recorded |
| M5 — remote | authenticated gh metadata edit with confirmations | dry-run + approval + rollback/record |
| M6 — releases | safe draft notes + semantic version suggestion | no silent tag/publish, strong verification |
| M7 — integrations | MCP adapter, one native agent plugin | same core behavior and safety gates |
| M8 — distribution | npm package, docs, signed/pinned CI workflow | clean install tested on clean OS |

## v0.1 scope freeze

**Build only M0–M3** plus a small media plan generator. M4–M8 are later. A tool for every agent and a visual editor on day one would increase maintenance and decrease reliability.

## First iteration quality gates

- No lost handwritten content.
- No invented instructions or test status.
- All planned writes listed and reversible.
- Zero network use by default.
- Reference fixtures and golden snapshots reviewed by a human.
- Permission checks centralized.
- Test suite passes on a clean checkout.

## Technical debt to avoid

One-off templates per framework without common schema; reading huge folders unbounded; HTML regex replacing markdown indiscriminately; app-specific logic in MCP handlers; relying on agents to self-police permissions without code gates; requiring an LLM provider for deterministic facts; per-commit README rewrites.

## Expansion criteria

Only ship v0.2 features when v0.1 is installed and used across at least 5 varied real repos, feedback shows recurring needs, and core false-positive/overwrite rates are acceptably low. Capture benchmark baselines rather than inventing improvement percentages.
