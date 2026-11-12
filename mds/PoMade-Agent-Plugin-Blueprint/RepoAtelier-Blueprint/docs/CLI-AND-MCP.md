# Interface contract — CLI first, optional MCP later

**Everything below is proposed API, not an existing executable.** Implement and test CLI first. Version command contracts when released.

## CLI

| Command | Effect | Writes? |
| --- | --- | --- |
| `repoatelier scan [path] --json` | repository facts/evidence | no |
| `repoatelier audit [path] --format text|json` | categorized findings | no |
| `repoatelier plan [path] --preset minimal|studio|maintainer` | proposed action plan with file patches | no project writes |
| `repoatelier diff --plan <path>` | show changes and conflicts | no |
| `repoatelier apply --plan <path> --approved` | apply approved local plan, verify fingerprints | local, explicit |
| `repoatelier doctor [path]` | check git/gh/node/media dependencies | no |
| `repoatelier media plan [path]` | propose real capture steps | no |
| `repoatelier media capture ...` | optional real capture | only after explicit code-exec/media authorization |
| `repoatelier github plan ...` | propose about/topics/homepage edits | no |
| `repoatelier github apply --approved ...` | remote metadata edit | explicit remote approval, later |
| `repoatelier release plan --version ...` | draft notes/version analysis | no |
| `repoatelier release draft --approved ...` | draft GitHub release | explicit remote approval, later |

**Plan artifact:** local `.repoatelier/plans/<id>.json` *only if user opts to save plans*; otherwise print to stdout / temporary cache outside repository. To satisfy read-only guarantees, commands cannot create repo files implicitly. `plan --output <file>` is explicitly a write to the requested destination, announced beforehand.

## Exit codes

- `0`: completed successfully.
- `1`: known finding/quality gate failed for check mode.
- `2`: invalid arguments/config.
- `3`: conflict/stale plan.
- `4`: authorization refused.
- `5`: runtime/dependency/network failure.
- `6`: safety policy blocked operation.

Machine output `--json` should include schema version, kind, time, snapshot fingerprint, warnings, errors and structured result; never include secrets.

## MCP tool proposal (later)

Read-only tools:
- `repo_scan({path})`
- `repo_audit({path, preset?})`
- `repo_plan({path, preset?, style?})`
- `repo_preview({plan_id})`
- `repo_media_plan({path, target?})`

High-risk tools:
- `repo_apply({plan_id, approval_token})`
- `repo_github_update({plan_id, approval_token})`
- `repo_release_draft({plan_id, approval_token})`

**Avoid** exposing a broad `run_shell` or `write_any_file` tool. A model calling an MCP tool does not equal human approval; the host UI and server must both enforce authorization. Use schema-validated inputs and limited workspace roots.

## Data contract example (illustrative)

```json
{
  "schemaVersion": "0.1",
  "planId": "plan-7b1",
  "repoRoot": "/workspace/example",
  "preset": "minimal",
  "actions": [
    {
      "id": "a1",
      "kind": "write-local",
      "target": "README.md",
      "permission": "local-write",
      "risk": "low",
      "evidenceIds": ["manifest:package-json:scripts.dev"],
      "beforeHash": "...",
      "proposedDiff": "..."
    }
  ],
  "warnings": ["Install command found in manifest but not executed"]
}
```

## Design rule

Agent entrypoints are *adapters*, not separate intelligence stacks. The CLI schema, quality rules and permissions stay identical whether invoked by a human, a skill, or an MCP client.
