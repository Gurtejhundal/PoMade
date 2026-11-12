# Repository presentation quality rubric

Do not promise to reproduce '100k-star repo features'. A good presentation depends on the project's actual stage and audience.

## Categories (weighted examples)

| Category | Example weight | What to evaluate |
| --- | ---: | --- |
| Clarity | 25 | precise one-liner, why project exists, audience, recognizable outcome |
| First-run success | 25 | verified setup, compatible prerequisites, fast hello-world, useful examples |
| Trust | 20 | claims backed by evidence, honest status, correct license, security and working links |
| Discoverability | 10 | relevant title/description/topics/homepage and approachable TOC |
| Presentation | 10 | readable hierarchy, useful screenshots, alt text, restrained badges, appropriate style |
| Maintainability | 10 | changes reflected in docs, contribution guidance, releases only when relevant |

**The numbers are example weights, not scientific ratings.** Report categories separately, with applicability and explanation; don't reduce quality to a single mysterious score. Avoid rewarding files that contain placeholders.

## Maturity-aware expectations

| Stage | Must have | Optional | Avoid |
| --- | --- | --- | --- |
| Idea/empty | purpose, honest status, next step | roadmap | fake screenshots, released badges |
| Prototype | succinct intro, current setup, limitations | real demo capture | mature-community templates |
| Usable | install, use, examples, real visuals if UI | contribution/security docs | impossible compatibility claims |
| Released | version, changelog, test/install evidence | release notes, CI badges | unsupported perf claims |
| Maintained OSS | contribution/security policies, issue templates, release hygiene | sponsorship, advanced docs | adding clutter with no reader value |

## Finding examples

**P0** README says `npm start` but no corresponding script exists; leaked access token appears in GIF; LICENSE contradicts README claim.
**P1** no working quickstart; install command fails; dead demo link; image doesn't show current product.
**P2** missing one-line description, poor heading order, stale version line, weak alt text.
**P3** small optional polish: image spacing, table-of-contents usefulness, badge style.

## Badges

Display only meaningful facts: actual CI status, real published release/version, supported package registry, real license, valid documentation link. Limit badge count in `minimal` preset. Never fabricate stars, downloads, coverage percentages or 'production ready' status.

## Output format

```text
Presentation: 7/10  (illustrative only)
Trust: pass (claims backed by evidence)
First-run: fail (README command missing)
Media: N/A (CLI library)
Top action: replace invalid install command with verified script
Applied: no (preview only)
```

Always include a short reason, evidence location, feasibility, risk and next action. Present `N/A` instead of unfairly punishing a library that has no GUI.
