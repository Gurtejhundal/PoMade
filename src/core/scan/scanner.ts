import * as path from 'node:path';
import * as crypto from 'node:crypto';
import { SafeFileSystem, type DiscoveredFile } from '../../adapters/filesystem/safe-fs.js';
import { GitCli } from '../../adapters/git/git-cli.js';
import type {
  RepositorySnapshot,
  ProjectKind,
  MaturityStage,
  ManifestFact,
  DocumentationFact,
  AssetFact,
  WorkflowFact,
  LicenseFact,
} from '../types/schemas.js';

export class RepositoryScanner {
  private readonly fs: SafeFileSystem;
  private readonly git: GitCli;
  private readonly repoRoot: string;

  constructor(repoRoot: string) {
    this.repoRoot = path.resolve(repoRoot);
    this.fs = new SafeFileSystem(this.repoRoot);
    this.git = new GitCli(this.repoRoot);
  }

  public async scan(): Promise<RepositorySnapshot> {
    if (!(await this.fs.rootExists())) {
      throw new Error(`Repository root directory does not exist or is not a directory: '${this.repoRoot}'`);
    }

    const warnings: string[] = [];
    const files = await this.fs.scanDirectory('', (w) => warnings.push(w));
    const gitState = await this.git.getGitState();

    // 1. Language counts
    const languages: Record<string, number> = {};
    for (const f of files) {
      const ext = f.extension;
      const lang = this.detectLanguageFromExt(ext);
      if (lang) {
        languages[lang] = (languages[lang] ?? 0) + 1;
      }
    }

    // 2. Manifests & Frameworks
    const manifests: ManifestFact[] = [];
    const frameworks = new Set<string>();

    for (const f of files) {
      const base = path.basename(f.relativePath);
      if (base === 'package.json') {
        const fact = await this.parsePackageJson(f.relativePath, warnings);
        if (fact) {
          manifests.push(fact);
          this.detectNodeFrameworks(fact, frameworks);
        }
      } else if (base === 'pyproject.toml') {
        const fact = await this.parsePyproject(f.relativePath, warnings);
        if (fact) {
          manifests.push(fact);
          this.detectPythonFrameworks(fact, frameworks);
        }
      } else if (base === 'requirements.txt') {
        const fact = await this.parseRequirements(f.relativePath, warnings);
        if (fact) {
          manifests.push(fact);
          this.detectPythonFrameworks(fact, frameworks);
        }
      } else if (base === 'Cargo.toml') {
        const fact = await this.parseCargoToml(f.relativePath, warnings);
        if (fact) {
          manifests.push(fact);
          this.detectRustFrameworks(fact, frameworks);
        }
      } else if (base === 'go.mod') {
        const fact = await this.parseGoMod(f.relativePath, warnings);
        if (fact) {
          manifests.push(fact);
        }
      }
    }

    // Determine primary language:
    // Prioritize actual programming languages over documentation/markup formats
    const nonMarkupLanguages = Object.entries(languages).filter(
      ([lang]) => lang !== 'Markdown' && lang !== 'HTML' && lang !== 'CSS'
    );

    let primaryLanguage = nonMarkupLanguages.sort((a, b) => b[1] - a[1])[0]?.[0];
    if (!primaryLanguage) {
      if (manifests.some((m) => m.manifestType === 'npm')) {
        primaryLanguage = languages['TypeScript'] ? 'TypeScript' : 'JavaScript';
      } else if (manifests.some((m) => m.manifestType === 'pyproject' || m.manifestType === 'pip')) {
        primaryLanguage = 'Python';
      } else if (manifests.some((m) => m.manifestType === 'cargo')) {
        primaryLanguage = 'Rust';
      } else if (manifests.some((m) => m.manifestType === 'gomod')) {
        primaryLanguage = 'Go';
      } else if (languages['Markdown']) {
        primaryLanguage = 'Markdown';
      }
    }

    // 3. Documentation
    const docs: DocumentationFact[] = [];
    for (const f of files) {
      const docKind = this.detectDocKind(f.relativePath);
      if (docKind) {
        let hasManaged = false;
        try {
          const content = await this.fs.readFile(f.relativePath, 256 * 1024);
          hasManaged =
            content.includes('<!-- pomade:start') ||
            content.includes('<!-- repoatelier:start');
        } catch {
          // ignore read error on large docs
        }
        docs.push({
          path: f.relativePath,
          kind: docKind,
          sizeBytes: f.sizeBytes,
          hasManagedSections: hasManaged,
        });
      }
    }

    // 4. Assets
    const assets: AssetFact[] = [];
    for (const f of files) {
      const assetKind = this.detectAssetKind(f.extension);
      if (assetKind) {
        assets.push({
          path: f.relativePath,
          kind: assetKind,
          sizeBytes: f.sizeBytes,
        });
      }
    }

    // 5. Workflows
    const workflows: WorkflowFact[] = [];
    for (const f of files) {
      if (f.relativePath.startsWith('.github/workflows/') && (f.extension === '.yml' || f.extension === '.yaml')) {
        workflows.push({
          path: f.relativePath,
          name: path.basename(f.relativePath, f.extension),
        });
      }
    }

    // 6. License
    const license = await this.detectLicense(files, manifests);

    // 7. Project Kind & Maturity Stage
    const kind = this.classifyProjectKind(files, manifests, frameworks);
    const stage = this.classifyMaturityStage(files, gitState, manifests, docs, workflows);

    // 8. Snapshot Fingerprint
    const fingerprint = this.computeFingerprint(
      files,
      gitState.commitSha,
      manifests,
      docs
    );

    return {
      repoRoot: this.repoRoot,
      gitState,
      kind,
      stage,
      primaryLanguage,
      languages,
      frameworks: Array.from(frameworks).sort(),
      manifests,
      docs,
      assets,
      workflows,
      license,
      warnings,
      snapshotFingerprint: fingerprint,
    };
  }

  private detectLanguageFromExt(ext: string): string | null {
    switch (ext) {
      case '.ts':
      case '.tsx':
      case '.mts':
      case '.cts':
        return 'TypeScript';
      case '.js':
      case '.jsx':
      case '.mjs':
      case '.cjs':
        return 'JavaScript';
      case '.py':
      case '.pyi':
        return 'Python';
      case '.rs':
        return 'Rust';
      case '.go':
        return 'Go';
      case '.java':
        return 'Java';
      case '.kt':
        return 'Kotlin';
      case '.rb':
        return 'Ruby';
      case '.php':
        return 'PHP';
      case '.c':
      case '.h':
        return 'C';
      case '.cpp':
      case '.hpp':
      case '.cc':
        return 'C++';
      case '.cs':
        return 'C#';
      case '.html':
        return 'HTML';
      case '.css':
      case '.scss':
      case '.less':
        return 'CSS';
      case '.sh':
      case '.bash':
      case '.zsh':
        return 'Shell';
      case '.md':
      case '.mdx':
        return 'Markdown';
      default:
        return null;
    }
  }

  private detectDocKind(relPath: string): string | null {
    const base = path.basename(relPath).toUpperCase();
    if (base.startsWith('README')) return 'readme';
    if (base.startsWith('CONTRIBUTING')) return 'contributing';
    if (base.startsWith('CODE_OF_CONDUCT')) return 'code-of-conduct';
    if (base.startsWith('SECURITY')) return 'security';
    if (base.startsWith('SUPPORT')) return 'support';
    if (base.startsWith('CHANGELOG') || base.startsWith('HISTORY')) return 'changelog';
    if (base.startsWith('LICENSE') || base.startsWith('LICENCE')) return 'license';
    if (relPath.startsWith('docs/') && (relPath.endsWith('.md') || relPath.endsWith('.mdx'))) return 'docs';
    return null;
  }

  private detectAssetKind(ext: string): 'image' | 'video' | 'gif' | 'diagram' | null {
    if (['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) return 'image';
    if (['.gif'].includes(ext)) return 'gif';
    if (['.mp4', '.webm', '.mov'].includes(ext)) return 'video';
    if (['.svg'].includes(ext)) return 'diagram';
    return null;
  }

  private async parsePackageJson(relPath: string, warnings: string[]): Promise<ManifestFact | null> {
    try {
      const content = await this.fs.readFile(relPath);
      const parsed = JSON.parse(content);

      const dependencies = Object.keys(parsed.dependencies ?? {});
      const devDependencies = Object.keys(parsed.devDependencies ?? {});

      const entrypoints: string[] = [];
      if (parsed.main) entrypoints.push(parsed.main);
      if (parsed.module) entrypoints.push(parsed.module);
      if (parsed.bin) {
        if (typeof parsed.bin === 'string') {
          entrypoints.push(parsed.bin);
        } else if (typeof parsed.bin === 'object') {
          entrypoints.push(...Object.values(parsed.bin as Record<string, string>));
        }
      }

      return {
        manifestType: 'npm',
        path: relPath,
        name: parsed.name,
        version: parsed.version,
        description: parsed.description,
        license: typeof parsed.license === 'string' ? parsed.license : undefined,
        scripts: typeof parsed.scripts === 'object' ? parsed.scripts : {},
        dependencies,
        devDependencies,
        entrypoints,
      };
    } catch (err: any) {
      warnings.push(`Failed to parse ${relPath}: ${err.message}`);
      return null;
    }
  }

  private async parsePyproject(relPath: string, warnings: string[]): Promise<ManifestFact | null> {
    try {
      const content = await this.fs.readFile(relPath);
      // Light-weight TOML key-value extraction for essential metadata without heavy deps
      const nameMatch = content.match(/name\s*=\s*["']([^"']+)["']/);
      const versionMatch = content.match(/version\s*=\s*["']([^"']+)["']/);
      const descMatch = content.match(/description\s*=\s*["']([^"']+)["']/);
      const licenseMatch = content.match(/license\s*=\s*["']([^"']+)["']/);

      const dependencies: string[] = [];
      const depsBlock = content.match(/dependencies\s*=\s*\[([\s\S]*?)\]/);
      if (depsBlock && depsBlock[1]) {
        const rawDeps = depsBlock[1].match(/["']([a-zA-Z0-9_\-.]+)["']/g);
        if (rawDeps) {
          dependencies.push(...rawDeps.map((d) => d.replace(/["']/g, '')));
        }
      }

      return {
        manifestType: 'pyproject',
        path: relPath,
        name: nameMatch?.[1],
        version: versionMatch?.[1],
        description: descMatch?.[1],
        license: licenseMatch?.[1],
        dependencies,
      };
    } catch (err: any) {
      warnings.push(`Failed to parse ${relPath}: ${err.message}`);
      return null;
    }
  }

  private async parseRequirements(relPath: string, warnings: string[]): Promise<ManifestFact | null> {
    try {
      const content = await this.fs.readFile(relPath);
      const dependencies = content
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith('#'))
        .map((line) => line.split(/[=<>~]/)[0]?.trim())
        .filter((d): d is string => Boolean(d));

      return {
        manifestType: 'pip',
        path: relPath,
        dependencies,
      };
    } catch (err: any) {
      warnings.push(`Failed to parse ${relPath}: ${err.message}`);
      return null;
    }
  }

  private async parseCargoToml(relPath: string, warnings: string[]): Promise<ManifestFact | null> {
    try {
      const content = await this.fs.readFile(relPath);
      const nameMatch = content.match(/name\s*=\s*["']([^"']+)["']/);
      const versionMatch = content.match(/version\s*=\s*["']([^"']+)["']/);
      const descMatch = content.match(/description\s*=\s*["']([^"']+)["']/);
      const licenseMatch = content.match(/license\s*=\s*["']([^"']+)["']/);

      return {
        manifestType: 'cargo',
        path: relPath,
        name: nameMatch?.[1],
        version: versionMatch?.[1],
        description: descMatch?.[1],
        license: licenseMatch?.[1],
      };
    } catch (err: any) {
      warnings.push(`Failed to parse ${relPath}: ${err.message}`);
      return null;
    }
  }

  private async parseGoMod(relPath: string, warnings: string[]): Promise<ManifestFact | null> {
    try {
      const content = await this.fs.readFile(relPath);
      const moduleMatch = content.match(/^module\s+([^\s]+)/m);
      return {
        manifestType: 'gomod',
        path: relPath,
        name: moduleMatch?.[1],
      };
    } catch (err: any) {
      warnings.push(`Failed to parse ${relPath}: ${err.message}`);
      return null;
    }
  }

  private detectNodeFrameworks(fact: ManifestFact, set: Set<string>): void {
    const allDeps = [...(fact.dependencies ?? []), ...(fact.devDependencies ?? [])];
    const depMap: Record<string, string> = {
      next: 'Next.js',
      react: 'React',
      vue: 'Vue',
      nuxt: 'Nuxt',
      svelte: 'Svelte',
      '@sveltejs/kit': 'SvelteKit',
      vite: 'Vite',
      astro: 'Astro',
      express: 'Express',
      fastify: 'Fastify',
      '@nestjs/core': 'NestJS',
      tailwindcss: 'Tailwind CSS',
      vitest: 'Vitest',
      jest: 'Jest',
      playwright: 'Playwright',
      cypress: 'Cypress',
      commander: 'Commander',
    };

    for (const dep of allDeps) {
      if (depMap[dep]) {
        set.add(depMap[dep]);
      }
    }
  }

  private detectPythonFrameworks(fact: ManifestFact, set: Set<string>): void {
    const deps = (fact.dependencies ?? []).map((d) => d.toLowerCase());
    const depMap: Record<string, string> = {
      fastapi: 'FastAPI',
      flask: 'Flask',
      django: 'Django',
      pytest: 'pytest',
      torch: 'PyTorch',
      tensorflow: 'TensorFlow',
      transformers: 'Transformers',
      scipy: 'SciPy',
      numpy: 'NumPy',
      pandas: 'Pandas',
    };

    for (const dep of deps) {
      if (depMap[dep]) {
        set.add(depMap[dep]);
      }
    }
  }

  private detectRustFrameworks(fact: ManifestFact, set: Set<string>): void {
    const deps = (fact.dependencies ?? []).map((d) => d.toLowerCase());
    const depMap: Record<string, string> = {
      actix: 'Actix',
      axum: 'Axum',
      tokio: 'Tokio',
      clap: 'Clap',
    };

    for (const dep of deps) {
      if (depMap[dep]) {
        set.add(depMap[dep]);
      }
    }
  }

  private async detectLicense(
    files: DiscoveredFile[],
    manifests: ManifestFact[]
  ): Promise<LicenseFact | null> {
    const licenseFile = files.find((f) => {
      const base = path.basename(f.relativePath).toUpperCase();
      return base === 'LICENSE' || base === 'LICENCE' || base.startsWith('LICENSE.') || base.startsWith('LICENCE.');
    });

    if (licenseFile) {
      try {
        const content = await this.fs.readFile(licenseFile.relativePath, 8 * 1024);
        const spdxId = this.identifySpdx(content);
        return {
          path: licenseFile.relativePath,
          spdxId,
          isStandard: Boolean(spdxId),
          origin: 'file',
        };
      } catch {
        return {
          path: licenseFile.relativePath,
          isStandard: false,
          origin: 'file',
        };
      }
    }

    // Fallback: check manifests
    for (const m of manifests) {
      if (m.license) {
        return {
          spdxId: m.license,
          isStandard: this.isStandardSpdx(m.license),
          origin: 'manifest',
        };
      }
    }

    return null;
  }

  private identifySpdx(content: string): string | undefined {
    const upper = content.toUpperCase();
    if (upper.includes('MIT LICENSE') || upper.includes('PERMISSION IS HEREBY GRANTED, FREE OF CHARGE')) return 'MIT';
    if (upper.includes('APACHE LICENSE') && upper.includes('VERSION 2.0')) return 'Apache-2.0';
    if (upper.includes('GNU GENERAL PUBLIC LICENSE') && upper.includes('VERSION 3')) return 'GPL-3.0';
    if (upper.includes('BSD 3-CLAUSE')) return 'BSD-3-Clause';
    if (upper.includes('BSD 2-CLAUSE')) return 'BSD-2-Clause';
    if (upper.includes('ISC LICENSE')) return 'ISC';
    if (upper.includes('MOZILLA PUBLIC LICENSE') && upper.includes('2.0')) return 'MPL-2.0';
    if (upper.includes('THE UNLICENSE')) return 'Unlicense';
    return undefined;
  }

  private isStandardSpdx(id: string): boolean {
    const standard = ['MIT', 'Apache-2.0', 'GPL-3.0', 'BSD-3-Clause', 'BSD-2-Clause', 'ISC', 'MPL-2.0', 'Unlicense'];
    return standard.includes(id);
  }

  private classifyProjectKind(
    files: DiscoveredFile[],
    manifests: ManifestFact[],
    frameworks: Set<string>
  ): ProjectKind {
    // 1. Monorepo
    const hasWorkspaces = manifests.some((m) => {
      return (
        files.some((f) => f.relativePath === 'pnpm-workspace.yaml') ||
        (m.manifestType === 'npm' && files.some((f) => f.relativePath.startsWith('packages/')))
      );
    });
    if (hasWorkspaces) return 'monorepo';

    // 2. ML / Data
    const isMl =
      frameworks.has('PyTorch') ||
      frameworks.has('TensorFlow') ||
      frameworks.has('Transformers') ||
      files.some((f) => f.extension === '.ipynb');
    if (isMl) return 'ml';

    // 3. Web UI
    const isWeb =
      frameworks.has('Next.js') ||
      frameworks.has('Nuxt') ||
      frameworks.has('React') ||
      frameworks.has('Vue') ||
      frameworks.has('Svelte') ||
      frameworks.has('SvelteKit') ||
      frameworks.has('Vite') ||
      files.some((f) => f.relativePath === 'index.html' || f.relativePath === 'public/index.html');

    // 4. CLI
    const isCli =
      manifests.some((m) => m.entrypoints?.some((e) => e.includes('cli') || e.includes('bin'))) ||
      files.some((f) => f.relativePath.includes('bin/') || f.relativePath.includes('cli.'));

    if (isCli && !isWeb) return 'cli';
    if (isWeb) return 'web';

    // 5. API / Service
    const isApi =
      frameworks.has('Express') ||
      frameworks.has('Fastify') ||
      frameworks.has('NestJS') ||
      frameworks.has('FastAPI') ||
      frameworks.has('Flask') ||
      frameworks.has('Django') ||
      frameworks.has('Actix') ||
      frameworks.has('Axum');
    if (isApi) return 'api';

    // 6. Library
    if (manifests.length > 0) return 'library';

    // 7. Docs
    const mdFiles = files.filter((f) => f.extension === '.md');
    if (mdFiles.length > 0 && files.length <= mdFiles.length + 2) return 'docs';

    return 'unknown';
  }

  private classifyMaturityStage(
    files: DiscoveredFile[],
    gitState: { clean: boolean; commitSha: string | null; trackedFilesCount: number },
    manifests: ManifestFact[],
    docs: DocumentationFact[],
    workflows: WorkflowFact[]
  ): MaturityStage {
    if (files.length <= 2 || (!gitState.commitSha && files.length === 0)) {
      return 'idea';
    }

    const hasCi = workflows.length > 0;
    const hasReadme = docs.some((d) => d.kind === 'readme');
    const hasContributing = docs.some((d) => d.kind === 'contributing');
    const hasLicense = docs.some((d) => d.kind === 'license');

    const primaryManifest = manifests[0];
    const version = primaryManifest?.version;

    // Released: version is >= 1.0.0 or semantic release indicator
    const isReleasedVersion = version && !version.startsWith('0.') && !version.includes('alpha') && !version.includes('beta');

    if (hasCi && hasContributing && hasLicense && isReleasedVersion) {
      return 'maintained';
    }

    if (isReleasedVersion || (hasReadme && manifests.some((m) => Object.keys(m.scripts ?? {}).length > 0) && hasLicense)) {
      return 'usable';
    }

    if (manifests.length > 0 || files.length > 3) {
      return 'prototype';
    }

    return 'idea';
  }

  private computeFingerprint(
    files: DiscoveredFile[],
    commitSha: string | null,
    manifests: ManifestFact[],
    docs: DocumentationFact[]
  ): string {
    const hash = crypto.createHash('sha256');
    hash.update(`git:${commitSha ?? 'none'};`);
    for (const f of files.slice(0, 100)) {
      hash.update(`${f.relativePath}:${f.sizeBytes};`);
    }
    for (const m of manifests) {
      hash.update(`manifest:${m.path}:${m.name}:${m.version};`);
    }
    for (const d of docs) {
      hash.update(`doc:${d.path}:${d.kind};`);
    }
    return hash.digest('hex').substring(0, 16);
  }
}
