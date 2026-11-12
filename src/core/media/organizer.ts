import * as path from 'node:path';
import { SafeFileSystem } from '../../adapters/filesystem/safe-fs.js';
import { SvgGenerator } from './svg-generator.js';
import type { RepositorySnapshot } from '../types/schemas.js';

export class MediaOrganizer {
  private readonly fs: SafeFileSystem;
  private readonly repoRoot: string;

  constructor(repoRoot: string) {
    this.repoRoot = path.resolve(repoRoot);
    this.fs = new SafeFileSystem(this.repoRoot);
  }

  public async saveArchitectureDiagram(snapshot: RepositorySnapshot, targetRel = 'docs/media/architecture.svg'): Promise<string> {
    const svg = SvgGenerator.generateArchitectureDiagram(snapshot);
    await this.fs.atomicWriteFile(targetRel, svg);
    return targetRel;
  }

  public async saveSocialCard(snapshot: RepositorySnapshot, targetRel = 'docs/media/social-preview.svg'): Promise<string> {
    const svg = SvgGenerator.generateSocialCard(snapshot);
    await this.fs.atomicWriteFile(targetRel, svg);
    return targetRel;
  }

  public static formatMarkdownImage(
    srcPath: string,
    altText: string,
    caption?: string
  ): string {
    const img = `![${altText}](${srcPath})`;
    if (caption) {
      return `${img}\n*${caption}*`;
    }
    return img;
  }

  public static formatAccessibleGif(
    gifPath: string,
    fallbackPngPath: string,
    altText: string
  ): string {
    return `<picture>
  <source srcset="${gifPath}" type="image/gif" />
  <img src="${fallbackPngPath}" alt="${altText}" width="100%" />
</picture>`;
  }
}
