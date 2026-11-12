import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  FileCode,
  Layout,
  RefreshCw,
  GitPullRequest,
  Cpu,
  Layers,
  Palette,
  Eye,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import { TerminalDemo } from '../components/TerminalDemo';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';

export default function HomePage() {
  return (
    <div className="space-y-28 py-8 sm:py-14">
      {/* 1. HERO SECTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        {/* Mascot Centerpiece */}
        <div className="flex justify-center">
          <div className="relative group">
            <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-full border-2 border-border-strong-light dark:border-border-strong-dark bg-white dark:bg-[#121318] p-2 shadow-card overflow-hidden transition-transform duration-300 group-hover:scale-105">
              <img
                src="/pomade-mascot.png"
                alt="Pomade Mascot — The Perfectionist"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            {/* Interactive speech pill */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-full text-[11px] font-mono bg-canvas-dark text-slate-100 border border-[#2B3040] shadow-md flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Judging repository presentation...</span>
            </div>
          </div>
        </div>

        {/* Title & Taglines */}
        <div className="space-y-4 max-w-3xl mx-auto pt-2">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-text-primary-light dark:text-text-primary-dark font-sans">
            Pomade
          </h1>
          <p className="text-xl sm:text-2xl font-serif italic text-copper-600 dark:text-amberGold-400 font-medium">
            Make every repo worth opening.
          </p>
          <p className="text-base sm:text-lg text-text-secondary-light dark:text-text-secondary-dark font-sans max-w-2xl mx-auto leading-relaxed">
            He doesn't write your code. He makes sure it looks finished.
            <br />
            <span className="text-text-muted-light dark:text-text-muted-dark text-sm sm:text-base">
              The agent-native GitHub repository presentation, packaging, and maintenance engine.
            </span>
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <a
            href="/templates"
            className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-copper-500 hover:bg-copper-600 dark:bg-amberGold-500 dark:hover:bg-amberGold-600 text-white dark:text-black font-mono text-sm font-semibold transition-all shadow-editorial hover:shadow-card"
          >
            <span>Explore 6 Templates</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href="/studio"
            className="flex items-center space-x-2 px-6 py-3 rounded-lg border border-border-strong-light dark:border-border-strong-dark bg-surface-light dark:bg-surface-dark hover:bg-subtle-light dark:hover:bg-subtle-dark text-text-primary-light dark:text-text-primary-dark font-mono text-sm font-semibold transition-colors"
          >
            <Sliders className="w-4 h-4 text-copper-500 dark:text-amberGold-500" />
            <span>Open README Studio</span>
          </a>

          <a
            href="https://github.com/Gurtejhundal/PoMade"
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-1.5 px-4 py-3 text-xs font-mono text-text-muted-light dark:text-text-muted-dark hover:text-text-primary-light dark:hover:text-text-primary-dark transition-colors"
          >
            <span>GitHub Repo</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Quick Command Pill */}
        <div className="pt-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-md bg-subtle-light dark:bg-subtle-dark border border-border-subtle-light dark:border-border-subtle-dark text-xs font-mono text-text-secondary-light dark:text-text-secondary-dark">
            <span className="text-text-muted-light dark:text-text-muted-dark">$</span>
            <span>npm install -g pomade</span>
            <span className="text-border-strong-light dark:text-border-strong-dark">|</span>
            <span className="text-copper-600 dark:text-amberGold-400 font-semibold">Ready in 2 seconds</span>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE TERMINAL SIMULATION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-copper-600 dark:text-amberGold-400 font-semibold">
            Live Terminal Engine
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary-light dark:text-text-primary-dark tracking-tight">
            See Pomade in Action
          </h2>
          <p className="text-xs sm:text-sm text-text-muted-light dark:text-text-muted-dark max-w-xl mx-auto font-mono">
            Pure evidence projection. Zero hallucinations. Click each command tab to inspect real output.
          </p>
        </div>

        <TerminalDemo />
      </section>

      {/* 3. THE PROBLEM & BEFORE/AFTER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BeforeAfterSlider />
      </section>

      {/* 4. HOW POMADE WORKS (5-STEP WALKTHROUGH) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-copper-600 dark:text-amberGold-400 font-semibold">
            Proven Methodology
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary-light dark:text-text-primary-dark tracking-tight">
            How Pomade Works
          </h2>
          <p className="text-xs sm:text-sm text-text-muted-light dark:text-text-muted-dark max-w-xl mx-auto font-mono">
            From raw repository to polished open-source showcase in 5 deterministic steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              step: '01',
              title: 'Inspect',
              desc: 'Scanner traverses manifests (Node, Python, Rust, Go), licenses, and git state without side effects.',
            },
            {
              step: '02',
              title: 'Classify',
              desc: 'Evidence ledger validates claims. Audit rubric evaluates repository maturity across 6 pillars.',
            },
            {
              step: '03',
              title: 'Choose Design',
              desc: 'Select from 6 curated templates tailored to CLI tools, web apps, SDKs, or ML research.',
            },
            {
              step: '04',
              title: 'Preview Diff',
              desc: 'Review standard unified diffs. Hand-crafted sections outside managed markers remain untouched.',
            },
            {
              step: '05',
              title: 'Approve & Apply',
              desc: 'Atomic file write requires explicit local approval. Remote GitHub sync requires separate auth.',
            },
          ].map((item, idx) => (
            <div
              key={item.step}
              className="p-5 rounded-xl border border-border-subtle-light dark:border-border-subtle-dark bg-surface-light dark:bg-surface-dark space-y-3 relative group hover:border-copper-500/50 dark:hover:border-amberGold-500/50 transition-colors"
            >
              <div className="font-mono text-xs font-bold text-copper-600 dark:text-amberGold-400">
                STEP {item.step}
              </div>
              <h3 className="font-bold text-sm text-text-primary-light dark:text-text-primary-dark">
                {item.title}
              </h3>
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark leading-relaxed font-sans">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FEATURE DEEP-DIVE (REAL ARTIFACTS) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-copper-600 dark:text-amberGold-400 font-semibold">
            Engine Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary-light dark:text-text-primary-dark tracking-tight">
            Built for Serious Repositories
          </h2>
          <p className="text-xs sm:text-sm text-text-muted-light dark:text-text-muted-dark max-w-xl mx-auto font-mono">
            Every feature produces production-ready code and assets verified against GitHub rendering.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="p-6 rounded-xl border border-border-subtle-light dark:border-border-subtle-dark bg-surface-light dark:bg-surface-dark space-y-4">
            <div className="w-10 h-10 rounded-lg bg-copper-50 dark:bg-amberGold-500/10 flex items-center justify-center text-copper-600 dark:text-amberGold-400 border border-copper-200 dark:border-amberGold-500/20">
              <FileCode className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-text-primary-light dark:text-text-primary-dark">
              Managed Sections
            </h3>
            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark leading-relaxed font-sans">
              Pomade manages only blocks wrapped in <code className="text-[11px] bg-subtle-light dark:bg-subtle-dark px-1 py-0.5 rounded">&lt;!-- pomade:start/end --&gt;</code>. Any prose or custom documentation you write by hand is guaranteed untouched.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-xl border border-border-subtle-light dark:border-border-subtle-dark bg-surface-light dark:bg-surface-dark space-y-4">
            <div className="w-10 h-10 rounded-lg bg-copper-50 dark:bg-amberGold-500/10 flex items-center justify-center text-copper-600 dark:text-amberGold-400 border border-copper-200 dark:border-amberGold-500/20">
              <Palette className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-text-primary-light dark:text-text-primary-dark">
              Vector Visual Assets
            </h3>
            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark leading-relaxed font-sans">
              Generates responsive, dark-mode compatible SVG architecture diagrams and compliant 1280×640 GitHub social cards saved into <code className="text-[11px] bg-subtle-light dark:bg-subtle-dark px-1 py-0.5 rounded">docs/media/</code>.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-xl border border-border-subtle-light dark:border-border-subtle-dark bg-surface-light dark:bg-surface-dark space-y-4">
            <div className="w-10 h-10 rounded-lg bg-copper-50 dark:bg-amberGold-500/10 flex items-center justify-center text-copper-600 dark:text-amberGold-400 border border-copper-200 dark:border-amberGold-500/20">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-text-primary-light dark:text-text-primary-dark">
              Drift Detection
            </h3>
            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark leading-relaxed font-sans">
              When scripts in <code className="text-[11px] bg-subtle-light dark:bg-subtle-dark px-1 py-0.5 rounded">package.json</code> or dependencies change, <code className="text-[11px] bg-subtle-light dark:bg-subtle-dark px-1 py-0.5 rounded">pomade drift</code> immediately alerts agents to synchronize documentation.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-6 rounded-xl border border-border-subtle-light dark:border-border-subtle-dark bg-surface-light dark:bg-surface-dark space-y-4">
            <div className="w-10 h-10 rounded-lg bg-copper-50 dark:bg-amberGold-500/10 flex items-center justify-center text-copper-600 dark:text-amberGold-400 border border-copper-200 dark:border-amberGold-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-text-primary-light dark:text-text-primary-dark">
              Safe Filesystem Guards
            </h3>
            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark leading-relaxed font-sans">
              Built with path traversal defense, symlink boundaries, and automatic exclusion of <code className="text-[11px] bg-subtle-light dark:bg-subtle-dark px-1 py-0.5 rounded">.env*</code>, SSH keys, and credentials files.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-6 rounded-xl border border-border-subtle-light dark:border-border-subtle-dark bg-surface-light dark:bg-surface-dark space-y-4">
            <div className="w-10 h-10 rounded-lg bg-copper-50 dark:bg-amberGold-500/10 flex items-center justify-center text-copper-600 dark:text-amberGold-400 border border-copper-200 dark:border-amberGold-500/20">
              <GitPullRequest className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-text-primary-light dark:text-text-primary-dark">
              Community Health Suite
            </h3>
            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark leading-relaxed font-sans">
              Initializes bug report templates, feature requests, PR templates, and verified CONTRIBUTING / SECURITY policies with a single approved command.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-6 rounded-xl border border-border-subtle-light dark:border-border-subtle-dark bg-surface-light dark:bg-surface-dark space-y-4">
            <div className="w-10 h-10 rounded-lg bg-copper-50 dark:bg-amberGold-500/10 flex items-center justify-center text-copper-600 dark:text-amberGold-400 border border-copper-200 dark:border-amberGold-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-text-primary-light dark:text-text-primary-dark">
              Release & Semver Planner
            </h3>
            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark leading-relaxed font-sans">
              Analyzes git commit history, classifies breaking changes and feature additions, drafts semver bumps, and verifies that test suites pass before release.
            </p>
          </div>
        </div>
      </section>

      {/* 6. CODING AGENT INTEGRATIONS */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="p-8 rounded-2xl border border-border-strong-light dark:border-border-strong-dark bg-gradient-to-b from-subtle-light/60 to-surface-light dark:from-subtle-dark/40 dark:to-surface-dark space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-copper-600 dark:text-amberGold-400 font-semibold">
              Ecosystem Architecture
            </span>
            <h2 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark tracking-tight">
              Agent-Native by Design
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary-light dark:text-text-secondary-dark max-w-2xl font-sans leading-relaxed">
              Pomade is not a manual web-only form. It packages as a portable <code className="text-xs font-mono bg-subtle-light dark:bg-subtle-dark px-1.5 py-0.5 rounded">SKILL.md</code> and CLI toolkit that any compatible AI coding agent invokes autonomously during development.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-canvas-dark text-slate-100 font-mono text-xs overflow-x-auto">
            <div className="text-slate-400 mb-2">// The Pomade Agent Pipeline</div>
            <div className="text-emerald-400">
              AI Coding Agent ──&gt; skills/pomade/SKILL.md ──&gt; Pomade Core Engine ──&gt; Validated Repository Updates
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            {[
              { name: 'Claude Code', status: 'Verified Supported' },
              { name: 'Antigravity', status: 'Verified Supported' },
              { name: 'Cursor & Cline', status: 'Verified Supported' },
              { name: 'GitHub Copilot', status: 'Planned Integration' },
            ].map((agent) => (
              <div
                key={agent.name}
                className="p-3 rounded-lg border border-border-subtle-light dark:border-border-subtle-dark bg-surface-light dark:bg-surface-dark text-center space-y-1"
              >
                <div className="font-mono text-xs font-bold text-text-primary-light dark:text-text-primary-dark">
                  {agent.name}
                </div>
                <div
                  className={`text-[10px] font-mono ${
                    agent.status.includes('Verified')
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-text-muted-light dark:text-text-muted-dark'
                  }`}
                >
                  {agent.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CLOSING CTA SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-block relative">
          <div className="w-20 h-20 rounded-full border border-border-strong-light dark:border-border-strong-dark overflow-hidden mx-auto bg-white dark:bg-black p-1 shadow-card">
            <img
              src="/pomade-mascot.png"
              alt="Pomade Mascot"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary-light dark:text-text-primary-dark tracking-tight">
            Good code deserves a good introduction.
          </h2>
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark max-w-lg mx-auto font-sans">
            Make your next open-source release look finished, trustworthy, and impossible to ignore.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <a
            href="/studio"
            className="px-6 py-3 rounded-lg bg-copper-500 hover:bg-copper-600 dark:bg-amberGold-500 dark:hover:bg-amberGold-600 text-white dark:text-black font-mono text-sm font-semibold transition-all shadow-editorial"
          >
            Launch README Studio
          </a>
          <a
            href="/templates"
            className="px-6 py-3 rounded-lg border border-border-strong-light dark:border-border-strong-dark bg-surface-light dark:bg-surface-dark hover:bg-subtle-light dark:hover:bg-subtle-dark text-text-primary-light dark:text-text-primary-dark font-mono text-sm font-semibold transition-colors"
          >
            Browse All Templates
          </a>
        </div>
      </section>
    </div>
  );
}
