# Keep presentation in the push workflow

PoMade has two entry points: a portable coding-agent skill for the initial review and a GitHub Action for maintenance after pushes.

## Install from source

```bash
git clone https://github.com/Gurtejhundal/PoMade.git
cd PoMade
npm ci
npm run build
npm link
```

Development and the GitHub Action use Node.js 22 or newer. The CLI runtime remains compatible with Node.js 18 or newer; the website build requires Node.js 20.9 or newer.

Inside your target repository:

```bash
pomade init --preset signature --approved
pomade diff
pomade plan --output /tmp/pomade-plan.json
pomade apply --plan /tmp/pomade-plan.json --approved
```

`init` previews unless `--approved` is supplied. It never overwrites an existing config or workflow. The first apply can adopt an unmarked README; review that replacement carefully. Automatic `sync` refuses an existing unmarked README and malformed markers. Only generated sections are maintained after adoption.

Commit README, `.pomade.json`, the workflow, and referenced media with your code. Do not commit saved plan artifacts. The sample workflow targets `main`; adjust it for your default branch. Pin `Gurtejhundal/PoMade@main` to a reviewed commit SHA before using it in another project.

## Configuration

See the actual [PoMade configuration](../.pomade.json) for a working example. Styles are `minimal` (Simple), `signature`, and `animated` (Motion). Legacy `studio` and `maintainer` CLI presets map to Signature.

Optional fields: `name`, `tagline`, `description`, `topics`, `homepage`, `features`, `installCommand`, `runCommand`, `testCommand`, `logo`, `screenshot`, `demo`, `demoPoster`.

- Commands are documentation, never automatically executed by the generator.
- Media must be existing relative repository paths. Commit the files yourself; PoMade does not invent screenshots or recordings.
- Owner-supplied feature descriptions require review. The scanner does not semantically prove arbitrary prose.
- Missing product media is omitted. Motion creates an identity cover and static alternative at `docs/media/pomade-motion.svg` and `docs/media/pomade-static.svg`.
- Existing manual topics are preserved when proposed topics are added. GitHub permits up to 20 topics; conflicts beyond that stop metadata sync.

## GitHub permissions

The workflow requires `contents: write` for normal generated-file commits. It commits only README and PoMade's two cover assets, then performs a normal `git push`; it never force-pushes. Concurrent pushes can reject the bot commit. Re-run the workflow after resolving the competing update. Branch protection may require adapting this to your repository's pull-request process.

About/topics are separate GitHub settings. To synchronize them automatically, save a fine-grained token as **POMADE_TOKEN**, limited to this repository with **Administration: write**. Pass it as the action's `metadata-token`. Without this secret, README/cover maintenance still runs and an Actions notice explains that metadata sync was skipped.

Manual equivalent:

```bash
pomade sync --approved --approved-remote
```

The CLI uses `GH_TOKEN` or `GITHUB_TOKEN` when supplied, with `gh` authentication as a local fallback. Never put tokens in `.pomade.json`, README, media, or workflow source. Metadata requests are bounded by timeouts. Failed metadata sync is reported as a failure; local and remote changes are separate operations and are not a distributed transaction.

## Coding-agent plugin

A standard Claude Code manifest lives in `.claude-plugin/plugin.json` and the portable skill is in `skills/pomade/SKILL.md`. For a local Claude Code session:

```bash
claude --plugin-dir /absolute/path/to/PoMade
```

Other agents that support portable `SKILL.md` directories can install `skills/pomade` using their own skill installer. The push behavior comes from GitHub Actions; loading the skill alone does not install a Git hook or change repository settings.

## Releases and captures

Releases remain an explicit owner publishing operation. PoMade drafts release notes and version suggestions; it never creates fictitious versions or assets.

PoMade's checked-in site preview is a real local browser capture. The CLI GIF is typeset playback of actual captured CLI stdout, not a screen recording. An animation and still image are linked separately so the documentation remains usable without motion.
