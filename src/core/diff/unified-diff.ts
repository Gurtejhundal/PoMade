import * as crypto from 'node:crypto';

export class UnifiedDiff {
  public static hash(content: string): string {
    if (!content) return '';
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  public static create(
    filename: string,
    originalContent: string,
    proposedContent: string
  ): string {
    if (originalContent === proposedContent) {
      return '';
    }

    const origLines = originalContent ? originalContent.split('\n') : [];
    const propLines = proposedContent ? proposedContent.split('\n') : [];

    const diffLines: string[] = [];
    diffLines.push(`--- a/${filename}`);
    diffLines.push(`+++ b/${filename}`);

    if (origLines.length === 0) {
      // New file
      diffLines.push(`@@ -0,0 +1,${propLines.length} @@`);
      for (const line of propLines) {
        diffLines.push(`+${line}`);
      }
      return diffLines.join('\n');
    }

    // Standard Myers / LCS diff or simple line-by-line chunking
    const lcs = this.computeLcs(origLines, propLines);
    let i = 0;
    let j = 0;
    let origIndex = 1;
    let propIndex = 1;

    const hunks: Array<{ type: 'same' | 'add' | 'del'; line: string }> = [];

    while (i < origLines.length || j < propLines.length) {
      if (i < origLines.length && j < propLines.length && origLines[i] === propLines[j]) {
        hunks.push({ type: 'same', line: origLines[i] });
        i++;
        j++;
      } else if (
        j < propLines.length &&
        (i >= origLines.length || lcs[i]?.[j + 1] >= (lcs[i + 1]?.[j] ?? 0))
      ) {
        hunks.push({ type: 'add', line: propLines[j] });
        j++;
      } else if (i < origLines.length) {
        hunks.push({ type: 'del', line: origLines[i] });
        i++;
      }
    }

    // Format into unified diff chunk
    diffLines.push(`@@ -1,${origLines.length} +1,${propLines.length} @@`);
    for (const h of hunks) {
      if (h.type === 'same') {
        diffLines.push(` ${h.line}`);
      } else if (h.type === 'add') {
        diffLines.push(`+${h.line}`);
      } else if (h.type === 'del') {
        diffLines.push(`-${h.line}`);
      }
    }

    return diffLines.join('\n');
  }

  private static computeLcs(a: string[], b: string[]): number[][] {
    const m = a.length;
    const n = b.length;
    const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

    for (let i = m - 1; i >= 0; i--) {
      for (let j = n - 1; j >= 0; j--) {
        if (a[i] === b[j]) {
          dp[i][j] = 1 + dp[i + 1][j + 1];
        } else {
          dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
        }
      }
    }

    return dp;
  }
}
