import pc from 'picocolors';
import type { RepositorySnapshot, AuditReport, Finding, Plan } from '../core/types/schemas.js';
import type { ApplyResult } from '../core/apply/applier.js';

export function formatScanText(snapshot: RepositorySnapshot): string {
  const lines: string[] = [];

  lines.push('');
  lines.push(pc.bold(pc.cyan('Pomade Repository Scan Report')));
  lines.push(pc.dim('----------------------------------------------------'));
  lines.push(`${pc.bold('Repo Root:')}        ${snapshot.repoRoot}`);
  lines.push(`${pc.bold('Project Kind:')}     ${pc.green(snapshot.kind.toUpperCase())}`);
  lines.push(`${pc.bold('Maturity Stage:')}   ${pc.yellow(snapshot.stage.toUpperCase())}`);
  lines.push(`${pc.bold('Primary Language:')} ${snapshot.primaryLanguage ?? 'None detected'}`);

  if (snapshot.frameworks.length > 0) {
    lines.push(`${pc.bold('Frameworks:')}       ${snapshot.frameworks.join(', ')}`);
  }

  // Git state
  lines.push('');
  lines.push(pc.bold('Git Environment:'));
  if (snapshot.gitState.isGit) {
    lines.push(`  Branch:        ${snapshot.gitState.branch ?? 'detached/none'}`);
    lines.push(`  Working Tree:  ${snapshot.gitState.clean ? pc.green('Clean') : pc.yellow('Dirty / Uncommitted changes')}`);
    lines.push(`  Commit SHA:    ${snapshot.gitState.commitSha?.substring(0, 7) ?? 'none'}`);
    lines.push(`  Remote URL:    ${snapshot.gitState.remoteUrl ?? pc.dim('none')}`);
  } else {
    lines.push(`  ${pc.yellow('Not a git repository')}`);
  }

  // Manifests & Docs
  lines.push('');
  lines.push(pc.bold(`Manifests (${snapshot.manifests.length}):`));
  for (const m of snapshot.manifests) {
    lines.push(`  • ${pc.bold(m.path)} (${m.name ?? 'unnamed'}@${m.version ?? '0.0.0'})`);
  }

  lines.push('');
  lines.push(pc.bold(`Documentation (${snapshot.docs.length}):`));
  if (snapshot.docs.length === 0) {
    lines.push(pc.dim('  None found'));
  } else {
    for (const d of snapshot.docs) {
      const managed = d.hasManagedSections ? pc.green(' [pomade managed]') : '';
      lines.push(`  • ${d.path} (${d.kind}, ${d.sizeBytes} B)${managed}`);
    }
  }

  // Assets
  if (snapshot.assets.length > 0) {
    lines.push('');
    lines.push(pc.bold(`Media Assets (${snapshot.assets.length}):`));
    for (const a of snapshot.assets) {
      lines.push(`  • ${a.path} (${a.kind}, ${a.sizeBytes} B)`);
    }
  }

  // License
  lines.push('');
  lines.push(pc.bold('License Status:'));
  if (snapshot.license) {
    lines.push(`  ${pc.green('✔')} ${snapshot.license.spdxId ?? 'Custom license'} (${snapshot.license.origin})`);
  } else {
    lines.push(`  ${pc.red('✖')} No license found (Pomade never auto-assigns licenses without choice)`);
  }

  // Warnings
  if (snapshot.warnings.length > 0) {
    lines.push('');
    lines.push(pc.bold(pc.yellow('Warnings:')));
    for (const w of snapshot.warnings) {
      lines.push(`  ! ${w}`);
    }
  }

  lines.push('');
  lines.push(pc.dim(`Fingerprint: ${snapshot.snapshotFingerprint}`));
  lines.push('');

  return lines.join('\n');
}

export function formatAuditText(report: AuditReport): string {
  const lines: string[] = [];

  lines.push('');
  lines.push(pc.bold(pc.cyan('Pomade Repository Quality Audit')));
  lines.push(pc.dim('----------------------------------------------------'));
  lines.push(`${pc.bold('Target:')} ${report.repoRoot}`);
  lines.push(`${pc.bold('Kind:')} ${pc.green(report.kind.toUpperCase())}  |  ${pc.bold('Stage:')} ${pc.yellow(report.stage.toUpperCase())}`);
  lines.push(`${pc.bold('Overall Presentation Score:')} ${getScoreColor(report.overallScore)(`${report.overallScore}/100`)}`);
  lines.push('');

  // Category scores
  lines.push(pc.bold('Category Breakdown:'));
  for (const [cat, summary] of Object.entries(report.categoryScores)) {
    const catName = (cat.charAt(0).toUpperCase() + cat.slice(1)).padEnd(16);
    const scoreStr = getScoreColor(summary.score)(`${summary.score}%`.padStart(4));
    const counts = pc.dim(`(${summary.pass} pass, ${summary.warn} warn, ${summary.fail} fail, ${summary.blocked} blocked, ${summary.na} n/a)`);
    lines.push(`  ${catName} ${scoreStr} ${counts}`);
  }

  // Findings
  lines.push('');
  lines.push(pc.bold('Findings & Diagnostics:'));
  for (const f of report.findings) {
    lines.push(formatFinding(f));
  }

  // Top Actions
  if (report.topActions.length > 0) {
    lines.push('');
    lines.push(pc.bold(pc.magenta('Top Recommended Actions:')));
    report.topActions.forEach((act, i) => {
      lines.push(`  ${pc.bold(`${i + 1}.`)} ${act}`);
    });
  }

  lines.push('');
  lines.push(pc.dim('Status: READ-ONLY AUDIT — no files were modified.'));
  lines.push('');

  return lines.join('\n');
}

export function formatPlanText(plan: Plan): string {
  const lines: string[] = [];

  lines.push('');
  lines.push(pc.bold(pc.cyan(`Pomade Action Plan [${plan.planId}]`)));
  lines.push(pc.dim('----------------------------------------------------'));
  lines.push(`${pc.bold('Target Repo:')}    ${plan.repoRoot}`);
  lines.push(`${pc.bold('Preset:')}         ${pc.green(plan.preset.toUpperCase())}`);
  lines.push(`${pc.bold('Summary:')}        ${plan.summary}`);
  lines.push('');

  if (plan.actions.length === 0) {
    lines.push(pc.green('✔ Repository presentation is already up to date. No actions proposed.'));
  } else {
    lines.push(pc.bold(`Proposed Actions (${plan.actions.length}):`));
    for (const a of plan.actions) {
      const riskColor = a.risk === 'low' ? pc.green : a.risk === 'medium' ? pc.yellow : pc.red;
      lines.push(`  • ${pc.bold(a.target)} [${riskColor(a.risk.toUpperCase())} RISK]`);
      lines.push(`    ${pc.dim(a.description)}`);
      lines.push(`    ${pc.dim(`Before hash: ${a.beforeHash ? a.beforeHash.substring(0, 10) : '(empty)'} -> After hash: ${a.afterHash.substring(0, 10)}`)}`);
    }
    lines.push('');
    lines.push(pc.bold(pc.yellow('Next steps:')));
    lines.push(`  1. Review changes: ${pc.cyan('pomade diff')}`);
    lines.push(`  2. Apply changes:  ${pc.cyan('pomade apply --approved')}`);
  }

  lines.push('');
  lines.push(pc.dim('Status: PREVIEW ONLY — no files were modified.'));
  lines.push('');

  return lines.join('\n');
}

export function formatDiffText(plan: Plan): string {
  const lines: string[] = [];

  lines.push('');
  lines.push(pc.bold(pc.cyan(`Pomade Proposed Diffs [${plan.planId}]`)));
  lines.push(pc.dim('----------------------------------------------------'));

  if (plan.actions.length === 0) {
    lines.push(pc.green('No diffs to display (repository is up to date).'));
  } else {
    for (const action of plan.actions) {
      lines.push(pc.bold(`Diff for ${action.target}:`));
      lines.push(colorizeDiff(action.proposedDiff));
      lines.push('');
    }
  }

  return lines.join('\n');
}

export function formatApplyText(result: ApplyResult): string {
  const lines: string[] = [];

  lines.push('');
  lines.push(pc.bold(pc.green(`✔ Pomade Plan Successfully Applied [${result.planId}]`)));
  lines.push(pc.dim('----------------------------------------------------'));
  lines.push(`${pc.bold('Actions Applied:')} ${result.appliedCount}`);
  lines.push(`${pc.bold('Modified Files:')}`);
  for (const f of result.modifiedFiles) {
    lines.push(`  • ${pc.green(f)} (updated atomically)`);
  }
  lines.push('');

  return lines.join('\n');
}

export function formatDriftText(report: {
  repoRoot: string;
  hasDrift: boolean;
  findings: Array<{
    id: string;
    category: string;
    severity: string;
    affectedSection: string;
    description: string;
  }>;
  recommendedAction: string;
}): string {
  const lines: string[] = [];

  lines.push('');
  lines.push(pc.bold(pc.cyan('Pomade Documentation Drift Report')));
  lines.push(pc.dim('----------------------------------------------------'));
  lines.push(`${pc.bold('Target Repo:')} ${report.repoRoot}`);

  if (!report.hasDrift) {
    lines.push(pc.green('✔ Documentation is synchronized with codebase interfaces. Zero drift detected.'));
  } else {
    lines.push(pc.yellow(`⚠ Documentation drift detected (${report.findings.length} item(s)):`));
    lines.push('');
    for (const f of report.findings) {
      const sevColor = f.severity === 'required' ? pc.red : f.severity === 'suggested' ? pc.yellow : pc.cyan;
      lines.push(`  • [${sevColor(f.severity.toUpperCase())}] Section: ${pc.bold(f.affectedSection)} (${f.category})`);
      lines.push(`    ${f.description}`);
    }
    lines.push('');
    lines.push(`${pc.bold('Recommended Action:')} ${pc.magenta(report.recommendedAction)}`);
  }

  lines.push('');
  lines.push(pc.dim('Status: READ-ONLY DRIFT CHECK — no files modified.'));
  lines.push('');

  return lines.join('\n');
}

export function formatMediaPlanText(plan: {
  planId: string;
  repoRoot: string;
  uiDetection: {
    hasRunnableUi: boolean;
    uiKind: string;
    framework?: string;
    startCommand?: string;
    reason: string;
  };
  captureRecommended: boolean;
  recommendedPath: string;
  steps: string[];
  privacyRules: string[];
}): string {
  const lines: string[] = [];

  lines.push('');
  lines.push(pc.bold(pc.cyan(`Pomade Media Capture Plan [${plan.planId}]`)));
  lines.push(pc.dim('----------------------------------------------------'));
  lines.push(`${pc.bold('Target Repo:')}    ${plan.repoRoot}`);
  lines.push(`${pc.bold('UI Detected:')}    ${plan.uiDetection.hasRunnableUi ? pc.green('Yes (' + plan.uiDetection.uiKind.toUpperCase() + ')') : pc.yellow('No (' + plan.uiDetection.uiKind.toUpperCase() + ')')}`);
  lines.push(`${pc.bold('Diagnostics:')}    ${plan.uiDetection.reason}`);
  lines.push(`${pc.bold('Recommendation:')} ${plan.captureRecommended ? pc.green('Capture UI Screenshot (' + plan.recommendedPath + ')') : pc.yellow('Skip screenshots; SVG diagram or terminal recording recommended')}`);
  lines.push('');

  lines.push(pc.bold('Privacy & Safety Rules:'));
  for (const rule of plan.privacyRules) {
    lines.push(`  • ${pc.yellow(rule)}`);
  }
  lines.push('');

  lines.push(pc.bold('Execution Steps:'));
  for (const step of plan.steps) {
    lines.push(`  ${step}`);
  }

  lines.push('');
  lines.push(pc.dim('Status: MEDIA PLAN ONLY — no code was executed and no screenshots were generated.'));
  lines.push('');

  return lines.join('\n');
}

function colorizeDiff(rawDiff: string): string {
  return rawDiff
    .split('\n')
    .map((line) => {
      if (line.startsWith('+++') || line.startsWith('---')) return pc.bold(line);
      if (line.startsWith('@@')) return pc.cyan(line);
      if (line.startsWith('+')) return pc.green(line);
      if (line.startsWith('-')) return pc.red(line);
      return pc.dim(line);
    })
    .join('\n');
}

function formatFinding(f: Finding): string {
  let badge = '';
  switch (f.status) {
    case 'pass':
      badge = pc.green(' PASS ');
      break;
    case 'warn':
      badge = pc.yellow(' WARN ');
      break;
    case 'fail':
      badge = pc.red(' FAIL ');
      break;
    case 'blocked':
      badge = pc.bgRed(pc.white(' BLOCK '));
      break;
    case 'not-applicable':
      badge = pc.dim(' N/A  ');
      break;
  }

  const sev = pc.dim(`[${f.severity}]`);
  return `  ${badge} ${sev} ${pc.bold(f.title)}\n         ${pc.dim(f.reason)}`;
}

function getScoreColor(score: number): (text: string) => string {
  if (score >= 80) return pc.green;
  if (score >= 50) return pc.yellow;
  return pc.red;
}
