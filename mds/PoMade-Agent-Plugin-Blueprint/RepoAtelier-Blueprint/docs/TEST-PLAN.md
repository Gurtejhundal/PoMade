# Verification and test plan

## Core unit tests

- Manifest scanners for Node, Python, Rust, Go and unknown type; ignore `.env`, vendor folders, binaries and oversize files.
- Evidence classifier: scripts in manifest are `conditional`, observed successful commands are `verified`; README-only assertions do not become truth.
- Stage classification: empty/prototype/usable/released/maintained, with `unknown` fallback.
- Rubric applicability: no screenshot penalty for CLI; no release penalty for prototype.
- Markdown managed markers: balanced, duplicated, absent, reordered, nested and malicious content.
- Paths: unicode, spaces, symlinks, `../`, absolute path, Windows separators, case sensitivity.
- Determinism: identical input yields identical plan ignoring generated timestamps/IDs.
- Approval gate: attempts to write without approved plan always fail.
- Conflict detection: edited file after plan causes abort; no content loss.
- Fake data: claims with no evidence are removed/flagged, no '99%' without real metrics.

## Integration tests

**Fixture A: empty repo.** Proposes honest purpose/status using provided user intent; never claims install works.

**Fixture B: TypeScript CLI.** Detects correct `package.json` script and docs; missing script results in warning, not invented command.

**Fixture C: Python package.** Derives setup from real `pyproject.toml` and actual entrypoint; avoids Node commands.

**Fixture D: web app.** Finds approved start script and route, proposes screenshot; does not launch app during read-only scan.

**Fixture E: mature OSS.** Preserves handwritten prose and existing docs, only targeted patch.

**Fixture F: private repo.** No network or public output; no remote writes.

**Fixture G: malicious repo.** README contains hostile prompt injection and symlink to home; both ignored/blocked.

**Fixture H: dirty working tree.** Plan preview okay; overlapping file write denied until replan/approval.

## End-to-end acceptance

1. `scan`, `audit`, `plan`, `diff` do not create/alter any file inside target repo (assert tracked and untracked hashes/list).
2. `apply` refuses without approval and only writes planned in-repo allowlisted targets.
3. Every factual claim in README has a record showing evidence or explicit conditional wording.
4. Run same plan twice: second run produces no additional content, duplicate markers, or formatting churn.
5. Existing manual sections are unchanged unless exact replacement specifically approved.
6. No secrets in generated README, report, media or logs.
7. Error paths provide recovery steps, not misleading success reports.
8. Missing network, git, gh, browser or model does not break offline auditing.
9. CLI `--json` is valid and versioned; exit codes adhere to contract.
10. Published installation instructions are tested from a clean workspace and OS image.

## Human evaluation rubric

Blind-compare 5 real repos against their unmodified README and at least one existing README generator. Ask independent readers to find: what it does (10s), get-started command (60s), one limitation, and a real demo if applicable. Record error rate and preference; don't cherry-pick screenshots.

## Automated CI

Run format/lint/typecheck, unit/integration tests, secret scan and dependency audit where feasible. Keep fixture snapshots reviewable. For release, build package from clean checkout and verify packed files contain SKILL, docs and executable entries. Don't report CI status unless it actually ran.
