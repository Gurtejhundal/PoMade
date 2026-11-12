import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Cpu, Terminal, FileCode, CheckCircle2, ArrowRight } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14 font-sans">
      <div className="text-center space-y-3">
        <span className="text-xs font-mono uppercase tracking-wider text-copper-600 dark:text-amberGold-400 font-semibold">
          Architecture & Methodology
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary-light dark:text-text-primary-dark tracking-tight">
          How Pomade Preserves Truth
        </h1>
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark font-sans max-w-xl mx-auto leading-relaxed">
          AI coding agents often fabricate commands or hallucinate benchmarks. Pomade enforces strict evidence-based invariants across every generated file.
        </p>
      </div>

      {/* 5 Invariants */}
      <div className="space-y-8">
        {[
          {
            title: '1. Multi-Manifest Scanner & SHA-256 Fingerprinting',
            desc: 'Traverses Node (package.json), Python (pyproject.toml, requirements.txt), Rust (Cargo.toml), and Go (go.mod) without modifying disk. Calculates a deterministic cryptographic fingerprint so changes are only proposed when code interfaces genuinely evolve.',
          },
          {
            title: '2. Evidence Ledger & Zero-Hallucination Policy',
            desc: 'Every claim in a generated README—such as installation scripts, framework integrations, and test commands—must cite a concrete evidence ID from the ledger. If an agent tries to claim a feature that does not exist in code, Pomade blocks it.',
          },
          {
            title: '3. Managed Sections Preservation',
            desc: 'Surrounds all generated content in <!-- pomade:start <id> --> and <!-- pomade:end <id> -->. When Pomade updates a repository, any personal prose, custom tutorials, or manual human edits outside the markers are 100% preserved.',
          },
          {
            title: '4. Safe Filesystem Sandbox with Traversal Defense',
            desc: 'Guarantees that files cannot escape repository boundaries via symlinks or relative paths (../). Automatically ignores and refuses to touch sensitive credentials, .env files, SSH keys, or private certificates.',
          },
          {
            title: '5. Two-Tier Approval Gating',
            desc: 'Local file modifications require explicit confirmation (--approved). Remote GitHub mutations (editing repository descriptions or adding topics) require a separate flag (--approved-remote). Nothing is pushed without owner authorization.',
          },
        ].map((item, i) => (
          <div
            key={item.title}
            className="p-6 rounded-xl border border-border-subtle-light dark:border-border-subtle-dark bg-surface-light dark:bg-surface-dark space-y-2 shadow-editorial"
          >
            <h2 className="text-base font-bold text-text-primary-light dark:text-text-primary-dark font-mono">
              {item.title}
            </h2>
            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="text-center pt-4">
        <a
          href="/studio"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg bg-copper-500 hover:bg-copper-600 dark:bg-amberGold-500 dark:hover:bg-amberGold-600 text-white dark:text-black font-mono text-xs font-semibold transition-all"
        >
          <span>Try It in the Interactive Studio</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
