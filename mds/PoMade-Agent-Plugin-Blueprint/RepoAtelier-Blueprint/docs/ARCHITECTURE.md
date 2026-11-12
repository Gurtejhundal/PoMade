# Architecture — portable core + thin adapters

## Core idea

```text
Host agent (Claude/Codex/Copilot/Gemini/etc)
      |            CLI user
      v               |
Portable SKILL.md     |
      |               v
      +----------> CLI commands <------------ optional MCP server (v0.2)
                       |
                Application service
                       |
       +---------------+---------------------+
       |               |                     |
  Scanner/Verifier   Planner/Differ       Policy Engine
       |               |                     |
  git + files     Markdown/templates      Permissions
       |               |                     |
       +------------ local filesystem -------+
                             |
                    Remote GH adapter (later, opt-in)
```

## Proposed implementation structure (future code, not included in this archive)

```text
src/
  cli/            command parsing, interactive approvals, console formatting
  core/
    scan/         repo discovery, manifest and Git inspection
    evidence/     evidence ledger, claim binding, confidence
    audit/        applicability-aware rules, severity, scoring
    plan/         action graph, dependencies, diffs, conflict detection
    content/      README sections, docs templates, style policies
    policy/       approval guards, safe file access, allowlist
  adapters/
    filesystem/   bounded reads and atomic writes
    git/          read-only Git subprocesses
    github/       opt-in GitHub CLI or Octokit adapter
    media/        optional browser and terminal recorders
    llm/          optional providers, never a hard dependency
  mcp/            optional separate package; core APIs only
skills/repo-atelier/SKILL.md
fixtures/          empty, cli, python, web, api, monorepo, private
```

## Important typed contracts

`RepositorySnapshot`:
- `repoRoot`, `gitState` (branch, clean/dirty, tracked files), `remote` (optional, sanitized)
- `kind`, `stage`, `frameworks`, `manifestFacts`, `docs`, `tests`, `assets`
- `ignoredPaths`, `warnings`, `snapshotFingerprint` (no secret content)

`Evidence`:
- `id`, `kind` (`file`, `manifest`, `command-result`, `git`, `user-supplied`)
- `pathOrCommand`, `location` (line/range where possible), `observedValue`
- `timestamp`, `confidence`, `sensitivity`, `hash` or fingerprint

`Claim`:
- `text`, `evidenceIds[]`, `verificationStatus` (`verified`, `conditional`, `unknown`, `contradicted`)
- `lastChecked`, `userAttestation` (optional)

`Finding`:
- `ruleId`, `status` (`pass`, `warn`, `fail`, `not-applicable`, `blocked`)
- `severity`, `reason`, `evidenceIds[]`, `suggestedActionIds[]`

`Plan`:
- `planId`, `baseSnapshotFingerprint`, `createdAt`, `actions[]`, `warnings[]`
- every `Action`: `target`, `actionKind`, `beforeHash`, `proposedDiff`, `reason`, `evidenceIds[]`, `permissionLevel`, `risk`, `rollbackNote`
- `Action` types include `write-local`, `generate-media`, `update-remote-metadata`, `draft-release`, `publish-release`; do not mix levels implicitly.

## State machine

1. `SCANNED`: all reads safe, evidence ledger created.
2. `PLANNED`: proposal and impacts assembled; no project writes.
3. `PREVIEWED`: unified diff, list of conflicts and remote side effects.
4. `APPROVED`: exact plan ID / targets approved by user.
5. `APPLIED`: atomic expected writes succeeded; failure leaves recovery instructions.
6. `VERIFIED`: rerun audit + diff, report unfinished work honestly.

Re-scan before applying. If source snapshot or target file hash changed, abort or re-plan; never blindly apply a stale proposal.

## Core invariants

- Read-only commands do not change tracked/untracked project files.
- The same snapshot, preferences and tool versions yield the same deterministic plan.
- Permission requirements are checked in core application service, not only at CLI/UI.
- Agents receive bounded evidence and cannot directly bypass write guards.
- Model-written copy is marked as a **proposal** until claims are verified.
- No hard dependency on network, OAuth, LLM API, browser or image generator in v0.1.
