# Pomade Style Guide — Technical Writing Standards

## 1. Opening Promise
Lead with concrete user outcomes:
- **Good:** `Pomade helps AI coding agents maintain truthful, polished GitHub repositories in sync with working code.`
- **Bad:** `A revolutionary AI-driven paradigm that seamlessly unlocks unprecedented repository excellence.`

## 2. Document Hierarchy
- **CLI Tools:** Title/Tagline → Quickstart (verified command) → Usage example → Options → Current limitations → License.
- **Web Applications:** Title/Tagline → UI Screenshot (real capture) → Prerequisites → Local dev setup → Features → License.
- **Libraries & APIs:** Title/Tagline → Code call snippet → Expected output → Installation → API essentials → License.

## 3. Presets
- **`minimal` / Simple:** Clean, fast scan. Concise bullets, a verified quickstart command block, restrained badges. Good for CLI tools, prototypes, and utilities.
- **`signature` / Signature:** Centered identity, concise badges, real product image. Good for a recognizable project with a useful screenshot.
- **`animated` / Motion:** Animated identity cover, real product GIF when available, static alternatives. Distinguish decoration from a recording of the working product.

Ask the user to choose on first use; do not silently pick a preset. Legacy CLI presets `studio` and `maintainer` map to Signature.

## 4. Markdown Hygiene
- Use GitHub Flavored Markdown (GFM).
- Code blocks must declare language syntax (`bash`, `typescript`, `python`, `mermaid`).
- Alt text must describe the content of the image for screen readers.
- Never commit broken relative links or dead demo URLs.
