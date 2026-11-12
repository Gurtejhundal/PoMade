# Primary sources and useful tools

Research checked on **2026-11-12**. Links are references, not endorsements or implementation dependencies. Verify current docs before implementing API calls and installation instructions.

## Standards and official docs

- Agent Skills specification: https://agentskills.io/specification — required `SKILL.md` YAML frontmatter and directory convention.
- Model Context Protocol tools spec: https://modelcontextprotocol.io/specification/2026-07-28/server/tools — tool discovery, JSON schema and human confirmation expectations.
- GitHub repository customization: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository — README, social card, topics, license.
- GitHub community standards: https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/about-community-profiles-for-public-repositories — community profile checklist.
- GitHub releases: https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases — tags and release basics.
- GitHub release management: https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository — draft/publish behavior.
- GitHub social preview instructions: https://docs.github.com/en/enterprise-cloud@latest/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/customizing-your-repositorys-social-media-preview — Settings UI, 1280×640 recommendation, under 1 MB.
- GitHub accessibility motion settings: https://docs.github.com/en/account-and-profile/how-tos/account-settings/managing-accessibility-settings — GIF autoplay can be disabled.
- GitHub REST repository update: https://docs.github.com/en/rest/repos/repos — `PATCH` metadata and auth requirements.
- GitHub CLI repo edit: https://cli.github.com/manual/gh_repo_edit — topics, description, homepage.
- GitHub CLI release: https://cli.github.com/manual/gh_release_create — supported draft creation and flags.

## Existing products and agent projects

- Ponytail agent plugin: https://github.com/DietrichGebert/ponytail
- ReadmeAI: https://github.com/eli64s/readme-ai
- README Auto Update: https://github.com/wuisabel-gif/readme-auto-update
- RepoPolish: https://www.repopolish.com/
- Render Visuals Skill: https://github.com/imshaikot/render-visual-skill
- Codeshot Skill: https://github.com/cryxnet/codeshot-skill
- GitLike name collision: https://gitlike.dev/agents
- RepoLoom collision: https://repoloom.com/
- GitGleam collision: https://github.com/imthatdev/GitGleam

## Optional technical tools (evaluate, don't install automatically)

- Playwright: https://playwright.dev/ — real browser screenshots and automation.
- FFmpeg: https://ffmpeg.org/ — media transcoding and GIFs.
- VHS: https://github.com/charmbracelet/vhs — terminal GIF recording.
- asciinema: https://asciinema.org/ — terminal sessions.
- GitHub CLI: https://cli.github.com/ — authenticated metadata/releases.
- Octokit: https://github.com/octokit/octokit.js — GitHub REST/GraphQL integration.
- markdownlint: https://github.com/DavidAnson/markdownlint — Markdown linting.
- lychee: https://github.com/lycheeverse/lychee — link checker.
- Gitleaks: https://github.com/gitleaks/gitleaks — secret scanning.
- Release Please: https://github.com/googleapis/release-please — compare for release automation; do not copy blindly.

## Evidence caveats

Competitor features and API surfaces can change; don't hard-code dates, install commands or stars. Name availability requires dedicated GitHub, npm, domain and trademark searches before public launch. This archive contains neither shipped source code nor legal advice.
