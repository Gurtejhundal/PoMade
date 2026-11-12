# GitHub integration — metadata, community health, releases

## What GitHub actually supports

The GitHub CLI supports editing a repository's description, homepage, and topics (`gh repo edit`) with appropriate auth. GitHub's docs list READMEs, licenses, social previews and topics as repository customization features. Releases are real objects associated with tags. All remote mutations need permission; do not claim the API can do things without verifying it.

## Categories of change

### Local files (v0.1)

`README.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `SUPPORT.md`, `CHANGELOG.md`, `docs/` content, relevant Markdown issue/PR templates. `LICENSE` requires explicit owner choice; do not include a generic placeholder claiming MIT.

### GitHub metadata (v0.2)

- Concise repo description (not a paragraph of hashtags).
- 3–8 relevant topics chosen from actual code and project purpose; existing topics preserved unless user approves replacement.
- Homepage/website URL only if it exists and resolves; never invent.
- Repository social preview: create correctly sized image, then guide user to Settings > Social Preview > Edit/Upload as documented; automatic API upload should be treated as unsupported until verified.

### Releases (v0.3)

- Semver proposal from diff and public API; user can override.
- Draft changelog entries and release notes from merged PR/commit evidence.
- Validate claimed test results, optionally create draft release after approved tag/commit.
- Publish is an additional explicit action; never do it in a maintenance hook.

## Example manual GitHub commands (after explicit approval)

```bash
gh auth status
gh repo edit OWNER/REPO --description 'A verified, concise description'
gh repo edit OWNER/REPO --add-topic documentation --add-topic developer-tools
gh release create v0.1.0 --draft --title 'v0.1.0' --notes-file RELEASE_NOTES.md
```

These are examples, not something v0.1 executes automatically. Reconcile existing topics and tags before changes. Verify current `gh` command flags at implementation time; do not log credentials.

## Community hygiene

Generate files only when appropriate. GitHub's community profile checks for health files, including README, code of conduct, license and contributing guidance. Offer `SECURITY.md` only with real reporting instructions, not a fake email address. Issue templates require proper GitHub placement/frontmatter. Avoid fake contributor names or unmaintained status badges.

## Remotes and permissions

Start `gh repo view` or GitHub API read-only with user-supplied repo identity; cross-check local `origin`. Refuse ambiguity (fork vs upstream, multiple remotes, detached HEAD) before writing. Do not mutate organization repos using a personal-token guess. Create a specific plan diff showing existing vs proposed metadata and request narrow approval.

## Remote operations should return

Operation ID, repository identity, target, previous value, new value, timestamp, API status and recovery guidance. Never claim success from a proposed command alone.

## GitHub Action (later)

Prefer PRs for docs drift over direct push. Use minimal permissions (`contents: read` for checking; `pull-requests: write` only if needed for PR), event restrictions, SHA-pinned third-party actions where practical and no execution of untrusted pull-request code with write credentials.
