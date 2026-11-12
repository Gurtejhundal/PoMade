# Agent integration strategy — don't build seven plugins at once

## Layer 1: Agent Skills standard (v0.1)

Create `skills/repo-atelier/SKILL.md` with compliant YAML metadata. It is the canonical cross-agent behavior contract: triggers, workflow, approval rules, evidence checks, tool use. This is the easiest path to give agents consistent instructions, but **instruction-only does not guarantee enforcement**. All destructive protections must be implemented in the CLI core.

## Layer 2: Repo-local `AGENTS.md` and native instruction files

For consumers of RepoAtelier, generate a small opt-in snippet **only** after reviewing existing instructions. Do not replace a project's AGENTS.md with the implementer-specific AGENTS.md in this blueprint. The consumer instruction should invoke RepoAtelier only for explicit repo setup, README, docs, release, or presentation tasks; never hijack all coding turns.

Proposed consumer snippet:

```markdown
## Repository presentation
When asked to polish README, set up repo metadata, capture real demos or prepare releases, use the `repo-atelier` skill. Scan and plan first; show evidence, proposed diffs and warnings. Ask for approval before any local writes or GitHub changes. Never invent implemented features or metrics.
```

## Layer 3: Native plugins (v0.2+)

Add tested adapters separately for Claude Code, Codex, Gemini CLI, Cursor, GitHub Copilot, OpenCode, etc. Each host has different extension formats, triggers, slash commands, hook capabilities and trust dialogs. Verify each host's latest docs; never claim install support merely because a directory was created.

Potential commands/messages:
- `/repoatelier-init` — day-one minimal setup.
- `/repoatelier-audit` — findings and actionable plans.
- `/repoatelier-refresh` — drift after meaningful changes.
- `/repoatelier-showcase` — media plan / approved capture.
- `/repoatelier-release` — prepare version, notes, draft.

These may be implemented as agent skills or namespaced commands depending on host conventions. Do not promise identical slash syntax everywhere.

## Layer 4: MCP (v0.2+)

Expose narrow read-only and authorized write tools with JSON schema, workspace allowlists, clear provenance and explicit host confirmation. See `docs/CLI-AND-MCP.md` and MCP spec. An MCP server gives tool access; it is not a substitute for the SKILL's style and judgment instructions.

## What to test per host

- Discovery: does host load the skill/instructions?
- Invocation: are command paths supported and stable?
- Security: can agent bypass CLI write approval? (must be no)
- UX: no unexpected prompt spam, no automatic hook installation.
- Output consistency: same snapshot produces same evidence and plan.
- Failure behavior: correct messaging if CLI, browser, git or auth unavailable.

## Ship priority

Generic skill + CLI -> one popular native plugin -> MCP -> additional adapters. Supporting six agents badly is worse than supporting one core cleanly and giving the rest a portable skill.
