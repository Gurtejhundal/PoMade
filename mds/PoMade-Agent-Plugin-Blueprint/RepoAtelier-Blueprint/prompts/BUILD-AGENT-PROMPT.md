# Paste this into your coding agent to start building RepoAtelier

> **Usage:** Extract this ZIP into a new folder/repository, open the folder in your coding agent, and paste the instructions **below the divider**. The agent should implement source code in that workspace using these Markdown specifications. This ZIP is a design/build package, not an installed plugin.

---

Build **RepoAtelier**, a local-first agent-native plugin that keeps GitHub repositories professionally presented and factually correct from day one. Read all root docs, `docs/ARCHITECTURE.md`, `docs/EVIDENCE-ENGINE.md`, `docs/SECURITY-AND-PERMISSIONS.md`, `docs/CLI-AND-MCP.md`, and `docs/TEST-PLAN.md`. Follow `AGENTS.md`. Treat the existing `skills/repo-atelier/SKILL.md` as the canonical agent behavior specification, adapting it only when code behavior is verified.

**Start with v0.1, not the whole roadmap.** Implement a real TypeScript CLI with `scan`, `audit`, `plan`, `diff`, `apply`, and `doctor`. Use Git and bounded local-file inspection; no cloud dependencies, GitHub writes or model API key. Make the scanner detect Node/Python/CLI/web/API/unknown projects, report evidence and conditional claims, and apply stage-appropriate quality rules. Generate a human-sounding README proposal from verified facts, preserving existing manually written sections. Generate a clear diff with hashes, require explicit approval for local writes, and fail when sources change. Do not create a website or dashboard.

Create tests and fixtures before claiming completion. Test an empty repo, Node CLI, Python project, web app, mature OSS, private repo, hostile prompt-injection README, symlink traversal, dirty Git tree and idempotent rerun. Have scan/plan/diff leave the repo unchanged. Verify every command and expose a structured JSON output. No silent commits, no auto-push, no license selection, no fabricated star/release/test claims, no stock image passed off as actual screenshot.

**Build order:**
1. minimal package + CLI entry + test runner;
2. typed repository snapshot/evidence/finding/plan models;
3. bounded scanner + tests;
4. audit rules + tests;
5. plan + stable diff + content writer;
6. guarded apply + tests;
7. end-to-end fixture demos;
8. documentation and install from clean checkout.

When finished, show:
- Exact implemented commands and changed files.
- Sample audit and before/after README from at least two fixtures.
- Test commands/results.
- Which requirements remain unimplemented and why.
- Your recommendation for the very next milestone.

**Do not ask me to approve every coding step; make practical engineering decisions. But never execute high-risk remote operations or overwrite existing user data without approval.**
