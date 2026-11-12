# Media pipeline — real screenshots, useful motion

## Goal

Show actual software. Visuals are evidence, not decoration. RepoAtelier never fabricates an app screenshot, generates a fake UI to imply features exist, or uses random stock pictures as product proof.

## Supported capture paths (planned, optional)

| Project | Capture source | Best output |
| --- | --- | --- |
| Web app | Playwright on a live local dev/test server | PNG screenshot, 4–8 sec GIF/video of one real action |
| Terminal tool | actual stdout + optional VHS/asciinema script | readable static terminal capture or short GIF |
| API/service | actual request and response captured after test server starts | code block/sequence diagram, not fake UI |
| Library | real usage snippet and verified output | text/code example; image optional |
| Mobile/native app | owner-supplied captures or supported emulator | verified screenshots; avoid claiming automatic support prematurely |

## Capture stages

1. Identify one high-value user journey, not ten arbitrary effects.
2. Ensure executable app exists and developer explicitly approves running it.
3. Create privacy-safe local fixture data. Never use production credentials.
4. Capture route/window at stable viewport and consistent theme.
5. If GIF requested, record a genuine meaningful interaction at consistent FPS; keep it short and compressed.
6. Inspect media visually or through supported comparison tools to confirm it shows what its caption claims.
7. Redact secrets and PII *before* saving; review residual metadata and accidental private paths.
8. Save in a predictable location such as `docs/media/`, with short descriptive name.
9. Save provenance report outside publication assets: source commit, capture date, command, viewport, route, redactions.
10. Link from README only when useful; include static fallback for users who disable motion.

## Capture limitations

- GitHub renders Markdown, images and supported GIFs, but a README does not become a running web app.
- GitHub's accessibility preferences can stop GIF autoplay; don't make meaning depend only on animation.
- GitHub social preview image upload is documented in the repository Settings UI. Rendering one does not guarantee API-based upload automation.
- Capturing an app may require installing dependencies, access to a running server, a demo account, or browser binaries. Treat all as opt-in and fail gracefully.

## Optional processing tools to evaluate

Playwright for real web flows; FFmpeg for compression/format conversion; VHS or asciinema for terminal sessions; SVG/Canvas or a simple renderer for preview cards. Avoid requiring all at installation time.

## Media acceptance checklist

- [ ] Actual code and feature shown (or explicitly labeled conceptual if visual is purely decorative).
- [ ] No private data, secret, customer identity or credential.
- [ ] Alt text and static equivalent available.
- [ ] Readable in GitHub light and dark modes.
- [ ] Asset loads in a clean repo clone; relative paths work.
- [ ] Reasonable file size and non-distracting length.
- [ ] Source commit, capture context and limitations recorded.
- [ ] License/permission for any third-party font, image or logo is valid.

## Example prompt for capture agent

'Capture one real local app flow: start with approved npm script, open the locally running dashboard, click a real navigation tab, and save an 8-second GIF plus initial PNG. Use fake demo data, redact anything sensitive, validate the resulting images, and show the exact generated files. If the app does not launch, stop; do not generate a speculative UI image.'
