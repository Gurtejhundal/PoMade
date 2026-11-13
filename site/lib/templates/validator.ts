import type { ProjectFacts, ValidationResult, AuditFinding } from './types';

export function validateProjectFacts(facts: ProjectFacts): ValidationResult {
  const findings: AuditFinding[] = [];
  let score = 0;

  // 1. Name Check (15 pts)
  if (facts.name && facts.name.trim().length > 0) {
    score += 15;
    findings.push({
      id: 'name-present',
      status: 'pass',
      category: 'Clarity',
      message: `Project name '${facts.name}' is clearly identified.`,
    });
  } else {
    findings.push({
      id: 'name-missing',
      status: 'fail',
      category: 'Clarity',
      message: 'Missing project name. Every repository requires a clear title.',
    });
  }

  // 2. Tagline & Description (20 pts)
  if (facts.tagline && facts.tagline.trim().length > 5) {
    score += 10;
    findings.push({
      id: 'tagline-present',
      status: 'pass',
      category: 'Clarity',
      message: 'Concise one-line tagline is present and readable.',
    });
  } else {
    findings.push({
      id: 'tagline-missing',
      status: 'warn',
      category: 'Clarity',
      message: 'Tagline is missing or too short. First impressions suffer without one.',
    });
  }

  if (facts.description && facts.description.trim().length > 20) {
    score += 10;
    findings.push({
      id: 'desc-present',
      status: 'pass',
      category: 'Clarity',
      message: 'Comprehensive project overview explains core purpose.',
    });
  } else {
    findings.push({
      id: 'desc-sparse',
      status: 'warn',
      category: 'Clarity',
      message: 'Project description is too sparse to give full context.',
    });
  }

  // 3. License (20 pts)
  if (facts.license && facts.license.trim().length > 0) {
    score += 20;
    findings.push({
      id: 'license-present',
      status: 'pass',
      category: 'Trust',
      message: `Standard open-source license (${facts.license}) specified.`,
    });
  } else {
    findings.push({
      id: 'license-missing',
      status: 'fail',
      category: 'Trust',
      message: 'No license specified. Pomade requires an explicit license for open-source clarity.',
    });
  }

  // 4. Quickstart Commands (20 pts)
  if (facts.installCommand && facts.runCommand) {
    score += 20;
    findings.push({
      id: 'quickstart-ready',
      status: 'pass',
      category: 'First-Run',
      message: 'Executable install and run commands provide a fast 60-second trial.',
    });
  } else {
    findings.push({
      id: 'quickstart-incomplete',
      status: 'fail',
      category: 'First-Run',
      message: 'Incomplete setup instructions. Developers cannot test without run commands.',
    });
  }

  // 5. Features (15 pts)
  if (facts.features && facts.features.length >= 2) {
    score += 15;
    findings.push({
      id: 'features-provided',
      status: 'pass',
      category: 'Discoverability',
      message: `Found ${facts.features.length} concrete feature highlights.`,
    });
  } else {
    findings.push({
      id: 'features-sparse',
      status: 'warn',
      category: 'Discoverability',
      message: 'Fewer than 2 features listed. Outline key capabilities.',
    });
  }

  // 6. Managed Markers (10 pts)
  if (facts.includeManagedMarkers !== false) {
    score += 10;
    findings.push({
      id: 'managed-markers-enabled',
      status: 'pass',
      category: 'Maintainability',
      message: 'Pomade managed markers enabled. Hand-crafted user sections are protected.',
    });
  } else {
    findings.push({
      id: 'managed-markers-disabled',
      status: 'info',
      category: 'Maintainability',
      message: 'Managed markers disabled. Subsequent automated updates cannot preserve manual prose.',
    });
  }

  let mascotReaction: 'judging' | 'puzzled' | 'approving' = 'judging';
  let reactionMessage = '';

  if (score >= 85) {
    mascotReaction = 'approving';
    reactionMessage = 'Acceptable. He gives a quiet nod of approval. Now your repository looks finished.';
  } else if (score >= 55) {
    mascotReaction = 'judging';
    reactionMessage = "He's squinting over his glasses. It's functional, but you still have sparse sections.";
  } else {
    mascotReaction = 'puzzled';
    reactionMessage = 'Unimpressed. Your repository is missing critical documentation. Fix the highlighted errors.';
  }

  return {
    score,
    mascotReaction,
    reactionMessage,
    findings,
  };
}
