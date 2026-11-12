import type { RepositorySnapshot } from '../types/schemas.js';

export interface UiDetectionResult {
  hasRunnableUi: boolean;
  uiKind: 'web' | 'cli' | 'none';
  framework?: string;
  startCommand?: string;
  defaultPort?: number;
  defaultUrl?: string;
  reason: string;
}

export class UiDetector {
  public static detect(snapshot: RepositorySnapshot): UiDetectionResult {
    const manifest = snapshot.manifests[0];
    const scripts = manifest?.scripts ?? {};

    // 1. Web application detection
    if (snapshot.kind === 'web' || snapshot.frameworks.some((f) => ['Next.js', 'React', 'Vue', 'Nuxt', 'Svelte', 'Vite'].includes(f))) {
      let startCommand = 'npm run dev';
      if (!scripts['dev']) {
        if (scripts['start']) startCommand = 'npm start';
        else if (scripts['serve']) startCommand = 'npm run serve';
      }

      let port = 3000;
      if (snapshot.frameworks.includes('Vite')) {
        port = 5173;
      } else if (snapshot.frameworks.includes('Nuxt')) {
        port = 3000;
      }

      const primaryFw = snapshot.frameworks.find((f) => ['Next.js', 'Nuxt', 'Vite', 'React', 'Vue', 'Svelte'].includes(f)) ?? 'Web UI';

      return {
        hasRunnableUi: true,
        uiKind: 'web',
        framework: primaryFw,
        startCommand,
        defaultPort: port,
        defaultUrl: `http://localhost:${port}`,
        reason: `Detected ${primaryFw} web application with '${startCommand}' launch script.`,
      };
    }

    // 2. Python Web UI (e.g. Streamlit, Gradio)
    if (snapshot.frameworks.includes('Streamlit')) {
      return {
        hasRunnableUi: true,
        uiKind: 'web',
        framework: 'Streamlit',
        startCommand: 'streamlit run app.py',
        defaultPort: 8501,
        defaultUrl: 'http://localhost:8501',
        reason: 'Detected Streamlit interactive dashboard.',
      };
    }

    // 3. CLI tool with terminal output
    if (snapshot.kind === 'cli') {
      const binName = manifest?.name ?? 'cli';
      return {
        hasRunnableUi: false,
        uiKind: 'cli',
        startCommand: `${binName} --help`,
        reason: `Project is a command-line utility (${binName}); graphical UI screenshots are not applicable. Terminal recordings (VHS/asciinema) or code blocks are recommended.`,
      };
    }

    // 4. Library / API / Unknown without graphical interface
    return {
      hasRunnableUi: false,
      uiKind: 'none',
      reason: `Project kind is '${snapshot.kind}'; no graphical user interface detected. Screenshot capture skipped gracefully.`,
    };
  }
}
