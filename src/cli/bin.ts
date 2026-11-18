#!/usr/bin/env node
import { Command, Option } from 'commander';
import {
  runInit,
  runSync,
  runScan,
  runAudit,
  runDoctor,
  runPlan,
  runDiff,
  runApply,
  runDrift,
  runMediaPlan,
  runGenerateDiagram,
  runGenerateCard,
  runGitHubPlan,
  runGitHubApply,
  runInitCommunity,
  runReleasePlan,
} from './commands.js';

const program = new Command();

program
  .name('pomade')
  .description(
    'Make every repo worth opening — Agent-native GitHub repository presentation and maintenance layer'
  )
  .version('1.0.0-rc.1');

program
  .command('scan')
  .description(
    'Scan repository facts, metadata, manifests, and git state without side effects'
  )
  .argument('[path]', 'Path to repository root (defaults to cwd)')
  .option('--json', 'Output structured JSON snapshot')
  .action(async (targetPath, options) => {
    const exitCode = await runScan(targetPath, options);
    process.exit(exitCode);
  });

program
  .command('audit')
  .description(
    'Audit repository clarity, first-run experience, trust, discoverability, and maintenance'
  )
  .argument('[path]', 'Path to repository root (defaults to cwd)')
  .option('--format <format>', 'Output format (text | json)', 'text')
  .option('--min-score <score>', 'Minimum passing score', (val) =>
    parseInt(val, 10)
  )
  .action(async (targetPath, options) => {
    const exitCode = await runAudit(targetPath, options);
    process.exit(exitCode);
  });

program
  .command('plan')
  .description(
    'Generate an evidence-backed presentation plan and proposed unified diffs'
  )
  .argument('[path]', 'Path to repository root (defaults to cwd)')
  .addOption(
    new Option(
      '--preset <preset>',
      'README style (studio/maintainer are legacy aliases)'
    ).choices(['minimal', 'signature', 'animated', 'studio', 'maintainer'])
  )
  .option(
    '--user-intent <intent>',
    'User-supplied project goal or intent description'
  )
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
  .addOption(
    new Option(
      '--preset <preset>',
      'README style (studio/maintainer are legacy aliases)'
    ).choices(['minimal', 'signature', 'animated', 'studio', 'maintainer'])
  )
  .option(
    '--user-intent <intent>',
    'User-supplied project goal or intent description'
  )
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
  .option(
    '--plan <file>',
    'Apply the exact saved plan, with content-hash checks'
  )
  .addOption(
    new Option(
      '--preset <preset>',
      'README style (studio/maintainer are legacy aliases)'
    ).choices(['minimal', 'signature', 'animated', 'studio', 'maintainer'])
  )
  .option('--dry-run', 'Simulate writes without modifying disk')
  .option('--json', 'Output apply results as JSON')
  .action(async (targetPath, options) => {
    const exitCode = await runApply(targetPath, options);
    process.exit(exitCode);
  });

program
  .command('doctor')
  .description(
    'Verify local environment, git configuration, and toolchain dependencies'
  )
  .argument('[path]', 'Path to repository root (defaults to cwd)')
  .action(async (targetPath) => {
    const exitCode = await runDoctor(targetPath);
    process.exit(exitCode);
  });

program
  .command('drift')
  .description(
    'Detect drift between codebase interfaces (scripts, frameworks, versions) and documentation'
  )
  .argument('[path]', 'Path to repository root (defaults to cwd)')
  .option(
    '--fail-on-drift',
    'Exit with code 1 if documentation drift is detected'
  )
  .option('--json', 'Output drift report as JSON')
  .action(async (targetPath, options) => {
    const exitCode = await runDrift(targetPath, options);
    process.exit(exitCode);
  });

const media = program
  .command('media')
  .description(
    'Manage repository visual assets, UI capture plans, and vector diagrams'
  );

media
  .command('plan')
  .description(
    'Detect UI and generate a media capture plan (strictly skipping fake screenshots)'
  )
  .argument('[path]', 'Path to repository root (defaults to cwd)')
  .option('--json', 'Output capture plan as JSON')
  .action(async (targetPath, options) => {
    const exitCode = await runMediaPlan(targetPath, options);
    process.exit(exitCode);
  });

media
  .command('generate-diagram')
  .description(
    'Generate a responsive, dark-mode compatible SVG architecture diagram'
  )
  .argument('[path]', 'Path to repository root (defaults to cwd)')
  .option(
    '--output <path>',
    'Destination SVG file path',
    'docs/media/architecture.svg'
  )
  .action(async (targetPath, options) => {
    const exitCode = await runGenerateDiagram(targetPath, options);
    process.exit(exitCode);
  });

media
  .command('generate-card')
  .description('Generate a compliant 1280x640 GitHub social preview card asset')
  .argument('[path]', 'Path to repository root (defaults to cwd)')
  .option(
    '--output <path>',
    'Destination SVG file path',
    'docs/media/social-preview.svg'
  )
  .action(async (targetPath, options) => {
    const exitCode = await runGenerateCard(targetPath, options);
    process.exit(exitCode);
  });

const github = program
  .command('github')
  .description(
    'Manage GitHub repository topics, description, community files, and remote sync'
  );

github
  .command('plan')
  .description(
    'Generate evidence-backed repository description and topic recommendations'
  )
  .argument('[path]', 'Path to repository root (defaults to cwd)')
  .option('--json', 'Output recommendations as JSON')
  .action(async (targetPath, options) => {
    const exitCode = await runGitHubPlan(targetPath, options);
    process.exit(exitCode);
  });

github
  .command('apply')
  .description(
    'Apply repository metadata changes to remote GitHub via gh CLI (requires --approved-remote)'
  )
  .argument('[path]', 'Path to repository root (defaults to cwd)')
  .option(
    '--approved-remote',
    'Explicit confirmation for remote repository mutations'
  )
  .option(
    '--dry-run',
    'Simulate command execution without executing gh network call'
  )
  .option('--json', 'Output execution result as JSON')
  .action(async (targetPath, options) => {
    const exitCode = await runGitHubApply(targetPath, options);
    process.exit(exitCode);
  });

github
  .command('init-community')
  .description(
    'Initialize issue templates, pull request template, CONTRIBUTING.md, and SECURITY.md'
  )
  .argument('[path]', 'Path to repository root (defaults to cwd)')
  .option('--approved', 'Explicit confirmation to write community files')
  .option('--dry-run', 'Simulate writes without modifying disk')
  .option(
    '--license <spdxId>',
    'Create a full MIT LICENSE (other full licenses must be supplied manually)'
  )
  .option('--author <name>', 'Author name for license copyright notice')
  .option('--email <email>', 'Security contact email address')
  .option('--json', 'Output plan/result as JSON')
  .action(async (targetPath, options) => {
    const exitCode = await runInitCommunity(targetPath, options);
    process.exit(exitCode);
  });

const release = program
  .command('release')
  .description(
    'Manage semantic versioning, changelogs, and release preparation'
  );

release
  .command('plan')
  .description(
    'Inspect git commit history and prepare a semver release plan and changelog draft'
  )
  .argument('[path]', 'Path to repository root (defaults to cwd)')
  .option('--json', 'Output release plan as JSON')
  .action(async (targetPath, options) => {
    const exitCode = await runReleasePlan(targetPath, options);
    process.exit(exitCode);
  });

program
  .command('init')
  .description(
    'Install presentation config and a push workflow; preview unless --approved'
  )
  .argument('[path]')
  .addOption(
    new Option('--preset <preset>')
      .choices(['minimal', 'signature', 'animated'])
      .default('signature')
  )
  .option('--approved', 'Write new configuration and workflow files')
  .action(async (targetPath, options) => {
    process.exit(await runInit(targetPath, options));
  });

program
  .command('sync')
  .description(
    'Refresh managed README and covers; optionally synchronize remote About/topics'
  )
  .argument('[path]')
  .option('--approved', 'Authorize local managed content writes')
  .option('--approved-remote', 'Authorize GitHub About/topics updates')
  .option('--dry-run', 'Preview without local or remote writes')
  .addOption(
    new Option('--preset <preset>').choices([
      'minimal',
      'signature',
      'animated',
    ])
  )
  .action(async (targetPath, options) => {
    process.exit(await runSync(targetPath, options));
  });

program.parse(process.argv);
