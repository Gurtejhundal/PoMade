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
- **`minimal` (default):** Clean, fast scan. Concise bullets, 1 verified quickstart command block, 0–3 badges. Ideal for CLI tools, early prototypes, and utilities.
- **`studio`:** Visual presentation. Hero structure, spacious layout, architecture diagram, use cases. Ideal for web apps and flagship projects.
- **`maintainer`:** Complete OSS hygiene. Contributing guide, security policies, test commands, release status. Ideal for active public open-source repositories.

## 4. Markdown Hygiene
- Use GitHub Flavored Markdown (GFM).
- Code blocks must declare language syntax (`bash`, `typescript`, `python`, `mermaid`).
- Alt text must describe the content of the image for screen readers.
- Never commit broken relative links or dead demo URLs.
