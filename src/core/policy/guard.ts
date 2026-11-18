import { UnifiedDiff } from '../diff/unified-diff.js';
import { SafeFileSystem } from '../../adapters/filesystem/safe-fs.js';
import type { Action } from '../types/schemas.js';

export class PolicyGuard {
  public static verifyApproval(approved: boolean): void {
    if (!approved) {
      const err = new Error(
        'Authorization required: Local file modifications are blocked. Pass `--approved` to authorize plan execution.'
      );
      (err as any).exitCode = 4;
      throw err;
    }
  }

  public static async verifyFreshness(
    fs: SafeFileSystem,
    action: Action
  ): Promise<void> {
    if (UnifiedDiff.hash(action.proposedContent) !== action.afterHash)
      throw new Error(
        'Plan content hash mismatch. Regenerate and review the plan.'
      );
    const exists = await fs.fileExists(action.target);
    let currentHash = '';

    if (exists) {
      const currentContent = await fs.readFile(action.target);
      currentHash = UnifiedDiff.hash(currentContent);
    }

    if (currentHash !== action.beforeHash) {
      const err = new Error(
        `Stale plan conflict: File '${action.target}' was modified after this plan was created. ` +
          `Expected hash ${action.beforeHash || '(empty)'}, but observed ${currentHash || '(empty)'}. ` +
          `Please re-run 'pomade plan' before applying.`
      );
      (err as any).exitCode = 3;
      throw err;
    }
  }
}
