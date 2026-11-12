import * as fs from 'node:fs/promises';
import * as fsSync from 'node:fs';
import * as path from 'node:path';

export interface SafeFsOptions {
  maxFileSize?: number; // bytes, default 1MB
  maxFilesScanned?: number; // default 5000
  maxDepth?: number; // default 10
}

export interface DiscoveredFile {
  relativePath: string;
  absolutePath: string;
  sizeBytes: number;
  extension: string;
  isSymlink: boolean;
}

export const DEFAULT_EXCLUDED_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  'out',
  'target',
  '.next',
  '.nuxt',
  '.turbo',
  'vendor',
  '__pycache__',
  '.venv',
  'env',
  '.pytest_cache',
  'coverage',
  '.terraform',
  '.idea',
  '.vscode',
]);

export const SENSITIVE_FILE_PATTERNS = [
  /^\.env(\..+)?$/i,
  /^id_rsa/i,
  /^id_ed25519/i,
  /\.pem$/i,
  /\.key$/i,
  /credentials\.json$/i,
  /secret/i,
  /service-account.*\.json$/i,
];

export const ALLOWED_SENSITIVE_EXCEPTIONS = [
  /^\.env\.example$/i,
  /^\.env\.sample$/i,
  /^\.env\.template$/i,
];

export class SafeFileSystem {
  private readonly root: string;
  private readonly maxFileSize: number;
  private readonly maxFilesScanned: number;
  private readonly maxDepth: number;

  constructor(repoRoot: string, options: SafeFsOptions = {}) {
    this.root = path.resolve(repoRoot);
    this.maxFileSize = options.maxFileSize ?? 1024 * 1024; // 1 MB
    this.maxFilesScanned = options.maxFilesScanned ?? 5000;
    this.maxDepth = options.maxDepth ?? 10;
  }

  public getRoot(): string {
    return this.root;
  }

  public async rootExists(): Promise<boolean> {
    try {
      const stat = await fs.stat(this.root);
      return stat.isDirectory();
    } catch {
      return false;
    }
  }

  public isPathWithinRoot(targetPath: string): boolean {
    const resolved = path.resolve(this.root, targetPath);
    const relative = path.relative(this.root, resolved);
    return !relative.startsWith('..') && !path.isAbsolute(relative);
  }

  public assertPathWithinRoot(targetPath: string): string {
    const resolved = path.resolve(this.root, targetPath);
    if (!this.isPathWithinRoot(resolved)) {
      throw new Error(`Security violation: Path '${targetPath}' escapes repository root '${this.root}'`);
    }
    return resolved;
  }

  public isSensitiveFile(fileName: string): boolean {
    const base = path.basename(fileName);
    for (const exception of ALLOWED_SENSITIVE_EXCEPTIONS) {
      if (exception.test(base)) {
        return false;
      }
    }
    for (const pattern of SENSITIVE_FILE_PATTERNS) {
      if (pattern.test(base)) {
        return true;
      }
    }
    return false;
  }

  public async readFile(targetPath: string, maxSize = this.maxFileSize): Promise<string> {
    const resolved = this.assertPathWithinRoot(targetPath);
    const stat = await fs.lstat(resolved);

    if (stat.isSymbolicLink()) {
      const real = await fs.realpath(resolved);
      if (!this.isPathWithinRoot(real)) {
        throw new Error(`Security violation: Symlink '${targetPath}' points outside repository root to '${real}'`);
      }
    }

    if (stat.size > maxSize) {
      throw new Error(`File size ${stat.size} bytes exceeds limit of ${maxSize} bytes for '${targetPath}'`);
    }

    return await fs.readFile(resolved, 'utf-8');
  }

  public async fileExists(targetPath: string): Promise<boolean> {
    try {
      const resolved = this.assertPathWithinRoot(targetPath);
      await fs.access(resolved);
      return true;
    } catch {
      return false;
    }
  }

  public async atomicWriteFile(targetPath: string, content: string): Promise<void> {
    const resolved = this.assertPathWithinRoot(targetPath);
    await fs.mkdir(path.dirname(resolved), { recursive: true });
    const tempPath = `${resolved}.pomade.tmp.${Date.now()}`;
    await fs.writeFile(tempPath, content, 'utf-8');
    try {
      await fs.rename(tempPath, resolved);
    } catch (err: any) {
      try {
        await fs.unlink(tempPath);
      } catch {
        // ignore cleanup error
      }
      throw new Error(`Failed to atomically write file '${targetPath}': ${err.message}`);
    }
  }

  public async scanDirectory(
    subDir = '',
    onWarning?: (warning: string) => void
  ): Promise<DiscoveredFile[]> {
    const results: DiscoveredFile[] = [];
    const queue: Array<{ dir: string; depth: number }> = [{ dir: subDir, depth: 0 }];

    while (queue.length > 0) {
      if (results.length >= this.maxFilesScanned) {
        onWarning?.(`Scan limit reached: Capped at ${this.maxFilesScanned} files.`);
        break;
      }

      const item = queue.shift();
      if (!item) break;
      const { dir, depth } = item;

      if (depth > this.maxDepth) {
        continue;
      }

      const currentAbsolute = path.resolve(this.root, dir);
      if (!this.isPathWithinRoot(currentAbsolute)) {
        onWarning?.(`Ignored directory escaping root: ${dir}`);
        continue;
      }

      let entries: fsSync.Dirent[];
      try {
        entries = await fs.readdir(currentAbsolute, { withFileTypes: true });
      } catch (err: any) {
        onWarning?.(`Could not read directory '${dir}': ${err.message}`);
        continue;
      }

      for (const entry of entries) {
        const entryName = entry.name;
        const entryRel = path.join(dir, entryName);
        const entryAbs = path.resolve(this.root, entryRel);

        if (entry.isDirectory()) {
          if (DEFAULT_EXCLUDED_DIRS.has(entryName) || entryName.startsWith('.')) {
            // Check if it's .github which we need to scan
            if (entryName === '.github') {
              queue.push({ dir: entryRel, depth: depth + 1 });
            }
            continue;
          }
          queue.push({ dir: entryRel, depth: depth + 1 });
          continue;
        }

        if (this.isSensitiveFile(entryName)) {
          // Sensitive file silently omitted from scan results
          continue;
        }

        try {
          const isSymlink = entry.isSymbolicLink();
          if (isSymlink) {
            const real = await fs.realpath(entryAbs);
            if (!this.isPathWithinRoot(real)) {
              onWarning?.(`Symlink '${entryRel}' references outside repository; skipped.`);
              continue;
            }
          }

          const stat = await fs.stat(entryAbs);
          if (stat.isFile()) {
            results.push({
              relativePath: entryRel.split(path.sep).join('/'),
              absolutePath: entryAbs,
              sizeBytes: stat.size,
              extension: path.extname(entryName).toLowerCase(),
              isSymlink,
            });
          }
        } catch {
          // Broken symlink or inaccessible file
          continue;
        }
      }
    }

    return results;
  }
}
