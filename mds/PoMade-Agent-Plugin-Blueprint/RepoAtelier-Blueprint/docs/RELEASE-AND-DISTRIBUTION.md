# Plugin release and distribution

## Packaging decision

Package a TS CLI (likely npm) containing executable commands and `skills/repo-atelier/SKILL.md`. Keep core independent from host adapters. Publish native plugins only after validating their manifests against current host documentation.

## Proposed public release ladder

- `v0.1.0-alpha`: scanner, audit, plan, draft README, approved local patch, basic skill. **No GitHub remote writes.**
- `v0.1.0`: stable local user workflow + fixture tests and no-regression guarantees.
- `v0.2.0`: real optional screenshot pipeline and `gh` metadata edits with separate authorization.
- `v0.3.0`: draft release notes and releases; bounded MCP tools.
- `v1.0.0`: multiple verified native adapters, reliable migration and polished docs, hardened audit.

## Installation (future — do not publish as currently working)

```bash
# Example syntax only after package is actually published:
npm install --global repoatelier
repoatelier doctor
repoatelier scan .
```

Portable skill: copy `skills/repo-atelier/` into a supported agent's skills directory using that agent's official procedure. Do not invent universal install commands.

## Release checklist

- [ ] Name collision and npm/GitHub handle availability checked; license reviewed/selected by owner.
- [ ] Clean install and build from published artifact works, and `--help` is correct.
- [ ] Fixtures, tests, security cases pass and versions are consistent.
- [ ] README examples verified on clean repo with no hidden local state.
- [ ] Dependencies and bundled assets inspected; no credentials or personal data.
- [ ] Changelog reflects shipped changes, breaking changes marked.
- [ ] Signed/verified release process where supported; release notes link to real changes.
- [ ] GitHub release created as draft first, reviewed and published by owner.
- [ ] Compatibility explicitly lists tested OS and tested agent hosts.

## Contributions

For the plugin's own repo, include genuine `CONTRIBUTING`, `CODE_OF_CONDUCT`, `SECURITY`, test documentation and issue templates. Do not add fake links or security contact addresses. A GitHub Action can later monitor drift through PRs, not surprise commits.
