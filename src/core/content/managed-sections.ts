export interface ParsedSection {
  id: string;
  startMarkerIndex: number;
  endMarkerIndex: number;
  contentStartIndex: number;
  contentEndIndex: number;
  rawContent: string;
}

const START_MARKER_REGEX = /<!--\s*(?:pomade|repoatelier):start\s+([a-zA-Z0-9_\-]+)\s*-->/g;
const END_MARKER_REGEX = /<!--\s*(?:pomade|repoatelier):end\s+([a-zA-Z0-9_\-]+)\s*-->/g;

export class ManagedSections {
  public static wrap(sectionId: string, content: string): string {
    const trimmed = content.trim();
    return `<!-- pomade:start ${sectionId} -->\n${trimmed}\n<!-- pomade:end ${sectionId} -->`;
  }

  public static hasManagedSections(content: string): boolean {
    return (
      content.includes('<!-- pomade:start') ||
      content.includes('<!-- repoatelier:start')
    );
  }

  public static parse(content: string): Map<string, ParsedSection> {
    const sections = new Map<string, ParsedSection>();
    const startMatches: Array<{ id: string; index: number; length: number }> = [];

    let match: RegExpExecArray | null;
    const startRegex = new RegExp(START_MARKER_REGEX.source, 'g');
    while ((match = startRegex.exec(content)) !== null) {
      startMatches.push({
        id: match[1],
        index: match.index,
        length: match[0].length,
      });
    }

    const endMatches: Array<{ id: string; index: number; length: number }> = [];
    const endRegex = new RegExp(END_MARKER_REGEX.source, 'g');
    while ((match = endRegex.exec(content)) !== null) {
      endMatches.push({
        id: match[1],
        index: match.index,
        length: match[0].length,
      });
    }

    // Verify parity
    if (startMatches.length !== endMatches.length) {
      throw new Error(
        `Managed section parity error: Found ${startMatches.length} start markers and ${endMatches.length} end markers.`
      );
    }

    for (const start of startMatches) {
      if (sections.has(start.id)) {
        throw new Error(`Duplicate managed section identifier: '${start.id}'`);
      }

      const matchingEnd = endMatches.find((e) => e.id === start.id);
      if (!matchingEnd) {
        throw new Error(`Missing closing marker for managed section: '${start.id}'`);
      }

      if (matchingEnd.index < start.index) {
        throw new Error(`Closing marker appears before start marker for section: '${start.id}'`);
      }

      const contentStart = start.index + start.length;
      const contentEnd = matchingEnd.index;
      const raw = content.substring(contentStart, contentEnd);

      sections.set(start.id, {
        id: start.id,
        startMarkerIndex: start.index,
        endMarkerIndex: matchingEnd.index + matchingEnd.length,
        contentStartIndex: contentStart,
        contentEndIndex: contentEnd,
        rawContent: raw,
      });
    }

    return sections;
  }

  public static replaceSection(content: string, sectionId: string, newContent: string): string {
    const sections = this.parse(content);
    const existing = sections.get(sectionId);

    if (!existing) {
      // Append section to bottom
      return `${content.trimEnd()}\n\n${this.wrap(sectionId, newContent)}\n`;
    }

    const before = content.substring(0, existing.contentStartIndex);
    const after = content.substring(existing.contentEndIndex);
    return `${before}\n${newContent.trim()}\n${after}`;
  }

  public static updateAllSections(
    content: string,
    sectionMap: Record<string, string>
  ): string {
    let result = content;
    // Process sections from bottom to top so indices don't shift
    const sections = Array.from(this.parse(content).values()).sort(
      (a, b) => b.startMarkerIndex - a.startMarkerIndex
    );

    for (const sec of sections) {
      if (sec.id in sectionMap) {
        const replacement = sectionMap[sec.id];
        const before = result.substring(0, sec.contentStartIndex);
        const after = result.substring(sec.contentEndIndex);
        result = `${before}\n${replacement.trim()}\n${after}`;
      }
    }

    // Append any new sections that didn't exist before
    for (const [id, secContent] of Object.entries(sectionMap)) {
      if (!sections.some((s) => s.id === id)) {
        result = `${result.trimEnd()}\n\n${this.wrap(id, secContent)}\n`;
      }
    }

    return result;
  }
}
