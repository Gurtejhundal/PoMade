import type { RepositorySnapshot } from '../types/schemas.js';
import { UiDetector, type UiDetectionResult } from './detector.js';

export interface MediaCapturePlan {
  planId: string;
  repoRoot: string;
  uiDetection: UiDetectionResult;
  captureRecommended: boolean;
  recommendedPath: string;
  dimensions: { width: number; height: number };
  privacyRules: string[];
  steps: string[];
  playwrightScript?: string;
  vhsTapeScript?: string;
}

export class MediaCapturePlanner {
  public static createPlan(snapshot: RepositorySnapshot): MediaCapturePlan {
    const ui = UiDetector.detect(snapshot);
    const planId = `media-${Date.now().toString(36)}`;

    const privacyRules = [
      'Do not capture live production credentials, tokens, or sensitive API keys.',
      'Use seeded demo test fixtures with non-identifiable sample data.',
      'Redact email addresses, private user IDs, and local host paths from the viewport.',
    ];

    if (ui.uiKind === 'web') {
      const steps = [
        `1. Request user authorization to start the local web application: \`${ui.startCommand}\`.`,
        `2. Wait for local server to be ready at ${ui.defaultUrl}.`,
        `3. Navigate browser to ${ui.defaultUrl} with viewport 1280×720 at device scale 2x.`,
        '4. Capture a clean PNG hero screenshot and save to `docs/media/hero.png`.',
        '5. (Optional) Record a 4–8 second user flow GIF and save to `docs/media/demo.gif`.',
        '6. Terminate the local development server process cleanly.',
      ];

      const playwrightScript = `// Playwright capture script for ${snapshot.manifests[0]?.name ?? 'app'}
import { chromium } from 'playwright';

async function capture() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 2 });
  await page.goto('${ui.defaultUrl ?? 'http://localhost:3000'}', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'docs/media/hero.png' });
  await browser.close();
  console.log('Saved screenshot to docs/media/hero.png');
}

capture();
`;

      return {
        planId,
        repoRoot: snapshot.repoRoot,
        uiDetection: ui,
        captureRecommended: true,
        recommendedPath: 'docs/media/hero.png',
        dimensions: { width: 1280, height: 720 },
        privacyRules,
        steps,
        playwrightScript,
      };
    }

    if (ui.uiKind === 'cli') {
      const binName = snapshot.manifests[0]?.name ?? 'cli';
      const steps = [
        `1. Execute verified command: \`${ui.startCommand}\`.`,
        '2. Capture high-contrast terminal output with clean monospace font.',
        '3. (Optional) Record a VHS tape script to produce `docs/media/terminal.gif`.',
      ];

      const vhsTapeScript = `# VHS tape script for ${binName}
Output docs/media/terminal.gif
Set FontSize 16
Set Width 800
Set Height 400
Type "${binName} --help"
Sleep 500ms
Enter
Sleep 2s
`;

      return {
        planId,
        repoRoot: snapshot.repoRoot,
        uiDetection: ui,
        captureRecommended: false,
        recommendedPath: 'docs/media/terminal.gif',
        dimensions: { width: 800, height: 400 },
        privacyRules,
        steps,
        vhsTapeScript,
      };
    }

    // No UI
    return {
      planId,
      repoRoot: snapshot.repoRoot,
      uiDetection: ui,
      captureRecommended: false,
      recommendedPath: 'docs/media/architecture.svg',
      dimensions: { width: 800, height: 360 },
      privacyRules,
      steps: [
        'Project has no graphical user interface.',
        'Screenshot capture skipped gracefully (Pomade never generates fake screenshots).',
        'Recommend generating a clean vector SVG architecture diagram instead: `pomade media generate-diagram`.',
      ],
    };
  }
}
