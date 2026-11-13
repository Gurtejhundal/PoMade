export interface DiffLine {
  type: 'add' | 'del' | 'same' | 'header';
  text: string;
  oldLineNumber?: number;
  newLineNumber?: number;
}

export function computeClientDiff(originalText: string, newText: string): DiffLine[] {
  const origLines = originalText.split('\n');
  const newLines = newText.split('\n');

  const diffLines: DiffLine[] = [
    { type: 'header', text: '--- a/README.md' },
    { type: 'header', text: '+++ b/README.md' },
    { type: 'header', text: `@@ -1,${origLines.length} +1,${newLines.length} @@` },
  ];

  let i = 0;
  let j = 0;

  while (i < origLines.length || j < newLines.length) {
    if (i < origLines.length && j < newLines.length) {
      if (origLines[i] === newLines[j]) {
        diffLines.push({
          type: 'same',
          text: `  ${origLines[i]}`,
          oldLineNumber: i + 1,
          newLineNumber: j + 1,
        });
        i++;
        j++;
      } else {
        // Propose deletion of old line and addition of new line
        diffLines.push({
          type: 'del',
          text: `- ${origLines[i]}`,
          oldLineNumber: i + 1,
        });
        diffLines.push({
          type: 'add',
          text: `+ ${newLines[j]}`,
          newLineNumber: j + 1,
        });
        i++;
        j++;
      }
    } else if (i < origLines.length) {
      diffLines.push({
        type: 'del',
        text: `- ${origLines[i]}`,
        oldLineNumber: i + 1,
      });
      i++;
    } else if (j < newLines.length) {
      diffLines.push({
        type: 'add',
        text: `+ ${newLines[j]}`,
        newLineNumber: j + 1,
      });
      j++;
    }
  }

  return diffLines;
}
