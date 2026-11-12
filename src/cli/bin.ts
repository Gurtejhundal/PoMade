#!/usr/bin/env node
import { Command } from 'commander';
import { runScan, runAudit, runDoctor, runPlan, runDiff, runApply, runDrift } from './commands.js';

const program = new Command();

program
  .name('pomade')
  .description('Make every repo worth opening — Agent-native GitHub repository presentation and maintenance layer')
  .version('0.1.0-alpha.1');

program
  .command('scan')
  .description('Scan repository facts, metadata, manifests, and git state without side effects')
  .argument('[path]', 'Path to repository root (defaults to cwd)')
  .option('--json', 'Output structured JSON snapshot')
  .action(async (targetPath, options) => {
    const exitCode = await runScan(targetPath, options);
    process.exit(exitCode);
  });

program
  .command('audit')
  .description('Audit repository clarity, first-run experience, trust, discoverability, and maintenance')
  .argument('[path]', 'Path to repository root (defaults to cwd)')
  .option('--format <format>', 'Output format (text | json)', 'text')
  .option('--min-score <score>', 'Minimum passing score', (val) => parseInt(val, 10))
  .action(async (targetPath, options) => {
    const exitCode = await runAudit(targetPath, options);
    process.exit(exitCode);
  });

program
  .command('plan')
  .description('Generate an evidence-backed presentation plan and proposed unified diffs')
  .argument('[path]', 'Path to repository root (defaults to cwd)')
  .option('--preset <preset>', 'Preset style (minimal | studio | maintainer)', 'minimal')
  .option('--user-intent <intent>', 'User-supplied project goal or intent description')
  .option('--output <file>', 'Save plan artifact to file')
  .option('--json', 'Output structured JSON plan')
  .action(async (targetPath, options) => {
    const exitCode = await runPlan(targetPath, options);
    process.exit(exitCode);
  });

program
  .command('diff')
  .description('Show proposed unified diffs before any changes are written')
  .argument('[path]', 'Path to repository root (defaults to cwd)')
  .option('--preset <preset>', 'Preset style (minimal | studio | maintainer)', 'minimal')
  .option('--user-intent <intent>', 'User-supplied project goal or intent description')
  .option('--json', 'Output diffs as JSON')
  .action(async (targetPath, options) => {
    const exitCode = await runDiff(targetPath, options);
    process.exit(exitCode);
  });

program
  .command('apply')
  .description('Apply an approved plan to local repository files atomically')
  .argument('[path]', 'Path to repository root (defaults to cwd)')
  .option('--approved', 'Explicit confirmation to execute local writes')
  .option('--preset <preset>', 'Preset style (minimal | studio | maintainer)', 'minimal')
  .option('--dry-run', 'Simulate writes without modifying disk')
  .option('--json', 'Output apply results as JSON')
  .action(async (targetPath, options) => {
    const exitCode = await runApply(targetPath, options);
    process.exit(exitCode);
  });

program
  .command('doctor')
  .description('Verify local environment, git configuration, and toolchain dependencies')
  .argument('[path]', 'Path to repository root (defaults to cwd)')
  .action(async (targetPath) => {
    const exitCode = await runDoctor(targetPath);
    process.exit(exitCode);
  });

program
  .command('drift')
  .description('Detect drift between codebase interfaces (scripts, frameworks, versions) and documentation')
  .argument('[path]', 'Path to repository root (defaults to cwd)')
  .option('--fail-on-drift', 'Exit with code 1 if documentation drift is detected')
  .option('--json', 'Output drift report as JSON')
  .action(async (targetPath, options) => {
    const exitCode = await runDrift(targetPath, options);
    process.exit(exitCode);
  });

program.parse(process.argv);
