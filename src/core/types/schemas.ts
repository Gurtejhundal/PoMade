import { z } from 'zod';

export const ProjectKindSchema = z.enum([
  'cli',
  'web',
  'api',
  'library',
  'ml',
  'monorepo',
  'docs',
  'unknown',
]);
export type ProjectKind = z.infer<typeof ProjectKindSchema>;

export const MaturityStageSchema = z.enum([
  'idea',
  'prototype',
  'usable',
  'released',
  'maintained',
  'unknown',
]);
export type MaturityStage = z.infer<typeof MaturityStageSchema>;

export const EvidenceKindSchema = z.enum([
  'file',
  'manifest',
  'command-result',
  'git',
  'user-supplied',
]);
export type EvidenceKind = z.infer<typeof EvidenceKindSchema>;

export const EvidenceConfidenceSchema = z.enum(['high', 'medium', 'low']);
export type EvidenceConfidence = z.infer<typeof EvidenceConfidenceSchema>;

export const ClaimStatusSchema = z.enum([
  'verified',
  'conditional',
  'unknown',
  'contradicted',
]);
export type ClaimStatus = z.infer<typeof ClaimStatusSchema>;

export const EvidenceSchema = z.object({
  id: z.string(),
  kind: EvidenceKindSchema,
  pathOrCommand: z.string(),
  location: z.string().optional(),
  observedValue: z.unknown(),
  confidence: EvidenceConfidenceSchema,
  fingerprint: z.string().optional(),
});
export type Evidence = z.infer<typeof EvidenceSchema>;

export const ClaimSchema = z.object({
  id: z.string(),
  text: z.string(),
  evidenceIds: z.array(z.string()),
  status: ClaimStatusSchema,
  verificationNote: z.string().optional(),
});
export type Claim = z.infer<typeof ClaimSchema>;

export const AuditCategorySchema = z.enum([
  'clarity',
  'first-run',
  'trust',
  'discoverability',
  'presentation',
  'maintainability',
]);
export type AuditCategory = z.infer<typeof AuditCategorySchema>;

export const FindingStatusSchema = z.enum([
  'pass',
  'warn',
  'fail',
  'not-applicable',
  'blocked',
]);
export type FindingStatus = z.infer<typeof FindingStatusSchema>;

export const FindingSeveritySchema = z.enum(['P0', 'P1', 'P2', 'P3']);
export type FindingSeverity = z.infer<typeof FindingSeveritySchema>;

export const FindingSchema = z.object({
  id: z.string(),
  ruleId: z.string(),
  category: AuditCategorySchema,
  status: FindingStatusSchema,
  severity: FindingSeveritySchema,
  title: z.string(),
  reason: z.string(),
  evidenceIds: z.array(z.string()),
  suggestedAction: z.string().optional(),
});
export type Finding = z.infer<typeof FindingSchema>;

export const GitStateSchema = z.object({
  isGit: z.boolean(),
  branch: z.string().nullable(),
  clean: z.boolean(),
  commitSha: z.string().nullable(),
  remoteUrl: z.string().nullable(),
  trackedFilesCount: z.number(),
});
export type GitState = z.infer<typeof GitStateSchema>;

export const ManifestFactSchema = z.object({
  manifestType: z.string(), // 'npm' | 'pyproject' | 'cargo' | 'gomod' etc.
  path: z.string(),
  name: z.string().optional(),
  version: z.string().optional(),
  description: z.string().optional(),
  license: z.string().optional(),
  scripts: z.record(z.string()).optional(),
  dependencies: z.array(z.string()).optional(),
  devDependencies: z.array(z.string()).optional(),
  entrypoints: z.array(z.string()).optional(),
});
export type ManifestFact = z.infer<typeof ManifestFactSchema>;

export const DocumentationFactSchema = z.object({
  path: z.string(),
  kind: z.string(), // 'readme' | 'contributing' | 'license' | 'code-of-conduct' | 'security' | 'changelog' | 'support' | 'docs'
  sizeBytes: z.number(),
  hasManagedSections: z.boolean().optional(),
});
export type DocumentationFact = z.infer<typeof DocumentationFactSchema>;

export const AssetFactSchema = z.object({
  path: z.string(),
  kind: z.enum(['image', 'video', 'gif', 'diagram', 'other']),
  sizeBytes: z.number(),
});
export type AssetFact = z.infer<typeof AssetFactSchema>;

export const WorkflowFactSchema = z.object({
  path: z.string(),
  name: z.string(),
  triggers: z.array(z.string()).optional(),
});
export type WorkflowFact = z.infer<typeof WorkflowFactSchema>;

export const LicenseFactSchema = z.object({
  path: z.string().optional(),
  spdxId: z.string().optional(),
  isStandard: z.boolean(),
  origin: z.enum(['file', 'manifest', 'none']),
});
export type LicenseFact = z.infer<typeof LicenseFactSchema>;

export const RepositorySnapshotSchema = z.object({
  repoRoot: z.string(),
  gitState: GitStateSchema,
  kind: ProjectKindSchema,
  stage: MaturityStageSchema,
  primaryLanguage: z.string().optional(),
  languages: z.record(z.number()),
  frameworks: z.array(z.string()),
  manifests: z.array(ManifestFactSchema),
  docs: z.array(DocumentationFactSchema),
  assets: z.array(AssetFactSchema),
  workflows: z.array(WorkflowFactSchema),
  license: LicenseFactSchema.nullable(),
  warnings: z.array(z.string()),
  snapshotFingerprint: z.string(),
});
export type RepositorySnapshot = z.infer<typeof RepositorySnapshotSchema>;

export const AuditReportSchema = z.object({
  schemaVersion: z.literal('0.1.0'),
  timestamp: z.string(),
  repoRoot: z.string(),
  kind: ProjectKindSchema,
  stage: MaturityStageSchema,
  findings: z.array(FindingSchema),
  categoryScores: z.record(
    AuditCategorySchema,
    z.object({
      score: z.number(),
      pass: z.number(),
      warn: z.number(),
      fail: z.number(),
      na: z.number(),
      blocked: z.number(),
    })
  ),
  overallScore: z.number(),
  topActions: z.array(z.string()),
  evidenceMap: z.record(z.string(), EvidenceSchema),
});
export type AuditReport = z.infer<typeof AuditReportSchema>;

export const PresetSchema = z.enum(['minimal', 'studio', 'maintainer']);
export type Preset = z.infer<typeof PresetSchema>;

export const ActionKindSchema = z.enum([
  'write-local',
  'create-media-plan',
  'update-remote-metadata',
  'draft-release',
]);
export type ActionKind = z.infer<typeof ActionKindSchema>;

export const PermissionLevelSchema = z.enum([
  'local-write',
  'isolated-exec',
  'remote-write',
  'remote-publish',
]);
export type PermissionLevel = z.infer<typeof PermissionLevelSchema>;

export const ActionSchema = z.object({
  id: z.string(),
  kind: ActionKindSchema,
  target: z.string(),
  description: z.string(),
  beforeHash: z.string(),
  afterHash: z.string(),
  proposedContent: z.string(),
  proposedDiff: z.string(),
  evidenceIds: z.array(z.string()),
  permission: PermissionLevelSchema,
  risk: z.enum(['low', 'medium', 'high']),
});
export type Action = z.infer<typeof ActionSchema>;

export const PlanSchema = z.object({
  schemaVersion: z.literal('0.1.0'),
  planId: z.string(),
  repoRoot: z.string(),
  baseSnapshotFingerprint: z.string(),
  createdAt: z.string(),
  preset: PresetSchema,
  actions: z.array(ActionSchema),
  warnings: z.array(z.string()),
  summary: z.string(),
});
export type Plan = z.infer<typeof PlanSchema>;
