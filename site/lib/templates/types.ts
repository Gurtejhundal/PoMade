export type ProjectCategory = 'cli' | 'web' | 'library' | 'api' | 'research';

export interface ProjectFeature {
  title: string;
  description: string;
  screenshotUrl?: string;
}

export interface ProjectBadge {
  label: string;
  value: string;
  color: string;
  linkUrl?: string;
}

export interface ProjectBenchmark {
  metric: string;
  score: string;
  baseline: string;
  source: string;
}

export interface ProjectFacts {
  name: string;
  tagline: string;
  description: string;
  category: ProjectCategory;
  author: string;
  license: string;
  repositoryUrl: string;
  homepageUrl?: string;
  primaryLanguage: string;
  frameworks: string[];
  installCommand: string;
  buildCommand?: string;
  testCommand?: string;
  runCommand: string;
  features: ProjectFeature[];
  badges: ProjectBadge[];
  architectureMermaid?: string;
  benchmarks?: ProjectBenchmark[];
  citationBibtex?: string;
  demoGifUrl?: string;
  screenshotUrl?: string;

  // Visual & Marker Options
  includeMascot?: boolean;
  includeArchitectureSvg?: boolean;
  includeSocialCard?: boolean;
  includeManagedMarkers?: boolean;
  enabledSections?: Record<string, boolean>;
}

export interface TemplateDefinition {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  recommendedFor: string[];
  supportedSections: string[];
  defaultSectionOrder: string[];
  render: (facts: ProjectFacts) => string;
}

export interface AuditFinding {
  id: string;
  status: 'pass' | 'warn' | 'fail' | 'info';
  category: string;
  message: string;
}

export interface ValidationResult {
  score: number;
  mascotReaction: 'judging' | 'puzzled' | 'approving';
  reactionMessage: string;
  findings: AuditFinding[];
}
