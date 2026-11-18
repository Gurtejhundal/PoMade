# Repository presentation research

Reviewed 18 November 2026. Public GitHub pages and default-branch README sources were inspected. Star counts below are approximate observations from those pages, not claims that presentation caused popularity. Screenshots supplied in the request are visual references, not evidence that PoMade has those stars, releases, or benchmarks.

| Reference | Observed stars | Useful design language | Applied to PoMade |
| --- | ---: | --- | --- |
| [Ponytail](https://github.com/DietrichGebert/ponytail) · [README source](https://raw.githubusercontent.com/DietrichGebert/ponytail/main/README.md) | 193k | Recognizable character, centered identity, compact release/package badges, a memorable line, immediate install path. | Signature's identity and concise pitch. Keep PoMade's own mascot; do not copy Ponytail's artwork or language. |
| [Ollama](https://github.com/ollama/ollama) · [README source](https://raw.githubusercontent.com/ollama/ollama/main/README.md) | 187k | Small logo, direct explanation, platform-specific setup and concrete examples before deeper reference material. | Simple's restrained structure and early first working command. |
| [VS Code](https://github.com/microsoft/vscode) · [README source](https://raw.githubusercontent.com/microsoft/vscode/main/README.md) | 196k | Real product capture, explicit distinction between source and distributed product, useful development and contribution links. | Actual screenshot slot; separate source installation from unverified package publication. |
| [FastAPI](https://github.com/fastapi/fastapi) · [README source](https://raw.githubusercontent.com/fastapi/fastapi/master/README.md) | 105k | Strong identity, status badges linked to their sources, early documentation links, concrete installation and executable examples. | Signature's compact navigation and useful badge hierarchy. |
| [Deno](https://github.com/denoland/deno) · [README source](https://raw.githubusercontent.com/denoland/deno/main/README.md) | 109k | Mascot as an accent, plain explanation, specific prerequisites, setup, contribution links. | Identity supports the text; it does not consume the entire first screen. |
| [yt-dlp](https://github.com/yt-dlp/yt-dlp) · [README source](https://raw.githubusercontent.com/yt-dlp/yt-dlp/master/README.md) | 209k | Branded opening, release information, extensive anchored navigation, detailed options/reference sections. | Keep long detail navigable. Releases are data, not decorative fabricated counters. |

Bun and Animate.css were also inspected, but the observed pages were below 100k stars (about 97k and 83k), so they are not counted in the requested 100k+ sample.

## Findings

Large repositories do not share one visual skin. They share an information order: identity → useful summary → first run → proof/example → reference → contribution/license. The strongest one-liners describe the result or impose a memorable point of view. Badges answer questions and link to real sources. The About sidebar is a separate GitHub API surface, not a README section.

Animation is optional. Most of this sample communicates well with static content. Motion in PoMade is an authored alternative, not a claim that animation is responsible for stars. It uses self-contained repository SVGs, a finite animation, a reduced-motion rule, and a direct static-cover link. Real GIF recordings can be included separately. GitHub Markdown cannot run website JavaScript or arbitrary CSS; do not export those as a supposed animated README.

## The three templates

1. **Simple (`minimal`)** — left-aligned title, short pitch, setup, capabilities, usage, license. No decorative product capture.
2. **Signature (`signature`)** — centered logo/name/one-liner, a few sourced badges, quick navigation, real screenshot, setup, useful feature descriptions, optional manifest map.
3. **Motion (`animated`)** — Signature plus an animated identity cover, static alternative, real demo GIF or screenshot, and the same readable documentation.

One pure renderer supplies the CLI and Studio Markdown. The website uses a warm paper/copper/sage palette, a standalone README document, a large centered mascot, title divider, italic one-liner, flat status/resource badges, compact code fences, and document sections. There is no repository navigation, branch selector, file browser, or About sidebar. It keeps Templates, Studio, Workflow, and Docs as distinct routes.

## Content boundaries

- Never invent performance percentages, passing CI, stars, release counts, package publication, prebuilt binaries, testimonials, or API signatures.
- A declared dependency proves only that the dependency is configured.
- A test script proves only that a command is configured.
- Owner-provided descriptions and feature claims require human review; PoMade cannot certify arbitrary prose.
- Capture the actual product. A generated banner is labeled as a cover, not a screenshot.

## Website direction confirmed

The website is the rendered README document itself, not a simulation of GitHub repository chrome. The opening follows the owner-provided reference: large mascot, centered project name, title rule, italic one-liner, inline links, and flat badges. Status, animated output, installation, templates, contribution, license, and live-data Star History are normal Markdown-like sections. PoMade starts with its own actual star count; no growth curve is invented.
