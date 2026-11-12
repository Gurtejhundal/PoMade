import React from 'react';
import Link from 'next/link';
import { Terminal, BookOpen, CheckCircle, ExternalLink, Copy } from 'lucide-react';

export default function DocsPage() {
  const commands = [
    {
      cmd: 'pomade scan [path]',
      desc: 'Scan repository structure, manifests, and git state without modifying files.',
      example: 'pomade scan --json',
    },
    {
      cmd: 'pomade audit [path]',
      desc: 'Audit presentation clarity, first-run experience, trust, and maintenance score (0-100).',
      example: 'pomade audit --min-score 80',
    },
    {
      cmd: 'pomade plan [path]',
      desc: 'Generate an evidence-backed presentation plan and proposed diffs.',
      example: 'pomade plan --preset studio',
    },
    {
      cmd: 'pomade diff [path]',
      desc: 'Display standard unified diffs for all proposed file changes.',
      example: 'pomade diff --preset maintainer',
    },
    {
      cmd: 'pomade apply [path]',
      desc: 'Apply approved plan atomically to local repository files.',
      example: 'pomade apply --approved --preset studio',
    },
    {
      cmd: 'pomade drift [path]',
      desc: 'Detect drift between codebase interfaces (scripts, dependencies) and README docs.',
      example: 'pomade drift --fail-on-drift',
    },
    {
      cmd: 'pomade media plan [path]',
      desc: 'Detect runnable UI and generate a media capture plan (skipping fake screenshots).',
      example: 'pomade media plan --json',
    },
    {
      cmd: 'pomade media generate-diagram',
      desc: 'Generate a responsive, dark-mode compatible SVG architecture diagram.',
      example: 'pomade media generate-diagram --output docs/media/architecture.svg',
    },
    {
      cmd: 'pomade media generate-card',
      desc: 'Generate a compliant 1280x640 GitHub social preview card asset.',
      example: 'pomade media generate-card --output docs/media/social-preview.svg',
    },
    {
      cmd: 'pomade github plan [path]',
      desc: 'Generate evidence-backed repository description and topic recommendations.',
      example: 'pomade github plan --json',
    },
    {
      cmd: 'pomade github apply [path]',
      desc: 'Apply metadata changes to remote GitHub via gh CLI (requires --approved-remote).',
      example: 'pomade github apply --approved-remote',
    },
    {
      cmd: 'pomade github init-community',
      desc: 'Initialize bug report, feature request, PR templates, and CONTRIBUTING.md.',
      example: 'pomade github init-community --approved --license MIT --author "Acme"',
    },
    {
      cmd: 'pomade release plan [path]',
      desc: 'Inspect git commit history and prepare a semver release plan and changelog draft.',
      example: 'pomade release plan --json',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 font-sans">
      <div className="space-y-3">
        <span className="text-xs font-mono uppercase tracking-wider text-copper-600 dark:text-amberGold-400 font-semibold">
          Reference Manual
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary-light dark:text-text-primary-dark tracking-tight">
          CLI & Agent Commands
        </h1>
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
          Comprehensive reference for the Pomade CLI and autonomous AI agent skill execution.
        </p>
      </div>

      {/* Global Installation */}
      <div className="p-6 rounded-xl border border-border-subtle-light dark:border-border-subtle-dark bg-surface-light dark:bg-surface-dark space-y-3 font-mono text-xs">
        <div className="font-bold text-sm text-text-primary-light dark:text-text-primary-dark">
          Installation
        </div>
        <pre className="p-3 bg-subtle-light dark:bg-subtle-dark rounded border border-border-subtle-light dark:border-border-subtle-dark text-text-primary-light dark:text-text-primary-dark">
          npm install -g pomade
        </pre>
        <p className="text-[11px] text-text-muted-light dark:text-text-muted-dark">
          Requires Node.js LTS (&gt;= 18.0.0). Verified on Linux, macOS, and Windows.
        </p>
      </div>

      {/* Commands List */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark tracking-tight font-mono">
          Command Specifications
        </h2>

        <div className="space-y-4">
          {commands.map((c) => (
            <div
              key={c.cmd}
              className="p-5 rounded-lg border border-border-subtle-light dark:border-border-subtle-dark bg-surface-light dark:bg-surface-dark space-y-2 font-mono text-xs shadow-editorial"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-copper-600 dark:text-amberGold-400 text-sm">
                  $ {c.cmd}
                </span>
              </div>
              <p className="text-text-secondary-light dark:text-text-secondary-dark font-sans text-xs">
                {c.desc}
              </p>
              <div className="p-2 bg-subtle-light dark:bg-subtle-dark rounded text-[11px] text-text-muted-light dark:text-text-muted-dark">
                Example: <span className="text-text-primary-light dark:text-text-primary-dark font-semibold">{c.example}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
