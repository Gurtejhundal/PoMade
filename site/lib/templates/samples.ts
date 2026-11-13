import type { ProjectFacts } from './types';

export const SAMPLE_PROJECTS: Record<string, ProjectFacts> = {
  character: {
    name: 'Pomade',
    tagline: 'Make every repo worth opening.',
    description:
      'He doesn’t write your code. He makes sure it looks finished. The agent-native GitHub repository presentation, packaging, and maintenance engine.',
    category: 'cli',
    author: 'Gurtej Hundal',
    license: 'MIT',
    repositoryUrl: 'https://github.com/Gurtejhundal/PoMade',
    homepageUrl: 'https://pomade.dev',
    primaryLanguage: 'TypeScript',
    frameworks: ['Commander', 'Vitest'],
    installCommand: 'npm install -g pomade',
    runCommand: 'pomade scan && pomade audit',
    testCommand: 'npm test',
    includeMascot: true,
    includeManagedMarkers: true,
    features: [
      {
        title: 'Multi-Manifest Scanner',
        description: 'Detects languages, frameworks, licenses, and entrypoints across Node, Python, Rust, and Go.',
      },
      {
        title: 'Evidence-Backed Authoring',
        description: 'Generates natural, truthful documentation without ever fabricating commands or stars.',
      },
      {
        title: 'Managed Markers',
        description: 'Protects personal human writing outside <!-- pomade:start/end --> blocks.',
      },
      {
        title: 'Documentation Drift Engine',
        description: 'Flags outdated READMEs whenever package scripts or interfaces change.',
      },
    ],
    badges: [
      { label: 'license', value: 'MIT', color: 'blue' },
      { label: 'version', value: '1.0.0-rc.1', color: 'informational' },
      { label: 'CI', value: 'passing', color: 'brightgreen' },
    ],
  },

  'terminal-noir': {
    name: 'GhostProxy',
    tagline: 'Zero-latency memory-safe reverse proxy for microservice clusters.',
    description:
      'Engineered in Rust with epoll event loops. GhostProxy transparently intercepts, sanitizes, and routes millions of concurrent HTTP/3 and gRPC streams with sub-millisecond tail latency.',
    category: 'cli',
    author: 'Infrastructure Core Team',
    license: 'Apache-2.0',
    repositoryUrl: 'https://github.com/org/ghost-proxy',
    primaryLanguage: 'Rust',
    frameworks: ['Tokio', 'Hyper', 'Tower'],
    installCommand: 'cargo install ghost-proxy-cli',
    runCommand: 'ghost-proxy --config /etc/ghost.toml --workers 8',
    testCommand: 'cargo test --all',
    includeManagedMarkers: true,
    features: [
      {
        title: 'Kernel-Bypass I/O',
        description: 'Harnesses io_uring on Linux 5.10+ to achieve zero-copy packet forwarding.',
      },
      {
        title: 'Strict Dynamic TLS',
        description: 'Automated ACME certificate rotation with zero connection drops.',
      },
      {
        title: 'Circuit Breakers',
        description: 'Adaptive exponential backoff and localized rate-limiting per route.',
      },
    ],
    badges: [
      { label: 'license', value: 'Apache-2.0', color: 'blue' },
      { label: 'crate', value: 'v0.9.4', color: 'orange' },
      { label: 'rustc', value: '1.75+', color: 'black' },
    ],
  },

  'product-showcase': {
    name: 'CanvasStudio',
    tagline: 'Infinite collaborative canvas for interactive system architecture.',
    description:
      'CanvasStudio gives product teams an infinite, tactile workspace where system diagrams, API endpoints, live metrics, and user feedback come together in real time.',
    category: 'web',
    author: 'Nexu Design Collective',
    license: 'MIT',
    repositoryUrl: 'https://github.com/nexu-io/canvas-studio',
    homepageUrl: 'https://canvas-studio.dev',
    primaryLanguage: 'TypeScript',
    frameworks: ['Next.js', 'React', 'Tailwind CSS', 'Zustand'],
    installCommand: 'npm install && npm run build',
    runCommand: 'npm run dev',
    testCommand: 'npm run test:e2e',
    screenshotUrl: 'docs/media/social-preview.svg',
    includeManagedMarkers: true,
    features: [
      {
        title: 'Real-Time Multiplayer Sync',
        description: 'CRDT-backed state synchronization ensures zero merge conflicts across team sessions.',
      },
      {
        title: 'Live Endpoint Probing',
        description: 'Send live requests directly from canvas nodes and visualize latency heatmaps.',
      },
      {
        title: 'Vector PDF & SVG Export',
        description: 'Export publication-grade architecture schematics with crystal clarity.',
      },
    ],
    badges: [
      { label: 'license', value: 'MIT', color: 'blue' },
      { label: 'version', value: '2.1.0', color: 'green' },
      { label: 'web', value: 'live', color: 'brightgreen' },
    ],
  },

  editorial: {
    name: 'Solitude',
    tagline: 'A quiet, local-first journal for deep engineering reflection.',
    description:
      'Solitude strips away notification badges, social feeds, and cloud sync clutter. It is a distraction-free writing space where engineers document architectural decisions and maintain mental rhythm.',
    category: 'library',
    author: 'Gurtej Hundal',
    license: 'MIT',
    repositoryUrl: 'https://github.com/Gurtejhundal/solitude',
    homepageUrl: 'https://solitude.app',
    primaryLanguage: 'TypeScript',
    frameworks: ['React', 'Electron', 'Tailwind CSS'],
    installCommand: 'npm install solitude-app',
    runCommand: 'solitude --zen',
    testCommand: 'npm test',
    includeManagedMarkers: true,
    features: [
      {
        title: 'Plain Markdown Storage',
        description: 'Your notes stay in simple .md files on your disk. No proprietary databases.',
      },
      {
        title: 'Focus Clock Rhythm',
        description: 'Gentle, non-intrusive soundscapes and milestone reminders.',
      },
      {
        title: 'Git Version History',
        description: 'Every thought is backed by local git commits with full offline privacy.',
      },
    ],
    badges: [
      { label: 'license', value: 'MIT', color: 'blue' },
      { label: 'aesthetic', value: 'monochrome', color: 'black' },
    ],
  },

  'technical-precision': {
    name: 'HyperState',
    tagline: 'Deterministic, memory-bounded state container with time-travel snapshots.',
    description:
      'A specification-grade state management library for distributed applications. Guarantees linearizable event ordering, immutable memory snapshots, and sub-microsecond atomic transitions.',
    category: 'api',
    author: 'Platform Architecture Guild',
    license: 'MIT',
    repositoryUrl: 'https://github.com/platform/hyper-state',
    primaryLanguage: 'TypeScript',
    frameworks: ['TypeScript', 'Vitest'],
    installCommand: 'npm install @hyper/state',
    runCommand: 'npm run benchmark',
    testCommand: 'vitest run --coverage',
    includeManagedMarkers: true,
    features: [
      {
        title: 'Zero-Copy Tree Traversal',
        description: 'Structural sharing algorithm eliminates garbage collection overhead under heavy load.',
      },
      {
        title: 'Time-Travel Undo/Redo',
        description: 'Compact delta logs allow rewinding thousands of states in under 2ms.',
      },
      {
        title: 'Strict Schema Contracts',
        description: 'Runtime type validation powered by compile-time generic inference.',
      },
    ],
    badges: [
      { label: 'npm', value: 'v3.4.0', color: 'informational' },
      { label: 'types', value: 'strict', color: 'blue' },
      { label: 'coverage', value: '100%', color: 'brightgreen' },
    ],
  },

  'research-lab': {
    name: 'AgentCritique',
    tagline: 'Iterative reflection loops for self-improving code generation agents.',
    description:
      'We present AgentCritique, a lightweight framework where autonomous coding agents evaluate generated code against formal test harnesses, reducing syntax errors by 41.2% without supervised human intervention.',
    category: 'research',
    author: 'Nous AI Research',
    license: 'Apache-2.0',
    repositoryUrl: 'https://github.com/nous/agent-critique',
    homepageUrl: 'https://arxiv.org/abs/2604.01942',
    primaryLanguage: 'Python',
    frameworks: ['PyTorch', 'Transformers', 'vLLM', 'pytest'],
    installCommand: 'pip install -r requirements.txt && python setup.py develop',
    runCommand: 'python eval/evaluate_agent.py --dataset humaneval --critique_steps 3',
    testCommand: 'pytest tests/ -v',
    includeManagedMarkers: true,
    features: [
      {
        title: 'Multi-Step Criticism Loop',
        description: 'Generates structured intermediate verification traces before final code synthesis.',
      },
      {
        title: 'Verifiable Evaluation Harness',
        description: 'Direct execution in sandboxed environments eliminates ungrounded metric reporting.',
      },
      {
        title: 'Open Model Checkpoints',
        description: 'Pre-trained weights released under open permissive weights license.',
      },
    ],
    badges: [
      { label: 'Paper', value: 'ArXiv', color: 'red' },
      { label: 'License', value: 'Apache-2.0', color: 'green' },
      { label: 'Benchmarks', value: 'Verifiable', color: 'blue' },
    ],
  },
};
