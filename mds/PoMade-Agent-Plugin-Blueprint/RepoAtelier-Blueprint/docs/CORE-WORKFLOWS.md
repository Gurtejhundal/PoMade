# Four workflows users will actually need

## A. Day-one `init`

**Trigger:** first useful commit or user explicitly runs `repoatelier plan`.

1. Scan: identify whether a project exists, what it does, how to run it and what's missing.
2. Ask at most two relevant questions only if inference is unsafe (e.g., intended audience, public/private or license intent). Proceed without optional info.
3. Choose `minimal` by default. Create a compact intro, verifiable quickstart, status and intended use.
4. Propose README, `.gitignore` suggestion, CONTRIBUTING/SUPPORT only when useful. Do not produce 30 empty templates.
5. Show file diffs, unverified claims, and actions that require owner decisions.
6. Apply approved local actions and audit again.

**Empty repository:** write a useful 'what will this be' starter only from developer-provided intent, label unimplemented features as planned, never pretend it works.

## B. New feature `refresh`

**Trigger:** user requests refresh, PR preparation, or a relevant code change is detected.

1. Compare current snapshot to last approved plan/base commit, not every line of code.
2. Detect public interface changes: commands, routes, env setup, screenshots, API parameters, supported platform, significant architecture changes.
3. Identify affected README/manual sections and linked media. Do not rewrite unaffected prose.
4. Propose targeted patch and screenshots that need recapture.
5. Request review, apply approved changes and revalidate.

**Default:** NO automatic commit or push. Recommended Git hook (later) only suggests updates and must never block users without opt-in.

## C. `showcase` media

**Trigger:** user asks for real screenshots/GIF or agent sees a UI and proposes one.

1. Detect app start command from manifest. Present expected command and risks.
2. Require user approval to launch arbitrary project code. Run sandboxed with timeout where possible.
3. Navigate only to local test URL/known safe route. Use seeded demo account/data.
4. Capture real pixels and interactions. Redact tokens, names, addresses and confidential test data.
5. Produce static screenshot and optional short GIF; verify each asset matches the actual feature.
6. Add Markdown with useful alt text and static fallback; keep file sizes reasonable.
7. Record provenance: route, commit, capture date, environment and known limitations.

If app cannot start, do not create an imaginary screenshot. Report the blocker and produce a capture checklist instead.

## D. `release`

**Trigger:** explicit owner instruction only.

1. Inspect last tag, version files, changelog and relevant merged changes.
2. Propose semver change using declared public API evidence. Highlight breaking changes and uncertainty.
3. Confirm validation/test results (do not claim tests passed unless actually run and succeeded).
4. Prepare draft notes with changes users care about and links where available.
5. Optional `gh release create ... --draft` ONLY with separate remote authorization; no published release by default.
6. Wait for human review before publication; never tag an unapproved commit.

## Decision questions

Ask for license choice (never decide automatically), authorization to run code, visibility changes, remote repo creation, release publishing, and whether to replace a user-written document. Small copy and layout preferences can use sane defaults.
