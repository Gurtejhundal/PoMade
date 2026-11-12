# Pomade Brand System & Visual Identity

> **"Code is the product. The repository is its first impression. Pomade takes care of that impression."**

---

## 1. Brand Essence & Voice

### 1.1 The Name: Pomade
In traditional grooming, **pomade** is the finishing product that turns unruly hair into a neat, disciplined, slick style. In software engineering, **Pomade** does the exact same thing for GitHub repositories: it takes an unruly codebase with scattered scripts, missing documentation, and absent visual media, and turns it into a disciplined, gleaming, professional repository.

### 1.2 Tagline Hierarchy
- **Primary Tagline:** *Make every repo worth opening.*
- **Personality Hook:** *He doesn't write your code. He makes sure it looks finished.*
- **Functional Description:** *The agent-native repository presentation, packaging, and maintenance engine.*

### 1.3 Character & Tone of Voice
Pomade speaks like a fastidious, experienced principal engineer who cares deeply about repository craftsmanship:
- **Obsessively Polished:** Noticeably attentive to small details: whitespace, badge alignments, clear headings, exact quickstarts.
- **Confident & Dry:** Uses understatement instead of hyperbolic marketing jargon ("game-changing", "10x", "revolutionary").
- **Slightly Judgmental:** Unimpressed by AI agents that churn out 3,000 lines of complex TypeScript but leave behind an empty README with `TODO: write docs`.
- **Developer-Native:** Uses the vernacular of git commits, pull requests, diff hunks, semver, and manifests.
- **Trustworthy:** Projects only verifiable facts; never hallucinates benchmarks, stars, or commands.

---

## 2. Mascot System: "The Perfectionist"

<p align="center">
  <img src="../media/pomade-mascot.png" alt="Pomade Mascot" width="220" />
</p>

### 2.1 Character Anatomy
- **The Hair:** Impeccably slicked-back dark hair pulled into a neat, high-tension ponytail with fine comb ridges.
- **The Expression:** A heavy, skeptical squint over the rims of wire spectacles resting on the bridge of the nose. Tight, unimpressed mouth line.
- **The Texture:** Classic high-contrast woodcut/engraving ink style. Clean vector line-work, cross-hatching, and subtle jawline stubble.
- **Aesthetic Alignment:** Monochrome ink illustration. Timeless, human, opinionated, memorable.

### 2.2 Mascot Behavioral Micro-States
On the website and studio interface, the mascot provides contextual feedback based on repository health:

| State | Trigger | Mascot Behavior / Expression |
| :--- | :--- | :--- |
| **Judging (Default)** | Unfinished repo loaded, low audit score (<50) | The signature squint over his glasses: *"Your agent wrote 4,000 lines of code and left a 3-line README? Really?"* |
| **Puzzled / Unimpressed** | Broken links, missing license, unrunnable script | Single eyebrow arched: *"You claim it runs on port 3000, but there's no dev script in package.json."* |
| **Understated Approval** | Audit score >90, clean diff, zero drift | A subtle, almost imperceptible nod of satisfaction: *"Acceptable. Now it looks like someone actually cares."* |
| **Pragmatic Farewell** | Exporting finished README.md / ZIP | Small cameo stamp at the footer: *"Now push it with pride."* |

### 2.3 Mascot Placement Rules
- **Hero Size:** Maximum 220px $\times$ 220px. Never dominates the entire screen like a billboard; centered with ample breathing room.
- **Studio Avatar:** 40px $\times$ 40px reactive thumbnail in the quality audit status pill.
- **Accessibility:** Always accompanied by descriptive alt text (`alt="Pomade mascot observing repository documentation quality"`).
- **Reduced Motion:** When users prefer reduced motion (`prefers-reduced-motion: reduce`), mascot transitions are immediate with zero bounce or shake.

---

## 3. Color System: Monochrome-First with Warm Amber / Copper

Pomade rejects generic AI gradient meshes (purple $\rightarrow$ cyan) in favor of an **editorial, monochrome-first palette** accented by warm amber/copper tones reminiscent of grooming pomade tins and warm workshop lighting.

### 3.1 Light Mode Palette (Default)

```
[ Canvas: #FBFBF9 ]  [ Surface: #FFFFFF ]  [ Border: #E5E5E2 ]
[ Text Muted: #6E7381 ]  [ Text Main: #111215 ]  [ Accent: #C26526 ]
```

| Token | Hex Value | Semantic Purpose |
| :--- | :--- | :--- |
| `--color-bg-canvas` | `#FBFBF9` | Warm off-white page background |
| `--color-bg-surface` | `#FFFFFF` | Card backgrounds, editor surface, GitHub preview sheet |
| `--color-bg-subtle` | `#F2F2EE` | Code fence backgrounds, table headers, breadcrumb pills |
| `--color-border-subtle` | `#E8E8E4` | Hairline dividers, subtle box borders |
| `--color-border-strong` | `#D1D1CB` | Active inputs, selected template cards |
| `--color-text-primary` | `#111215` | Headings, bold text, high-contrast titles |
| `--color-text-secondary` | `#4B5162` | Body copy, explanations, documentation |
| `--color-text-muted` | `#6E7381` | Metadata, file timestamps, branch labels |
| `--color-accent` | `#C26526` | Warm copper/amber accent for CTAs, active tags, score badges |
| `--color-accent-hover` | `#A6521A` | Darker copper hover state |
| `--color-diff-add-bg` | `#E6F6EC` | Unified diff added line background |
| `--color-diff-add-text` | `#147938` | Unified diff added text |
| `--color-diff-del-bg` | `#FFEBE9` | Unified diff removed line background |
| `--color-diff-del-text` | `#CF222E` | Unified diff removed text |

### 3.2 Dark Mode Palette

```
[ Canvas: #0B0C0E ]  [ Surface: #14161B ]  [ Border: #252830 ]
[ Text Muted: #8B949E ]  [ Text Main: #ECEFF4 ]  [ Accent: #F59E0B ]
```

| Token | Hex Value | Semantic Purpose |
| :--- | :--- | :--- |
| `--color-bg-canvas` | `#0B0C0E` | Deep carbon/obsidian page background |
| `--color-bg-surface` | `#14161B` | Surface panels, editor containers, modals |
| `--color-bg-subtle` | `#1B1E26` | Code fence background, inactive tabs |
| `--color-border-subtle` | `#252830` | Structural borders, subtle dividers |
| `--color-border-strong` | `#383D4A` | Focused inputs, card borders |
| `--color-text-primary` | `#ECEFF4` | Crisp white headings and code |
| `--color-text-secondary` | `#B0B7C3` | Body copy, readable paragraphs |
| `--color-text-muted` | `#8B949E` | Secondary metadata, git status indicators |
| `--color-accent` | `#F59E0B` | Warm golden amber highlight |
| `--color-accent-hover` | `#D97706` | Darker amber hover state |
| `--color-diff-add-bg` | `#12261E` | Unified diff added line background |
| `--color-diff-add-text` | `#3FB950` | Unified diff added text |
| `--color-diff-del-bg` | `#2D161A` | Unified diff removed line background |
| `--color-diff-del-text` | `#F85149` | Unified diff removed text |

### 3.3 Strict Design Prohibitions
- **NO saturated neon gradients:** Zero blue-to-purple, magenta-to-cyan SaaS gradients.
- **NO backdrop glassmorphism clutter:** Card surfaces are solid, opaque, with crisp 1px borders.
- **NO arbitrary rounded corners:** Use consistent 6px (`rounded-md`) for buttons and pills, 8px (`rounded-lg`) for preview cards.

---

## 4. Typography System

The typography pairs an **editorial sans-serif** for literary clarity with a **precision monospace** for code, paths, and developer artifacts.

### 4.1 Font Families
- **Display & Interface:** Modern Grotesk (`Inter`, `Geist Sans`, or system `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`).
- **Code & Monospace:** High-legibility developer mono (`Geist Mono`, `JetBrains Mono`, `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`).

### 4.2 Typographic Hierarchy
| Role | Size | Weight | Line Height | Tracking |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Title** | 44px / 2.75rem | Bold (700) | 1.15 | -0.03em |
| **Section Heading (H2)** | 28px / 1.75rem | SemiBold (600) | 1.25 | -0.02em |
| **Card / Subsection (H3)** | 18px / 1.125rem | SemiBold (600) | 1.35 | -0.01em |
| **Body Text** | 15px / 0.9375rem | Regular (400) | 1.6 | normal |
| **Subtle / Metadata** | 13px / 0.8125rem | Regular / Medium | 1.4 | +0.01em |
| **Monospace / Code** | 13px / 0.8125rem | Regular (400) | 1.5 | normal |

---

## 5. Repository-Inspired UI Design Language

The Pomade website and studio intentionally incorporate familiar repository motifs without directly copying GitHub's copyrighted interface:

1. **Repository Header Bar:**
   - Displays `pomade / pomade` breadcrumbs.
   - Branch indicator: `main` with branch icon.
   - Document identifier: `README.md` (active tab) and `docs/` tree.
   - Commit SHA badge: `c1cb013` (clickable verification).
2. **File Tree Sidebar:**
   - Visual folder structure resembling a clean project root (`package.json`, `src/`, `docs/media/`, `LICENSE`).
3. **Diff Chunk Visualizer:**
   - Standard unified diff coloring (`+` in green, `-` in red, `@@` in cyan) with monospaced line numbers.
4. **Evidence Check Badges:**
   - Crisp rectangular pills (`✔ Verified from package.json:scripts.test`) that provide proof for claims.
