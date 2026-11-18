/** Browser-safe README renderer shared by the CLI and Studio. */
export type PresentationStyle = 'minimal' | 'signature' | 'animated';
export interface PresentationFacts {
  name: string;
  tagline?: string;
  description: string;
  installCommand?: string;
  runCommand?: string;
  testCommand?: string;
  features?: { title: string; description: string }[];
  repositoryUrl?: string;
  homepageUrl?: string;
  license?: string;
  licensePath?: string;
  version?: string;
  workflowPath?: string;
  screenshotUrl?: string;
  demoGifUrl?: string;
  demoPosterUrl?: string;
  logoUrl?: string;
  bannerUrl?: string;
  staticBannerUrl?: string;
  architectureMermaid?: string;
}

export const PRESENTATION_STYLES = [
  {
    id: 'minimal',
    name: 'Simple',
    number: '01',
    line: 'Less decoration. More documentation.',
    description:
      'A clear title, the first working command, and the details people came for.',
    reference: 'Ollama · Deno',
  },
  {
    id: 'signature',
    name: 'Signature',
    number: '02',
    line: 'A project with a point of view.',
    description:
      'A centered identity, a sharp one-liner, compact badges, and a real product image.',
    reference: 'Ponytail · FastAPI · VS Code',
  },
  {
    id: 'animated',
    name: 'Motion',
    number: '03',
    line: 'Show the thing doing the thing.',
    description:
      'An animated cover, a real demo recording, and a static alternative. Still readable without motion.',
    reference: 'Product demos · GitHub-safe media',
  },
] as const;

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function safeMediaUrl(value?: string): string | undefined {
  if (!value || /[\s<>"'`\\]/.test(value)) return undefined;
  if (/^https:\/\//i.test(value)) {
    try {
      const url = new URL(value);
      return url.username || url.password
        ? undefined
        : url.href.replace(/[()]/g, (c) =>
            encodeURIComponent(c) === c
              ? '%' + c.charCodeAt(0).toString(16)
              : encodeURIComponent(c)
          );
    } catch {
      return undefined;
    }
  }
  if (
    /^[a-z][a-z\d+.-]*:/i.test(value) ||
    value.startsWith('/') ||
    value.split('/').includes('..')
  )
    return undefined;
  return value.replace(/\(/g, '%28').replace(/\)/g, '%29');
}

const text = (value: string) =>
  escapeHtml(value).replace(/([\\`*_[\]{}])/g, '\\$1');
const code = (value: string) => {
  const fence = '`'.repeat(
    Math.max(3, ...Array.from(value.matchAll(/`+/g), (m) => m[0].length + 1))
  );
  return `${fence}bash\n${value}\n${fence}`;
};
const image = (url: string | undefined, alt: string, width = 800) => {
  const safe = safeMediaUrl(url);
  return safe
    ? `<p align="center"><img src="${escapeHtml(safe)}" alt="${escapeHtml(alt)}" width="${width}" /></p>`
    : '';
};

export function presentationSections(
  facts: PresentationFacts,
  style: PresentationStyle
): Record<string, string> {
  const centered = style !== 'minimal';
  const name = text(facts.name);
  const badges: string[] = [];
  if (facts.version)
    badges.push(
      `![Manifest version](https://img.shields.io/badge/version-${encodeURIComponent(facts.version).replace(/-/g, '--')}-a76740?style=flat-square)`
    );
  if (facts.license && facts.licensePath)
    badges.push(
      `[![License](https://img.shields.io/badge/license-${encodeURIComponent(facts.license).replace(/-/g, '--')}-6d8870?style=flat-square)](${encodeURI(facts.licensePath)})`
    );
  const repo = safeMediaUrl(facts.repositoryUrl);
  const slug = repo?.match(
    /^https:\/\/github.com\/([\w.-]+\/[\w.-]+)\/?$/
  )?.[1];
  if (slug && facts.workflowPath)
    badges.push(
      `[![CI](https://github.com/${slug}/actions/workflows/${encodeURIComponent(facts.workflowPath.split('/').pop()!)}/badge.svg)](https://github.com/${slug}/actions)`
    );
  const links = [`[Quickstart](#quickstart)`, `[Features](#features)`];
  const home = safeMediaUrl(facts.homepageUrl);
  if (home) links.push(`[Website](${home})`);
  if (repo) links.push(`[Repository](${repo})`);
  const header = [
    centered ? image(facts.logoUrl, `${facts.name} logo`, 100) : '',
    centered
      ? `<h1 align="center">${escapeHtml(facts.name)}</h1>`
      : `# ${name}`,
    centered
      ? `<p align="center"><em>${escapeHtml(facts.tagline || facts.description)}</em></p>`
      : `> ${text(facts.tagline || facts.description)}`,
    badges.join(' '),
    links.join(' · '),
    style === 'animated'
      ? image(facts.bannerUrl, `${facts.name} animated cover`)
      : '',
    style === 'animated' && safeMediaUrl(facts.staticBannerUrl)
      ? `[View the static cover](${safeMediaUrl(facts.staticBannerUrl)})`
      : '',
  ]
    .filter(Boolean)
    .join('\n\n');
  const sections: Record<string, string> = {
    header,
    overview: `## Overview\n\n${text(facts.description)}`,
  };
  const media =
    style === 'animated'
      ? facts.demoGifUrl || facts.screenshotUrl
      : facts.screenshotUrl;
  if (centered && safeMediaUrl(media)) {
    sections.preview = `## See it in action\n\n${image(media, `${facts.name} demonstration`)}${style === 'animated' && safeMediaUrl(facts.demoPosterUrl || facts.screenshotUrl) ? `\n\n[${facts.demoPosterUrl ? 'View the static demo' : 'View the product screenshot'}](${safeMediaUrl(facts.demoPosterUrl || facts.screenshotUrl)})` : ''}`;
  }
  sections.quickstart = `## Quickstart\n\n${facts.installCommand ? code(facts.installCommand) : 'No installation command was detected. Add verified setup instructions here.'}`;
  sections.features = `## Features\n\n${facts.features?.length ? facts.features.map((f) => `- **${text(f.title)}** — ${text(f.description)}`).join('\n') : 'No feature claims supplied. Describe the behavior you have verified.'}`;
  sections.usage = `## Usage\n\n${facts.runCommand ? code(facts.runCommand) : 'No runnable command was detected. Consult the project source before running it.'}`;
  if (centered && facts.architectureMermaid)
    sections.architecture = `## Architecture\n\n\`\`\`mermaid\n${facts.architectureMermaid}\n\`\`\``;
  if (facts.testCommand)
    sections.development = `## Development\n\nConfigured test command (its presence does not imply tests pass):\n\n${code(facts.testCommand)}`;
  sections.license = `## License\n\n${facts.license && facts.licensePath ? `[${text(facts.license)}](${encodeURI(facts.licensePath)})` : 'No license file detected. Check with the repository owner before reuse.'}`;
  return sections;
}

export function renderPresentation(
  facts: PresentationFacts,
  style: PresentationStyle,
  markers = true
): string {
  return (
    Object.entries(presentationSections(facts, style))
      .map(([id, content]) =>
        markers
          ? `<!-- pomade:start ${id} -->\n${content}\n<!-- pomade:end ${id} -->`
          : content
      )
      .join('\n\n') + '\n'
  );
}

export function renderBanner(
  facts: PresentationFacts,
  animated = true
): string {
  const title = escapeHtml(facts.name.slice(0, 30));
  const tagline = escapeHtml((facts.tagline || facts.description).slice(0, 76));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="400" viewBox="0 0 1200 400" role="img" aria-labelledby="title desc">
<title id="title">${title}</title><desc id="desc">${tagline}</desc>
<style>text{font-family:ui-monospace,SFMono-Regular,Consolas,monospace}.cursor{${animated ? 'animation:blink 1.5s steps(2,start) 6' : ''}}.track{${animated ? 'animation:scan 8s ease-in-out 2' : ''}}@keyframes blink{to{opacity:0}}@keyframes scan{0%{width:0}80%,100%{width:1080px}}@media(prefers-reduced-motion:reduce){.cursor,.track{animation:none}}</style>
<rect width="1200" height="400" rx="12" fill="#151719"/><rect x="1" y="1" width="1198" height="398" rx="12" fill="none" stroke="#383b3d"/>
<circle cx="38" cy="30" r="5" fill="#bd7654"/><circle cx="58" cy="30" r="5" fill="#c4a367"/><circle cx="78" cy="30" r="5" fill="#7c967e"/>
<text x="60" y="100" fill="#c4a367" font-size="14" letter-spacing="3">README / ${animated ? 'MOTION' : 'STATIC'}</text>
<text x="60" y="195" fill="#f2eee5" font-size="60" font-weight="700">${title}<tspan class="cursor" fill="#c4a367">_</tspan></text>
<text x="60" y="250" fill="#b9b8b2" font-size="20">${tagline}</text>
<rect x="60" y="320" width="1080" height="2" fill="#383b3d"/><rect class="track" x="60" y="320" width="1080" height="2" fill="#c4a367"/>
<text x="60" y="365" fill="#b9b8b2" font-size="12">A little polish. A better first impression.</text>
</svg>\n`;
}
